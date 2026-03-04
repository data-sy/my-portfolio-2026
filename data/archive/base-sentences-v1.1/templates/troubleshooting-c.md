# Troubleshooting C: 시나리오형

## Template
시나리오 → 질문들 → 시도 과정 → 최종 결과 → 인사이트

## Case: Redis Sorted Set 랭킹
| key | value |
|---|---|
| title | Redis Sorted Set으로 실시간 랭킹 조회 98% 개선 |
| scenario | "실시간 판매량 TOP 100을 매번 조회한다면?" |
| question_1 | 매 요청마다 전체 테이블 정렬하면 부하가 얼마나 될까? |
| question_2 | 캐싱하면 해결될까? 갱신은 어떻게? |
| question_3 | 랭킹에 최적화된 자료구조가 있을까? |
| question_4 | null |
| question_5 | null |
| try_1_title | DB 인덱스 추가 |
| try_1_desc | 인덱스로 정렬 최적화 |
| try_1_result | 25%↓ (150ms) |
| try_1_limit | 매 요청 정렬 비용 |
| try_2_title | Redis String 캐싱 |
| try_2_desc | 캐시 미스 시 DB 조회 |
| try_2_result | 90%↓ (20ms) |
| try_2_limit | 갱신 시 전체 재계산, race condition |
| try_3_title | Redis Sorted Set |
| try_3_desc | 정렬 상태 자동 유지 |
| try_3_result | 98%↓ (5ms) |
| try_3_limit | null |
| final_result | 200ms → 5ms (98%↓) |
| insight_1 | 단순 캐싱도 효과적이지만, 자료구조 선택이 성능과 구현 복잡도 모두에 영향을 미침. "어떻게 저장할까"보다 "어떻게 갱신하고 조회할까" 패턴을 먼저 분석해야 함 |
| insight_2 | |
| followup_q1 | |
| followup_q2 | |

<!-- 
insight_1 방향: 
insight_1 예상 꼬리질문: 

insight_2 방향: 
insight_2 예상 꼬리질문: 

followup_a1: 
followup_a2: 
-->

<!--
## 시나리오 분석 맥락 (면접 대비용)

시나리오 설정 이유:
- 왜 이 상황을 가정했나?
- 실제 서비스에서 이 시나리오가 발생할 가능성은?

질문 흐름:
- Q1에서 Q2로 넘어간 이유:
- Q2에서 Q3으로 넘어간 이유:

시도별 선택 이유:
- 시도 1: 왜 먼저?
- 시도 2: 왜 다음으로?
- 시도 3: 왜 최종?

인사이트 연결:

-->