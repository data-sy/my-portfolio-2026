# Form Check Gym Project

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: 실시간 자세 분석 화면 (관절 좌표 오버레이)
candidate_image_2: 각도 계산 시각화 (직교좌표계 → 구면좌표계 변환 -> 백터 내적) <- 채택
candidate_image_5: 최종 발표회 시연 장면
-->

<!-- 공통: info -->
| key | value |
|---|---|
| name | Form Check Gym Project|
| intro | 운동 자세를 실시간으로 분석·교정하는 영상 기반 시스템 |
| period | 2021.10 ~ 11 (1개월) |
| role | 백엔드 리드, **발표 (5인 팀)** |
| stack | Python 3.8, Flask, OpenCV, MediaPipe |
| github | https://github.com/data-sy/ai-gym |

<!-- 포폴 커버용: 배경 -->
| background | 운동 자세를 실시간 분석·교정하기 위해, MediaPipe 기반 관절 좌표 추출과 각도 계산을 통한 자세 평가 시스템을 설계했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 개발 속도 |
| achievement_1_metric | 83%↓ |
| achievement_1_detail | 3일 → 0.5일 |
| achievement_2_title | 최종 발표회 |
| achievement_2_metric | 2등 |
| achievement_2_detail | 12팀 중 2등 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | 벡터 내적 기반 **공통 모듈**로 구현시간 단축, **3일 → 0.5일 (83%↓)** |
| task_2 | MediaPipe로 관절 좌표 추출, 실시간 자세 분석 플로우 구현 |
| task_3 | Flask 영상 처리 서버 구축, 분석 결과를 Spring 서버로 전달 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | **공통 모듈 추출이** 단순 코드 정리가 아닌 **팀 전체 생산성 향상** 수단임을 체감함 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 운동별 자세 판정 로직 개별 구현으로 1개당 3일 소요, 운동마다 중심점·기준축이 달라 구현 오버헤드 발생. **벡터 내적 기반 공통 각도 모듈**로 비즈니스 로직인 판정 기준 정의에만 집중. **3일 → 0.5일 (83%↓)** |
| resume_item_2 | **Flask 영상 처리 서버** 구축, 분석 결과를 Spring 서버로 전달 |
| resume_item_3 | 최종 발표회 PT 진행 및 시연으로 **최우수상 수상** (12팀 중 2등) |
