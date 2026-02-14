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
| github | https://github.com/data-sy/high-traffic-performance-tuning |

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
| task_2 | 랭킹 조회 반복 집계 → Redis Sorted Set 캐싱으로 98% 개선 |
| task_3 | 100만 회원, 300만 주문 대용량 환경 구축 |
| task_4 | K6 시나리오 기반 부하테스트로 개선 전후 성능 검증 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 성능 최적화는 추측이 아니라 측정. 실행계획 분석과 모니터링으로 병목을 진단하고, 트레이드오프를 판단하며 개선 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 10만 건 상품 테이블의 카테고리별 최신순 조회 시 Full Table Scan 병목 발생<br>복합 인덱스 설계로 정렬 비용을 제거. 응답시간 2.5s → 180ms (93%↓) |
| resume_item_2 | 1만 명 회원의 (or 5천 개 상품의) 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생<br>Redis Sorted Set으로 정렬 연산을 쓰기 시점으로 분산하여 DB 정렬 부하 제거. 응답시간 200ms → 5ms (98%↓) |
| resume_item_3 | 100만 회원·300만 주문 환경 구축. EXPLAIN으로 10개 핵심 쿼리의 실행계획 분석<br>K6로 주요 API 15개를 동시 사용자 100명 기준 부하 테스트하여 병목 지점 정량 검증 |
| resume_item_draft | (점검 아직 안 함) 주문 상세 조회 시 N+1 문제 발생, Fetch Join으로 연관 데이터 한 번에 조회. 쿼리 수 23회 → 1회 (95%↓) |
| resume_item_draft | (점검 아직 안 함) 선착순 쿠폰 발급 시 동시성 이슈 발생, Redis 분산락 + Lua Script로 정합성 확보. 동시 1000명 요청 시 100명 정확 발급 |


<!-- 면접용: 이력서 예상 질문 -->
| id | question | answer_core | answer_rationale | follow_up_question | follow_up_strategy |
|---|---|---|---|---|---|
| item1_Q1 | 복합 인덱스를 어떤 컬럼 순서로 설계했나요? | (category_id, created_at DESC) 순서 | WHERE 조건 먼저, ORDER BY 나중 원칙 | 역순으로 설계하면 안 되나요? | WHERE 필터링 효율 떨어짐. 카디널리티 높은 컬럼 우선 |
| item1_Q2 | 인덱스 추가 후 INSERT 성능 영향은? | 쓰기 10회/일 vs 읽기 1000회/일 비교 | 읽기 위주 워크로드에서 인덱스 오버헤드 미미 | 쓰기가 많아지면? | 파티셔닝 or 읽기 복제본 분리 검토 |
| item1_Q3 | 93% 개선했는데 나머지 7%는? | 네트워크 레이턴시 + 애플리케이션 처리 | DB 쿼리만 개선, E2E에는 다른 요소 포함 | 나머지도 개선 가능한가요? | Connection Pool, DTO 최적화 가능하나 우선순위 낮음 |
| item2_Q1 | 쓰기 시점 분산이 구체적으로 무슨 뜻인가요? | Read 부하를 Write로 이동 | 랭킹 조회마다 정렬 vs 점수 변경 시 정렬. Read >> Write이므로 효율적 | Write가 많아지면 어떻게 하죠? | Write 빈도 모니터링 + 필요시 캐시 무효화 전략 변경 |
| item2_Q2 | DB 정렬 부하만 제거한 건가요? COUNT는요? | COUNT도 ZCARD O(1)로 제거 | ORDER BY는 정렬 유지, COUNT는 ZCARD로 Full Scan 제거. 둘 다 개선 | ZCARD는 언제 업데이트되나요? | ZADD/ZREM 시 자동 갱신. Redis 내부적으로 O(1) 유지 |
| item2_Q3 | Redis 장애 시 어떻게 대응하나요? | DB Fallback + Circuit Breaker | Redis 장애 시 200ms로 복귀하지만 서비스 유지. Circuit Breaker로 빠른 실패 처리 | Redis HA는 어떻게 구성하셨나요? | Redis Sentinel 고려 or Cluster 샤딩 (1만→100만 확장 시) |
| item3_Q1 | 왜 동시 사용자 100명으로 설정했나요? | 실제 MMT 피크 타임 30명의 3배 여유 | 실무에서는 예상 트래픽의 2~3배로 테스트. 여유 있는 환경에서 병목 미리 검증 | 실제 동시 접속자는 얼마인가요? | "평소 10~20명, 피크 타임 30명 정도인데, 향후 확장 대비해서 100명 기준으로 테스트했습니다" |
| item3_Q2 | EXPLAIN으로 뭘 확인했나요? | type, key, rows로 인덱스 활용 여부 | type이 ALL이면 Full Scan, key가 NULL이면 인덱스 미사용. 개선 전후 비교에 활용 | 인덱스 안 타는 쿼리 발견하면 어떻게 했나요? | "복합 인덱스 설계하거나 쿼리 조건 순서 조정. item1의 상품 조회가 대표 사례입니다" |
| item3_Q3 | K6로 어떤 시나리오 테스트했나요? | 상품 조회·랭킹·주문 API 동시 호출 | 실제 사용자 행동 패턴 시뮬레이션. 응답시간 P95, TPS로 병목 API 특정 | 병목 발견 후 어떻게 개선했나요? | "Redis 캐싱(item2) 또는 인덱스 추가(item1). 개선 후 재측정으로 효과 정량 검증했습니다" |
