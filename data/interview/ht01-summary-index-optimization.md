# Phase 3-1. 인덱스 최적화

## 문제 상황

상품 목록 조회 시, 카테고리별 필터링 + 최신순 정렬 + 페이징 쿼리 실행.

```sql
SELECT * FROM product WHERE category = '전자기기' ORDER BY created_at DESC LIMIT 20
```

- 10만 건(카테고리 5개, 각 2만 건) 기준으로 매 요청마다 Full Table Scan + filesort 발생
- EXPLAIN 결과: type=ALL, rows=99,742, Extra: Using where; Using filesort

---

## 실험 구성

- 부하 조건: k6, VU 10명, 30초간 상품 목록 조회 반복
- 기준(v1): 인덱스 없는 순수 DB 쿼리

---

## v1. 인덱스 없음 (Baseline)

### 무엇을 했나

인덱스 없이 순수 쿼리 실행. Full Table Scan으로 10만 건 전체를 읽고, 그 중 category 필터링 후 filesort로 정렬.

### EXPLAIN 결과

| 항목 | 값 |
|---|---|
| type | ALL (Full Table Scan) |
| key | NULL |
| rows | 99,742 |
| Extra | Using where; Using filesort |

### 부하테스트 결과

| 측정 | 값 |
|---|---|
| p95 | 70.6ms |
| 평균 | 48.0ms |
| 처리량 | 67.0 req/s |
| 총 요청 수 | 2,020 |

### 문제점

- 매 요청마다 10만 행 전체 스캔
- WHERE 필터링도, ORDER BY 정렬도 인덱스 없이 처리
- filesort: 디스크 기반 정렬로 추가 비용

---

## v2. 단일 인덱스 — category만

### 무엇을 했나

```sql
CREATE INDEX idx_product_category ON product(category);
```

WHERE 조건인 category에만 인덱스 추가. category로 빠르게 좁힌 뒤, 나머지 정렬은 DB가 처리.

### EXPLAIN 결과

| 항목 | 값 |
|---|---|
| type | ref (인덱스 참조) |
| key | idx_product_category |
| rows | 1 (옵티마이저 추정) |
| Extra | Using filesort |

### 부하테스트 결과

| 측정 | 값 |
|---|---|
| p95 | 78.2ms |
| 평균 | 59.0ms |
| 처리량 | 62.7 req/s |
| 총 요청 수 | 1,883 |

### 분석

- WHERE 절은 인덱스를 탐 (type=ALL → ref 개선)
- 하지만 **filesort가 여전히 존재**: category로 걸러진 2만 건을 created_at으로 정렬하는 비용
- v1보다 **오히려 악화**: p95 70.6ms → 78.2ms, 처리량 67.0 → 62.7 req/s

### 왜 v1보다 느린가?

단건 쿼리에서는 category 인덱스가 10만 → 2만으로 좁히는 효과가 있지만, 부하테스트에서는:
- 인덱스로 좁힌 2만 건에 대해 filesort 수행 → 정렬 비용은 여전
- 인덱스 참조 + filesort라는 **2단계 작업**이 Full Scan + filesort보다 오히려 오버헤드
- 옵티마이저가 인덱스를 사용하는 경로를 선택했지만, 총 비용은 더 클 수 있음

→ **WHERE만 커버하는 인덱스로는 ORDER BY 비용을 해결할 수 없음**

---

## v3. 단일 인덱스 — created_at만

### 무엇을 했나

```sql
CREATE INDEX idx_product_created_at ON product(created_at DESC);
```

ORDER BY 조건인 created_at에만 인덱스 추가. 정렬은 인덱스로 해결하고, WHERE 필터링은 행 단위로 처리.

### EXPLAIN 결과

| 항목 | 값 |
|---|---|
| type | index (인덱스 풀스캔) |
| key | idx_product_created_at |
| rows | 20 |
| Extra | Using where |

### 부하테스트 결과

| 측정 | 값 |
|---|---|
| p95 | 43.4ms |
| 평균 | 31.8ms |
| 처리량 | 75.5 req/s |
| 총 요청 수 | 2,270 |

### 분석

- **filesort 제거됨**: created_at DESC 인덱스를 따라가며 읽으므로 정렬 불필요
- rows=20: LIMIT 20이므로 인덱스를 따라가다 category='전자기기'에 해당하는 20개를 찾으면 멈춤
- v1 대비 **p95 38% 개선** (70.6ms → 43.4ms)

### 한계

- type=index는 인덱스 전체를 스캔하는 것. category 필터링이 인덱스에 없어서 행마다 WHERE 체크 필요
- 만약 해당 카테고리 데이터가 최근에 몰려 있으면 빠르지만, 분산되어 있으면 많은 행을 건너뛰어야 함
- **최악의 경우**: 해당 카테고리 상품이 오래전에만 존재하면 인덱스 전체를 스캔

→ **ORDER BY는 해결했지만, WHERE 필터링이 인덱스를 타지 못함**

---

## v4. 복합 인덱스 — (category, created_at DESC) ✅

### 무엇을 했나

```sql
CREATE INDEX idx_product_category_created ON product(category, created_at DESC);
```

WHERE + ORDER BY를 동시에 커버하는 복합 인덱스. category로 먼저 좁히고, 그 안에서 created_at이 이미 정렬되어 있음.

### 복합 인덱스의 동작 원리

B-Tree 인덱스 내부 구조:

```
idx_product_category_created:
  ├── category='도서'
  │     ├── created_at: 2024-12-31 (최신)
  │     ├── created_at: 2024-12-30
  │     └── ...
  ├── category='스포츠'
  │     └── ...
  ├── category='식품'
  │     └── ...
  ├── category='의류'
  │     └── ...
  └── category='전자기기'
        ├── created_at: 2024-12-31 (최신) ← 여기서부터
        ├── created_at: 2024-12-30         ← 20개만
        ├── created_at: 2024-12-29         ← 순서대로
        └── ...                            ← 읽으면 끝
```

- category='전자기기' 노드로 바로 이동 (= WHERE)
- 그 안에서 이미 created_at DESC로 정렬됨 (= ORDER BY 불필요)
- 상위 20개만 읽으면 끝 (= LIMIT)

### EXPLAIN 결과

| 항목 | 값 |
|---|---|
| type | ref (인덱스 참조) |
| key | idx_product_category_created |
| rows | 1 (옵티마이저 추정) |
| Extra | NULL |

**핵심: Extra가 NULL** = filesort도 없고, Using where도 없음. 인덱스만으로 모든 조건을 처리.

### 부하테스트 결과

| 측정 | 값 |
|---|---|
| p95 | 34.3ms |
| 평균 | 25.6ms |
| 처리량 | 79.2 req/s |
| 총 요청 수 | 2,380 |

### 성과

- v1 대비 **p95 51% 개선** (70.6ms → 34.3ms)
- v1 대비 **처리량 18% 증가** (67.0 → 79.2 req/s)
- WHERE과 ORDER BY를 모두 인덱스로 처리하여 DB 부하 최소화

---

## v5. 역순 복합 인덱스 — (created_at DESC, category)

### 무엇을 했나

```sql
CREATE INDEX idx_product_created_category ON product(created_at DESC, category);
```

v4와 같은 컬럼이지만 **순서를 반대로**. 인덱스 컬럼 순서가 성능에 미치는 영향을 검증.

### EXPLAIN 결과

| 항목 | 값 |
|---|---|
| type | index (인덱스 풀스캔) |
| key | idx_product_created_category |
| rows | 20 |
| Extra | Using where |

### 부하테스트 결과

| 측정 | 값 |
|---|---|
| p95 | 57.5ms |
| 평균 | 43.3ms |
| 처리량 | 69.4 req/s |
| 총 요청 수 | 2,083 |

### 왜 v4보다 느린가?

B-Tree 인덱스 내부 구조 비교:

```
v4: (category, created_at DESC)
→ category='전자기기' 노드로 바로 이동 (ref)
→ 그 안에서 정렬된 순서로 20개 읽음

v5: (created_at DESC, category)
→ created_at이 선행 컬럼이므로 시간순으로 정렬
→ category='전자기기'를 찾으려면 행마다 체크 (Using where)
→ 다른 카테고리 행도 읽으며 건너뛰어야 함
```

- v4는 **type=ref**: 정확한 위치로 바로 이동
- v5는 **type=index**: 인덱스를 순서대로 스캔하면서 WHERE 체크
- B-Tree 특성상 **선행 컬럼이 등호(=) 조건이어야** 후행 컬럼의 정렬 이점을 활용 가능
- created_at이 선행이면 range scan이 되어 후행 컬럼 category의 필터링이 인덱스를 타지 못함

→ **복합 인덱스의 컬럼 순서는 쿼리 패턴에 맞춰야 함. 등호 조건 컬럼이 먼저, 범위/정렬 컬럼이 나중에**

---

## 전체 비교 (k6 부하테스트, VU 10, 30초)

| | v1 | v2 | v3 | v4 | v5 |
|---|---|---|---|---|---|
| 방식 | 인덱스 없음 | category만 | created_at만 | (category, created_at) | (created_at, category) |
| p95 | 70.6ms | 78.2ms | 43.4ms | **34.3ms** | 57.5ms |
| 평균 | 48.0ms | 59.0ms | 31.8ms | **25.6ms** | 43.3ms |
| 처리량 | 67.0 req/s | 62.7 req/s | 75.5 req/s | **79.2 req/s** | 69.4 req/s |
| 총 요청 수 | 2,020 | 1,883 | 2,270 | **2,380** | 2,083 |
| EXPLAIN type | ALL | ref | index | **ref** | index |
| filesort | ✅ 있음 | ✅ 있음 | ❌ 없음 | **❌ 없음** | ❌ 없음 |
| Using where | ✅ 있음 | ❌ 없음 | ✅ 있음 | **❌ 없음** | ✅ 있음 |

### 상세 실험 비교

| | v1 (인덱스 없음) | v2 (category만) | v3 (created_at만) | v4 (복합 인덱스) | v5 (역순 복합) |
|---|---|---|---|---|---|
| **무엇을 실험?** | 인덱스 없이 Full Scan | WHERE 조건에만 인덱스 | ORDER BY 조건에만 인덱스 | WHERE + ORDER BY 동시 커버 | 컬럼 순서 반대로 |
| **인덱스** | 없음 | (category) | (created_at DESC) | (category, created_at DESC) | (created_at DESC, category) |
| **EXPLAIN type** | ALL | ref | index | ref | index |
| **EXPLAIN Extra** | Using where; Using filesort | Using filesort | Using where | NULL (최적) | Using where |
| **p95** | 70.6ms | 78.2ms | 43.4ms | **34.3ms** | 57.5ms |
| **평균** | 48.0ms | 59.0ms | 31.8ms | **25.6ms** | 43.3ms |
| **처리량** | 67.0 req/s | 62.7 req/s | 75.5 req/s | **79.2 req/s** | 69.4 req/s |
| **총 요청 수** | 2,020 | 1,883 | 2,270 | **2,380** | 2,083 |
| **결과 요약** | 느림. 전체 스캔 + 정렬 | 오히려 악화. 필터만 되고 정렬은 그대로 | 개선. 정렬은 해결, 필터가 미흡 | **최적. 필터 + 정렬 모두 인덱스** | v3과 유사. 컬럼 순서가 안 맞음 |
| **한계** | WHERE도 ORDER BY도 인덱스 없음 | filesort 여전히 발생 | type=index, 인덱스 풀스캔 | — | 등호 조건이 후행이라 활용 불가 |

> v2가 v1보다 느린 이유: category 인덱스로 2만 건을 좁힌 뒤 filesort를 수행하는 2단계 경로가, Full Scan 한 번의 경로보다 오히려 오버헤드가 컸음. 옵티마이저가 인덱스를 선택했지만 항상 빠른 것은 아님.

---

## 핵심 인사이트

**복합 인덱스 컬럼 순서의 중요성**: 같은 컬럼 조합이라도 순서에 따라 성능이 완전히 달라짐. B-Tree 특성상 등호(=) 조건 컬럼이 선행, 범위/정렬 컬럼이 후행이어야 인덱스를 온전히 활용.

**EXPLAIN 기반 진단의 효과**: 이전 프로젝트(MMT)에서는 EXPLAIN 없이 직관으로 접근해 시행착오를 겪었음. 이번에는 EXPLAIN을 먼저 실행해 문제의 전체 그림(type=ALL, filesort)을 파악한 뒤 복합 인덱스로 직행하여 시행착오 없이 해결.

---

## 면접 대비 꼬리질문

| 질문 | 핵심 답변 |
|---|---|
| 복합 인덱스의 쓰기 비용은? | 읽기 중심 서비스라 인덱스 유지 비용 허용. 쓰기가 많아지면 인덱스 수 조정 |
| 컬럼 순서가 (created_at, category)면? | v5 실험으로 확인. type=index, Using where로 v4보다 67% 느림 |
| v2가 v1보다 느린 게 이상한데? | 인덱스 참조 + filesort 2단계가 Full Scan 1단계보다 오버헤드 큼. 인덱스가 항상 빠른 것은 아님 |
| 다른 조회 패턴이 추가되면? | 새 패턴마다 EXPLAIN으로 진단 후 인덱스 추가/조정. 인덱스는 쿼리 패턴에 맞춰 설계 |
| MMT에서는 어떤 시행착오? | EXPLAIN 없이 단일 인덱스를 하나씩 시도. 이번에는 진단 먼저 → 복합 인덱스로 직행 |
