# Troubleshooting A: 순차개선형

## SRP 기반 단계적 구조 개선
| key | value |
|---|---|
| title | SRP 기반 단계적 구조 개선 |
| context | View에 상태 관리 로직이 섞여 있고, TimerManager가 데이터 저장·비즈니스 로직·완료 처리를 모두 담당. 정책 변경 시 수정 범위가 넓고 사이드이펙트 파악이 어려움 |
| try_1_title | View → ViewModel 분리 |
| try_1_desc | View의 상태 관리와 로직을 ViewModel로 분리 |
| try_1_result | View 수정 시 로직 영향 제거 |
| try_1_limit | TimerManager가 여전히 God Object |
| try_2_title | CompletionHandler 분리 |
| try_2_desc | 타이머 완료 후처리를 Handler로 분리 |
| try_2_result | 완료 정책 변경 시 Handler만 수정 |
| try_2_limit | TimerManager가 여전히 저장+로직 담당 |
| try_3_title | Repository + Service 분리 |
| try_3_desc | 데이터 저장→Repository, 비즈니스 로직→Service로 분리 |
| try_3_result | SRP 확립, SSOT 자연 확보 |
| try_3_completion | 정책 변경 시 수정 대상 명확, 유지보수성 개선 ✓ |
| result | SRP 기반 계층 분리로 정책 변경 시 수정 대상 명확화 |
| result_desc | SSOT 확립으로 고아 알림 구조적 방지(발생 0건) |
| insight_1 | "유지보수가 어렵다"는 느낌이 들 때가 구조를 나눌 타이밍
불편함을 방치하면 기능 추가마다 부채가 쌓이므로 적절한 타이밍에 해소해야 함을 느낌 |
| followup_q1 | Service가 비대해지면 어떻게 분리하나? |
| followup_q2 | 이 계층 분리가 Spring 환경과 어떻게 연결되나? |

<!--
insight_1 방향: 리팩토링 타이밍 감각
insight_1 예상 꼬리질문: 어떤 신호가 왔을 때 리팩토링을 결심했나? / 출시 일정과 리팩토링 사이에서 어떻게 균형을 잡았나? / 리팩토링을 미루면 어떤 일이 생기나?

| insight_2 | SRP를 지키면 SSOT는 자연스럽게 따라온다. 책임을 나누면 각 계층이 자기 영역의 단일 진실 공급원이 됨 |
insight_2 방향: SRP → SSOT 연결 이해
insight_2 예상 꼬리질문: SSOT가 깨지면 어떤 문제가 생기나? / Spring에서는 이걸 어떻게 보장하나? / @Transactional과의 공통점?

followup_a1: 책임별로 분리. 현재 TimerCompletionHandler가 완료 처리를 분담. 알림도 NotificationService로 분리 가능. Service는 오케스트레이션만 담당하는 Facade 패턴으로 진화.
followup_a2: Spring의 Controller→Service→Repository 계층과 동일한 구조. @Service는 비즈니스 로직 집중, @Transactional은 작업 원자성 보장. 이 Service도 "데이터 수정 + 부수 효과"의 원자성을 보장하는 동일한 역할. Spring 경험이 있었기에 Swift에서도 자연스럽게 계층 분리를 적용할 수 있었음.
-->

<!--
## 경험 맥락 (면접 대비용)

상황 배경:
- SwiftUI 첫 프로젝트로, 초기에는 빠른 프로토타이핑 위주로 개발
- View에 @State로 로직을 넣는 SwiftUI 튜토리얼 방식으로 시작
- TimerManager에 모든 타이머 관련 기능을 집중시킴
- 정책 변경(완료 시 보관→자동삭제)을 겪으면서 수정 범위가 넓어지는 문제 체감
- 블로그 회고 4주차: "유지보수의 어려움을 직접 경험하고 나니 SRP의 의미와 필요성이 확실히 와닿았다"

시도별 선택 이유:
- 시도 1 (View→ViewModel): SwiftUI 튜토리얼 방식으로 View에 @State 로직이 섞여 있었음. MVVM 패턴 적용으로 View를 선언형 UI에 집중시킴
- 시도 2 (CompletionHandler): 완료 정책이 자주 바뀌는데(보관→삭제, 카운트다운 추가 등) TimerManager를 매번 수정해야 해서 완료 처리만 분리
- 시도 3 (Repository+Service): Spring의 Controller→Service→Repository 패턴을 알고 있었기에 자연스럽게 적용. 데이터 저장과 비즈니스 로직의 책임 분리

결과에서 의미 있는 부분:
- 정성적: 정책 변경 시 수정 대상이 명확해짐 (완료 정책→Handler, 데이터 저장→Repository, 생명주기→Service)
- 구조적: 부수 효과(알림 스케줄링/취소)가 Service에 집중되어 고아 알림 구조적 방지
- SSOT: 데이터 수정 경로가 자연스럽게 단일화됨

다시 한다면 다르게 할 점:
- Service가 ~400줄로 커졌는데, 초기부터 책임별로 더 잘게 분리했으면 좋았을 것
- 시도 1, 2를 거치지 않고 처음부터 계층 분리를 했을 수도 있지만, 단계적으로 경험했기에 SRP의 필요성을 더 깊이 체감

인사이트 연결:
- 불편함 감지 → SRP 적용 → 계층 분리 → SSOT 자연 확보
- Spring 경험이 Swift에서의 아키텍처 결정에 직접적으로 영향

참고 블로그:
- 4주차 회고 (SRP 체감, CompletionHandler 분리): https://velog.io/@data_sy/AI를-활용한-타이머-앱-개발기-주간-회고-4
- 5주차 회고 (Repository+Service 분리): https://velog.io/@data_sy/AI를-활용한-타이머-앱-개발기-주간-회고-5

참고 ADR:
- 노션 이슈트래커 ADR-011: https://www.notion.so/ADR-011-TimerManager-24fdbe50bc038038b612d7dc0bd86ab9?v=227dbe50bc03813fbd26000c27b3de22&source=copy_link


TODO: 트러블슈팅 전용 블로그 글 작성 후 포트폴리오 페이지에 링크 연결
-->
