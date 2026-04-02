# Troubleshooting A: 문제해결형

## Template
문제 상황 → 시도 과정 → 최종 결과 → 인사이트

## Case: DB 인덱스 최적화
| key | value |
|---|---|
| title | DB 인덱스 최적화를 통한 상품 목록 조회 성능 93% 개선 |
| problem | Full Table Scan으로 상품 목록 조회 응답시간 2.5초 |
| try_1_title | 단일 인덱스 (category) |
| try_1_desc | category 단일 컬럼 인덱스 생성 |
| try_1_result | 2.5초 → 1.8초 (28%↓) |
| try_1_limit | 여전히 filesort 발생 |
| try_2_title | 단일 인덱스 (created_at) |
| try_2_desc | created_at 단일 컬럼 인덱스 생성 |
| try_2_result | 2.1초 (16%↓) |
| try_2_limit | filesort 제거, category 필터링 비효율 |
| try_3_title | 복합 인덱스 |
| try_3_desc | (category, created_at DESC) 복합 인덱스 적용 |
| try_3_result | 180ms (93%↓) ✓ |
| try_3_limit | 조회 패턴 전체 커버 |
| final_result | 2.5s → 180ms (93%↓) |
| insight_1 | 인덱스는 WHERE 조건 + 정렬/페이징 패턴까지 포함한 설계 문제이며, 단일 인덱스로는 복합 조건을 효율적으로 처리할 수 없음 |
| insight_2 |  |
| followup_q1 |  |
| followup_q2 |  |

<!-- 
insight_1 방향: 
insight_1 예상 꼬리질문: 

insight_2 방향: 
insight_2 예상 꼬리질문: 

followup_a1: 
followup_a2: 
-->


<!--
## 문제 해결 맥락

상황: 상품 목록 조회 쿼리
SELECT * FROM products WHERE category = ? ORDER BY created_at DESC LIMIT 20;

시도 1: category 단일 인덱스
- 왜? WHERE 조건에 쓰이는 컬럼이니까 가장 먼저 시도
- 한계: WHERE은 빨라졌는데 ORDER BY 정렬은 여전히 filesort

시도 2: created_at 단일 인덱스  
- 왜? 정렬 기준 컬럼에 인덱스 걸면?
- 한계: 정렬은 빨라졌는데 category 필터링이 비효율

시도 3: (category, created_at DESC) 복합 인덱스
- 왜? WHERE + ORDER BY 둘 다 커버
- 핵심: category로 먼저 좁히고, 그 안에서 created_at 정렬이 이미 되어있음

인사이트 연결:
상품 목록은 항상 "카테고리 필터 + 최신순 정렬" 패턴으로 조회됨.
이 흐름을 알았으면 처음부터 복합 인덱스로 갔을 텐데,
쿼리 조건 하나씩만 보고 단일 인덱스를 시도해서 돌아갔음.
-->
