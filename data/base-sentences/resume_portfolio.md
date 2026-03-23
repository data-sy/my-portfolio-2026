# Resume

## Info
| key | value |
|---|---|
| name | Robin |
| position | **Backend Developer** |

## Projects
### High-Traffic Performance Tuning Project
| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 상품 10만·주문 5만 건 규모의 이커머스 환경에서 성능 병목을 개선한 프로젝트 |
| period | 2026.02 ~ 03 (1개월) |
| role | 1인 개발 |
| stack | Java 17, **Spring Boot 3**, Spring Data **JPA**, **MySQL 8**, **Redis**, K6 |
| github | https://github.com/data-sy/high-traffic-performance-tuning |
| resume_item_1 |  10만 건 상품 테이블의 카테고리별 최신순 조회 시 Full Table Scan 병목 발생 **복합 인덱스 설계**로 정렬 비용을 제거. 응답시간 **70.6ms → 34.3ms (51%↓)** |
| resume_item_2 | 주문상품 15만 건 실시간 랭킹 조회 시 매번 COUNT + ORDER BY 발생 **Redis Sorted Set**으로 집계·정렬을 쓰기 시점의 증분 갱신으로 전환하여 DB 부하 제거 응답시간 **2,813ms → 17ms (99.4%↓)** |

### My Math Teacher
| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2024.01 ~ 2024.07 (7개월, v1) 2026 리팩토링 예정 (v2) |
| role | **1인 개발** |
| stack | Java 17, Spring Boot 3, **Spring Security 6**, JdbcTemplate (JPA 부분 적용), MySQL, Neo4j, Redis, **Docker**,**GitHub Actions, AWS(ECR, ECS, RDS)**, Vue 3, TensorFlow Serving|
| github | https://github.com/data-sy/my-math-teacher |
| demo | https://www.my-math-teacher.com |
| resume_item_1 | 5천 건 문항 테이블의 맞춤 추천 시 ORDER BY RAND() 병목 발생
**인라인 뷰**로 PK만 랜덤 선택하여 정렬 대상 축소. 응답시간 **232ms → 50ms (78%↓)** |
| resume_item_2 | 수작업 배포로 휴먼 에러와 긴 소요시간 발생. **GitHub Actions + Docker Compose**로 자동화하여 에러 가능성 제거 및 및 배포시간 단축. **25분 → 7분 (72%↓)** |
| resume_item_3 | **TensorFlow Serving**으로 DKT AI모델 서빙 인프라 구축. RESTful API로 취약한 선수지식 실시간 예측 제공 (AUC 0.83) |


### Plogging Project
| key | value |
|---|---|
| name | Plogging Community Project |
| intro | 위치 기반 플로깅 장소 공유 커뮤니티 |
| period | 2021.07 ~ 08 (3주) |
| role | **백엔드 리드 (4인 팀)** |
| stack | Java 8, JSP/Servlet, Oracle 11g, JDBC, JavaScript, Kakao Maps API |
| github | https://github.com/data-sy/plogging |
| resume_item_1 | 플로깅 장소 1km 반경 조회 시 평면 거리 계산으로 최대 260m 오차 발생. **Haversine** 공식 기반 구면 거리 계산 도입으로 경도 왜곡 제거. **260m → 2.4m (99%↓) ** |
| resume_item_2 | Haversine 계산 위치에 따라 전체 row 연산 부하(DB) vs 대량 데이터 전송(Java) 트레이드오프. **DB BETWEEN 1차 필터 + Java Haversine 2차 계산**으로
**양쪽 비용 절감** |

### Quick Label Timer
| key | value |
|---|---|
| name | Quick Label Timer |
| intro | 라벨 설정에 필요한 탭 수를 최소화한 iOS 타이머 앱 **(앱스토어 출시)** |
| period | 2025.07 ~ 08 (2개월) |
| role | 1인 개발 |
| stack | Swift, SwiftUI |
| github | https://github.com/data-sy/quick-label-timer |
| appstore | ** https://apps.apple.com/kr/app/%ED%80%B5%EB%9D%BC%EB%B2%A8%ED%83%80%EC%9D%B4%EB%A8%B8/id6752611917 ** |
| resume_item_1 | iOS Suspended 상태에서 AVAudioPlayer 알람 미동작 발생 **UNUserNotification** 기반 연속 로컬 알림으로 전환하여 **알람 신뢰성 100%** 확보 |
| resume_item_2 | Manager가 완료 정책·타이머 제어·데이터 저장을 모두 처리하여 완료 정책 변경 시 side effect 발생 **CompletionHandler**(완료 정책)-**Service**(타이머 재생/정지)-**Repository**(CRUD)로 **책임 분리 (SRP)** 수정 영향 범위를 단일 계층으로 한정 |
| resume_item_3 | **17건의 ADR** 작성으로 기술 선택 근거와 트레이드오프 체계적 문서화 1인 개발에서 미래의 나에게 전달하는 컨텍스트로 활용 |

### Form Check Gym
| key | value |
|---|---|
| name | Form Check Gym Project|
| intro | 운동 자세를 실시간으로 분석·교정하는 영상 기반 시스템 |
| period | 2021.10 ~ 11 (1개월) |
| role | 백엔드 리드, **발표 (5인 팀)** |
| stack | Python 3.8, Flask, OpenCV, MediaPipe |
| github | https://github.com/data-sy/ai-gym |
| resume_item_1 | 운동별 자세 판정 로직 개별 구현으로 1개당 3일 소요, 운동마다 중심점·기준축이 달라 구현 오버헤드 발생. **벡터 내적 기반 공통 각도 모듈**로 비즈니스 로직인 판정 기준 정의에만 집중. **3일 → 0.5일 (83%↓)** |
| resume_item_2 | **Flask 영상 처리 서버** 구축, 분석 결과를 Spring 서버로 전달 |
| resume_item_3 | 최종 발표회 PT 진행 및 시연으로 **최우수상 수상** (12팀 중 2등) |

## Background
| key | value |
|---|---|
| cert_1_name | **정보처리기사** |
| cert_1_date | 2023.06 |
| cert_2_name | **SQLD** |
| cert_2_date | 2024.04 |
| edu_name | 빅데이터 분석서비스 개발자 과정 |
| edu_org | 스마트인재개발원 |
| edu_period | 2021.05 ~ 10 |
| degree_school | 순천대학교 |
| degree_major | 수학교육과 |
| degree_period | 2009.03 ~ 2013.02 |

## Skills
| key | value |
|---|---|
| **Backend** | Java, Spring Boot, Spring Security, Spring Data JPA, JdbcTemplate |
| **Database** | MySQL, Redis, Neo4j |
| **DevOps** | Docker, GitHub Actions, AWS (EC2, RDS), Nginx |

## About
| about_1 | 수학교사 시절, "이런 서비스가 있으면 좋겠다"는 아이디어를 실현하고자 1인 개발에 뛰어들었습니다. 기획부터 배포까지 경험하며, 특히 **백엔드 설계 과정에서 깊은 몰입감**을 느꼈습니다. 복잡한 현실 문제를 논리적인 구조로 추상화하는 과정이 수학적 모델링과 닮아 있었기 때문입니다. |
| about_2 | 그러나 개발은 수학과 결정적으로 달랐습니다. 정답이 존재하는 학문의 세계와 달리, 엔지니어링의 의사결정에는 최고가 없고 최선만 있습니다. 모든 선택에는 대가가 따르며, 서비스의 **맥락에 맞춰 트레이드오프를 판단하는 과정이 엔지니어링의 본질**임을 체득했습니다. |
| about_direction | 실제로도 iOS 알람은 커스텀 제어보다 신뢰성을, 거리 계산은 정확도와 DB 부하를 고려한 하이브리드 구조를 선택했습니다. 현재는 마이그레이션 비용과 운영 안정성을 고민하고 있습니다. 저는 이제 단순히 기술적 가능 여부를 묻기보다, **의사결정 근거를 ADR로 기록하며 어떤 비용을 감수할지 판단하는 개발자**로 성장하고 있습니다. |

---

# Portfolio
## Cover
| key | value |
|---|---|
| name | Robin |
| position | **Backend Developer** |
| headline | 트레이드오프를 고려하는 개발자 |

## Projects
### High-Traffic Performance Tuning Project
| key | value |
|---|---|
| name | High-Traffic Performance Tuning Project |
| intro | 상품 10만·주문 5만 건 규모의 이커머스 환경에서 **성능 병목을 개선**한 프로젝트 |
| period | 2026.02 ~ 03 (1개월) |
| role | 1인 개발 |
| stack | Java 17, **Spring Boot 3**, Spring Data **JPA**, **MySQL 8**, **Redis**, K6 |
| github | https://github.com/data-sy/high-traffic-performance-tuning |
<!-- 포폴 커버용: 배경 -->
| background | 실무에서 발생 가능한 성능 병목을 미리 경험하고 해결 역량을 검증하기 위해, 상품 10만·주문 5만 건 규모의 이커머스 환경을 설계했습니다. |
<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 상품 조회 |
| achievement_1_metric | 51% ↓ |
| achievement_1_detail | 70.6ms → 34.3ms |
| achievement_2_title | 랭킹 조회 |
| achievement_2_metric | 99% ↓ |
| achievement_2_detail | 2,813ms → 17ms |
<!-- 포폴 커버용: 한 일 -->
| task_1 | **복합 인덱스 설계**로 상품 조회 최적화, **70.6ms→34.3ms(51%↓))** |
| task_2 | **Redis Sorted Set**으로 랭킹 조회 최적화, **2.8s→17ms(99.4%↓)** |
| task_3 | 상품 10만·주문 5만 (주문상품 15만) 건 규모 테스트 환경 구축 |
| task_4 | 동시 접속 100명 (k6, VU 100) 기준 부하 테스트 수행|
<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 성능 최적화는 추측이 아닌 측정임을 체득. 실행계획 분석과 모니터링으로 병목을 진단하고 **트레이드오프를 판단**해 개선함 |

#### DB 인덱스 최적화로 상품 목록 조회 성능 51% 개선
| key | value |
|---|---|
| title | DB 인덱스 최적화로 상품 목록 조회 성능 51% 개선 |
| context | 상품 10만 건, 상품 목록 조회 시 **Full Scan**으로 **p95 70.6ms** |
| try_1_title | EXPLAIN 실행계획 진단 |
| try_1_desc | 인덱스 적용 전 실행계획 분석 |
| try_1_result | type=ALL, Using filesort 확인 |
| try_1_limit | WHERE과 ORDER BY 모두 인덱스 미적용 상태 |
| try_2_title | null |
| try_2_desc | null |
| try_2_result | null |
| try_2_limit | null |
| try_3_title | 복합 인덱스 (category, created_at DESC) 적용 |
| try_3_desc | WHERE + ORDER BY를 동시에 커버하는 복합 인덱스 설계 및 적용 |
| try_3_result| **type=ref, filesort 제거 확인** |
| try_3_completion | 조회 패턴 전체 커버 ✓ |
| result | 상품 10만 건 기준 p95 70.6ms → 34.3ms (51% ↓) |
| result_desc | 복합 인덱스로 WHERE + ORDER BY 동시 커버 |
| insight_1 | 이전 프로젝트(MMT)의 시행착오를 반면교사 삼아, 이번에는 **EXPLAIN 진단을 먼저 수행함** 객관적 진단이 불필요한 시행착오를 막는다는 것을 체감 |
| followup_q1 | 인덱스 컬럼 순서가 (created_at, category)였다면 어떻게 됐을까? |
| followup_q2 | 복합 인덱스를 사용했을 때 쓰기 비용이 늘어나지는 않나? |

#### Redis Sorted Set으로 실시간 랭킹 조회 98% 개선
| key | value |
|---|---|
| title | Redis Sorted Set으로 실시간 랭킹 조회 98% 개선 |
| context | 주문상품 15만 건, 실시간 판매량 TOP 100 조회 시 매 요청 집계 정렬로 **p95 2,813ms** |
| try_1_title | 커버링 인덱스 |
| try_1_desc | (product_id, quantity) 커버링 인덱스 적용 |
| try_1_result | Using index로 I/O 감소하지만 Using temporary·filesort 잔존 |
| try_1_limit | 집계+정렬은 인덱스만으로 제거 불가 |
| try_2_title | Redis String 캐싱 |
| try_2_desc | TOP 100 결과를 Redis String 캐싱 (TTL 5분) |
| try_2_result | 2,813ms → 202ms (93% ↓) |
| try_2_limit | 캐시 만료 시 race condition (cache stampede) |
| try_3_title | Redis Sorted Set |
| try_3_desc | **ZINCRBY**로 판매 시 score 증가, **ZREVRANGE**로 정렬 상태 자동 유지 |
| try_3_result | **2,813ms → 17ms (99.4%↓)** |
| try_3_completion | 삽입 O(log N), 조회 O(log N + M) ✓ |
| result | 동시접속 100명 기준 p95 2,813ms → 17ms (99.4% ↓) |
| insight_1 | 단순 캐싱은 "결과 저장", **Sorted Set은 "구조 저장"** 갱신이 빈번한 데이터는 결과가 아니라 정렬 구조 자체를 캐싱해야 읽기/쓰기 모두 효율적 |
| followup_q1 | Sorted Set의 메모리 사용량이 커지면 어떻게 관리하나? |
| followup_q2 | 랭킹 데이터와 DB 원본 데이터의 정합성은 어떻게 보장하나? |

### My Math Teacher

| key | value |
|---|---|
| name | My Math Teacher |
| intro | 틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스 |
| period | 2024.01 ~ 2024.07 (7개월, v1) 2026 리팩토링 예정 (v2) |
| role | 1인 개발 |
| stack | Java 17, Spring Boot 3, Spring Security 6, JdbcTemplate (JPA 부분 적용), MySQL, Neo4j, Redis, Docker, GitHub Actions, AWS(ECR, ECS, RDS), Vue 3, TensorFlow Serving|
| github | https://github.com/data-sy/my-math-teacher |
<!-- 포폴 커버용: 배경 -->
| background | 학생들이 틀린 문제의 근본 원인(선수지식 부족)을 스스로 찾기 어렵다는 문제를 해결하기 위해, AI가 학습 상태를 진단하고 약점을 역추적하는 맞춤형 학습 플랫폼을 설계했습니다.  |
<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 문항 추천 |
| achievement_1_metric | 78%↓ |
| achievement_1_detail | 232ms → 50ms |
| achievement_3_title | 배포 시간 |
| achievement_3_metric | 72%↓ |
| achievement_3_detail | 25분 → 7분 |
<!-- 포폴 커버용: 한 일 -->
| task_1 | ORDER BY RAND() 병목 → 인라인 뷰로 PK 선택 후 조인하여 정렬 범위 축소, 232ms → 50ms (78% 개선) |
| task_3 | 수동 배포 25분 소요 → GitHub Actions + Docker 자동화로 빌드/배포 파이프라인 구축, 25분 → 7분 (72% 단축) |
<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 검증된 문항 확보 실패로 DKT AI 모델 구현과 무관하게 사용자 유치 실패. 교육 서비스는 콘텐츠(문항) 품질이 기술 구현만큼 서비스 성패에 결정적임을 체감함 |

#### 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선
| key | value |
|---|---|
| title | 인라인 뷰 최적화로 맞춤 문항 API 랜덤 조회 78% 개선 |
| context | 문항 5천 건, 맞춤 문항 추출 API에서 `ORDER BY RAND()` 사용 시 **p95 기준 232ms 소요** |
| try_1_title | 애플리케이션 레벨 랜덤 선택 |
| try_1_desc | DB에서 전체 조회 후 Java에서 랜덤 선택 |
| try_1_result | 232ms → 333ms (오히려 악화) |
| try_1_limit | 전체 행 전송 비용이 RAND()보다 더 큼 |
| try_2_title | ID만 조회 후 Java 랜덤 선택 |
| try_2_desc | 조회한 ID를 Java 랜덤 선택하여 재조회 |
| try_2_result | 232ms → 152ms (34%↓) |
| try_2_limit | DB I/O 2회. 불필요한 네트워크 비용 |
| try_3_title | 인라인 뷰로 DB 내에서 최적화 |
| try_3_desc | 시도 2의 ID 선별 로직을 서브쿼리(인라인 뷰)로 이동하여 **단일 쿼리로 처리** |
| try_3_result | **232ms → 49ms (78%↓)** |
| try_3_completion | 단일 쿼리로 처리, PK만 정렬하여 인덱스 스캔  ✓ |
| result | p95 기준 232ms → 49ms (78%↓) |
| insight_1 | 직관에 의존해 시행착오를 거쳤으나, **EXPLAIN으로 병목을 먼저 진단했다면 즉시 해결할 수도 있었음.** 이후 프로젝트에서 EXPLAIN 진단을 먼저 수행하는 접근으로 개선 |
| followup_q1 | EXPLAIN을 사용했다면 어떤 병목을 발견했을까? |
| followup_q2 | ORDER BY RAND()가 항상 나쁜 선택인가? |

#### GitHub Actions + Docker Compose로 배포 시간 72% 단축
| key | value |
|---|---|
| title | GitHub Actions + Docker Compose로 배포 시간 72% 단축 |
| context | 수작업 배포(SSH 접속 → pull → build → restart)로 매번 25분 소요. 빌드 순서 실수, 환경변수 누락 등으로 **운영 장애 반복 발생** |
| action_1_title | GitHub Actions 워크플로우 작성 |
| action_1_desc | main 브랜치 push 시 자동 트리거 |
| action_2_title | Docker Compose로 멀티 컨테이너 구성 |
| action_2_desc | App + MySQL + Redis를 코드로 정의하여 **일관된 실행 환경 보장** |
| action_3_title | CI/CD 파이프라인 구축 |
| action_3_desc | Docker 이미지 빌드 → Docker Hub 푸시 → EC2에서 pull + 재시작 |
| action_4_title | 환경변수 관리 |
| action_4_desc | GitHub Secrets로 관리, docker-compose.yml에서 참조 |
| result | 25분 → 7분 (72%↓)  휴먼에러 제거, 코드 push만으로 배포 자동화 |
| result_desc | 배포 자동화로 시간 72% 단축, 휴먼에러 제거 |
| insight_1 | 배포 자동화로 배포 부담이 줄면서 소규모 빈번한 배포가 가능해졌고, **장애 발생 시 원인 파악도 쉬워짐** |
| followup_q1 | 배포 중 장애가 발생하면 롤백은 어떻게 하나? |
| followup_q2 | GitHub Actions의 비용이나 제약은 없었나? |

### Plogging Community Project
| key | value |
|---|---|
| name | Plogging Community Project |
| intro | 위치 기반 플로깅 장소 공유 커뮤니티 |
| period | 2021.07 ~ 08 (3주) |
| role | **백엔드 리드 (4인 팀)** |
| stack | Java 8, JSP/Servlet, Oracle 11g, JDBC, JavaScript, Kakao Maps API |
| github | https://github.com/data-sy/plogging |
<!-- 포폴 커버용: 배경 -->
| background | 플로깅 활동을 하고 싶은 사람들이 적절한 장소를 찾기 어렵다는 문제를 해결하기 위해,  위치 기반으로 플로깅 장소를 공유하고 커뮤니티로 소통할 수 있는 플랫폼을 설계했습니다. |
<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 거리 오차 |
| achievement_1_metric | 99%↓ |
| achievement_1_detail | 최대 오차 260m → 2.4m |
| achievement_2_title | 트레이드오프 분석 |
| achievement_2_metric | DB vs Java |
| achievement_2_detail | 연산·전송 비용 최소화 |
<!-- 포폴 커버용: 한 일 -->
| task_1 | **Haversine 공식**으로 거리 오차 개선, **260m → 2.4m (99%↓)** |
| task_2 | 하이브리드 설계 **(DB BETWEEN + Java Haversine)**로 연산·전송 비용 최소화 |
<!--| task_3 | ERD 설계 및 Oracle DB 스키마 작성, JDBC 기반 DAO 패턴 아키텍처 구현 |-->
<!--| task_4 | 카카오 지도 API 연동으로 현재 위치 기반 반경 조회 및 마커 표시 구현 |-->
<!-- 포폴 커버용: 인사이트 -->
| insight_1 | DB와 애플리케이션 중 어디서 연산할지 결정하며, **선택지의 장단점을 구조적으로 비교하는 트레이드오프 사고**를 경험함 |
<!--| insight_2 | Haversine으로 직접 구현한 경험이 DBMS Spatial 기능 이해에 도움이 됨. 비효율적으로 보였던 시도들 또한 모두 의미 있는 과정이었음 |-->

#### 좌표계 특성을 반영한 위치 기반 거리 계산 공식 선택
| key | value |
|---|---|
| title | 좌표계 특성을 반영한 위치 기반 거리 계산 공식 선택 |
| context | 1km 반경 내 플로깅 장소 조회 시 거리 **계산 정확도 문제 발생** |
| try_1_title | BETWEEN (사각형 필터링) |
| try_1_desc | 위도·경도 범위를 BETWEEN으로 필터링 |
| try_1_result | 초과 영역 27.3% (사각형 4r² vs 원 πr²) |
| try_1_limit | 사각형 조회로 모서리 영역 초과 포함 |
| try_2_title | 유클리드 거리 (평면 근사) |
| try_2_desc | POWER 함수로 평면 유클리드 거리 계산 |
| try_2_result | 면적 πr²로 초과 영역 해 |
| try_2_limit | 방향별 거리 편차 발생. 경도 방향 최대 260m 과대평가 |
| try_3_title | Haversine 공식 (구면 기하학) |
| try_3_desc | 위도·경도가 구면 좌표임을 인식. Java에서 Haversine 직접 구현 |
| try_3_result | **최대 거리 오차 260m → 2.4m**  |
| try_3_completion | 1km 반경 조회 정확도 확보 ✓ |
| result | 초과 영역 27.3% 제거. 최대 거리 오차 260m → 2.4m |
| result_desc | Haversine 공식으로 구면 거리 정확 계산 |
| insight_1 | 이후 위치 기반 데이터를 관리할 수 있는 **Oracle Spatial 기능**의 존재 파악. 다음부터는 데이터 특성에 특화된 DBMS 기능이 있는지 우선 검토해야겠다는 교훈을 얻음 |
| followup_q1 | Oracle Spatial 기능을 알았다면 어떻게 구현했을까? |
| followup_q2 | Spatial 기능을 쓰면 Java에서 Haversine 직접 구현하는 것보다 어떤 이점이 있을까? |

#### DB vs 애플리케이션 — 거리 계산 처리 위치의 트레이드오프
| key | value |
|---|---|
| title | DB vs 애플리케이션 — 거리 계산 처리 위치의 트레이드오프 |
| context | Haversine 공식으로 거리 계산 정확도를 확보한 뒤, 이를 실제 서비스에 적용하는 단계에서 **처리 위치를 결정**해야 함 |
| target_a | DB에서 계산 |
| target_b | 애플리케이션(Java)에서 계산 ✓ |
| criteria_1 | DB CPU 부하 |
| cri_1_a | 모든 row에 연산 |
| cri_1_b | DB는 단순 조회만 ✅ |
| criteria_2 | 네트워크 전송량 |
| cri_2_a | 필요한 결과만 ✅ |
| cri_2_b | 전체 데이터 |
| criteria_3 | 삼각함수 정밀도 |
| cri_3_a | DB 내장 함수 |
| cri_3_b | Java Math 라이브러리 |
| criteria_4 | 인덱스 활용 |
| cri_4_a | WHERE절에 함수 사용 시 인덱스 불가 |
| cri_4_b | BETWEEN으로 인덱스 활용 가능 ✅ |
| result | 하이브리드: DB BETWEEN 1차 + Java Haversine 2차 필터링 |
| result_desc | BETWEEN 사각형이 Haversine 원을 포함하여 누락 없음. DB는 인덱스 활용 가능한 범위 조회만, 삼각함수는 축소된 후보군에만 Java 실행. **정확도 손해 없이 양쪽 단점 제거 ✓** |
| insight_1 | 의사결정 시 선택지의 **장단점을 구조적으로 비교**하는 습관을 갖게 됨 |
| insight_2 | 어디까지 DB에서 처리하고 어디부터 애플리케이션에서 처리할지, **역할 분담**이라는 관점을 갖게 됨 |
| followup_q1 | Spatial 기능과 하이브리드 방식의 트레이드오프는? |

### Quick Label Timer
<!-- 포폴: info -->
| key | value |
|---|---|
| name | Quick Label Timer |
| intro | 라벨 설정에 필요한 탭 수를 최소화한 iOS 타이머 앱 |
| period | 2025.07 ~ 08 (2개월) |
| role | 1인 개발 |
| stack | Swift, SwiftUI |
| github | https://github.com/data-sy/quick-label-timer |
| appstore | https://apps.apple.com/kr/app/%ED%80%B5%EB%9D%BC%EB%B2%A8%ED%83%80%EC%9D%B4%EB%A8%B8/id6752611917 |

<!-- 포폴 커버용: 배경 -->
| background | 라벨 설정의 **과도한 탭 수 문제를 해결**하기 위해,  라벨 설정 흐름을 최소화한 앱을 설계하고 iOS **앱스토어에 출시**했습니다.
 |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 백그라운드 알람 |
| achievement_1_metric | 100% |
| achievement_1_detail | Suspended 상태 해결 |
| achievement_2_title | ADR 문서화 |
| achievement_2_metric | 17건 |
| achievement_2_detail | 의사결정 기록 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | 연속 로컬 알림으로 iOS **Suspended 상태 알림 미동작 해결** |
| task_2 | 의사결정 과정을 **ADR 17건**으로 문서화 |
| task_3 | CompletionHandler/Service 분리로 완료 정책 단일 책임 확보 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | 백엔드에서 학습한 계층 아키텍처와 SRP 원칙을 iOS 프로젝트에 적용하며 **설계 원칙은 플랫폼 독립적**임을 경험함 |
| insight_2 | 기술 선택 트레이드오프를 반복 경험하며 기술 결정이 **비즈니스 맥락까지 고려**하는 과정임을 이해함 |

#### iOS Suspended 상태 알람 전략 — 트레이드오프 분석
| key | value |
|---|---|
| title | iOS Suspended 상태 알람 전략 — 트레이드오프 분석 |
| context | AVAudioPlayer 기반 백그라운드 알람 구현 후 단위테스트 통과. 그러나 실기기에서 iOS가 앱을 **Suspended 상태로 자동 전환하며 알람 미동작** |
| target_a | 무음 오디오 트릭 (백그라운드 무음 재생) |
| target_b | 연속 로컬 알림 |
| criteria_1 | Suspended 대응 |
| cri_1_a | 앱 활성 유지 (우회) |
| cri_1_b | OS가 직접 발송 (준수) ✅ |
| criteria_2 | 무음 모드 대응 |
| cri_2_a | 우회 가능 (직접 재생) ✅ |
| cri_2_b | 불가 (기기 설정 따름) |
| criteria_3 | 배터리 소모 |
| cri_3_a | 높음 (상시 재생) |
| cri_3_b | 없음 ✅ |
| criteria_4 | 심사 리스크 |
| cri_4_a | 높음 (오디오 모드 남용) |
| cri_4_b | 없음 ✅ |
| criteria_5 | 다중 타이머 대응 |
| cri_5_a | 제약 없음 ✅ |
| cri_5_b | 6개 제한 |
| result | 연속 로컬 알림 (UNUserNotification) 선택 |
| result_desc | 1인 개발 MVP에서 앱스토어 출시 안정성 우선. 커스텀 제어는 포기하되 알람 신뢰성 확보 |
| insight_1 | 기술 선택은 "최선의 기능"이 아닌 **"현재 맥락에서 감당 가능한 리스크"**로 결정됨을 체감함
| insight_2 | iOS 26의 AlarmKit 도입으로 향후 리스크 없이 커스텀 제어가 가능해질 전망 |
| followup_q1 | 팀 개발이었다면 같은 선택을 했을까? 의사결정 과정이 어떻게 달라졌을까? |
| followup_q2 | AlarmKit으로 전환하면 기존 구조에서 어떤 부분이 바뀌나? |

#### SRP 기반 단계적 구조 개선
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
| try_3_result | **SRP 확립, SSOT 자연 확보** |
| try_3_completion | 정책 변경 시 수정 대상 명확, 유지보수성 개선 ✓ |
| result | SRP 기반 계층 분리로 정책 변경 시 수정 대상 명확화 |
| result_desc | SSOT 확립으로 고아 알림 구조적 방지(발생 0건) |
| insight_1 | "유지보수가 어렵다"는 느낌이 들 때가 구조를 나눌 타이밍
불편함을 방치하면 기능 추가마다 부채가 쌓이므로 적절한 타이밍에 해소해야 함을 느낌 |
| followup_q1 | Service가 비대해지면 어떻게 분리하나? |
| followup_q2 | 이 계층 분리가 Spring 환경과 어떻게 연결되나? |

#### Java vs Swift 언어 철학 비교
| key | value |
|---|---|
| title | Java vs Swift 언어 철학 비교 |
| context | 언어마다 안전성을 보장하는 시점이 다른 이유는? |
| target_a | ☕ Java (Spring) |
| target_b | 🍎 Swift (SwiftUI) |
| criteria_1 | Null 안전성 |
| cri_1_a | 약함 (모든 참조 타입 null 허용) |
| cri_1_b | 강함 (Optional 타입 시스템 강제) |
| criteria_2 | 메모리 관리 |
| cri_2_a | GC (런타임 자동 수집) |
| cri_2_b | ARC (컴파일 타임 카운팅) |
| criteria_3 | 타입 시스템 |
| cri_3_a | Reference Type 중심 |
| cri_3_b | Value Type (struct) 중심 |
| criteria_4 | 설계 패러다임 |
| cri_4_a | OOP (상속 기반) |
| cri_4_b | POP (Protocol 기반) |
| result | Java는 서버 생태계를, Swift는 모바일 환경을 배경으로 탄생 |
| result_desc | Java는 런타임 유연성을, Swift는 컴파일 타임 확정성을 우선시 |
| insight_1 | Swift의 컴파일 타임 강제를 경험하니, **Java로 돌아와서도 Optional과 @NonNull을 적극 활용**하게 됨 |
| followup_q1 | JavaScript처럼 런타임 중심 언어를 써봤다면, 타입 안전성을 어떻게 보완할까? |
| followup_q2 | 세 언어의 스펙트럼을 경험한 뒤, 새로운 언어를 평가할 때 가장 먼저 보는 기준은? |

### Form Check Gym Project

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

#### 각도 계산 공통 모듈로 운동별 구현시간 83% 단축
| key | value |
|---|---|
| title | 공통 각도 계산 모듈로 운동별 구현시간 83% 단축 — 3일 → 0.5일 |
| context | MediaPipe 직교좌표로 운동별 자세 판정 로직을 **매번 새로 작성.** 운동 1개당 구현 약 3일 소요 |
| try_1_title | 직교좌표(x,y,z) 직접 활용 |
| try_1_desc | 좌표 간 거리·위치 비교로 판정 |
| try_1_result | 기본 자세 판정 가능 |
| try_1_limit | 카메라 각도·체형에 따라 정확도 불안정 |
| try_2_title | 구면좌표계(r,θ,φ) 변환 |
| try_2_desc | 직교좌표 → 구면좌표 변환, 회전각 기반 판정 |
| try_2_result | 체형·카메라 위치 무관 판정 가능 |
| try_2_limit | 운동마다 중심점·기준축 달라 개별 구현 |
| try_3_title | 공통 각도 계산 모듈 (벡터 내적) |
| try_3_desc | 벡터 내적으로 관절 3점 사잇각 반환하는 공통 함수 개발 |
| try_3_result | **운동 1개당 구현 3일 → 0.5일 (83%↓) ✓** |
| try_3_completion | 공통 모듈 재사용으로 개발 속도 향상 ✓ |
| result | 공통 모듈 도입으로 운동별 구현시간 3일 → 0.5일 (83%↓) |
| result_desc | 벡터 내적 기반 공통 모듈로 구현 시간 83% 단축 |
| insight_1 | 측정 기준의 추상화 수준을 높여가며 **반복 오버헤드 제거.** 운동별 판정 기준 정의에만 집중 가능해짐 |
| followup_q1 | 발표에서 이 기술 과정을 어떻게 쉽게 설명할 수 있을까? |
| followup_q2 | 2D 영상에서 추정한 z축 좌표, 각도 계산에 오차는 없었을까? |
