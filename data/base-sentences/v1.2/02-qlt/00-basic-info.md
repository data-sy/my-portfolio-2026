# Quick Label Timer

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: 앱 스크린샷 (iPhone 목업)
candidate_image_2: 앱스토어 페이지 캡처
candidate_image_3: 빠른 라벨 설정 UX 플로우 다이어그램
candidate_image_4: 계층 아키텍처 다이어그램
-->

<!-- 공통: info -->
| key | value |
|---|---|
| name | Quick Label Timer |
| intro | 라벨 설정에 필요한 탭 수를 최소화한 iOS 타이머 앱 (앱스토어 출시) |
| period | 2025.07 ~ 08 (2개월) |
| role | 1인 개발 (기획/설계/개발/디자인/출시) |
| stack | Swift, SwiftUI |
| github | https://github.com/data-sy/quick-label-timer |
| appstore | https://apps.apple.com/kr/app/%ED%80%B5%EB%9D%BC%EB%B2%A8%ED%83%80%EC%9D%B4%EB%A8%B8/id6752611917 |

<!-- 포폴 커버용: 배경 -->
| background | 기존 타이머 앱들이 라벨 설정에 많은 탭을 요구한다는 문제를 해결하기 위해, 타이머 생성부터 라벨 설정까지의 탭 수를 최소화한 타이머 앱을 설계하고 iOS 앱스토어에 출시했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 백그라운드 알람 |
| achievement_1_metric | 100% |
| achievement_1_detail | Suspended 상태 해결 |
| achievement_2_title | ADR 문서화 |
| achievement_2_metric | 17건 |
| achievement_2_detail | 의사결정 기록 |
<!-- 다운로드/리뷰수 성공하면 추가하기-->
| achievement_3_title | 다운로드 |
| achievement_3_metric | 500+ |
| achievement_3_detail | 앱스토어 |
| achievement_3_title | 사용자 평가 |
| achievement_3_metric | 4.5★ |
| achievement_3_detail | 평점 (20건 이상) |
<!--
============================================================
다운로드/리뷰 사용 최소 기준
============================================================
[출시 후 목표 지표 (측정 예정)]
목표 (최소): 다운로드 100+, 리뷰 5+, 평점 4.0+, 업데이트 3회+
목표 (권장): 다운로드 500+, 리뷰 10+, 평점 4.5+, 업데이트 5회+
achievement_3 (다운로드/리뷰) 사용 기준:
[다운로드 수 기준]
- 500+ 다운로드: 카드 사용 가능 (최소 기준)
- 1,000+ 다운로드: 강력한 성과로 강조 가능
- 500 미만: 카드에서 제외하고 2개 카드만 사용 권장
[리뷰/별점 기준]
- 4.5+ 별점 & 20+ 리뷰: 카드 사용 가능 (최소 기준)
- 4.7+ 별점 & 50+ 리뷰: 강력한 성과로 강조 가능
- 20건 미만 리뷰: 표본이 적어 신뢰도 낮음, 카드 제외 권장
[카드 개수 결정]
- 다운로드 500+ 또는 리뷰 20+/4.5+ 달성: 3개 카드 사용
- 두 기준 모두 미달: 2개 카드만 사용 (achievement_1, 2만)
[참고사항]
- iOS 개인 앱의 일반적 리뷰 전환율: 다운로드의 1~3%
- 예: 1,000 다운로드 → 약 10~30개 리뷰
- 타이머 앱은 경쟁 카테고리로 마케팅 없이는 성장 어려움
============================================================
-->

<!-- 포폴 커버용: 한 일 -->
| task_1 | iOS Suspended 상태 알람 미동작 →  UNUserNotification 기반 연속 로컬 알림으로 전환하여 신뢰성 100% 확보 |
| task_2 | 완료 정책(자동저장→자동삭제) 변경 시 Service 수정 필요 → CompletionHandler/Service로 분리하여 단일 책임 확보 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 백엔드에서 학습한 계층 아키텍처와 SRP 원칙을 iOS 프로젝트에 적용하며 설계 원칙이 플랫폼 독립적임을 경험함 |
| insight_2 | 기술 선택 트레이드오프를 반복 경험하며 기술 결정이 비즈니스 맥락까지 고려하는 과정임을 이해함 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | iOS Suspended 상태에서 AVAudioPlayer 알람 미동작 발생<br>UNUserNotification 기반 연속 로컬 알림으로 전환하여 알람 신뢰성 100% 확보 |
| resume_item_2 | Manager가 완료 정책·타이머 제어·데이터 저장을 모두 처리하여 완료 정책 변경 시 side effect 발생<br>CompletionHandler(완료 정책)-Service(타이머 재생/정지)-Repository(CRUD)로 책임 분리 (SRP)<br>수정 영향 범위를 단일 계층으로 한정 |
| resume_item_3 |  Swift 첫 학습 2개월 만에 TestFlight 베타 테스트 거쳐 앱스토어 정식 출시 완료
Java와의 언어 철학 차이(Optional/Protocol 기반 설계) 빠르게 습득  |
| resume_item_4 | 17건의 ADR 작성으로 기술 선택 근거와 트레이드오프 체계적 문서화<br>1인 개발에서 미래의 나에게 전달하는 컨텍스트로 활용 |

<!-- 향후 개선 계획 -->
| improvement_plan_1 | iOS 26 Alarm Kit 도입으로 시스템 레벨 알림 통합 검토 중 |
| improvement_plan_2 | Widget Extension 추가로 홈 화면 접근성 향상 계획 |
| improvement_plan_3 | Analytics 기반 사용자 행동 패턴 분석 및 UX 개선 진행 중 |
