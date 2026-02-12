# Troubleshooting D: 트레이드오프형

## Neo4j → MySQL 마이그레이션 — DBMS 선택의 트레이드오프
| key | value |
|---|---|
| title | Neo4j → MySQL 마이그레이션 — DBMS 선택의 트레이드오프 |
| context | 선수지식 그래프 DB를 Neo4j로 구현했으나, 실제 사용 패턴이 그래프 DB의 강점(다방향 탐색, 최단 경로)을 활용하지 못함. 인프라 복잡도 대비 이점 부족 |
| target_a | Neo4j 유지 |
| target_b | MySQL 마이그레이션 ✓ |
| criteria_1 | 쿼리 패턴 적합성 |
| cri_1_a | 단방향만 사용 |
| cri_1_b | 재귀 CTE 동일 구현 ✅ |
| criteria_2 | 인프라 |
| cri_2_a | 이중 관리 부담 |
| cri_2_b | 단일 통합 ✅ |
| criteria_3 | 동기화 |
| cri_3_a | 양쪽 동기화 필요 |
| cri_3_b | 동기화 문제 제거 ✅ |
| criteria_4 | 확장성 |
| cri_4_a | 그래프 쿼리 가능 ✅ |
| cri_4_b | 특화 쿼리 포기 |
| criteria_5 | 마이그레이션 |
| cri_5_a | 없음 ✅ |
| cri_5_b | 재구현 필요 |
| result | MySQL 마이그레이션 선택 |
| result_desc | 인프라 관리 포인트 50% 감소 ← 더 구체적인 지표 만들기 |
| insight_1 | "그래프 데이터니까 그래프 DB"가 아니라, 실제 쿼리 패턴과 운영 비용을 종합적으로 판단해야 함. 기술 선택은 일회성이 아니라 도메인 적합성에 따라 재평가가 필요함을 경험 |
| followup_q1 | 팀 개발이었다면 같은 선택을 했을까? |
| followup_q2 | MySQL로 마이그레이션했을 때 성능이 느려지지는 않았나? |

<!--
insight_1: "그래프 데이터니까 그래프 DB"가 아니라, 실제 쿼리 패턴과 운영 비용을 종합적으로 판단해야 함. 기술 선택은 일회성이 아니라 도메인 적합성에 따라 재평가가 필요함을 경험

insight_1 의도: 기술 선택의 재평가, 도메인 적합성 판단
insight_1 예상 꼬리질문:
- 처음에 Neo4j를 선택한 이유는?
- 부적합 판단의 구체적 기준은?
- 도메인 분석을 먼저 했으면 달라졌을까?

followup_q1: 팀 개발이었다면 같은 선택을 했을까?
followup_a1: 팀에 인프라 전담 인력이 있고 Neo4j 운영 부담이 분산된다면 유지했을 수도 있음. 하지만 여전히 "실제 쿼리 패턴이 Neo4j의 강점을 활용하지 못한다"는 핵심 문제는 남아있음. 소셜 네트워크, 추천 시스템, 부정탐지 등 다방향 + 가변 깊이 탐색이 핵심인 도메인이면 Neo4j 유지가 합리적. 이 프로젝트는 "특정 단원 → 선수 단원" 단방향 트리 탐색이라 RDBMS로 충분.

followup_q2: MySQL로 마이그레이션했을 때 성능이 느려지지는 않았나?
followup_a2: 단방향 트리 탐색(깊이 5~7) 기준 Neo4j Cypher와 MySQL 재귀 CTE 모두 수십 ms 내로 유사한 성능. 이 프로젝트의 데이터 규모(수천 노드)에서는 체감 차이 없음. Neo4j의 인덱스 프리 인접성(Index-Free Adjacency)은 수백만 노드 + 다방향 탐색에서 이점이 드러나는 특성.
-->

<!--
데이터 동기화 맥락:
- Neo4j: 개념(단원) 노드 + 선수지식 관계
- MySQL: 개념(단원) 테이블 + 문항 테이블 (어떤 개념과 연관된 문제인지)
- 개념 테이블이 양쪽에 존재하여, 개념 추가/수정 시 양쪽 동기화 필요
- 마이그레이션하면 MySQL 단일 소스로 동기화 문제 자체가 사라짐

criteria 우선순위 (스토리 흐름):
c01 쿼리 패턴 적합성 → 마이그레이션의 핵심 근거 (단방향만 사용)
c02 인프라            → 이중 관리 부담 제거
c03 동기화            → 개념 테이블 양쪽 동기화 문제 해결
c04 확장성            → Neo4j 장점 포기 (약점 인정)
c05 마이그레이션      → 재구현 비용 존재하지만 장기적 이득

꼬리질문 대비:
Q: 재귀 CTE에서 순환 참조는 어떻게 방지했나?
A: 데이터 입력 시 자기 자신을 선수지식으로 참조하는 케이스를 애플리케이션 레벨에서 검증 + CTE에 최대 깊이 10 제한 설정. 실제 교육과정 구조상 깊이 7을 넘지 않으므로 안전 마진 확보.

Q: 구체적으로 CTE는 어떻게 구현했나?
A: WITH RECURSIVE로 가변 깊이 트리 탐색. Self Join은 깊이가 고정되고, 애플리케이션 레벨 반복은 깊이만큼 DB 왕복 발생. 재귀 CTE는 단일 쿼리로 전체 하위 선수지식 조회 가능.

  WITH RECURSIVE prereq_tree AS (
    SELECT id, name, parent_id, 1 as depth
    FROM topics WHERE id = ?
    UNION ALL
    SELECT t.id, t.name, t.parent_id, pt.depth + 1
    FROM topics t
    JOIN prereq_tree pt ON t.parent_id = pt.id
    WHERE pt.depth < 10
  )
  SELECT * FROM prereq_tree;
-->
