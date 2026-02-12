# Quick Label Timer

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: 앱 스크린샷 (iPhone 목업)
candidate_image_2: 앱스토어 페이지 캡처
candidate_image_3: 빠른 라벨 설정 UX 플로우 다이어그램
candidate_image_4: SSOT 기반 Service 계층 아키텍처 다이어그램
candidate_image_5: DDD 도메인 모델 구조 (TimerData/Preset 분리)
-->

<!-- 공통: info -->
| key | value |
|---|---|
| name | Quick Label Timer |
| intro | 타이머 생성과 라벨 설정의 탭 수를 최소화한 iOS 타이머 앱 (앱스토어 출시) |
| period | 2025.07 ~ 08 (2개월) |
| role | 1인 개발 (기획/설계/개발/디자인/출시) |
| stack | Swift, SwiftUI |
| appstore | https://apps.apple.com/kr/app/%ED%80%B5%EB%9D%BC%EB%B2%A8%ED%83%80%EC%9D%B4%EB%A8%B8/id6752611917 |
| github | https://github.com/data-sy/quick-label-timer |

<!-- 포폴 커버용: 배경 -->
| background | 기존 타이머 앱들이 라벨 설정에 많은 탭을 요구한다는 문제를 해결하기 위해, 타이머 생성부터 라벨 설정까지의 탭 수를 최소화한 타이머 앱을 설계하고 iOS 앱스토어에 출시했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 학습-출시 |
| achievement_1_metric | 2개월 |
| achievement_1_detail | Swift 첫 학습 → 출시 |
| achievement_2_title | 고아 알림 버그 |
| achievement_2_metric | 0건 |
| achievement_2_detail | SSOT 설계로 방지 |
| achievement_3_title | 의사결정 기록 |
| achievement_3_metric | 17건 |
| achievement_3_detail | ADR 문서화 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | DDD 기반 도메인 모델 설계 (TimerData/Preset 분리로 책임 명확화) |
| task_2 | SSOT 기반 Service 계층 설계로 데이터 수정 경로 단일화 및 고아 알림 버그 구조적 방지 |
| task_3 | Figma로 앱 아이콘 및 App Store 스크린샷 5종 디자인 제작 |
| task_4 | 17건의 ADR 작성으로 기술 선택 및 설계 의사결정 맥락 체계적 기록 |
| task_5 | TestFlight 베타 테스트 거쳐 App Store 정식 출시 완료 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | Java와 Swift의 언어 철학 차이(Optional, Protocol 중심 설계 등)를 경험하며 새로운 기술 스택에 빠르게 적응할 수 있음을 검증 |
| insight_2 | SSOT 원칙을 통해 버그를 사후 수정이 아닌 구조 설계 단계에서 예방할 수 있음을 체감 |
| insight_3 | 1인 개발에서 ADR 문서화가 미래의 나에게 전달하는 컨텍스트로 작동함을 경험 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 타이머와 알림의 생명주기 불일치로 고아 알림 발생 가능, SSOT 원칙으로 알림 생성/삭제 경로 단일화. 구조적 버그 방지 (발생 0건) |
| resume_item_2 | Swift/SwiftUI 첫 학습 프로젝트로 2개월 만에 앱스토어 정식 출시 완료, 기술 학습 및 적응 능력 검증 |
| resume_item_3 | DDD 원칙 기반 도메인 모델 설계(TimerData/Preset 분리)로 도메인 로직과 UI 관심사 명확히 분리 |
| resume_item_4 | 17건의 ADR(Architecture Decision Record) 작성으로 기술 선택 근거와 트레이드오프 체계적 문서화 |

<!-- 향후 개선 계획 -->
| improvement_plan_1 | iOS 26 Alarm Kit 도입으로 시스템 레벨 알림 통합 검토 중 |
| improvement_plan_2 | Widget Extension 추가로 홈 화면 접근성 향상 계획 |
| improvement_plan_3 | Analytics 기반 사용자 행동 패턴 분석 및 UX 개선 진행 중 |

<!-- 출시 후 목표 지표 (측정 예정) -->
<!--
목표 (최소): 다운로드 100+, 리뷰 5+, 평점 4.0+, 업데이트 3회+
목표 (권장): 다운로드 500+, 리뷰 10+, 평점 4.5+, 업데이트 5회+
-->
