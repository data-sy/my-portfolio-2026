# Troubleshooting E: 일반형

## Case: Service 계층을 통한 SSOT 구현
| key | value |
|---|---|
| title | Service 계층을 통한 SSOT 구현 — 데이터 수정 경로 단일화 |
| situation | 타이머 상태 변경(시작/일시정지/재개/삭제) 시 알림 스케줄링/취소 등 부수 효과가 반드시 동반되어야 함. ViewModel에서 직접 수정하면 부수 효과 누락 위험 |
| action_1 | TimerService를 모든 타이머 조작의 단일 경로로 설계 |
| action_2 | ViewModel은 Service 함수만 호출, 직접 데이터 수정 금지 (timerService.pauseTimer(id:) ✓, timer.status = .paused ✗) |
| action_3 | 모든 부수 효과(알림 스케줄링/취소, 완료 처리)를 Service 내부에 집중 |
| action_4 | removeTimer()가 항상 cancelNotifications() → repository.removeTimer() 순서 보장 |
| action_5 | Protocol 기반 설계로 테스트 시 Mock 주입 가능 |
| result | 상태 변경 로직 한 곳에 집중되어 버그 추적 용이. 고아 알림(삭제된 타이머의 알림이 남는 현상) 구조적으로 방지 |
| insight_1 | SSOT의 핵심은 "데이터 수정 경로를 하나로 제한"하는 것. Service가 그 단일 경로 역할 |
| insight_2 | Spring의 @Service와 동일한 역할을 수동 DI 환경에서 구현. 프레임워크 없이도 아키텍처 원칙 적용 가능 |
| followup_q1 | Service가 비대해지면 어떻게 분리하나요? |
| followup_q2 | 이 패턴이 Spring 환경과 어떻게 연결되나요? |

<!-- 
insight_1 방향: SSOT 원칙의 본질 이해
insight_1 예상 꼬리질문: SSOT가 깨지면 어떤 문제가 생기나요? / 다른 프로젝트에서도 적용한 사례?

insight_2 방향: 프레임워크 독립적 설계 능력
insight_2 예상 꼬리질문: Spring에서는 이 문제를 어떻게 해결하나요? / @Transactional과의 공통점?

followup_a1: 책임별로 분리. 현재 TimerCompletionHandler가 완료 처리를 분담. 알림도 NotificationService로 분리 가능. Service는 오케스트레이션만 담당하는 Facade 패턴으로 진화.
followup_a2: @Service는 비즈니스 로직 집중, @Transactional은 작업 원자성 보장. 이 Service도 "데이터 수정 + 부수 효과"의 원자성을 보장하는 동일한 역할.
-->

<!--
## 경험 맥락 (면접 대비용)

상황 배경:
- 왜 이 일을 하게 됐나? 타이머 삭제 시 알림 취소를 빼먹어서 고아 알림 버그 발생
- 당시 제약/조건은? iOS 알림 64개 제한, 최대 6개 타이머 동시 실행

액션 선택 이유:
- 액션 1: 데이터 수정 + 부수 효과가 항상 함께 실행되어야 하므로 단일 경로 필요
- 액션 2: ViewModel에서 직접 수정하면 각자 부수 효과를 챙겨야 해서 누락 위험
- 액션 3: Service에 집중하면 한 곳만 확인하면 됨
- 액션 4: 순서 보장으로 고아 알림 구조적 방지
- 액션 5: 테스트 가능성 확보

결과에서 의미 있는 부분:
- 정량적 성과: 고아 알림 버그 0건
- 정성적 성과: 버그 발생 시 Service만 확인하면 되어 디버깅 시간 단축

다시 한다면 다르게 할 점:
- Service가 ~400줄로 커졌는데, 초기부터 책임별로 더 잘게 분리했으면 좋았을 것

인사이트 연결:
- SSOT 원칙 → Service 단일 경로 → 부수 효과 누락 방지 → 안정적 운영
-->
