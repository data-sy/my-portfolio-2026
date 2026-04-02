# Troubleshooting A: 문제해결형

## Redis Sorted Set으로 실시간 랭킹 조회 98% 개선
| key | value |
|---|---|
| title | Redis Sorted Set으로 실시간 랭킹 조회 98% 개선 |
| context | 주문상품 15만 건, 실시간 판매량 TOP 100 조회 시 매 요청 집계 정렬로 **p95 2,813ms** |
| try_1_title | 커버링 인덱스 |
| try_1_desc | (product_id, quantity) 커버링 인덱스 적용 |
| try_1_result | Using index로 I/O 감소하지만 Using temporary·filesort 잔존 |
| try_1_limit | 집계+정렬은 인덱스만으로 제거 불가 |
| try_2_title | Redis String 캐싱 |
| try_2_desc | TOP 100 결과를 Redis String 캐싱 (TTL 5분) |
| try_2_result | 2,813ms → 202ms (93% ↓) |
| try_2_limit | 캐시 만료 시 race condition (cache stampede) |
| try_3_title | Redis Sorted Set |
| try_3_desc | **ZINCRBY**로 판매 시 score 증가, **ZREVRANGE**로 정렬 상태 자동 유지 |
| try_3_result | **2,813ms → 17ms (99.4%↓)** |
| try_3_completion | 삽입 O(log N), 조회 O(log N + M) ✓ |
| result | 동시접속 100명 기준 p95 2,813ms → 17ms (99.4% ↓) |
<!--| result_desc | Sorted Set으로 정렬 상태 자동 유지 |-->
| insight_1 | 단순 캐싱은 "결과 저장", **Sorted Set은 "구조 저장"** 갱신이 빈번한 데이터는 결과가 아니라 정렬 구조 자체를 캐싱해야 읽기/쓰기 모두 효율적 |
| followup_q1 | Sorted Set의 메모리 사용량이 커지면 어떻게 관리하나? |
| followup_q2 | 랭킹 데이터와 DB 원본 데이터의 정합성은 어떻게 보장하나? |

<!--
insight_1 방향: 결과 캐싱 vs 구조 캐싱 차이
insight_1 예상 꼬리질문: String 캐싱의 race condition은 구체적으로 어떻게 발생하나? / Sorted Set은 왜 race condition이 없나? / 언제 String을 쓰고 언제 Sorted Set을 쓰나?

followup_a1: Sorted Set은 member 수에 비례하여 메모리 사용. TOP 100만 필요하므로 ZREMRANGEBYRANK로 하위 데이터 주기적 정리. 또는 TTL 설정으로 전체 키 만료 후 재구축.
followup_a2: 판매 발생 시 DB 업데이트와 동시에 ZINCRBY로 Redis 갱신. 장애 시 DB 기준 배치로 Redis 재구축하는 복구 전략 마련.
-->

<!--
## 문제 해결 맥락 (면접 대비용)

상황: 실시간 판매량 TOP 100 조회
SELECT product_id, COUNT(*) as sales_count
FROM orders GROUP BY product_id ORDER BY sales_count DESC LIMIT 100;
→ 매번 전체 상품 대상 정렬 실행

시도 1: 커버링 인덱스 (product_id, quantity)
- 왜? 가장 먼저 시도할 수 있는 DB 레벨 최적화
- 결과: Using index로 I/O 감소하지만 Using temporary·filesort 잔존
- 한계: 집계+정렬은 인덱스만으로 제거 불가

시도 2: Redis String 캐싱
- 왜? 결과를 캐싱하면 DB 부하 제거 가능
- 결과: 캐시 히트 시 90% 개선
- 한계: 갱신 시 전체 재계산 필요, 동시 갱신 시 race condition

시도 3: Redis Sorted Set
- 왜? 정렬 구조 자체를 유지하는 자료구조
- 핵심: ZINCRBY product:ranking 1 {product_id}
       ZREVRANGE product:ranking 0 99 WITHSCORES
- 결과: 판매 시 score 자동 증가 + 정렬 유지, 조회 O(log N + M)으로 98% 개선
- 추가: 왜 ZADD가 아니라 ZINCRBY인가?
  - ZADD는 score를 덮어쓰고, ZINCRBY는 기존 score에 더하는 것
  - 주문마다 해당 상품의 quantity만큼 누적해야 하니까 ZINCRBY가 정확한 선택

인사이트 연결:
처음엔 "캐싱하면 되겠지" 생각했지만,
String 캐싱은 갱신마다 전체 재계산 + race condition 문제.
"결과"가 아니라 "정렬 상태"를 저장하는 자료구조가 필요했고,
Sorted Set이 실시간 갱신과 빠른 조회를 동시에 해결.
-->

<!--
## 핵심 쿼리 비교

DB 방식:
SELECT product_id, COUNT(*) as sales_count
FROM orders
GROUP BY product_id
ORDER BY sales_count DESC
LIMIT 100;
→ 매번 O(N log N) 정렬

Redis Sorted Set:
// 판매 발생 시
ZINCRBY product:ranking 1 {product_id}

// 조회 시
ZREVRANGE product:ranking 0 99 WITHSCORES
→ O(log N + M) 조회
-->
