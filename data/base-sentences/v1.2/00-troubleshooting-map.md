# result <-> troubleshooting type mapping

| 프로젝트 | 항목 | 내용 | 유형 |
| --- | --- | --- | --- |
| **High-Traffic** | result_1 | 목록 조회 → 복합 인덱스 | A |
|  | result_2 | 랭킹 → Redis Sorted Set | C |
|  | result_3 | 상세 조회 → N+1 / Fetch Join | A |
|  | result_4 | 선착순 → 동시성 / 분산락 | C |
|  | result_4 | 선착순 → 동시성 / 분산락 | D |
|  | result_5 | 페이징 → No Offset | A |
|  | result_6 | 통계 → 배치 선집계 | D |
| **QLT** | result_2 | 사용자 피드백 → UX 개선 (AS-IS/TO-BE) | B |
|  | result_3 | ADR 기록 | E |
|  | insight_1 | Java vs Swift 언어 철학 비교 | B |
|  | insight_2 | 웹 백엔드 vs 모바일 앱 관점 비교 | B |
| **MMT** | result_1 | ORDER BY RAND() → 인라인 뷰 | A |
|  | result_2 | 수작업 배포 → CI/CD 자동화 | E |
|  | result_3 | Neo4j → MySQL 마이그레이션 (트레이드오프 분석) | D |
|  | result_3 | Neo4j → MySQL 마이그레이션 (재귀 CTE 구현) | A |
|  | insight_2 | [개선점] JdbcTemplate 패러다임 불일치 → JPA 마이그레이션 계획 | D |
|  | insight_3 | [개선점] DKT → LLM 전환 검토 (트레이드오프 분석) | D |
| **Skeleton** | result_1 | 좌표 측정 제각각 → 공통 모듈 (AS-IS/TO-BE) | B |
|  | result_2 | 최우수상 (12팀 중 2등) | E |
| **Plogging** | result_1 | 거리 계산 정확도 개선 (트레이드오프 분석) | D |
|  | result_1 | 거리 계산 정확도 개선 (구면 기하학 적용) | A |
