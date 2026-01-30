# Troubleshooting A: 문제해결형

## Fetch Join으로 주문 상세 조회 N+1 문제 해결 — 쿼리 수 95% 감소
| key | value |
|---|---|
| title | Fetch Join으로 주문 상세 조회 N+1 문제 해결 — 쿼리 수 95% 감소 |
| problem | 주문 상세 조회 시 N+1 문제 발생, 쿼리 23회 실행 |
| try_1_title | 즉시 로딩 (FetchType.EAGER) |
| try_1_desc | 연관 엔티티를 즉시 로딩으로 변경 |
| try_1_result | 쿼리 수 23회 그대로 |
| try_1_limit | EAGER는 로딩 시점만 변경, N+1 근본 해결 불가 |
| try_2_title | @BatchSize 설정 |
| try_2_desc | @BatchSize(size=10)으로 IN 절 배치 로딩 |
| try_2_result | 23회 → 4회 (83%↓) |
| try_2_limit | 쿼리 수 감소하나 여전히 복수 쿼리, Batch Size 튜닝 필요 |
| try_3_title | Fetch Join (JPQL) |
| try_3_desc | JOIN FETCH로 연관 데이터 한 번에 조회 |
| try_3_result | 23회 → 1회 (95%↓) ✓ |
| try_3_limit | 1:N 관계 Fetch Join 시 데이터 중복 가능 → DISTINCT 사용 |
| final_result | 쿼리 수 23회 → 1회 (95%↓) |
| insight_1 | N+1은 JPA의 기본 로딩 전략(LAZY)과 프록시 동작을 이해해야 진단 가능. EAGER로 바꾸는 것은 해결이 아니라 로딩 시점만 변경하는 것 |
| insight_2 | Fetch Join은 만능이 아님. 2개 이상의 컬렉션을 동시에 Fetch Join하면 MultipleBagFetchException 발생. 상황에 따라 BatchSize와 조합하는 전략이 필요 |
| followup_q1 | Fetch Join과 일반 Join의 차이는? |
| followup_q2 | 2개 이상 컬렉션을 동시에 조회해야 한다면 어떻게 하나? |

<!--
insight_1 방향: JPA 로딩 전략 이해도, LAZY/EAGER 차이
insight_1 예상 꼬리질문: LAZY 로딩은 언제 실제 쿼리가 발생하나? / 프록시 객체란? / EAGER가 왜 N+1을 해결하지 못하나?

insight_2 방향: Fetch Join의 한계 인식, 복합 전략
insight_2 예상 꼬리질문: MultipleBagFetchException이 왜 발생하나? / List vs Set 차이? / BatchSize와 Fetch Join을 어떻게 조합하나?

followup_a1: 일반 Join은 SELECT 절에 주 엔티티만 반환하고 연관 엔티티는 프록시 상태. Fetch Join은 연관 엔티티도 함께 SELECT하여 영속성 컨텍스트에 로딩. 따라서 Fetch Join만 N+1을 해결.
followup_a2: 가장 데이터가 많은 컬렉션 하나만 Fetch Join, 나머지는 @BatchSize로 처리. 또는 쿼리를 분리하여 각각 Fetch Join 후 애플리케이션에서 조합.
-->


<!--
## 문제 해결 맥락 (면접 대비용)

상황: 주문 상세 조회 API
주문 1건 조회 시 → 주문상품(N건) + 각 상품 정보 + 배송 정보 로딩
기본 LAZY 로딩으로 인해 1(주문) + N(주문상품) + N(상품) + 1(배송) = 약 23회 쿼리

시도 1: FetchType.EAGER
- 왜? 가장 직관적인 방법 — 즉시 로딩하면 한 번에 가져오지 않을까?
- 한계: EAGER는 "언제" 로딩할지만 변경. 여전히 개별 SELECT 실행

시도 2: @BatchSize(size=10)
- 왜? IN 절로 묶어서 쿼리 수를 줄이자
- 한계: 23회 → 4회로 줄었지만, 근본적으로 여러 번 쿼리 실행

시도 3: Fetch Join
- 왜? 한 번의 JOIN 쿼리로 연관 데이터 모두 조회
- 핵심: SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.product JOIN FETCH o.delivery

인사이트 연결:
N+1 문제를 처음 겪었을 때 "EAGER로 바꾸면 되지 않나?"라고 생각했지만,
실제로는 로딩 시점만 바뀔 뿐 쿼리 수는 동일.
JPA의 프록시 동작과 로딩 전략을 이해한 후에야 Fetch Join이 왜 근본 해결인지 납득.
-->
