# Phase 3-2. 랭킹 조회 최적화

## 문제 상황

실시간 판매량 TOP 100 조회 시, 매 요청마다 `order_item` 테이블에서 GROUP BY + ORDER BY 쿼리 실행.

```sql
SELECT oi.product_id, SUM(oi.quantity) as sales_count
FROM order_item oi
GROUP BY oi.product_id
ORDER BY sales_count DESC
LIMIT 100
```

- `order_item`은 주문 상세 테이블. 주문마다 행이 쌓이고, product_id별로 quantity를 SUM해서 총 판매량을 계산
- product 테이블에 sales_count 컬럼을 두지 않은 이유: 주문 INSERT와 동시에 UPDATE해야 하는데, 트랜잭션 범위가 넓어지고 동시 주문 시 해당 행에 락 경합 발생

---

## 실험 구성

- 부하 조건: k6, VU 100명, 2분간 랭킹 조회 반복
- 기준(v1): 인덱스 없는 순수 DB 쿼리

---

## 시도 1. 커버링 인덱스 (v2)

### 무엇을 했나

`(product_id, quantity)` 커버링 인덱스 추가. 쿼리에 필요한 모든 컬럼이 인덱스에 포함되어 테이블 본체에 접근하지 않아도 되게 함.

### 커버링 인덱스란

- **복합 인덱스**: 2개 이상 컬럼으로 만든 인덱스. 인덱스의 구조에 대한 정의
- **커버링 인덱스**: 쿼리가 필요로 하는 모든 컬럼이 인덱스에 포함되어 **테이블 본체를 안 봐도 되는 상태**. 쿼리와 인덱스의 관계에 대한 정의
- 같은 인덱스가 어떤 쿼리에는 커버링이고, 다른 쿼리에는 아닐 수 있음
- EXPLAIN에서 Extra: `Using index`가 뜨면 커버링 인덱스 적용

### 결과

| 측정 | 값 |
|---|---|
| 단건 측정 | 185ms → 138ms (25% ↓) |
| 부하테스트 p95 | 2,813ms → 5,906ms (**오히려 110% 악화**) |
| 처리량 | 38 req/s → 24 req/s |

### 한계

단건에서는 효과가 있지만, 동시접속 시 DB 자체가 병목. 인덱스를 아무리 최적화해도 매 요청마다 DB에 쿼리를 치는 구조 자체의 한계.

→ **DB 레벨 최적화만으로는 부족. 캐싱 도입 필요.**

---

## 시도 2. Redis String 캐싱 (v3)

### 무엇을 했나

GROUP BY 쿼리 결과(TOP 100 리스트)를 JSON으로 직렬화하여 Redis String에 저장 (TTL 5분). Cache-aside 패턴.

### 동작 흐름

1. 랭킹 요청 → Redis GET → 캐시 있으면 바로 반환 (cache hit)
2. 캐시 없으면 → DB 쿼리 실행 → 결과를 Redis SET (TTL 5분) → 반환
3. 5분 후 TTL 만료 → 다음 요청이 다시 DB 조회

**주의**: "5분마다 자동 갱신"이 아니라 "만료 후 다음 요청이 올 때 재생성"

### 결과

| 측정 | 값 |
|---|---|
| 부하테스트 p95 | 2,813ms → 202ms (93% ↓) |
| 처리량 | 38 req/s → 368 req/s |
| < 1000ms 통과율 | 32% → 100% |

### 한계: Race Condition → Cache Stampede

TTL 만료 직후 동시 요청 시 race condition 발생:

```
스레드 1: GET cache → null (없네!)
스레드 2: GET cache → null (스레드 1이 SET 하기 전)
...
스레드 100: GET cache → null

→ 100개 스레드가 전부 DB 쿼리 실행 (의도: 1개만 실행)
→ 느린 스레드가 나중에 SET 하면서 최신 데이터를 오래된 데이터로 덮어쓸 수 있음
```

**핵심 개념 정리:**

| 개념 | 대상 | 의미 |
|---|---|---|
| Race Condition | Redis 캐시 값 | GET-SET이 원자적이지 않아서 실행 순서에 따라 결과가 달라짐 |
| Cache Stampede | DB | race condition의 결과로 동시에 대량의 DB 쿼리가 몰리는 현상 |
| Contention (경합) | DB 커넥션풀 | 100개 스레드가 10개 커넥션을 놓고 기다리는 것. 느려지지만 결과는 정확 |

**v1과의 차이**: v1도 100명 요청 시 DB 쿼리 100개 나가지만, 그건 "매번 DB 조회"라는 설계 의도대로 동작하는 것 (= 성능 문제). v3는 "1명만 DB 가고 99명은 캐시 쓰기"가 의도인데 100명 전부 DB로 가는 것 (= 설계 의도 실패 = race condition).

**race condition으로 결과가 달라지는 예시:**

```
시간 0:00.001 — 스레드 1: GET → null → DB 쿼리 시작
시간 0:00.002 — 주문 발생! 상품A: 100 → 105
시간 0:00.003 — 스레드 2: GET → null → DB 쿼리 시작
시간 0:00.200 — 스레드 2: 결과(105) → SET cache {상품A: 105} ✓ 최신
시간 0:00.300 — 스레드 1: 결과(100) → SET cache {상품A: 100} ← 오래된 데이터로 덮어씀!

→ 5분간 모든 사용자가 오래된 랭킹(100)을 봄. 실제 DB는 105.
```

→ **GET-SET이 원자적이지 않은 구조적 한계. 캐싱 방식 자체를 바꿔야 함.**

---

## 시도 3. Redis Sorted Set (v4)

### 무엇을 했나

쿼리 결과를 캐싱하는 대신, **정렬 구조 자체를 Redis에 유지**. 주문 발생 시 ZINCRBY로 score 증가, 조회 시 ZREVRANGE로 이미 정렬된 결과를 반환.

### Redis Sorted Set 구조

Redis는 Key → Value 형태. Sorted Set은 Value 타입 중 하나:

```
Key: "product:ranking"
Value (Sorted Set):
  ├── (member: "상품A", score: 7)    ← member: 유니크한 원소
  ├── (member: "상품B", score: 5)    ← score: 정렬 기준 숫자
  └── (member: "상품C", score: 2)    ← score 기준 자동 정렬 유지
```

- **Key**: Sorted Set의 이름. 아무 문자열이나 가능. `A:B` 형태는 관례(convention)일 뿐
- **Member**: Set 안의 원소. 유니크. (여기서는 product_id)
- **Score**: 각 member에 붙은 숫자. 정렬 기준. (여기서는 총 판매량)
- 내부 구조: Skip List → 삽입/삭제/검색 O(log N), 범위 조회 O(log N + M)
- Java SortedSet(TreeSet)은 원소 자체의 값으로 정렬하지만, Redis Sorted Set은 별도의 score로 정렬

### RDB 테이블에 비유

Key 하나가 테이블 하나의 역할. Redis에는 테이블 개념이 없고, Key-Value 쌍 하나가 하나의 데이터 묶음:

```
RDB:
  product_ranking 테이블
  | product_id (PK) | sales_count        |
  |------------------|--------------------|
  | 상품A            | 7                  |
  | 상품B            | 5                  |
  | 상품C            | 2                  |
  ORDER BY sales_count DESC → 조회 시 정렬

Redis Sorted Set:
  Key: "product:ranking"
  | member (유니크)  | score (자동 정렬)   |
  |------------------|--------------------|
  | 상품A            | 7                  |
  | 상품B            | 5                  |
  | 상품C            | 2                  |
  → 저장하는 순간 정렬 유지 (ORDER BY 불필요)
```

핵심 차이: RDB는 저장은 정렬 안 된 상태이고 조회할 때 ORDER BY로 정렬. Sorted Set은 **저장하는 순간 정렬이 유지**됨.

product 테이블에 sales_count 컬럼을 비정규화로 추가하는 대신, 외부 인메모리 DB인 Redis에 동일한 역할을 맡기는 구조. DB 비정규화는 락 경합 + 정합성 문제가 있지만, Redis Sorted Set은 ZINCRBY가 원자적이라 그런 문제가 없음.

### 동작 흐름 (TOP 5 예시)

```
주문 1: 상품A 3개 → ZINCRBY product:ranking 3 "상품A" → {상품A: 3}
주문 2: 상품B 5개 → ZINCRBY product:ranking 5 "상품B" → {상품B: 5, 상품A: 3}
주문 3: 상품A 4개 → ZINCRBY product:ranking 4 "상품A" → {상품A: 7, 상품B: 5}

조회: ZREVRANGE product:ranking 0 4 WITHSCORES
→ 1위: 상품A(7), 2위: 상품B(5) ... DB 접근 없음!
```

### 왜 race condition이 없나

- ZINCRBY는 Redis 내부에서 **원자적(atomic)** 처리. 100명이 동시에 같은 상품을 주문해도 score가 정확히 +100
- 전체 결과를 덮어쓰는 게 아니라 해당 member의 score만 증가시키므로 순서가 꼬일 여지가 없음

### 메모리 관리

ZREMRANGEBYRANK로 하위 데이터 주기적 정리. TOP 100만 유지하면 100개 이상 쌓이지 않음.


### ZINCRBY, ZREMRANGEBYRANK 어원과 발음
- 어원
  - Z + INCRBY = Z + increment by
  - Z + REMRANGEBYRANK = Z + remove range by rank
- 발음
  - Z는 Redis Sorted Set 명령어의 접두사라서 "지"로 읽고, 나머지는 영어 단어 그대로
  - ZINCRBY: "지-인크르-바이" 또는 줄여서 "진크르바이"
  - ZREMRANGEBYRANK: "지-렘-레인지-바이-랭크"


### 결과

| 측정 | 값 |
|---|---|
| 부하테스트 p95 | 2,813ms → 17ms (99.4% ↓) |
| 평균 응답시간 | 1,405ms → 6ms |
| 처리량 | 38 req/s → 519 req/s |
| < 1000ms 통과율 | 32% → 100% |

### 미완성 부분

검증 테스트에서 "주문 → ZINCRBY → 랭킹 반영" end-to-end 흐름 검증이 5번(주문 API 호출 실패 → SKIP), 6번(랭킹 반영 확인 → FAIL) 미완. 조회 성능은 부하테스트로 증명됨.

---

## 전체 비교 (k6 부하테스트, VU 100, 2분)

| | 기준 (v1) | 시도 1 (v2) | 시도 2 (v3) | 시도 3 (v4) |
|---|---|---|---|---|
| 방식 | DB 풀스캔 | 커버링 인덱스 | Redis String 캐싱 | Redis Sorted Set |
| p95 | 2,813ms | 5,906ms | 202ms | 17ms |
| 평균 | 1,405ms | 2,368ms | 51ms | 6ms |
| 처리량 | 38 req/s | 24 req/s | 368 req/s | 519 req/s |
| 총 요청 수 | 4,527 | 2,849 | 44,190 | 62,339 |
| < 1000ms | 32% | 18% | 100% | 100% |
| 한계 | 매번 정렬 비용 | 동시접속 시 악화 | 만료 시 race condition | 검증 테스트 미완 |

### 상세 실험 비교

| | v1 (기준) | v2 (커버링 인덱스) | v3 (Redis String 캐싱) | v4 (Redis Sorted Set) |
|---|---|---|---|---|
| **무엇을 실험?** | 매 요청마다 DB에서 GROUP BY + ORDER BY 쿼리 실행 | 같은 쿼리에 (product_id, quantity) 커버링 인덱스 추가 | 쿼리 결과를 Redis String에 JSON으로 캐싱 (TTL 5분) | 주문 시 ZINCRBY로 score 증가, 조회 시 ZREVRANGE |
| **가상 데이터** | order_item 테이블에 상품 데이터 적재, 인덱스 없음 | 동일 데이터 + 커버링 인덱스 추가 | 동일 데이터 + Redis에 캐시 저장 | 동일 데이터를 서버 시작 시 Redis Sorted Set에 로딩 |
| **부하 조건** | VU 100명, 2분간 조회 반복 | VU 100명, 2분간 조회 반복 | VU 100명, 2분간 조회 반복 | VU 100명, 2분간 조회 반복 |
| **총 요청 수** | 4,527 | 2,849 | 44,190 | 62,339 |
| **p95 응답시간** | 2,813ms | 5,906ms | 202ms | 17ms |
| **평균 응답시간** | 1,405ms | 2,368ms | 51ms | 6ms |
| **< 1000ms 통과율** | 32% (1,467/4,527) | 18% (507/2,849) | 100% (44,190/44,190) | 100% (62,339/62,339) |
| **처리량 (req/s)** | 38 | 24 | 368 | 519 |
| **결과 요약** | 느림. 매 요청 DB 풀스캔 | 오히려 악화. 동시접속 시 DB 자체가 병목 | 대폭 개선. 캐시 히트 시 DB 안 감 | 최고 성능. DB 접근 자체가 없음 |
| **한계** | 매 요청 O(N log N) 정렬 비용 | 단건에서는 25% 개선이나 동시접속에서 악화 | 캐시 만료 시 race condition (cache stampede) | 검증 테스트 5번/6번 미완 (주문→랭킹 반영 흐름) |
| **추가 검증** | — | 단건 측정: 185ms → 138ms (25% ↓) | race condition 테스트: 100 스레드 → DB 쿼리 100번 발생 확인 | 메모리 관리: ZREMRANGEBYRANK로 100개 유지 확인 |

> 총 요청 수가 v1(4,527) vs v4(62,339)로 크게 차이나는 이유: 같은 2분이라도 응답이 빠르면 더 많은 요청을 보낼 수 있음. v4가 14배 더 많은 요청을 처리한 것 자체가 성능 차이를 보여줌.

---

## 핵심 인사이트

**결과 캐싱 vs 구조 캐싱**: 단순 캐싱(String)은 "결과 저장", Sorted Set은 "구조 저장". 갱신이 빈번한 데이터는 결과가 아니라 정렬 구조 자체를 캐싱해야 읽기/쓰기 모두 효율적.

**Race Condition의 본질**: 공유 자원(Redis 캐시 값)에 대한 비원자적 접근(GET → DB → SET)이 원인. Sorted Set은 ZINCRBY라는 원자적 연산으로 구조적으로 해결.

---

## 면접 대비 꼬리질문

| 질문 | 핵심 답변 |
|---|---|
| Sorted Set 메모리가 커지면? | ZREMRANGEBYRANK로 하위 데이터 정리. TOP 100만 유지 |
| DB와 Redis 정합성 보장? | 주문 시 DB UPDATE + ZINCRBY 동시 실행. 장애 시 DB 기준 배치로 Redis 재구축 |
| String 캐싱의 race condition 해결법은? | 분산 락(Redisson) 또는 구조 변경(Sorted Set). Sorted Set이 구조적 해결 |
| 왜 커버링 인덱스가 부하테스트에서 악화? | 단건에서는 효과 있지만, 동시 100명이 같은 무거운 쿼리를 치면 DB 자체가 병목 |
| v1도 동시 요청 시 같은 문제 아닌가? | DB 부하는 같지만, v1은 설계 의도대로 동작(성능 문제). v3는 의도와 다른 결과(race condition) |
