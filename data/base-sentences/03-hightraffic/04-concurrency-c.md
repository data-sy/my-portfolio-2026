# Troubleshooting C: 시나리오형

## Redis 분산락으로 선착순 쿠폰 동시성 제어
| key | value |
|---|---|
| title | Redis 분산락으로 선착순 쿠폰 동시성 제어 |
| scenario | "선착순 100명 쿠폰 발급, 동시 1000명이 요청하면?" |
| question_1 | 동시 요청 시 100장 초과 발급이 가능한가? |
| question_2 | DB 락으로 해결할 수 있을까? 분산 환경에서는? |
| question_3 | 원자적으로 "잔여 수량 확인 + 차감"을 처리할 수 있는 방법은? |
| question_4 | null |
| question_5 | null |
| try_1_title | synchronized (JVM 락) |
| try_1_desc | Java synchronized 키워드로 메서드 동기화 |
| try_1_result | 단일 서버에서 정합성 확보 |
| try_1_limit | 다중 서버(Scale-out) 환경에서 무효 |
| try_2_title | DB 비관적 락 (SELECT FOR UPDATE) |
| try_2_desc | 쿠폰 수량 Row에 비관적 락 적용 |
| try_2_result | 분산 환경에서 정합성 확보 |
| try_2_limit | DB 커넥션 점유 시간 증가, 동시 1000명 시 커넥션 풀 고갈 위험 |
| try_3_title | Redis 분산락 + Lua Script |
| try_3_desc | Redis SETNX로 분산락 획득, Lua Script로 수량 확인+차감 원자적 처리 |
| try_3_result | 동시 1000명 요청 시 100명 정확 발급 ✓ |
| try_3_limit | null |
| final_result | 동시 1000명 요청 시 100명 정확 발급 |
| insight_1 | 동시성 문제는 "어디서 락을 잡을 것인가"가 핵심. JVM → DB → Redis 순으로 락의 범위가 확장되며, 분산 환경에서는 애플리케이션 외부에 락을 두어야 함 |
| insight_2 | Lua Script는 Redis 서버에서 원자적으로 실행되므로 "확인 → 판단 → 실행"을 하나의 연산으로 묶을 수 있음. 분산 환경에서 race condition을 제거하는 핵심 |
| followup_q1 | 분산락 획득 실패 시 재시도 전략은? |
| followup_q2 | Redisson과 직접 구현(SETNX)의 차이는? |

<!--
insight_1 방향: 락 범위 확장 관점, 분산 환경 이해
insight_1 예상 꼬리질문: synchronized가 왜 분산 환경에서 안 되나? / DB 락의 구체적 문제점은? / Redis 락은 어떻게 분산 환경을 지원하나?

insight_2 방향: Lua Script 원자성, race condition 제거
insight_2 예상 꼬리질문: Lua Script 없이 분산락만 쓰면 안 되나? / Lua Script의 원자성은 어떻게 보장되나? / 스크립트가 길어지면 Redis 블로킹 문제는?

followup_a1: 스핀락 방식으로 일정 간격 재시도하되 최대 시도 횟수 제한. 타임아웃 설정으로 데드락 방지. Redisson의 경우 pub/sub 기반 대기로 busy waiting 방지.
followup_a2: 직접 구현(SETNX + EXPIRE)은 락 해제 시 본인 확인 없이 삭제 가능한 위험. Redisson은 워치독(자동 연장), 재진입 락, pub/sub 기반 대기 등 프로덕션 레벨 기능 제공.
-->


<!--
## 시나리오 분석 맥락 (면접 대비용)

시나리오 설정 이유:
- 선착순 이벤트는 짧은 시간에 대량 동시 요청이 집중되는 대표적 케이스
- "수량 확인 → 발급" 사이 race condition이 핵심 문제

질문 흐름:
- Q1 "초과 발급 가능?": 동시성 문제의 본질 파악
- Q2 "DB 락으로?": 전통적 해결책의 한계 인식
- Q3 "원자적 처리?": 근본 해결 방향 도출

시도별 선택 이유:
- 시도 1 (synchronized): 가장 단순 → 단일 JVM에서만 유효
- 시도 2 (DB 비관적 락): 분산 환경 지원 → 커넥션 점유 문제
- 시도 3 (Redis 분산락 + Lua): DB 부하 없이 원자적 처리 → 커넥션 풀 영향 없음

핵심 Lua Script:
local remaining = tonumber(redis.call('GET', KEYS[1]))
if remaining > 0 then
    redis.call('DECR', KEYS[1])
    return 1
end
return 0

인사이트 연결:
synchronized → DB 락 → Redis 락으로 진행하며 "락의 범위"가 확장되는 과정을 경험.
동시성 문제의 해결은 결국 "어디서 원자성을 보장할 것인가"로 귀결됨.
-->
