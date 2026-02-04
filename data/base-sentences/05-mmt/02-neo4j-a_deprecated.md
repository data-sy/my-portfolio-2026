# Troubleshooting A: 문제해결형

## Neo4j → MySQL 마이그레이션 — 재귀 CTE로 그래프 탐색 구현
| key | value |
|---|---|
| title | Neo4j → MySQL 마이그레이션 — 재귀 CTE로 그래프 탐색 구현 |
| problem | Neo4j에서 MySQL로 마이그레이션 결정 후, 선수지식 그래프 탐색 쿼리(Cypher)를 SQL로 재구현해야 하는 상황 |
| try_1_title | Self Join (고정 깊이) |
| try_1_desc | parent_id 기반 Self Join으로 계층 조회. JOIN 횟수 = 탐색 깊이 |
| try_1_result | 깊이 3까지 조회 가능 |
| try_1_limit | 탐색 깊이가 고정됨. 깊이가 달라지면 쿼리 수정 필요, 가변 깊이 탐색 불가 |
| try_2_title | 애플리케이션 레벨 반복 조회 |
| try_2_desc | 부모 노드 조회 → 자식 노드 조회 → 반복. 애플리케이션에서 루프로 구현 |
| try_2_result | 가변 깊이 탐색 가능 |
| try_2_limit | 깊이만큼 DB 왕복 발생 (N번 쿼리). 깊이가 깊어지면 성능 저하 |
| try_3_title | 재귀 CTE (WITH RECURSIVE) |
| try_3_desc | MySQL 8.0 WITH RECURSIVE로 가변 깊이 트리 탐색. 단일 쿼리로 전체 하위 선수지식 조회 |
| try_3_result | 단일 쿼리로 가변 깊이 탐색 ✓ |
| try_3_limit | Neo4j Cypher 대비 문법 복잡도 증가, 순환 참조 시 무한루프 방지 필요 |
| final_result | Neo4j Cypher와 동일한 탐색 결과를 MySQL 재귀 CTE 단일 쿼리로 구현. 인프라 단순화 달성 |
| insight_1 | "그래프 데이터 = 그래프 DB"가 아님. 실제 쿼리 패턴이 단방향 트리 탐색이면 RDBMS 재귀 CTE로 충분. 도구가 아니라 문제의 구조를 먼저 파악해야 함 |
| insight_2 | 재귀 CTE는 "종료 조건"이 핵심. 순환 참조 방지를 위해 방문 노드 추적(visited 배열)이나 최대 깊이 제한을 반드시 설정해야 함 |
| followup_q1 | 재귀 CTE의 성능은 Neo4j Cypher와 비교해 어떠했나? |
| followup_q2 | 순환 참조가 실제로 발생한 적이 있나? |

<!--
insight_1 방향: 도구 vs 문제 구조, 기술 선택 기준
insight_1 예상 꼬리질문: Cypher 쿼리를 CTE로 변환하는 과정은? / 성능 비교는 했나? / CTE가 불가능한 그래프 쿼리는?

insight_2 방향: 재귀 CTE 실전 사용 시 주의점
insight_2 예상 꼬리질문: 최대 깊이 제한은 어떻게 설정했나? / MySQL의 CTE 재귀 깊이 기본값은? / 성능 최적화는 어떻게 했나?

followup_a1: 단방향 트리 탐색(깊이 5~7) 기준 Neo4j와 MySQL CTE 모두 수십 ms 내로 유사한 성능. Neo4j는 인덱스 프리 인접성(index-free adjacency)으로 탐색 자체는 빠르지만, 이 프로젝트의 데이터 규모(수천 노드)에서는 체감 차이 없음.
followup_a2: 데이터 입력 시 자기 자신을 선수지식으로 참조하는 케이스를 방지하기 위해 애플리케이션 레벨 검증 + CTE에 최대 깊이 10 제한 설정. 실제 교육과정 구조상 깊이 7을 넘지 않으므로 안전 마진 확보.
-->


<!--
## 문제 해결 맥락 (면접 대비용)

상황: 선수지식 그래프 탐색
Neo4j Cypher:
MATCH (start)-[:PREREQUISITE*]->(prereq)
WHERE start.id = ?
RETURN prereq;
→ MySQL로 동일 기능 구현 필요

시도 1: Self Join
- 왜? 가장 기본적인 계층 조회 방법
- 한계: JOIN 횟수가 곧 탐색 깊이 → 깊이 변동 시 쿼리 수정 필요
  SELECT c.* FROM topics t
  JOIN topics c1 ON t.id = c1.parent_id
  JOIN topics c2 ON c1.id = c2.parent_id -- 깊이 2
  JOIN topics c3 ON c2.id = c3.parent_id -- 깊이 3

시도 2: 애플리케이션 반복 조회
- 왜? 깊이를 코드로 제어 가능
- 한계: 깊이마다 DB 왕복 → N번 쿼리

시도 3: 재귀 CTE
- 왜? 단일 쿼리로 가변 깊이 탐색
- 핵심:
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

인사이트 연결:
Neo4j의 Cypher가 직관적이긴 하지만,
이 프로젝트에서 실제로 쓰는 쿼리는 "하위 선수지식 전체 조회" 하나.
CTE로 충분히 대체 가능했고, 인프라 단순화의 이점이 더 컸음.
-->
