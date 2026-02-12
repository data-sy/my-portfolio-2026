# Plogging Community Project

<!-- result 패턴
[기능] 시 [문제] 발생, [해결방법]으로 [결과 해석]. [수치]
-->

| key | value |
|---|---|
| name | Plogging Community Project |
| intro | 위치 기반 플로깅 장소 공유 커뮤니티 |
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
