# Troubleshooting A: 문제해결형

## 좌표계 특성을 반영한 위치 기반 거리 계산 공식 선택
| key | value |
|---|---|
| title | 좌표계 특성을 반영한 위치 기반 거리 계산 공식 선택 |
| context | 1km 반경 내 플로깅 장소 조회 시 거리 계산 정확도 문제 발생 |
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
| try_3_result | 최대 거리 오차 260m → 2.4m  |
| try_3_completion | 1km 반경 조회 정확도 확보 ✓ |
| result | 초과 영역 27.3% 제거. 최대 거리 오차 260m → 2.4m |
| result_desc | Haversine 공식으로 구면 거리 정확 계산 |
| insight_1 | 이후 위치 기반 데이터를 관리할 수 있는 Oracle Spatial 기능의 존재 파악. 다음부터는 데이터 특성에 특화된 DBMS 기능이 있는지 우선 검토해야겠다는 교훈을 얻음 |
| followup_q1 | Oracle Spatial 기능을 알았다면 어떻게 구현했을까? |
| followup_q2 | Spatial 기능을 쓰면 Java에서 Haversine 직접 구현하는 것보다 어떤 이점이 있을까? |

<!--
insight_1: 이후 위치 기반 데이터를 관리할 수 있는 Oracle Spatial 기능의 존재 파악. 다음부터는 데이터 특성에 특화된 DBMS 기능이 있는지 우선 검토해야겠다는 교훈을 얻음

insight_1 의도: 직접 구현 경험을 통한 학습과 기술 조사 선행의 중요성
insight_1 예상 꼬리질문:
- Spatial 기능의 구성요소는?
- ST_Distance_Sphere vs 직접 구현의 차이는?
- 지금 다시 한다면 어떻게 구현하겠나?
- 직접 구현한 경험이 있어서 좋았던 점은?

followup_q1: Oracle Spatial 기능을 알았다면 어떻게 구현했을까?
followup_a1: MySQL Spatial 기능(또는 Oracle Spatial)을 알았다면 ST_Distance_Sphere 함수를 사용했을 것. POINT 타입으로 좌표를 저장하고 공간 인덱스를 생성하여 DB 레벨에서 거리 계산 + 공간 인덱스 기반 필터링이 가능. 애플리케이션 레벨에서 계산하는 것보다 성능이 우수하고 코드도 간결해짐.

followup_q2: Spatial 기능을 쓰면 Java에서 Haversine 직접 구현하는 것보다 어떤 이점이 있을까?
followup_a2: (1) DB 레벨 필터링으로 네트워크 전송 데이터 감소. (2) 공간 인덱스(R-Tree) 활용으로 대량 데이터에서 쿼리 성능 향상. (3) 검증된 구현체로 정확도 보장. 하지만 직접 구현 경험 덕분에 Haversine 공식의 원리와 Spatial 함수의 내부 동작을 깊이 이해하게 됨. 기술을 선택하더라도 그 내부를 이해하고 있으면 디버깅과 최적화에 유리.
-->

<!--
경험 배경:
- 현재 위치 기반 반경 1km 내 플로깅 장소 조회
- Java 8, JSP/Servlet 환경
- DBMS Spatial 기능 미인지 상태 (MySQL Spatial 존재를 몰랐음)

문제의 두 가지 독립적 측면:
1. 사각형 vs 원형 (면적 문제)
2. 평면 vs 구면 (형태 문제)

시도 1: BETWEEN (사각형 필터링)
- 방식: 위도·경도 범위를 BETWEEN으로 필터링
- 한계: 사각형 면적(4r²) vs 원 면적(πr²) → 초과 영역 27.3%
- 배운 것: 사각형 ≠ 원

시도 2: 유클리드 거리 (평면 근사)
- 생각: "사각형 대신 원형으로 거리를 계산하면?"
- 방식: √((x₂-x₁)² + (y₂-y₁)²) 로 거리 계산, POWER 함수 사용
- 결과: 면적은 πr²로 초과 영역 문제 해결
- 한계: 면적은 맞지만 방향별 거리가 균일하지 않음
  - 위도 1도 ≈ 111km (거의 일정)
  - 경도 1도 = 111km × cos(위도) (위도에 따라 변함)
  - 서울 기준 경도 방향 최대 260m 과대평가
- 배운 것: 위도·경도를 평면 좌표(x,y)처럼 다루면 안 됨. 구면 좌표계 특성 반영 필요

시도 3: Haversine 공식 (구면 기하학)
- 생각: "위도·경도가 구면 좌표라면 구면 거리 공식을 써야"
- 방식: Java에서 Haversine 공식 직접 구현
  - 지구를 반지름 6,371km 구로 가정
  - Math.sin, Math.cos, Math.atan2 활용
- 결과: 최대 거리 오차 260m → 2.4m (99% 개선)

학습 과정:
- 문제 해결 후 MySQL Spatial 기능 존재를 알게 됨
- ST_Distance_Sphere 함수가 내부적으로 Haversine 기반 계산 수행
- 직접 구현 경험이 있어 Spatial 함수의 동작 원리를 더 깊이 이해
- 교훈: 데이터 특성에 특화된 DBMS 기능을 우선 검토해야 함
- 이후 프로젝트에서는 기술 선택 전 조사를 먼저 하는 습관으로 발전
-->

