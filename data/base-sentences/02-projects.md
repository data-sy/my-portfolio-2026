# Projects

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

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
| result_1 | 상품 목록 조회 시 Full Table Scan 발생, 복합 인덱스 설계로 정렬 비용 제거. 응답시간 2.5s → 180ms (93%↓) |
| result_2 | 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생, Redis Sorted Set으로 정렬 상태 자동 유지. 200ms → 5ms (98%↓) |
| result_3 | 주문 상세 조회 시 N+1 문제 발생, Fetch Join으로 연관 데이터 한 번에 조회. 쿼리 수 23회 → 1회 (95%↓) |
| result_4 | 선착순 쿠폰 발급 시 동시성 이슈 발생, Redis 분산락 + Lua Script로 정합성 확보. 동시 1000명 요청 시 100명 정확 발급 |
| result_5 | 대용량 페이징 조회 시 OFFSET 성능 저하, No Offset 방식으로 페이지 위치 무관하게 일정 속도 유지. 응답시간 ?ms → ?ms (?%↓) |
| result_6 | 통계 조회 시 GROUP BY 부하 발생, 배치 선집계로 실시간 부하 제거. 응답시간 ?ms → ?ms (?%↓) |
| insight | 성능 최적화는 측정 → 병목 진단 → 트레이드오프 판단의 반복. 무조건 빠르게가 아니라 "무엇을 포기할 수 있는가"를 먼저 정의해야 함 |

<!-- 
트러블슈팅 유형 정리
- result_1: A형 (문제 → 시도 → 결과) / 목록 조회 → 복합 인덱스
- result_2: C형 (시나리오) / 랭킹 → Redis Sorted Set
- result_3: A형 (문제 → 시도 → 결과) / 상세 조회 → N+1 / Fetch Join
- result_4: C형 (시나리오) 또는 D형 (트레이드오프) / 선착순 → 동시성 / 분산락
- result_5: A형 (문제 → 시도 → 결과) / 페이징 → No Offset [예정]
- result_6: D형 (트레이드오프) / 통계 → 배치 선집계 [예정]
-->

## Quick Label Timer
| key | value |
|---|---|
| name | Quick Label Timer |
| intro | 상황별 라벨로 타이머를 빠르게 생성하는 iOS 앱 (앱스토어 출시) |
| period | 2025.07 ~ 09 (9주) |
| role | 1인 개발 |
| stack | Swift, SwiftUI |
| task_1 | DDD 기반 도메인 모델 설계 (TimerData/Preset 분리) |
| task_2 | SSOT 기반 Service 계층 설계 (데이터 수정 경로 단일화) |
| task_3 | 타이머 핵심 로직 구현 (시작, 일시정지, 리셋, 완료 처리) |
| task_4 | SwiftUI 선언형 UI 및 다크모드 대응 |
| task_5 | 라벨 기반 프리셋 저장/불러오기 기능 구현 (UserDefaults) |
| task_6 | String Catalog 활용 영어/한국어 로컬라이제이션 |
| task_7 | Figma로 앱 아이콘 및 App Store 스크린샷 제작 |
| result_1 | 앱스토어 정식 출시 |
| result_2 | 사용자 피드백으로 불편사항 발견, 기능 업데이트로 UX 개선 |
| result_3 | 기능 추가 시 사이드이펙트 검토, ADR로 의사결정 과정 기록. 총 10건 작성 ([ADR 모음](링크)) |
| insight_1 | Java와 Swift의 언어 철학 차이(Optional, Protocol 등)를 경험하며 새로운 언어에 유연하게 적응할 수 있음을 확인 |
| insight_2 | 웹 백엔드와 모바일 앱 개발을 경험하며 서버/클라이언트 관점 차이를 인지 |
| insight_3 | AI assistant/agent 활용으로 기획부터 출시까지 1인 개발 완료, AI 도구 활용한 생산성 향상 경험 |
<!-- 
result에 적을 수치화
목표 (최소): 다운로드 100+, 리뷰 5+, 평점 4.0+, 업데이트 3회+
목표 (권장): 다운로드 500+, 리뷰 10+, 평점 4.5+, 업데이트 5회+
-->

## My Math Teacher
| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2024.01 ~ 2024.07 (v1), 2026 리팩토링 예정 (v2) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Security 6, JdbcTemplate (JPA 부분 적용), MySQL, Neo4j, Redis, Docker, GitHub Actions, Vue 3, TensorFlow |
| task_1 | 프로젝트 기획, DB 설계 ([ERD](링크)), RESTful API 설계 ([API 문서](링크)) |
| task_2 | Spring Security + JWT 인증/인가, OAuth2 소셜 로그인 구현 |
| task_3 | Vue 3 + PrimeVue 기반 프론트엔드 개발, Cytoscape.js로 선수지식 그래프 시각화 |
| task_4 | TensorFlow Serving으로 AUC 0.83 AI 모델 서빙, 지식 상태 예측 API 구축 |
| task_5 | Docker + GitHub Actions 기반 CI/CD 파이프라인 구축 |
| task_6 | K6 부하 테스트 및 쿼리 튜닝 |
| result_1 | 맞춤 문항 API에서 ORDER BY RAND() 병목, 인라인 뷰 최적화로 랜덤 선택 비용 제거. 응답시간 232ms → 50ms (78%↓) |
| result_2 | 수작업 배포로 휴먼에러 발생, GitHub Actions + Docker Compose로 배포 자동화. 25분 → 7분 (72%↓) |
| result_3 | Neo4j 도메인 부적합 판단 → 트레이드오프 분석 후 MySQL 마이그레이션. 재귀 CTE로 동일 성능 유지, 인프라 단순화 |
| insight_1 | 기술 선택은 일회성이 아니라 도메인 적합성에 따라 재평가가 필요함을 경험 |
| insight_2 | [개선점] JdbcTemplate의 DB-Java 패러다임 불일치 경험 → v2에서 JPA 마이그레이션 계획 |
| insight_3 | [개선점] DKT의 수치 기반 출력 한계 → v2에서 LLM 자연어 피드백 검토 |

## Skeleton Gym Project
| key | value |
|---|---|
| name | Skeleton Gym |
| intro | 실시간 영상 분석 기반 운동 자세 교정 서비스 |
| period | 2021.10 ~ 11 (4주) |
| role | BE, 발표 (5인 팀) |
| stack | Python 3.8, Flask, OpenCV, MediaPipe |
| task_1 | MediaPipe 기반 실시간 관절 좌표 추출 |
| task_2 | 직교좌표계 → 구면좌표계 변환 로직 구현 |
| task_3 | 공통 각도 계산 모듈 개발 (관절 3점 입력 시 각도 반환)
| task_4 | 운동별 자세 교정 로직 구현 (3개 중 2개 담당) |
| task_5 | Flask 기반 AI 서버 구축 |
| result_1 | 운동별 좌표 기반 측정 방식이 제각각, 공통 각도 계산 모듈로 통일하여 구현시간 3일 → 0.5일 단축 |
| result_2 | 최종 발표회 최우수상 (12팀 중 2등) |
| insight_1 | 개별 케이스를 추상화하여 하나의 모듈로 통합하니 개발 속도가 크게 향상됨을 경험 |
| insight_2 | 문제 해결은 불편함에서 시작해 해결 방안을 고민하고 적용하는 과정임을 체득 |

## Plogging Community Project
| key | value |
|---|---|
| name | Plogging Community Project |
| intro | 위치 기반 플로깅 장소 공유 및 커뮤니티 서비스 |
| period | 2021.07 ~ 08 (3주) |
| role | BE 리드 (4인 팀) |
| stack | Java 8, JSP/Servlet, Oracle 11g, JDBC, WebSocket, JavaScript, Kakao Maps API |
| task_1 | ERD 설계 및 DB 스키마 작성 |
| task_2 | JDBC 커넥션 및 DAO 패턴 기반 백엔드 구조 설계 |
| task_3 | 카카오 지도 API 연동 (마커 표시, 현재 위치 기반 조회) |
| task_4 | 게시글 CRUD 및 이미지 업로드 기능 구현 |
| task_5 | WebSocket 기반 실시간 채팅 (생성, 입장/퇴장, 메시지 저장) |
| result_1 | 반경 조회 시 거리 계산 오차 발생 → 트레이드오프 분석 후 정확도 우선 판단, 구면 기하학 적용으로 오차율 32% → 3.69% (88%↓) |
| insight_1 | 요구사항에 따라 트레이드오프 판단이 필요함을 경험 |
| insight_2 | 이후 DBMS 공간 데이터 기능(Spatial 등) 존재를 학습 |

---

# result. <-> trouble shooting type. mapping

| 프로젝트 | 항목 | 내용 | 유형 |
| --- | --- | --- | --- |
| **High-Traffic** | result_1 | 목록 조회 → 복합 인덱스 | A |
|  | result_2 | 랭킹 → Redis Sorted Set | C |
|  | result_3 | 상세 조회 → N+1 / Fetch Join | A |
|  | result_4 | 선착순 → 동시성 / 분산락 | C |
|  | result_4 | 선착순 → 동시성 / 분산락 | D |
|  | result_5 | 페이징 → No Offset | A |
|  | result_6 | 통계 → 배치 선집계 | D |
| **QLT** | result_2 | 사용자 피드백 → UX 개선 (AS-IS/TO-BE) | B |
|  | result_3 | ADR 기록 | E |
|  | insight_1 | Java vs Swift 언어 철학 비교 | B |
|  | insight_2 | 웹 백엔드 vs 모바일 앱 관점 비교 | B |
| **MMT** | result_1 | ORDER BY RAND() → 인라인 뷰 | A |
|  | result_2 | 수작업 배포 → CI/CD 자동화 | E |
|  | result_3 | Neo4j → MySQL 마이그레이션 (트레이드오프 분석) | D |
|  | result_3 | Neo4j → MySQL 마이그레이션 (재귀 CTE 구현) | A |
|  | insight_2 | [개선점] JdbcTemplate 패러다임 불일치 → JPA 마이그레이션 계획 | D |
|  | insight_3 | [개선점] DKT → LLM 전환 검토 (트레이드오프 분석) | D |
| **Skeleton** | result_1 | 좌표 측정 제각각 → 공통 모듈 (AS-IS/TO-BE) | B |
|  | result_2 | 최우수상 (12팀 중 2등) | E |
| **Plogging** | result_1 | 거리 계산 정확도 개선 (트레이드오프 분석) | D |
|  | result_1 | 거리 계산 정확도 개선 (구면 기하학 적용) | A |
