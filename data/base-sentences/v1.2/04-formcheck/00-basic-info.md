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
| task_1 | 웹캠 영상에서 MediaPipe로 관절 좌표 추출, 실시간 자세 분석 플로우 구현 |
| task_2 | 벡터 내적 기반 공통 각도 모듈로 구현 오버헤드를 제거하여 운동별 구현시간 단축. 3일 → 0.5일 (83%↓) |
| task_3 | 시티드 로우·숄더 프레스·펙 덱 플라이 자세 판정 로직 구현 (5개 중 3개 담당)|
| task_4 | Flask 기반 영상 처리 서버 구축, 자세 분석 결과를 Spring 백엔드로 전달 |
| task_5 | 최종 발표회 PT 진행 및 시연으로 12팀 중 최우수상 수상 (2등) |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 공통 모듈 추출이 단순 코드 정리가 아닌 팀 전체 생산성 향상 수단임을 체감함 |
| insight_2 | 서버 간 API 통합 과정에서 명세 부재로 인한 커뮤니케이션 비용을 경험. API 문서화가 협업 효율에 미치는 영향을 체감함 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 운동별 자세 판정 로직 개별 구현으로 1개당 3일 소요, 중복 코드 과다
벡터 내적 기반 공통 각도 모듈로 구현 오버헤드 제거. 3일 → 0.5일 (83%↓) |
| resume_item_2 | 좌표 기반 판정의 카메라 각도 의존성 문제, 벡터 내적 기반 공통 각도 모듈 개발로 해결. 체형·카메라 무관 안정적 판정 구현 |
| resume_item_3 |  Flask 기반 영상 처리 서버 구축, OpenCV 파이프라인 설계 및 Spring 백엔드 연동 |
| resume_item_4 | 최종 발표회 PT 진행 및 시연으로 12팀 중 최우수상 수상 (2등) |

<!-- 프로젝트 특이사항 -->
| note_1 | 문제 발견 → 추상화 → 모듈화의 가치를 체감한 프로젝트 |
| note_2 | 좌표계 변환과 각도 계산 등 수학적 로직 구현 경험 |
