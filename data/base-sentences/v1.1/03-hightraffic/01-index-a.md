# Troubleshooting A: 문제해결형

## DB 인덱스 최적화를 통한 상품 목록 조회 성능 93% 개선
| key | value |
|---|---|
| title | DB 인덱스 최적화로 상품 목록 조회 성능 93% 개선 |
| problem | Full Table Scan으로 상품 목록 조회 응답시간 2.5초 |
| try_1_title | EXPLAIN 실행계획 진단 |
| try_1_desc | 인덱스 적용 전 EXPLAIN으로 실행계획 분석 |
| try_1_result | type=ALL (Full Table Scan), Extra에 Using filesort 확인. WHERE (category)과 ORDER BY (created_at DESC) 모두 인덱스 미지원 상태로 진단 |
| try_1_limit | 진단 완료, 해결 필요 |
| try_2_title | 복합 인덱스 (category, created_at DESC) 적용 |
| try_2_desc | 진단 결과 기반으로 WHERE + ORDER BY를 동시에 커버하는 복합 인덱스 설계. 적용 후 EXPLAIN으로 검증 |
| try_2_result | 2.5s → 180ms (93%↓), type=ref, filesort 제거 확인 ✓ |
| try_2_limit | 조회 패턴 전체 커버 |
| final_result | 2.5s → 180ms (93%↓) |
| insight_1 | 인덱스는 WHERE 조건 + 정렬/페이징 패턴까지 포함한 설계 문제. 쿼리 하나가 아니라 조회 흐름 전체를 봐야 함 |
| insight_2 | MMT에서 실행계획 없이 직관으로 접근해 불필요한 시행착오를 겪은 경험을 바탕으로, 이번에는 EXPLAIN 진단을 먼저 수행. 문제의 전체 그림을 파악한 뒤 해결책을 설계하니 시행착오 없이 해결할 수 있었음 |
| followup_q1 | 복합 인덱스를 사용했을 때 쓰기 비용이 늘어나지는 않나? |
| followup_q2 | 인덱스 컬럼 순서가 (created_at, category)였다면 어떻게 됐을까? |
| followup_a2 | 실제로 순서를 바꿔서 EXPLAIN으로 확인한 결과, created_at이 선행 컬럼이면 범위 검색 시 후행 컬럼(category)의 필터링이 인덱스를 타지 못함. B-Tree 특성상 선행 컬럼이 범위 조건이면 후행 컬럼의 정렬/필터 이점을 잃기 때문에 (category, created_at) 순서가 적합 |

<!--
insight_1 방향: 쿼리 패턴 분석, 조회 흐름 기반 설계
insight_1 예상 꼬리질문: 이 서비스에서 자주 쓰이는 조회 패턴은? / 복합 인덱스 컬럼 순서는 어떻게 정했나? / 다른 조회 패턴이 추가되면 인덱스 어떻게 관리?

insight_2 방향: 프로젝트 간 성장, 진단 기반 접근의 효과
insight_2 예상 꼬리질문: MMT에서는 구체적으로 어떤 시행착오를 겪었나? / EXPLAIN 결과를 보고 어떻게 복합 인덱스가 필요하다고 판단했나? / EXPLAIN에서 어떤 항목을 주로 확인하나?

followup_a1: 상품 조회가 등록보다 압도적으로 많은 읽기 중심 서비스라 읽기 최적화 우선. 쓰기 빈도가 높아지면 인덱스 개수 조정이나 비동기 처리 고려.
followup_a2: 실제로 순서를 바꿔서 EXPLAIN 확인한 결과, created_at이 선행 컬럼이면 범위 검색 시 후행 컬럼(category)의 필터링이 인덱스를 타지 못함. B-Tree 특성상 선행 컬럼이 범위 조건이면 후행 컬럼의 정렬/필터 이점을 잃기 때문에 (category, created_at) 순서가 적합.
-->

<!--
## 문제 해결 맥락 (면접 대비용)

상황: 상품 목록 조회 쿼리
SELECT * FROM product WHERE category = ? ORDER BY created_at DESC LIMIT 20;

시도 1: EXPLAIN 실행계획 진단
- 왜? MMT에서 직관으로 접근해 시행착오를 겪은 교훈 반영
- 결과: type=ALL, Extra=Using filesort → WHERE과 ORDER BY 모두 인덱스 지원 없음 확인
- 판단: 두 조건을 동시에 커버하는 복합 인덱스가 필요

시도 2: (category, created_at DESC) 복합 인덱스 적용
- 왜? 진단 결과 WHERE + ORDER BY 동시 커버 필요
- 핵심: category로 먼저 좁히고, 그 안에서 created_at 정렬이 이미 되어있음
- 검증: 적용 후 EXPLAIN 재실행 → type=ref, filesort 제거 확인

인사이트 연결:
MMT에서는 EXPLAIN 없이 직관으로 단일 인덱스를 하나씩 시도하며 돌아갔음.
그 경험에서 "실행계획 기반 진단이 먼저"라는 교훈을 얻었고,
HT에서는 EXPLAIN을 먼저 실행해 문제의 전체 그림을 파악한 뒤
복합 인덱스로 직행하여 시행착오 없이 해결.
-->

<!--
## MMT ↔ HT 성장 스토리 대비

| | MMT (실험형) | HT (진단형) |
|---|---|---|
| 접근 | 직관 → 시행착오 | EXPLAIN 진단 → 바로 해결 |
| 시도 수 | 3단계 (삽질 포함) | 2단계 (진단 + 적용) |
| EXPLAIN 사용 | 사용하지 않음 | 사전 진단 + 사후 검증 |
| 인사이트 | "EXPLAIN을 먼저 해야 했다" | "EXPLAIN을 먼저 했더니 시행착오 없이 해결" |
| 면접 포인트 | 실패에서 교훈 도출 | 교훈을 실제로 적용하여 성장 증명 |
-->
