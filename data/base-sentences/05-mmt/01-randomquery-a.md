# Troubleshooting A: 문제해결형

## 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선
| key | value |
|---|---|
| title | 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선 |
| problem | 맞춤 문항 API에서 ORDER BY RAND()로 랜덤 문항 추출 시 전체 테이블 정렬 발생. 응답시간 232ms |
| try_1_title | LIMIT 축소 |
| try_1_desc | ORDER BY RAND() LIMIT 수를 줄여 반환량 감소 |
| try_1_result | 미미한 개선 |
| try_1_limit | RAND()가 전체 행에 난수를 부여한 뒤 정렬하므로 LIMIT과 무관하게 Full Table Scan 발생 |
| try_2_title | WHERE 조건 강화 |
| try_2_desc | 조건절로 대상 행을 줄인 뒤 ORDER BY RAND() 적용 |
| try_2_result | 232ms → 150ms (35%↓) |
| try_2_limit | 대상 행이 줄어도 RAND() 정렬 비용은 행 수에 비례하여 여전히 비효율 |
| try_3_title | 인라인 뷰 최적화 |
| try_3_desc | 서브쿼리(인라인 뷰)에서 PK만 랜덤 선택 후, 메인 쿼리에서 해당 PK로 조회. RAND() 정렬 대상을 PK(인덱스)로 한정 |
| try_3_result | 232ms → 50ms (78%↓) ✓ |
| try_3_limit | 조회 패턴 커버 |
| final_result | 232ms → 50ms (78%↓) |
| insight_1 | ORDER BY RAND()의 문제는 "전체 행에 난수 부여 + 정렬". 핵심은 정렬 대상을 줄이는 것이며, 인라인 뷰로 PK만 대상으로 하면 테이블 접근 없이 인덱스만으로 처리 가능 |
| insight_2 | EXPLAIN으로 실행계획을 확인하니 filesort + 임시 테이블 사용이 보였음. "느리다"는 체감이 아니라 실행계획 기반 진단이 최적화의 시작점 |
| followup_q1 | 인라인 뷰 방식 외에 랜덤 조회를 최적화하는 다른 방법은? |
| followup_q2 | ORDER BY RAND()가 항상 나쁜 선택인가? |

<!--
insight_1 방향: ORDER BY RAND() 내부 동작 이해, 인라인 뷰 최적화 원리
insight_1 예상 꼬리질문: 인라인 뷰가 왜 빠른지 실행계획으로 설명? / PK만 정렬하면 왜 빠른가? / 커버링 인덱스와의 관계는?

insight_2 방향: EXPLAIN 기반 진단 능력
insight_2 예상 꼬리질문: EXPLAIN에서 어떤 항목을 확인했나? / filesort와 임시 테이블이 왜 문제인가? / type이 ALL이면 어떤 의미인가?

followup_a1: (1) 애플리케이션에서 랜덤 PK 생성 후 WHERE id >= :randomId LIMIT N. (2) 테이블의 MIN/MAX PK 범위에서 랜덤 값 생성. (3) 별도 랜덤 풀 테이블 사전 생성. 각각 데이터 분포 편향, 삭제된 PK 처리 등 트레이드오프 존재.
followup_a2: 데이터가 수백~수천 건이면 ORDER BY RAND()도 허용 가능. 문제는 수만 건 이상에서 발생. 데이터 규모와 조회 빈도에 따라 판단해야 하며, 무조건 피하기보다 실행계획으로 확인 후 결정.
-->


<!--
## 문제 해결 맥락 (면접 대비용)

상황: 맞춤 문항 추출 API
SELECT * FROM questions WHERE topic_id = ? ORDER BY RAND() LIMIT 10;
→ 조건에 맞는 전체 행에 RAND() 적용 후 정렬

시도 1: LIMIT 축소
- 왜? 반환량을 줄이면 빨라지지 않을까?
- 한계: RAND()는 LIMIT 전에 전체 행에 적용 → LIMIT 무관

시도 2: WHERE 조건 강화
- 왜? 대상 행을 줄이면 RAND() 정렬 대상도 줄어듦
- 한계: 줄어들긴 했으나 여전히 행 데이터 전체를 정렬

시도 3: 인라인 뷰 최적화
- 왜? RAND() 정렬 대상을 PK(인덱스)로 한정
- 핵심:
  SELECT q.* FROM questions q
  JOIN (SELECT id FROM questions WHERE topic_id = ? ORDER BY RAND() LIMIT 10) sub
  ON q.id = sub.id;
→ 서브쿼리에서 PK만 랜덤 선택 (인덱스 스캔)
→ 메인 쿼리에서 PK 조인으로 나머지 데이터 조회

인사이트 연결:
"ORDER BY RAND()가 느리다"는 알았지만, "왜 느린지"를 EXPLAIN으로 확인한 뒤에야
"정렬 대상을 줄이자"라는 해결 방향이 나왔음.
-->
