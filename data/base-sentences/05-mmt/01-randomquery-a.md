# Troubleshooting A: 문제해결형

## 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선
| key | value |
|---|---|
| title | 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선 |
| problem | 맞춤 문항 API에서 ORDER BY RAND()로 랜덤 문항 추출 시 전체 테이블 정렬 발생. 응답시간 232ms |
| try_1_title | LIMIT 축소 |
| try_1_desc | ORDER BY RAND() LIMIT 수를 줄여 반환량 감소 |
| try_1_result | 미미한 개선 |
| try_1_limit | RAND()가 전체 행에 난수를 부여한 뒤 정렬하므로 LIMIT을 줄여도 처리량은 동일 |
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
| insight_2 | 시도 1, 2에서 직관에 의존해 LIMIT과 WHERE 조건만 조정했으나, 근본 원인은 RAND()의 전체 행 정렬이었음. EXPLAIN으로 실행계획을 먼저 확인했다면 filesort + 임시 테이블 사용을 바로 파악하고 불필요한 시행착오를 줄일 수 있었음 |
| followup_q1 | 인라인 뷰 방식 외에 랜덤 조회를 최적화하는 다른 방법은? |
| followup_q2 | ORDER BY RAND()가 항상 나쁜 선택인가? |

<!--
insight_1 방향: ORDER BY RAND() 내부 동작 이해, 인라인 뷰 최적화 원리
insight_1 예상 꼬리질문: 인라인 뷰가 왜 빠른지 설명? / PK만 정렬하면 왜 빠른가? / 커버링 인덱스와의 관계는?

insight_2 방향: 직관 vs 진단, 성장 포인트 (→ HT에서 EXPLAIN 먼저 사용하는 것으로 연결)
insight_2 예상 꼬리질문: EXPLAIN을 썼다면 구체적으로 뭘 봤을 것 같나? / filesort가 왜 문제인가? / 이 교훈을 이후 프로젝트에서 어떻게 적용했나? (→ HT 연결)

followup_a1: (1) 애플리케이션에서 랜덤 PK 생성 후 WHERE id >= :randomId LIMIT N. (2) 테이블의 MIN/MAX PK 범위에서 랜덤 값 생성. (3) 별도 랜덤 풀 테이블 사전 생성. 각각 데이터 분포 편향, 삭제된 PK 처리 등 트레이드오프 존재.
followup_a2: 데이터가 수백~수천 건이면 ORDER BY RAND()도 허용 가능. 문제는 수만 건 이상에서 발생. 데이터 규모와 조회 빈도에 따라 판단해야 하며, 무조건 피하기보다 상황에 따라 결정.
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
시도 1, 2는 "결과를 줄이자"는 직관적 접근이었으나 근본 원인(RAND()의 전체 행 정렬)을 짚지 못함.
EXPLAIN으로 실행계획을 먼저 확인했다면 filesort + 임시 테이블을 바로 파악하고,
"정렬 대상 자체를 줄이자"라는 방향으로 더 빨리 도달할 수 있었음.
→ 이 교훈을 HT 프로젝트에서 적용: EXPLAIN 진단을 먼저 수행하여 시행착오 없이 해결
-->
