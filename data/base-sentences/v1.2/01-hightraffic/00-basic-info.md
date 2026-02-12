# High-Traffic Performance Tuning Project

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: Before/After 성능 비교 막대 그래프 (2,500ms→180ms vs 200ms→5ms)
candidate_image_2: 병목 해결 프로세스 다이어그램 (Full Scan → 복합 인덱스 / COUNT+ORDER BY → Redis Sorted Set)
candidate_image_3: K6 부하테스트 결과 차트 (응답시간 분포 개선 전후)
candidate_image_4: 성능 개선 프로세스 다이어그램
-->

<!-- 공통: info -->
| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 100만 회원 규모 트래픽 환경에서 성능 병목을 개선한 프로젝트 |
| period | 2026.02 (2주) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Data JPA, MySQL 8, Redis, K6 |
| github | https://github.com/data-sy/high-traffic-performance-tuning

<!-- 포폴 커버용: 배경 -->
| background | 실무에서 발생 가능한 성능 병목을 미리 경험하고 해결 역량을 검증하기 위해, 100만 회원 규모의 이커머스 환경을 설계했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 상품 조회 |
| achievement_1_metric | 93% ↓ |
| achievement_1_detail | 2.5s → 180ms |
| achievement_2_title | 랭킹 조회 |
| achievement_2_metric | 98% ↓ |
| achievement_2_detail | 200ms → 5ms |

<!-- 포폴 커버용: 한 일 -->
| task_1 | Full Table Scan 병목 → 복합 인덱스 설계로 조회 93% 개선 |
| task_2 | N+1 랭킹 조회 → Redis Sorted Set 캐싱으로 98% 개선 |
| task_3 | EXPLAIN 분석으로 쿼리 실행계획 진단 및 병목 지점 식별 |
| task_4 | Redis 기반 캐싱 전략 설계 및 데이터 정합성 관리 |
| task_5 | 100만 회원, 300만 주문 대용량 환경 구축 |
| task_6 | K6 시나리오 기반 부하테스트로 개선 전후 성능 검증 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 성능 최적화는 추측이 아니라 측정. 실행계획 분석과 모니터링으로 병목을 진단하고, 트레이드오프를 판단하며 개선 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 상품 목록 조회 시 Full Table Scan 발생, 복합 인덱스 설계로 정렬 비용 제거. 응답시간 2.5s → 180ms (93%↓) |
| resume_item_2 | 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생, Redis Sorted Set으로 정렬 상태 자동 유지. 200ms → 5ms (98%↓) |
| resume_item_3 | 실무 규모 성능 병목 검증을 위해 100만 회원, 300만 주문 환경을 구축하고, EXPLAIN과 K6로 병목 진단 및 개선 효과를 정량화 |
| resume_item_draft | 주문 상세 조회 시 N+1 문제 발생, Fetch Join으로 연관 데이터 한 번에 조회. 쿼리 수 23회 → 1회 (95%↓) |
| resume_item_draft | 선착순 쿠폰 발급 시 동시성 이슈 발생, Redis 분산락 + Lua Script로 정합성 확보. 동시 1000명 요청 시 100명 정확 발급 |
