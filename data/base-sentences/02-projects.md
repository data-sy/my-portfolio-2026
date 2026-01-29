# Projects

## High-Traffic Performance Tuning Project
| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 100만 회원 규모 트래픽 환경에서 성능 병목을 개선한 프로젝트 |
| period | 2026.01 (3주) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Data JPA, MySQL 8, Redis, K6 |
| task_1 | JMeter를 사용해 부하 테스트 수행 |
| task_2 | Prometheus + Grafana로 성능 모니터링 |
| task_3 | EXPLAIN 분석으로 쿼리 병목 진단 |
| task_4 | null |
| task_5 | null |
| result_1 | 상품 목록 조회 시 Full Table Scan 발생, 복합 인덱스 설계로 응답시간 2.5s → 180ms (93%↓) |
| result_2 | 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생, Redis Sorted Set으로 200ms → 5ms (98%↓) |
| result_3 | 주문 목록 조회 시 N+1 문제 발생, Fetch Join으로 쿼리 수 23회 → 1회 (95%↓) |
| result_4 | 선착순 쿠폰 발급 시 동시성 이슈 발생, Redis 분산락 + Lua Script로 정합성 확보 |
| result_5 | null |
| insight | 카디널리티를 고려한 복합 인덱스 설계와 EXPLAIN 분석의 중요성을 체감 |

## Quick Label Timer
| key | value |
|---|---|
| name | Quick Label Timer |
| intro | 앱스토어 출시 iOS 타이머 앱 |
| period | 2024.08 ~ 현재 |
| role | 1인 개발 |
| stack | Swift, SwiftUI |
| task_1 | null |
| task_2 | null |
| task_3 | null |
| task_4 | null |
| task_5 | null |
| result_1 | 사용자 피드백 기반 기능 업데이트, 평점 4.5 이상 유지 |
| result_2 | String Catalog 활용 영어 로컬라이제이션, 접근성 레이블 i18n 처리 |
| result_3 | Java와 달리 Optional, Protocol, Closure 등 Swift 고유 패턴 학습 및 적용 |
| result_4 | SwiftUI의 선언형 UI와 Combine의 반응형 프로그래밍 패러다임 이해 |
| result_5 | Figma로 App Store 미리보기 이미지 및 앱 아이콘 직접 제작 |
| insight | null |

## My Math Teacher
| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2023.12 ~ 2024.07 |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Security 6, JPA, MySQL, Neo4j, Redis, Docker, GitHub Actions |
| task_1 | null |
| task_2 | null |
| task_3 | null |
| task_4 | null |
| task_5 | null |
| result_1 | 맞춤 문항 API에서 ORDER BY RAND() 병목, 인라인 뷰 최적화로 232ms → 50ms (78%↓) |
| result_2 | 수작업 배포로 휴먼에러 발생, GitHub Actions + Docker Compose로 25분 → 7분 (72%↓) |
| result_3 | RDB에서 그래프 쿼리 복잡, Neo4j 도입으로 "학년별 선수지식 깊이" 요구사항 즉각 대응 |
| result_4 | Spring Security 6 + JWT 인증/인가, OAuth2 소셜 로그인(Google, Kakao) 구현 |
| result_5 | TensorFlow Serving으로 AUC 0.83 AI 모델 서빙, 지식 상태 예측 API 구축 |
| insight | null |

## Skeleton-Gym Project
| key | value |
|---|---|
| name | Skeleton-Gym Project |
| intro | 실시간 영상 분석 기반 운동 코칭 시스템 |
| period | 2021.05 ~ 10 (교육과정 내) |
| role | 5인, BE 40% |
| stack | null |
| task_1 | null |
| task_2 | null |
| task_3 | null |
| task_4 | null |
| task_5 | null |
| result_1 | 공통 각도 계산 모듈 개발로 구현시간 3일 → 0.5일 단축 |
| result_2 | 최종 발표회 최우수상(2등) |
| result_3 | null |
| result_4 | null |
| result_5 | null |
| insight | null |

## Plogging Community Project
| key | value |
|---|---|
| name | Plogging Community Project |
| intro | 위치 기반 플로깅 커뮤니티 웹서비스 |
| period | 2021.05 ~ 10 (교육과정 내) |
| role | 4인, BE 70% |
| stack | null |
| task_1 | null |
| task_2 | null |
| task_3 | null |
| task_4 | null |
| task_5 | null |
| result_1 | 구면 기하학 기반 거리 계산으로 오차율 32% → 3.69% 개선 |
| result_2 | null |
| result_3 | null |
| result_4 | null |
| result_5 | null |
| insight | null |
