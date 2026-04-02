# My Math Teacher

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: 웹사이트 화면 (노트북 목업)
candidate_image_2: 선수지식 그래프 시각화 (Cytoscape.js)
candidate_image_3: AI 진단 프로세스 다이어그램 (문제 풀이 → DKT 예측 → 약점 추적)
candidate_image_4: 성능 개선 Before/After 차트 (232ms→50ms, 배포 25분→7분)
candidate_image_5: AWS 아키텍처 다이어그램 (github actions, docker, aws 등)
-->

<!-- 포폴: info -->
| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2024.01 ~ 2024.07 (7개월, v1) 2026 리팩토링 예정 (v2) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Security 6, JdbcTemplate (JPA 부분 적용), MySQL, Neo4j, Redis, Docker, GitHub Actions, AWS(ECR, ECS, RDS), Vue 3, TensorFlow Serving|
| github | https://github.com/data-sy/my-math-teacher |
| demo | https://www.my-math-teacher.com |

<!-- 이력서: info -->
| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2024.01 ~ 2024.07 (7개월, v1) 2026 리팩토링 예정 (v2) |
| role | **1인 개발** |
| stack | Java 17, Spring Boot 3, **Spring Security 6**, JdbcTemplate (JPA 부분 적용), MySQL, Neo4j, Redis, **Docker**,**GitHub Actions, AWS(ECR, ECS, RDS)**, Vue 3, TensorFlow Serving|
| github | https://github.com/data-sy/my-math-teacher |
| demo | https://www.my-math-teacher.com |

<!-- 포폴 커버용: 배경 -->
| background | 학생들이 틀린 문제의 근본 원인(선수지식 부족)을 스스로 찾기 어렵다는 문제를 해결하기 위해, AI가 학습 상태를 진단하고 약점을 역추적하는 맞춤형 학습 플랫폼을 설계했습니다.  |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 문항 추천 |
| achievement_1_metric | 78%↓ |
| achievement_1_detail | 232ms → 50ms |
<!-- 메모리 사용량: CloudWatch MemoryUtilized 측정 (Neo4j 제거 전후 평균값 비교) 이게 더 강력!! -->
| achievement_2_title | 메모리 사용량 |
| achievement_2_metric | 50%↓ |
| achievement_2_detail | 2GB → 1GB |
<!-- 인프라 비용: ECS Task Definition 메모리 할당량 변경 (Fargate 요금 직접 절감) 실제 요금 청구서를 보여줘야 설득력 생김 -->
| achievement_2_title | 인프라 비용 |
| achievement_2_metric | 50%↓ |
| achievement_2_detail | Task 메모리 4GB → 2GB |
| achievement_3_title | 배포 시간 |
| achievement_3_metric | 72%↓ |
| achievement_3_detail | 25분 → 7분 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | ORDER BY RAND() 병목 → 인라인 뷰로 PK 선택 후 조인하여 정렬 범위 축소, 232ms → 50ms (78% 개선) |
| task_2 | DB 이중 관리와 동기화 부담 → MySQL 재귀 CTE로 단일 DB 통합하여 메모리 2GB → 1GB (50% 절감) |
| task_3 | 수동 배포 25분 소요 → GitHub Actions + Docker 자동화로 빌드/배포 파이프라인 구축, 25분 → 7분 (72% 단축) |
<!--| task_4 | TensorFlow Serving으로 AUC 0.83 DKT 모델 서빙, 지식 상태 예측 API 구축 |--> <!-- 자리 부족으로 탈락 -->
<!--| task_1 | 프로젝트 기획, DB 설계 (ERD), RESTful API 설계 (API 문서) |-->
<!--| task_2 | Spring Security + JWT 인증/인가, OAuth2 소셜 로그인 구현 |-->

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 검증된 문항 확보 실패로 DKT AI 모델 구현과 무관하게 사용자 유치 실패. 교육 서비스는 콘텐츠(문항) 품질이 기술 구현만큼 서비스 성패에 결정적임을 체감함 |
<!--| insight_2 | 기술 선택은 일회성이 아니라 도메인 적합성과 비용을 지속적으로 재평가해야 함을 경험함 |--> <!-- QLT 인사이트와 중복. 탈락 -->
<!--| insight_3 | DB-Java 패러다임 불일치 경험을 통해 ORM 필요성을 체감하고 JPA 마이그레이션 계획 수립 |-->

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 5천 건 문항 테이블의 맞춤 추천 시 ORDER BY RAND() 병목 발생
**인라인 뷰**로 PK만 랜덤 선택하여 정렬 대상 축소. 응답시간 **232ms → 50ms (78%↓)** |
| resume_item_2 | 수작업 배포로 휴먼 에러와 긴 소요시간 발생. **GitHub Actions + Docker Compose**로 자동화하여 에러 가능성 제거 및 및 배포시간 단축. **25분 → 7분 (72%↓)** |
| resume_item_3 | **TensorFlow Serving**으로 DKT AI모델 서빙 인프라 구축. RESTful API로 취약한 선수지식 실시간 예측 제공 (AUC 0.83) |

<!-- 추가할 후보들 -->
<!--| resume_item_3 | Neo4j-MySQL 이중 운영으로 메모리 사용률 85% 및 동기화 복잡도 증가. 기술 스택 재검토 후 MySQL 재귀 CTE로 통합하여 메모리 여유 30%p 확보 및 관리 포인트 40% 감소 | -->
<!--| resume_item_4 | TensorFlow Serving으로 DKT AI모델 서빙 인프라 구축, RESTful API로 실시간 학습 상태 예측 제공 (AUC 0.83) |-->
<!--| resume_item_5 | Spring Security + JWT로 인증/인가 구현 및 OAuth2 소셜 로그인 통합 |-->

<!-- v2 개선 계획 -->
| improvement_plan_1 | JdbcTemplate의 보일러플레이트 코드 문제 → JPA 마이그레이션으로 생산성 향상 계획 |
| improvement_plan_2 | DKT 수치 기반 출력 한계 → LLM 기반 자연어 피드백 시스템 검토 중 |
