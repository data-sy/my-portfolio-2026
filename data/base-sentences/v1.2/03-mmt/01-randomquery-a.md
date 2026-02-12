# Troubleshooting A: 문제해결형

## 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선
| key | value |
|---|---|
| title | 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선 |
| context | 맞춤 문항 추출 API에서 `ORDER BY RAND()` 사용 시 p95 기준 232ms 소요 |
| try_1_title | 애플리케이션 레벨 랜덤 선택 |
| try_1_desc | DB에서 전체 조회 후 Java에서 랜덤 선택 |
| try_1_result | 232ms → 333ms (오히려 악화) |
| try_1_limit | 전체 행 전송 비용이 RAND()보다 더 큼 |
| try_2_title | ID만 조회 후 Java 랜덤 선택 |
| try_2_desc | 조회한 ID를 Java 랜덤 선택하여 재조회 |
| try_2_result | 232ms → 152ms (34%↓) |
| try_2_limit | DB I/O 2회. 불필요한 네트워크 비용 |
| try_3_title | 인라인 뷰로 DB 내에서 최적화 |
| try_3_desc | 시도 2의 ID 선별 로직을 서브쿼리(인라인 뷰)로 이동하여 단일 쿼리로 처리 |
| try_3_result | 232ms → 49ms (78%↓) |
| try_3_completion | 단일 쿼리로 처리, PK만 정렬하여 인덱스 스캔  ✓ |
| result | p95 기준 232ms → 49ms (78%↓) |
| result_desc | 인라인 뷰로 PK만 랜덤 선택 후 조인 |
| insight_1 | 직관에 의존해 시행착오를 거쳤으나, EXPLAIN으로 병목을 먼저 진단했다면 즉시 해결할 수도 있었음. 이후 프로젝트에서 EXPLAIN 진단을 먼저 수행하는 접근으로 개선 |
| followup_q1 | EXPLAIN을 사용했다면 어떤 병목을 발견했을까? |
| followup_q2 | ORDER BY RAND()가 항상 나쁜 선택인가? |

<!--
insight_1: 직관에 의존해 시행착오를 거쳤으나, EXPLAIN으로 병목을 먼저 진단했다면 즉시 해결할 수도 있었음. 이후 프로젝트에서 EXPLAIN 진단을 먼저 수행하는 접근으로 개선

insight_1 의도: 실패를 통한 학습과 다음 프로젝트로의 성장 연결
insight_1 예상 꼬리질문: 
- EXPLAIN을 썼다면 구체적으로 뭘 봤을 것 같나? 
- filesort가 왜 문제인가? 
- 이 교훈을 이후 프로젝트에서 어떻게 적용했나? (→ HT 연결)

followup_q1: EXPLAIN을 사용했다면 어떤 병목을 발견했을까?
followup_a1: filesort + Using temporary를 확인했을 것. ORDER BY RAND()는 전체 행에 난수를 부여한 후 정렬하기 때문에 임시 테이블 생성 및 정렬 비용이 발생. 인라인 뷰로 PK만 대상으로 하면 정렬 대상이 줄어들고, 인덱스만으로 처리 가능하다는 점을 즉시 파악할 수 있었음.

followup_q2: ORDER BY RAND()가 항상 나쁜 선택인가?
followup_a2: 데이터가 수백~수천 건이면 ORDER BY RAND()도 허용 가능. 문제는 수만 건 이상에서 발생. 데이터 규모와 조회 빈도에 따라 판단해야 하며, 무조건 피하기보다 상황에 따라 결정.
-->

<!--
## 문제 해결 맥락 (면접 대비용)

상황: 맞춤 문항 추출 API (500명 부하 테스트)
SELECT * FROM questions WHERE topic_id = ? ORDER BY RAND() LIMIT 1;
→ 조건에 맞는 전체 행에 RAND() 적용 후 정렬

사고 흐름 (각 시도가 다음 시도의 근거):

시도 1: 애플리케이션 레벨 랜덤
- 생각: "DB에서 RAND()가 느리니까 Java로 옮기면 되지 않을까?"
- 결과: 오히려 악화 (333ms). 전체 행 데이터 전송 비용이 더 큼
- 배운 것: 문제를 단순히 다른 레이어로 옮기는 건 해결이 아님

시도 2: ID만 조회 후 Java 랜덤
- 생각: "전체 데이터 전송이 문제라면, ID만 가져오면?"
- 결과: 152ms (34%↓). ID만 전송하니 확실히 빨라짐
- 배운 것: "ID만 먼저 뽑으면 빠르다"는 사실 확인

시도 3: 인라인 뷰 최적화
- 생각: "ID만 먼저 뽑는 게 빠르다면, 이걸 DB 안에서 하면?"
- 핵심:
  SELECT q.* FROM questions q
  JOIN (SELECT id FROM questions WHERE topic_id = ? ORDER BY RAND() LIMIT 1) sub
  ON q.id = sub.id;
→ 서브쿼리에서 PK만 랜덤 선택 (인덱스 스캔)
→ 메인 쿼리에서 PK 조인으로 나머지 데이터 조회
→ DB 왕복도 1회로 줄어듦

인사이트 연결:
시도 1에서 3까지 모두 직관으로 진행. 결과적으로 해결했지만,
EXPLAIN으로 실행계획을 먼저 봤다면 filesort + 임시 테이블이라는 병목을 바로 파악하고
"정렬 대상 자체를 줄여야 한다"는 방향을 더 빨리 잡을 수 있었음.
→ 이 교훈을 HT 프로젝트에서 적용: EXPLAIN 진단을 먼저 수행하여 시행착오 없이 해결

## MMT ↔ HT 성장 스토리 연결

| | MMT (01-randomquery) | HT (인덱스 최적화) |
|---|---|---|
| 접근 | 직관 → 시행착오 3단계 | EXPLAIN 진단 → 바로 해결 |
| 시도 수 | 3단계 (직감 기반) | 2단계 (진단 + 적용) |
| EXPLAIN 사용 | 사용하지 않음 | 사전 진단 + 사후 검증 |
| 인사이트 | "EXPLAIN을 먼저 해야 했다" | "EXPLAIN을 먼저 했더니 시행착오 없이 해결" |
| 면접 포인트 | 실패에서 교훈 도출 | 교훈을 실제로 적용하여 성장 증명 |
-->
