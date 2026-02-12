# Troubleshooting D: 트레이드오프형

## DB vs 애플리케이션 — 거리 계산 처리 위치의 트레이드오프
| key | value |
|---|---|
| title | DB vs 애플리케이션 — 거리 계산 처리 위치의 트레이드오프 |
| context | Haversine 공식으로 거리 계산 정확도를 확보한 뒤, 이를 실제 서비스에 적용하는 단계에서 처리 위치를 결정해야 함 |
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
| result_desc | BETWEEN 사각형이 Haversine 원을 포함하여 누락 없음. DB는 인덱스 활용 가능한 범위 조회만, 삼각함수는 축소된 후보군에만 Java 실행. 정확도 손해 없이 양쪽 단점 제거 ✓ |
| insight_1 | 의사결정 시 선택지의 장단점을 구조적으로 비교하는 습관을 갖게 됨 |
| insight_2 | 어디까지 DB에서 처리하고 어디부터 애플리케이션에서 처리할지, 역할 분담이라는 관점을 갖게 됨 |
| followup_q1 | Spatial 기능과 하이브리드 방식의 트레이드오프는? |

<!--
insight_1: 의사결정 시 선택지의 장단점을 구조적으로 비교하는 습관을 갖게 됨

insight_1 의도: 첫 프로젝트에서의 의사결정 경험과 사고 구조화
insight_1 예상 꼬리질문:
- 다른 프로젝트에서도 이런 비교를 한 경험이 있나?
- 트레이드오프 분석을 어떤 형식으로 기록했나?
- 팀 프로젝트였다면 이 결정을 어떻게 공유했을까?

insight_2: 어디까지 DB에서 처리하고 어디부터 애플리케이션에서 처리할지, 역할 분담이라는 관점을 갖게 됨

insight_2 의도: DB vs 애플리케이션 역할 분담에 대한 사고 체계
insight_2 예상 꼬리질문:
- 어떤 기준으로 DB에서 할지 Java에서 할지 결정하나?
- 이후 프로젝트에서도 이런 역할 분담 고민을 했나?
- 다른 상황에서 하이브리드 접근을 적용한 경험이 있나?

followup_q1: Spatial 기능과 하이브리드 방식의 트레이드오프는?
followup_a1: MySQL Spatial 기능(POINT 타입 + ST_Distance_Sphere 함수 + 공간 인덱스)을 쓰면 DB 레벨에서 구면 거리 계산과 공간 인덱스(R-Tree) 기반 필터링이 모두 가능. 하이브리드보다 구현이 단순하고 대량 데이터에서 성능도 우수할 수 있음. 당시에는 Spatial 기능을 인지하지 못했고, 하이브리드 방식으로 충분한 결과를 확보함. 지금 다시 한다면 Spatial 기능을 우선 검토하되, 데이터 규모와 쿼리 빈도를 고려해 선택할 것.
-->

<!--
의사결정 배경:
- Haversine 공식으로 정확도 확보 완료
- 이제 실제 서비스 적용 단계
- 핵심 질문: Haversine 계산을 어디서 할 것인가?

선택지 분석:

Option A: DB에서 계산
방식: WHERE haversine(my_lat, my_lon, lat, lon) <= 1000
장점: 결과만 전송 → 네트워크 효율적
단점:
- WHERE절에 함수 사용 시 인덱스 불가 (Full Table Scan)
- 모든 row에 sin, cos, atan2 연산 → DB CPU 부하

Option B: 애플리케이션(Java)에서 계산
방식: SELECT * FROM places → Java에서 Haversine 필터링
장점: DB 부하 없음 (단순 조회만)
단점: 전체 데이터 전송 → 네트워크·메모리 낭비

하이브리드 결정 (최종 선택):
1단계(DB): BETWEEN으로 사각형 범위 1차 필터링 (인덱스 활용)
  SELECT * FROM places
  WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?
2단계(Java): 축소된 후보군에 Haversine 2차 필터링
  - 사각형 ⊃ 원이므로 누락 없음
  - DB는 인덱스 활용 가능한 범위 조회만
  - 삼각함수는 축소된 후보군에만 Java 실행

핵심 판단:
"어디서 계산할까"의 정답은 한쪽이 아니라 각 레이어의 강점 조합
- DB: 인덱스 기반 범위 조회에 강함
- 애플리케이션: 복잡한 수학 연산(Math 라이브러리)에 강함
- 하이브리드로 양쪽 단점 제거

criteria 우선순위:
c01 DB CPU 부하      → DB 계산의 핵심 단점
c02 네트워크 전송량  → Java 계산의 핵심 단점
c04 인덱스 활용      → 하이브리드 결정의 근거
c03 삼각함수 정밀도  → 실제 차이 미미하여 보조 판단
-->
