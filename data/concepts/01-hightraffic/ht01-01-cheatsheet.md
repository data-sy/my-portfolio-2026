# Phase 3-1: Index Optimization (Interview Guide)

## 프로젝트 개요

**목표:** 상품 목록 조회 쿼리에 최적 인덱스를 설계하여 성능 51% 개선

**핵심 성과:**
- v1 (인덱스 없음): p95 70.6ms, Full Scan + filesort
- v2 (category만): p95 78.2ms (오히려 악화!)
- v3 (created_at만): p95 43.4ms, filesort 제거
- v4 (복합 인덱스): **p95 34.3ms, Extra=NULL** ✨
- v5 (역순 복합): p95 57.5ms, 컬럼 순서의 중요성 증명

**개선율:** v1 대비 51% 개선 (70.6ms → 34.3ms)

---

## 핵심 인사이트 (면접 1분 요약)

```
"상품 목록 조회를 최적화하면서 5가지 인덱스 전략을 실험했습니다.

v1(인덱스 없음)은 10만 건 Full Scan에 filesort까지 발생했고,
v2(category만 인덱스)는 WHERE는 개선됐지만 filesort가 남아서
오히려 v1보다 느려졌습니다.

v3(created_at만 인덱스)로 filesort를 제거해 38% 개선했지만,
v4(category, created_at 복합 인덱스)로 51%까지 끌어올렸습니다.

v5에서 컬럼 순서를 반대로 한 실험으로
'등호 조건이 선행, 정렬 컬럼이 후행' 원칙도 실측으로 검증했습니다.

가장 중요한 발견은 EXPLAIN 기반 진단의 효과였습니다.
이전 프로젝트(MMT)에서는 직관으로 접근해 시행착오를 겪었는데,
이번에는 EXPLAIN을 먼저 실행해 문제를 파악하고 바로 해결했습니다."
```

---

## v1 → v2 → v3 → v4 → v5 진화 과정

### v1: 인덱스 없음 (Baseline)

**쿼리:**
```sql
SELECT * FROM product
WHERE category = '전자기기'
ORDER BY created_at DESC
LIMIT 20;
```

**EXPLAIN:**
```
type=ALL | key=NULL | rows=99,742 | Extra: Using where; Using filesort
```

**성능 (10 VU):**
- p95: 70.6ms
- 평균: 48.0ms
- 처리량: 67.0 req/s

**문제점:**
- 10만 행 Full Table Scan
- WHERE: 행마다 category 비교
- ORDER BY: filesort로 정렬
- LIMIT: 정렬 끝나야 상위 20개 추출

---

### v2: category만 인덱스

**인덱스:**
```sql
CREATE INDEX idx_product_category ON product(category);
```

**EXPLAIN:**
```
type=ref | key=idx_product_category | rows=1 | Extra: Using filesort
```

**성능 (10 VU):**
- p95: **78.2ms** (v1보다 악화!)
- 평균: 59.0ms
- 처리량: 62.7 req/s

**왜 악화됐나?**
```
WHERE: category 인덱스로 2만 건 빠르게 추출 ✅
ORDER BY: 2만 건을 filesort로 정렬 ❌

→ 인덱스 참조 + filesort라는 2단계 경로
→ Full Scan 1단계보다 오히려 오버헤드
→ 옵티마이저가 인덱스를 선택했지만 총 비용은 더 큼
```

**핵심 교훈:**
> "WHERE만 커버하는 인덱스는 ORDER BY 비용을 해결하지 못한다"

---

### v3: created_at만 인덱스

**인덱스:**
```sql
CREATE INDEX idx_product_created_at ON product(created_at DESC);
```

**EXPLAIN:**
```
type=index | key=idx_product_created_at | rows=20 | Extra: Using where
```

**성능 (10 VU):**
- p95: 43.4ms (v1 대비 38% ↓)
- 평균: 31.8ms
- 처리량: 75.5 req/s

**개선점:**
- **filesort 제거**: 인덱스가 이미 created_at DESC 순서
- rows=20: 인덱스를 따라가며 category='전자기기' 20개 찾으면 멈춤

**한계:**
- type=index (인덱스 풀스캔). category가 인덱스에 없어서 행마다 WHERE 체크
- 카테고리별 데이터 분포에 따라 성능 편차 발생 가능
- 최악의 경우 인덱스 전체 스캔

---

### v4: 복합 인덱스 (category, created_at DESC) — 최종 솔루션

**인덱스:**
```sql
CREATE INDEX idx_product_category_created ON product(category, created_at DESC);
```

**EXPLAIN:**
```
type=ref | key=idx_product_category_created | rows=1 | Extra: NULL
```

**Extra=NULL의 의미:**
- filesort 없음 (정렬 인덱스로 해결)
- Using where 없음 (필터링도 인덱스로 해결)
- 인덱스만으로 WHERE + ORDER BY + LIMIT 모두 처리

**성능 (10 VU):**
- p95: **34.3ms** (v1 대비 51% ↓)
- 평균: 25.6ms
- 처리량: 79.2 req/s

**핵심 장점:**
1. **WHERE + ORDER BY 동시 커버**
   - category='전자기기' 노드로 바로 이동
   - 그 안에서 이미 created_at DESC 정렬
   - 상위 20개만 읽으면 끝

2. **최소 I/O**
   - 인덱스 B-Tree에서 정확한 위치로 이동
   - 불필요한 행 읽기 없음

---

### v5: 역순 복합 인덱스 (created_at DESC, category) — 대조 실험

**인덱스:**
```sql
CREATE INDEX idx_product_created_category ON product(created_at DESC, category);
```

**EXPLAIN:**
```
type=index | key=idx_product_created_category | rows=20 | Extra: Using where
```

**성능 (10 VU):**
- p95: 57.5ms (v4보다 67% 느림)
- 평균: 43.3ms
- 처리량: 69.4 req/s

**왜 v4보다 느린가?**
```
v4: (category, created_at DESC)
  → category='전자기기'로 바로 이동 (type=ref)
  → 그 안에서 정렬된 순서로 20개 읽음
  → Extra: NULL

v5: (created_at DESC, category)
  → created_at 순서로 인덱스 스캔 (type=index)
  → 매 행마다 category='전자기기'인지 체크 (Using where)
  → 다른 카테고리 행 건너뛰기
  → v3과 동일한 동작
```

**핵심 원칙:**
> "등호(=) 조건이 선행, 범위/정렬 조건이 후행이어야 인덱스 활용도가 높다"

---

## EXPLAIN 핵심 항목 해석

### type 필드 (접근 방식, 위에서 아래로 좋음)

| type | 의미 | 이 실험에서 |
|------|------|------------|
| ref | 인덱스에서 특정 값 참조 | v2, **v4** |
| index | 인덱스 전체 스캔 | v3, v5 |
| ALL | 테이블 전체 스캔 | v1 |

### Extra 필드 (추가 작업)

| Extra | 의미 | 성능 영향 |
|-------|------|----------|
| NULL | 추가 작업 없음 | **최적** (v4) |
| Using where | 행 필터링 필요 | 비용 있음 (v1, v3, v5) |
| Using filesort | 별도 정렬 필요 | 비용 큼 (v1, v2) |

### 이 실험의 EXPLAIN 전체 비교

| | type | key | rows | Extra |
|---|---|---|---|---|
| v1 | ALL | NULL | 99,742 | Using where; Using filesort |
| v2 | ref | idx_product_category | 1 | Using filesort |
| v3 | index | idx_product_created_at | 20 | Using where |
| v4 | **ref** | idx_product_category_created | 1 | **NULL** |
| v5 | index | idx_product_created_category | 20 | Using where |

---

## 복합 인덱스 컬럼 순서 원칙 (핵심 개념)

### B-Tree 구조 비교

```
v4: (category, created_at DESC) — 최적
┌──────────────────────────────────────┐
│  category='전자기기'                  │ ← ref로 바로 이동
│    ├── 2024-12-31                    │
│    ├── 2024-12-30                    │ ← 이미 정렬됨
│    ├── 2024-12-29                    │ ← 20개만 읽으면 끝
│    └── ...                           │
│  category='의류'                     │
│    └── ...                           │
└──────────────────────────────────────┘

v5: (created_at DESC, category) — 비효율
┌──────────────────────────────────────┐
│  2024-12-31                          │
│    ├── category='전자기기' ✅          │ ← 하나 찾음
│    ├── category='의류' ❌             │ ← 건너뜀
│    ├── category='식품' ❌             │ ← 건너뜀
│    └── ...                           │
│  2024-12-30                          │
│    ├── category='도서' ❌             │ ← 건너뜀
│    ├── category='전자기기' ✅          │ ← 또 하나 찾음
│    └── ...                           │ ← 20개 모을 때까지 반복
└──────────────────────────────────────┘
```

### 원칙

| 조건 유형 | 인덱스 위치 | 이유 |
|-----------|------------|------|
| 등호 (=) | **선행** | 정확한 노드로 이동 가능 |
| 범위/정렬 | **후행** | 등호로 좁힌 범위 안에서 활용 |

---

## MMT → HT 성장 스토리

### 비교표

| | MMT (이전 프로젝트) | HT (현재 프로젝트) |
|---|---|---|
| 접근 | 직관 → 시행착오 | EXPLAIN 진단 → 바로 해결 |
| 시도 수 | 3단계 (삽질 포함) | 5단계 (체계적 실험) |
| EXPLAIN 사용 | 사용하지 않음 | 사전 진단 + 사후 검증 |
| 인사이트 | "EXPLAIN을 먼저 해야 했다" | "EXPLAIN을 먼저 했더니 시행착오 없이 해결" |
| 면접 포인트 | 실패에서 교훈 도출 | 교훈을 실제로 적용하여 성장 증명 |

### 면접 포인트

```
"MMT 프로젝트에서는 EXPLAIN 없이 직관적으로 단일 인덱스를 하나씩 시도했습니다.
결과적으로 돌아가는 방법을 택한 셈이었죠.

그 경험에서 '실행계획 기반 진단이 먼저'라는 교훈을 얻었고,
HT 프로젝트에서는 EXPLAIN을 먼저 실행해 type=ALL, filesort라는 문제를 파악했습니다.
그래서 5가지 전략을 체계적으로 실험하고 실측 데이터로 비교할 수 있었습니다."
```

---

## 부하 테스트 결과 분석

### 테스트 환경
- k6 load test
- 10 VU (Virtual Users)
- 30초 실행

### 결과 비교

| Version | p95 | 평균 | 처리량 | 총 요청 | filesort |
|---------|-----|------|--------|---------|----------|
| **v1** | 70.6ms | 48.0ms | 67.0/s | 2,020 | ✅ |
| **v2** | 78.2ms | 59.0ms | 62.7/s | 1,883 | ✅ |
| **v3** | 43.4ms | 31.8ms | 75.5/s | 2,270 | ❌ |
| **v4** | **34.3ms** | **25.6ms** | **79.2/s** | **2,380** | **❌** |
| **v5** | 57.5ms | 43.3ms | 69.4/s | 2,083 | ❌ |

### 주요 발견

#### 1. v2의 역설 (인덱스가 항상 빠른 것은 아니다)
```
v1: 2,020 requests in 30s (67.0 req/s)
v2: 1,883 requests in 30s (62.7 req/s) ← 6% 감소!

왜? category 인덱스로 좁혔지만 filesort가 남음
→ 인덱스 참조 + filesort 2단계
→ Full Scan 1단계보다 오버헤드
```

#### 2. v3 vs v5 (같은 동작, 다른 인덱스)
```
v3: p95 43.4ms (created_at만)
v5: p95 57.5ms (created_at + category, 역순)

둘 다 type=index, Using where
하지만 v5가 더 느림 = 복합 인덱스의 추가 크기가 스캔 비용 증가
```

#### 3. v4의 압도적 효율
```
v4: Extra=NULL → 추가 작업 제로
다른 모든 버전은 filesort 또는 Using where가 존재

v4만이 인덱스 하나로 WHERE + ORDER BY + LIMIT 모두 해결
```

---

## 면접 대비 Q&A

### Q1. "왜 복합 인덱스를 선택했나요?"

**답변:**
```
EXPLAIN 진단 결과, 문제가 두 가지였습니다:
1. WHERE category = ? → type=ALL (Full Scan)
2. ORDER BY created_at DESC → Using filesort

이 두 문제를 동시에 해결하려면 (category, created_at DESC) 복합 인덱스가 필요했습니다.
category로 바로 이동한 뒤, 이미 정렬된 순서로 20개만 읽으면 끝나니까요.

실제로 v4 적용 후 EXPLAIN에서 Extra=NULL이 나왔습니다.
filesort도, Using where도 없는 최적 상태입니다.
```

### Q2. "복합 인덱스의 쓰기 비용은 괜찮나요?"

**답변:**
```
이 서비스는 읽기 중심입니다.
상품 등록은 관리자가 가끔 하지만, 조회는 사용자가 수시로 합니다.
읽기:쓰기 비율이 압도적으로 읽기 쪽이므로 인덱스 유지 비용은 허용 범위입니다.

만약 쓰기가 많아지면:
1. 인덱스 수 자체를 줄이거나
2. 비동기 배치 처리로 쓰기 부하 분산
3. 읽기 전용 레플리카에만 인덱스 추가

를 고려할 수 있습니다.
```

### Q3. "v2가 v1보다 느린 게 이상한데요?"

**답변:**
```
처음엔 저도 의외였습니다.
EXPLAIN을 보면 v2는 type=ref로 개선됐는데, Extra에 filesort가 남아 있었습니다.

category 인덱스로 2만 건을 빠르게 찾았지만,
그 2만 건을 created_at으로 정렬하는 filesort 비용이 여전했습니다.

인덱스 참조 + filesort라는 2단계 경로가
Full Scan 1단계 경로보다 총 비용이 더 컸던 겁니다.

k6 결과로 보면:
- v1: 2,020 req, p95 70.6ms
- v2: 1,883 req, p95 78.2ms

이 경험으로 "인덱스를 타는 것이 항상 빠른 것은 아니다"는 교훈을 얻었습니다.
```

### Q4. "컬럼 순서가 왜 중요한가요?"

**답변:**
```
v4와 v5를 비교하면 명확합니다.
같은 두 컬럼인데 순서만 바꿨더니 p95가 34.3ms vs 57.5ms로 67% 차이났습니다.

B-Tree 특성상:
- v4 (category, created_at): category='전자기기'로 바로 이동 → 정렬된 순서로 읽기
- v5 (created_at, category): 시간순으로 스캔하면서 category를 매번 체크

원칙은 "등호 조건이 선행, 범위/정렬 조건이 후행"입니다.
등호 조건으로 먼저 범위를 좁혀야 후행 컬럼의 정렬을 활용할 수 있습니다.
```

### Q5. "MMT에서는 어떤 시행착오를 겪었나요?"

**답변:**
```
MMT에서는 EXPLAIN을 사용하지 않고 직관적으로 접근했습니다.
"이 컬럼에 인덱스를 추가하면 빨라지겠지" 하고 단일 인덱스를 하나씩 시도했어요.

결과적으로 여러 단계를 돌아가며 삽질을 했고,
그 경험에서 "실행계획 기반 진단이 먼저"라는 교훈을 얻었습니다.

HT에서는 그 교훈을 적용해서:
1. EXPLAIN 먼저 실행 → type=ALL, filesort 확인
2. 문제의 전체 그림 파악
3. 5가지 전략을 체계적으로 실험
4. 실측 데이터로 비교 검증

진단을 먼저 하니 시행착오 없이 최적 해결책에 도달할 수 있었습니다.
```

### Q6. "다른 조회 패턴이 추가되면 어떻게 하나요?"

**답변:**
```
인덱스는 쿼리 패턴에 종속적입니다.
새로운 조회 패턴이 추가되면:

1. EXPLAIN으로 새 쿼리의 실행계획 진단
2. 기존 인덱스로 커버 가능한지 확인
3. 안 되면 새 인덱스 추가

다만 인덱스가 많아지면 쓰기 비용이 증가하므로,
실제 사용 빈도를 기준으로 우선순위를 정하고
사용하지 않는 인덱스는 주기적으로 정리합니다.
```

---

## 기술 스택 & 핵심 명령어

### MySQL EXPLAIN

```sql
-- 기본 실행계획
EXPLAIN SELECT * FROM product
WHERE category = '전자기기'
ORDER BY created_at DESC LIMIT 20;

-- JSON 포맷 (상세 비용 정보)
EXPLAIN FORMAT=JSON SELECT * FROM product
WHERE category = '전자기기'
ORDER BY created_at DESC LIMIT 20;

-- 인덱스 확인
SHOW INDEX FROM product;
```

### 인덱스 관리

```sql
-- 복합 인덱스 생성
CREATE INDEX idx_product_category_created
ON product(category, created_at DESC);

-- 인덱스 삭제
DROP INDEX idx_product_category_created ON product;
```

### Spring Data JPA

```java
// Repository: 인덱스를 활용하는 메서드명 규칙
Page<Product> findByCategoryOrderByCreatedAtDesc(
    String category, Pageable pageable);

// 생성되는 쿼리:
// SELECT * FROM product
// WHERE category = ?
// ORDER BY created_at DESC
// LIMIT ? OFFSET ?
```

---

## 참고 자료

- EXPLAIN 결과: `results/explain/step1~step5-*.txt`, `*.json`
- k6 부하테스트: `results/k6/step1~step5-*.json`
- 인덱스 SQL: `scripts/index/step0~step5-*.sql`

---

**작성일:** 2026-02-27
**테스트 환경:** MacBook Air M1, Docker (MySQL 8.0), Java 17, Spring Boot 3, k6
**데이터:** product 100K rows (5 categories × 20K each)
