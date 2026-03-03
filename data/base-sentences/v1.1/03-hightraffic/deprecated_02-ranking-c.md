# Troubleshooting C: 시나리오형

## Redis Sorted Set으로 실시간 랭킹 조회 98% 개선
| key | value |
|---|---|
| title | Redis Sorted Set으로 실시간 랭킹 조회 98% 개선 |
| scenario | "실시간 판매량 TOP 100을 매번 조회한다면?" |
| question_1 | 매 요청마다 COUNT + ORDER BY 정렬하면 부하는? |
| question_2 | 캐싱하면 해결될까? 랭킹 갱신은 어떻게? |
| question_3 | 랭킹에 최적화된 자료구조가 있을까? |
| question_4 | null |
| question_5 | null |
| try_1_title | DB 인덱스 추가 |
| try_1_desc | sales_count 인덱스로 정렬 최적화 |
| try_1_result | 25%↓ (150ms) |
| try_1_limit | 한계: 매 요청 정렬 비용 |
| try_2_title | Redis String 캐싱 |
| try_2_desc | 캐시 미스 시 DB 조회 |
| try_2_result | 90%↓ (20ms) |
| try_2_limit | 한계: 갱신 시 전체 재계산, race condition |
| try_3_title | Redis Sorted Set |
| try_3_desc | 정렬 상태 자동 유지 |
| try_3_result | 98%↓ (5ms) ✓ |
| try_3_limit | null |
| final_result | 200ms → 5ms (98%↓) |
| insight_1 | 단순 캐싱도 효과적이지만, 자료구조 선택이 성능과 구현 복잡도 모두에 영향을 미침. "어떻게 저장할까"보다 "어떻게 갱신하고 조회할까" 패턴을 먼저 분석해야 함 |
| insight_2 | Redis String은 "결과 캐싱", Sorted Set은 "구조 캐싱". 갱신 빈도가 높은 랭킹은 결과가 아닌 구조를 캐싱해야 race condition 없이 실시간성을 유지할 수 있음 |
| followup_q1 | Sorted Set의 메모리 사용량이 커지면 어떻게 관리하나? |
| followup_q2 | 랭킹 데이터와 DB 원본 데이터의 정합성은 어떻게 보장하나? |

<!--
insight_1 방향: 자료구조 선택 기준, 갱신/조회 패턴 분석
insight_1 예상 꼬리질문: Sorted Set 외 다른 자료구조는 검토했나? / 어떤 기준으로 자료구조를 선택했나? / 캐싱 전략은 어떻게 달라지나?

insight_2 방향: "결과 캐싱 vs 구조 캐싱" 관점 차이
insight_2 예상 꼬리질문: race condition이 구체적으로 어떻게 발생하나? / String 캐싱에서 갱신 시 어떤 문제가 있었나? / Sorted Set은 왜 race condition이 없나?

followup_a1: Sorted Set은 member 수에 비례하여 메모리 사용. TOP 100만 필요하므로 ZREMRANGEBYRANK로 하위 데이터 주기적 정리. 또는 TTL 설정으로 전체 키 만료 후 재구축.
followup_a2: 판매 발생 시 DB 업데이트와 동시에 ZINCRBY로 Redis 갱신. 장애 시 DB 기준 배치로 Redis 재구축하는 복구 전략 마련.
-->


<!--
## 시나리오 분석 맥락 (면접 대비용)

시나리오 설정 이유:
- 100만 회원 규모에서 실시간 랭킹은 높은 동시 조회가 발생하는 대표적 기능
- 매 요청마다 COUNT + ORDER BY는 O(N log N) 정렬 비용

질문 흐름:
- Q1 "매번 정렬하면?": DB 부하의 본질 파악 → 정렬 자체가 병목
- Q2 "캐싱하면?": 단순 캐싱의 한계 인식 → 갱신 문제
- Q3 "최적 자료구조?": 문제를 자료구조 레벨에서 해결

시도별 선택 이유:
- 시도 1 (인덱스): 가장 단순한 DB 레벨 최적화 → 매 요청 정렬 비용 근본 해결 불가
- 시도 2 (String 캐싱): 읽기는 빠르지만 갱신 시 전체 재계산 → 쓰기 시 비효율
- 시도 3 (Sorted Set): 삽입/갱신 시 O(log N) 자동 정렬 → 읽기/쓰기 모두 효율적

핵심 쿼리:
SELECT product_id, COUNT(*) as sales_count
FROM orders GROUP BY product_id ORDER BY sales_count DESC LIMIT 100;
→ ZREVRANGE ranking:products 0 99 WITHSCORES

인사이트 연결:
String 캐싱은 "결과를 저장"하는 것이고, Sorted Set은 "정렬이라는 연산 자체를 저장"하는 것.
갱신이 빈번한 데이터는 결과가 아니라 구조를 캐싱해야 함.
-->
