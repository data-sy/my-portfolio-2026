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

<!-- 포폴: info -->
| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 상품 10만·주문 5만 건 규모의 이커머스 환경에서 **성능 병목을 개선**한 프로젝트 |
| period | 2026.02 ~ 03 (1개월) |
| role | 1인 개발 |
| stack | Java 17, **Spring Boot 3**, Spring Data **JPA**, **MySQL 8**, **Redis**, K6 |
| github | https://github.com/data-sy/high-traffic-performance-tuning |

 <!--이력서: info-->
| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 상품 10만·주문 5만 건 규모의 이커머스 환경에서 성능 병목을 개선한 프로젝트 |
| period | 2026.02 ~ 03 (1개월) |
| role | 1인 개발 |
| stack | Java 17, **Spring Boot 3**, Spring Data **JPA**, **MySQL 8**, **Redis**, K6 |
| github | https://github.com/data-sy/high-traffic-performance-tuning |

<!-- 포폴 커버용: 배경 -->
| background | 실무에서 발생 가능한 성능 병목을 미리 경험하고 해결 역량을 검증하기 위해, 상품 10만·주문 5만 건 규모의 이커머스 환경을 설계했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 상품 조회 |
| achievement_1_metric | 51% ↓ |
| achievement_1_detail | 70.6ms → 34.3ms |
| achievement_2_title | 랭킹 조회 |
| achievement_2_metric | 99% ↓ |
| achievement_2_detail | 2,813ms → 17ms |

<!-- 포폴 커버용: 한 일 -->
| task_1 | **복합 인덱스 설계**로 상품 조회 최적화, **70.6ms→34.3ms(51%↓))** |
| task_2 | **Redis Sorted Set**으로 랭킹 조회 최적화, **2.8s→17ms(99.4%↓)** |
| task_3 | 상품 10만·주문 5만 (주문상품 15만) 건 규모 테스트 환경 구축 |
| task_4 | 동시 접속 100명 (k6, VU 100) 기준 부하 테스트 수행|

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 성능 최적화는 추측이 아닌 측정임을 체득. 실행계획 분석과 모니터링으로 병목을 진단하고 **트레이드오프를 판단**해 개선함 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 |  10만 건 상품 테이블의 카테고리별 최신순 조회 시 Full Table Scan 병목 발생 **복합 인덱스 설계**로 정렬 비용을 제거. 응답시간 **70.6ms → 34.3ms (51%↓)** |
| resume_item_2 | 주문상품 15만 건 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생 **Redis Sorted Set**으로 집계·정렬을 쓰기 시점의 증분 갱신으로 전환하여 DB 부하 제거 응답시간 **2,813ms → 17ms (99.4%↓)** |
| resume_item_3 | 상품 10만·주문 5만(주문상품 15만) 건 규모의 테스트 환경을 구축하고, **EXPLAIN**으로 핵심 쿼리의 실행계획을 분석하여 **병목 원인을 특정** |
| resume_item_4 | **K6(VU 100)**로 주요 API의 응답시간을 실측하여 각 최적화 전략의 효과를 **정량 검증** |
| resume_item_draft | 주문 상세 조회 시 N+1 문제 발생, Fetch Join으로 연관 데이터 한 번에 조회. 쿼리 수 23회 → 1회 (95%↓) |
| resume_item_draft | 선착순 쿠폰 발급 시 동시성 이슈 발생, Redis 분산락 + Lua Script로 정합성 확보. 동시 1000명 요청 시 100명 정확 발급 |
