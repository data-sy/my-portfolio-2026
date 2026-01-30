# Troubleshooting A: 문제해결형

## DB 인덱스 최적화를 통한 상품 목록 조회 성능 93% 개선
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
| insight_1 | 인덱스는 WHERE 조건 + 정렬/페이징 패턴까지 포함한 설계 문제. 쿼리 하나가 아니라 조회 흐름 전체를 봐야 함 |
| insight_2 | EXPLAIN으로 실행계획을 먼저 확인했다면 시도 1, 2를 건너뛸 수 있었음. 인덱스 설계는 추측이 아니라 실행계획 기반 진단이 먼저여야 함 |
| followup_q1 | 복합 인덱스를 사용했을 때 쓰기 비용이 늘어나지는 않나? |
| followup_q2 | 인덱스 컬럼 순서가 (created_at, category)였다면 어떻게 됐을까? |

<!-- 
insight_1 방향: 쿼리 패턴 분석, 조회 흐름 기반 설계
insight_1 예상 꼬리질문: 이 서비스에서 자주 쓰이는 조회 패턴은? / 복합 인덱스 컬럼 순서는 어떻게 정했나? / 다른 조회 패턴이 추가되면 인덱스 어떻게 관리?

insight_2 방향: 진단 능력, MySQL 내부 동작 이해도
insight_2 예상 꼬리질문: EXPLAIN 결과 해석 방법? / type, key, Extra에서 뭘 봤는지? / filesort가 왜 문제? / 실행계획 보고 인덱스 설계하는 프로세스?

followup_a1: 상품 조회가 등록보다 압도적으로 많은 읽기 중심 서비스라 읽기 최적화 우선. 쓰기 빈도가 높아지면 인덱스 개수 조정이나 비동기 처리 고려.
followup_a2: category는 중복도가 높고 created_at은 고유도가 높음. 일반적으로 카디널리티가 높은 컬럼을 앞에 두는 것이 유리하지만, 범위 검색(Range Scan)이 빈번한 created_at을 뒤에 두는 것이 B-Tree 탐색 효율상 더 유리하다고 판단하여 (category, created_at) 순서를 채택.

복합 인덱스 사용 시 쓰기 지연 우려: 조회 성능은 OOO만큼 개선되었으나, 인덱스 정렬 비용으로 인해 쓰기 작업 시 미세한 오버헤드가 발생할 수 있음을 인지함. 하지만 해당 서비스는 조회:쓰기 비율이 9:1이므로 조회 성능 최적화가 더 중요하다고 판단.

인덱스 컬럼 순서 변경 (Created, Category): '카테고리'는 중복도가 높고 '생성일'은 고유도가 높음. 일반적으로 카디널리티가 높은 컬럼을 앞에 두는 것이 유리하지만, 범위 검색(Range Scan)이 빈번한 생성일을 뒤에 두는 것이 B-Tree 탐색 효율상 더 유리하다고 판단하여 (카테고리, Created) 순서를 채택함.

-->


<!--
## 문제 해결 맥락 (면접 대비용)

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

<!-- TODO: 팔로우업 구조화는 모든 트러블 슈팅 끝내고
- 명확한 명사형 (가장 깔끔함)
[Side Effect] 쓰기 성능 저하 가능성 검토: 복합 인덱스 적용 시 데이터 삽입(INSERT), 수정(UPDATE) 시 발생할 수 있는 오버헤드를 고려. (현재 서비스의 읽기/쓰기 비율이 9:1이므로 조회 성능 최적화를 우선하여 트레이드오프 결정)
- 질문형 (탐구하는 자세 강조)
예상되는 Side Effect는 없는가?: 인덱스가 늘어남에 따라 쓰기 지연(Write Latency)이 발생할 수 있음. 이를 감수하고라도 조회 성능을 올려야 하는지 트레이드오프를 다시 한번 고민함.
- 주제어 강조형
Side Effect 및 리스크 관리: 복합 인덱스 생성에 따른 쓰기 성능 저하와 디스크 공간 사용량 증가를 고려.
-->
