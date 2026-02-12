# Form Check Gym Project

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: 실시간 자세 분석 화면 (관절 좌표 오버레이)
candidate_image_2: 각도 계산 다이어그램 (직교좌표계 → 구면좌표계 변환)
candidate_image_3: 공통 모듈 아키텍처 다이어그램 (Before/After)
candidate_image_4: 운동별 자세 교정 로직 플로우차트
candidate_image_5: 최종 발표회 시연 장면
-->

<!-- 공통: info -->
| key | value |
|---|---|
| name | Form Check Gym Project|
| intro | 실시간 영상 분석 기반 운동 자세 교정 시스템 |
| period | 2021.10 ~ 11 (4주) |
| role | 백엔드 개발, 발표 (5인 팀) |
| stack | Python 3.8, Flask, OpenCV, MediaPipe |
| github | https://github.com/data-sy/ai-gym |

<!-- 포폴 커버용: 배경 -->
| background | 운동 자세를 실시간으로 분석하고 교정하기 위해, MediaPipe 기반 관절 좌표 추출과 각도 계산을 통한 자세 평가 시스템을 설계했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 개발 속도 |
| achievement_1_metric | 83% ↓ |
| achievement_1_detail | 3일 → 0.5일 |
| achievement_2_title | 프로젝트 평가 |
| achievement_2_metric | 최우수상 |
| achievement_2_detail | 12팀 중 2등 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | MediaPipe 기반 실시간 관절 좌표 추출 파이프라인 구축 |
| task_2 | 벡터 내적 기반 공통 각도 계산 모듈 개발, 운동별 구현시간 83% 단축 (3일 → 0.5일) |
| task_3 | 운동별 자세 교정 로직 구현 (5개 중 3개 담당)|
| task_4 | Flask 기반 영상 처리 서버 구축, 자세 분석 결과를 Spring 백엔드로 전달 |
| task_5 | 최종 발표회 PT 진행 및 시연 (12팀 중 최우수상 수상) |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 공통 모듈 추출이 단순히 코드를 정리하는 게 아니라 팀 전체의 생산성을 높이는 것임을 체감 |
| insight_2 | 서버 간 통신에서 데이터 전달 형식을 문서화하지 않아 통합 시 시행착오를 겪음. API 명세 문서화가 협업의 기본임을 인식함 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 운동별 각도 측정 로직이 제각각으로 중복 발생, 관절 3점 기반 공통 각도 계산 모듈로 추상화. 구현시간 3일 → 0.5일 (83%↓) |
| resume_item_2 | 좌표 기반 판정의 카메라 각도 의존성 문제, 벡터 내적 기반 공통 각도 모듈 개발로 해결. 체형·카메라 무관 안정적 판정 구현 |
| resume_item_3 |  Flask 기반 영상 처리 서버 구축, OpenCV 파이프라인 설계 및 Spring 백엔드 연동 |
| resume_item_4 | 최종 발표회 PT 진행 및 시연으로 12팀 중 최우수상 수상 (2등) |

<!-- 프로젝트 특이사항 -->
| note_1 | 문제 발견 → 추상화 → 모듈화의 가치를 체감한 프로젝트 |
| note_2 | 좌표계 변환과 각도 계산 등 수학적 로직 구현 경험 |
