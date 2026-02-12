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
| background | 플로깅 활동을 위한 장소를 위치 기반으로 공유하고, 실시간 채팅으로 소통할 수 있는 커뮤니티 플랫폼을 설계했습니다. |

<!-- 포폴 커버용: 성과 카드 (숫자 + 타이틀) -->
| achievement_1_title | 거리 계산 정확도 |
| achievement_1_metric | 88% ↑ |
| achievement_1_detail | 오차율 32% → 3.69% |
| achievement_2_title | 백엔드 리드 |
| achievement_2_metric | 4인 팀 |
| achievement_2_detail | 첫 리드 경험 |

<!-- 포폴 커버용: 한 일 -->
| task_1 | Haversine 공식 기반 구면 거리 계산으로 위치 조회 정확도 88% 개선 (오차율 32% → 3.69%) |
| task_2 | 하이브리드 필터링 설계 (DB BETWEEN 1차 + Java Haversine 2차), 인덱스 활용 및 정확도 확보 |
| task_3 | ERD 설계, Oracle DB 스키마 작성, JDBC 기반 DAO 패턴 아키텍처 설계 |
| task_4 | 카카오 지도 API 연동 (마커 표시, 현재 위치 기반 반경 조회) |

<!-- 포폴 커버용: 인사이트 -->
| insight_1 | DB와 애플리케이션 중 어디서 연산할지 결정하며, 선택지의 장단점을 구조적으로 비교하는 트레이드오프 습관을 갖게 됨 |
| insight_2 | Haversine으로 직접 구현한 삽질이 DBMS Spatial 기능 이해에 도움이 됨. 삽질에서도 배움이 있음을 체감 |

<!-- 이력서용: 프로젝트 아이템 (문제+해결+결과 상세) -->
| resume_item_1 | 1km 반경 조회 시 평면 좌표 가정으로 거리 오차 최대 260m 발생, Haversine 공식으로 구면 거리 계산. 오차 260m → 2.4m (99%↓) |
| resume_item_2 | DB 연산 부하 vs 네트워크 전송량 트레이드오프, 하이브리드 필터링(DB BETWEEN + Java Haversine) 설계. 인덱스 활용 + 정확도 확보 |
| resume_item_3 | ERD 설계, Oracle DB 스키마 작성, JDBC 기반 DAO 패턴 아키텍처 설계 |
| resume_item_4 | 백엔드 리드로 팀 아키텍처 설계 및 코드 리뷰 진행 (4인 팀) |

<!-- 프로젝트 특이사항 -->
| note_1 | 첫 백엔드 리드 경험으로, 아키텍처 설계와 기술 의사결정 주도 |
| note_2 | 좌표계 특성 이해와 트레이드오프 분석을 통한 문제 해결 경험 |
| note_3 | 직접 구현 후 Spatial 기능 존재를 학습하며 기술 조사 선행의 중요성 체감 |
