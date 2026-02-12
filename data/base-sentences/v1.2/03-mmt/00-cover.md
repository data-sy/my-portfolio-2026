# My Math Teacher

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2024.01 ~ 2024.07 (v1), 2026 리팩토링 예정 (v2) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Security 6, JdbcTemplate (JPA 부분 적용), MySQL, Neo4j, Redis, Docker, GitHub Actions, Vue 3, TensorFlow |
| task_1 | 프로젝트 기획, DB 설계 ([ERD](링크)), RESTful API 설계 ([API 문서](링크)) |
| task_2 | Spring Security + JWT 인증/인가, OAuth2 소셜 로그인 구현 |
| task_3 | Vue 3 + PrimeVue 기반 프론트엔드 개발, Cytoscape.js로 선수지식 그래프 시각화 |
| task_4 | TensorFlow Serving으로 AUC 0.83 AI 모델 서빙, 지식 상태 예측 API 구축 |
| task_5 | Docker + GitHub Actions 기반 CI/CD 파이프라인 구축 |
| task_6 | K6 부하 테스트 및 쿼리 튜닝 |
| result_1 | 맞춤 문항 API에서 ORDER BY RAND() 병목, 인라인 뷰 최적화로 랜덤 선택 비용 제거. 응답시간 232ms → 50ms (78%↓) |
| result_2 | 수작업 배포로 휴먼에러 발생, GitHub Actions + Docker Compose로 배포 자동화. 25분 → 7분 (72%↓) |
| result_3 | Neo4j 도메인 부적합 판단 → 트레이드오프 분석 후 MySQL 마이그레이션. 재귀 CTE로 동일 성능 유지, 인프라 단순화 |
| insight_1 | 기술 선택은 일회성이 아니라 도메인 적합성에 따라 재평가가 필요함을 경험 |
| insight_2 | [개선점] JdbcTemplate의 DB-Java 패러다임 불일치 경험 → v2에서 JPA 마이그레이션 계획 |
| insight_3 | [개선점] DKT의 수치 기반 출력 한계 → v2에서 LLM 자연어 피드백 검토 |
