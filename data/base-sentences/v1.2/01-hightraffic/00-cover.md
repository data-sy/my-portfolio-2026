# High-Traffic Performance Tuning Project

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 100만 회원 규모 트래픽 환경에서 성능 병목을 개선한 프로젝트 |
| period | 2026.02 (2주) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Data JPA, MySQL 8, Redis, K6 |
| task_1 | JMeter를 사용해 부하 테스트 수행 |
| task_2 | Prometheus + Grafana로 성능 모니터링 |
| task_3 | EXPLAIN 분석으로 쿼리 병목 진단 |
| task_4 | null |
| task_5 | null |
| result_1 | 상품 목록 조회 시 Full Table Scan 발생, 복합 인덱스 설계로 정렬 비용 제거. 응답시간 2.5s → 180ms (93%↓) |
| result_2 | 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생, Redis Sorted Set으로 정렬 상태 자동 유지. 200ms → 5ms (98%↓) |
| result_3 | 주문 상세 조회 시 N+1 문제 발생, Fetch Join으로 연관 데이터 한 번에 조회. 쿼리 수 23회 → 1회 (95%↓) |
| result_4 | 선착순 쿠폰 발급 시 동시성 이슈 발생, Redis 분산락 + Lua Script로 정합성 확보. 동시 1000명 요청 시 100명 정확 발급 |
| result_5 | 대용량 페이징 조회 시 OFFSET 성능 저하, No Offset 방식으로 페이지 위치 무관하게 일정 속도 유지. 응답시간 ?ms → ?ms (?%↓) |
| result_6 | 통계 조회 시 GROUP BY 부하 발생, 배치 선집계로 실시간 부하 제거. 응답시간 ?ms → ?ms (?%↓) |
| insight_1 | 성능 최적화는 측정 → 병목 진단 → 트레이드오프 판단의 반복 |
| insight_2 | 무조건 빠르게가 아니라 "무엇을 포기할 수 있는가"를 고민해야 함 |

<!--
트러블슈팅 유형 정리
- result_1: A형 (문제 → 시도 → 결과) / 목록 조회 → 복합 인덱스
- result_2: C형 (시나리오) / 랭킹 → Redis Sorted Set
- result_3: A형 (문제 → 시도 → 결과) / 상세 조회 → N+1 / Fetch Join
- result_4: C형 (시나리오) 또는 D형 (트레이드오프) / 선착순 → 동시성 / 분산락
- result_5: A형 (문제 → 시도 → 결과) / 페이징 → No Offset [예정]
- result_6: D형 (트레이드오프) / 통계 → 배치 선집계 [예정]
-->
