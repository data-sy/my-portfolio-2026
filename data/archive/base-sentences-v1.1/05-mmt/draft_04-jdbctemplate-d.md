# Troubleshooting D: 트레이드오프형

## JdbcTemplate 패러다임 불일치 — JPA 마이그레이션 계획 (v2)
| key | value |
|---|---|
| title | JdbcTemplate 패러다임 불일치 — JPA 마이그레이션 계획 (v2) |
| situation | JdbcTemplate 사용 중 DB 중심 사고와 Java 객체지향 사고의 패러다임 불일치 경험. RowMapper 반복 작성, 연관 객체 수동 매핑, 쿼리와 도메인 로직 혼재 |
| option_1_name | JdbcTemplate 유지 |
| option_1_pros | 이미 구현 완료, SQL 직접 제어 가능, 학습 비용 없음 |
| option_1_cons | RowMapper 보일러플레이트 반복, 연관 객체 수동 매핑, 도메인 모델과 DB 스키마 강결합 |
| option_2_name | JPA 전면 전환 |
| option_2_pros | 객체 중심 설계, 연관관계 자동 매핑, 보일러플레이트 제거, 도메인 모델과 DB 분리 |
| option_2_cons | 마이그레이션 작업량, JPA 학습 곡선, N+1 등 새로운 성능 이슈 가능 |
| option_3_name | 하이브리드 (JPA + 복잡한 쿼리는 JdbcTemplate) |
| option_3_pros | 점진적 마이그레이션 가능, 복잡한 쿼리는 SQL 직접 작성 |
| option_3_cons | 두 방식 혼용으로 코드 일관성 저하, 트랜잭션 관리 주의 필요 |
| final_choice | v2에서 JPA 마이그레이션 계획 |
| reasoning | v1에서 JdbcTemplate의 패러다임 불일치를 체감한 후, v2 리팩토링에서 JPA 전환 결정. 객체 중심 설계로 도메인 로직과 DB 접근 분리. 복잡한 통계 쿼리는 JdbcTemplate 병행 |
| insight_1 | JdbcTemplate은 "SQL을 Java로 실행"하는 것이고, JPA는 "객체를 DB에 저장"하는 것. 접근 방식의 출발점이 다르며, 도메인 복잡도가 높을수록 객체 중심 접근의 이점이 커짐 |
| insight_2 | 개선점을 인식하고 다음 버전에 반영하는 것도 엔지니어링. v1에서 "이게 최선일까?"를 의심하고, v2에서 구체적 개선 계획을 세우는 것이 성장의 증거 |
| followup_q1 | JPA로 전환하면 기존 성능 최적화 쿼리는 어떻게 되나? |
| followup_q2 | JdbcTemplate을 처음부터 쓰지 않았다면 어떻게 했을까? |

<!--
insight_1 방향: 패러다임 차이 인식, 도구 선택 기준
insight_1 예상 꼬리질문: "패러다임 불일치"를 구체적으로 어떤 상황에서 느꼈나? / RowMapper의 문제가 구체적으로 뭔가? / MyBatis는 고려하지 않았나?

insight_2 방향: 자기 개선 인식, 버전 간 성장
insight_2 예상 꼬리질문: v1에서 JdbcTemplate을 선택한 이유는? / v2 마이그레이션의 구체적 계획은? / 마이그레이션 우선순위는 어떻게 정했나?

followup_a1: JPQL/QueryDSL로 대부분 전환 가능. 복잡한 집계/통계 쿼리는 네이티브 쿼리 또는 JdbcTemplate 병행. JPA의 @Query 네이티브 쿼리 옵션으로 기존 SQL 유지도 가능.
followup_a2: 프로젝트 시작 시점에 JPA 학습이 부족하여 JdbcTemplate을 선택. 당시로서는 합리적인 판단이었으며, JdbcTemplate으로 SQL 기본기를 다진 뒤 JPA의 추상화를 더 깊이 이해할 수 있었음. 돌이키면 JdbcTemplate 경험이 JPA 학습의 기반이 됨.
-->


<!--
## 트레이드오프 맥락 (면접 대비용)

상황에서 핵심 제약 조건:
- 제약 1: v1에서 JdbcTemplate으로 전체 구현 완료
- 제약 2: 도메인 복잡도 — 문항, 단원, 선수지식 등 연관관계 다수
- 제약 3: v2 리팩토링 계획 수립 중

각 선택지를 고려한 이유:
- JdbcTemplate 유지: 변경 비용 0 → but 개발 생산성 저하 지속
- JPA 전면 전환: 근본 해결 → but 마이그레이션 비용
- 하이브리드: 점진적 전환 → but 코드 일관성 저하

최종 선택의 결정적 근거:
- v1에서 체감한 패러다임 불일치가 개발 속도를 저하시킴
- v2는 리팩토링 목적이므로 기술 부채 해소 적기
- JPA 학습이 완료된 상태이므로 전환 비용 감소

만약 상황이 달랐다면:
- 단순 CRUD 중심 → JdbcTemplate도 충분
- 팀 프로젝트에서 팀원이 JPA 미숙 → 하이브리드로 점진적 전환
- 복잡한 통계/분석 위주 → JdbcTemplate 또는 MyBatis가 더 적합
-->
