# Plogging Community Project

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

<!-- 이미지 후보 (미정) -->
<!--
candidate_image_1: 카카오 지도 기반 플로깅 장소 마커 화면
candidate_image_2: 거리 계산 방식 비교 다이어그램 (사각형/유클리드/Haversine)
candidate_image_3: 하이브리드 필터링 아키텍처 (DB BETWEEN + Java Haversine)
candidate_image_4: WebSocket 실시간 채팅 화면
candidate_image_5: ERD 다이어그램
-->

<!-- 공통: info -->
| key | value |
|---|---|
| name | Plogging Community Project |
| intro | 위치 기반 플로깅 장소 공유 커뮤니티 |
| period | 2021.07 ~ 08 (3주) |
| role | 백엔드 리드 (4인 팀) |
| stack | Java 8, JSP/Servlet, Oracle 11g, JDBC, JavaScript, Kakao Maps API |
| github | https://github.com/data-sy/plogging |

<!-- 포폴 커버용: 배경 -->
| background | 플로깅 활동을 하고 싶은 사람들이 적절한 장소를 찾기 어렵다는 문제를 해결하기 위해, 위치 기반으로 플로깅 장소를 공유하고 커뮤니티로 소통할 수 있는 플랫폼을 설계했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_metric | 99% ↓ |
| achievement_1_title | 거리 오차 |
| achievement_1_detail | 최대 오차 260m → 2.4m |
| achievement_2_metric | DB vs Java |
| achievement_2_title | 트레이드오프 분석 |
| achievement_2_detail | 연산·전송 비용 최소화 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | Haversine 공식으로 구면 거리 계산하여 초과 영역(27.3%) 제거 및 최대 거리 오차 99% 개선 (260m → 2.4m) |
| task_2 | 하이브리드 방식 설계 (DB BETWEEN 1차 필터 + Java Haversine 2차)로 연산 및 전송 비용 최소화 |
| task_3 | ERD 설계 및 Oracle DB 스키마 작성, JDBC 기반 DAO 패턴 아키텍처 구현 |
| task_4 | 카카오 지도 API 연동으로 현재 위치 기반 반경 조회 및 마커 표시 구현 |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | DB와 애플리케이션 중 어디서 연산할지 결정하며, 선택지의 장단점을 구조적으로 비교하는 트레이드오프 사고를 경험함 |
| insight_2 | Haversine으로 직접 구현한 경험이 DBMS Spatial 기능 이해에 도움이 됨. 비효율적으로 보였던 시도들 또한 모두 의미 있는 과정이었음 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 플로깅 장소 1km 반경 조회 시 평면 거리 계산으로 최대 260m 오차 발생. Haversine 공식 기반 구면 거리 계산 도입으로 경도 왜곡 제거. 260m → 2.4m (99%↓)  |
| resume_item_2 | Haversine 계산 위치에 따라 전체 row 연산 부하(DB) vs 대량 데이터 전송(Java) 트레이드오프 . DB BETWEEN 1차 필터 + Java Haversine 2차 계산으로 양쪽 비용 최소화 |

<!-- 프로젝트 특이사항 -->
| note_1 | 첫 백엔드 리드 경험으로, 아키텍처 설계와 기술 의사결정 주도 |
| note_2 | 좌표계 특성 이해와 트레이드오프 분석을 통한 문제 해결 경험 |
| note_3 | 직접 구현 후 Spatial 기능 존재를 학습하며 기술 조사 선행의 중요성 체감 |
