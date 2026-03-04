# Troubleshooting D: 트레이드오프형

## 위치 기반 거리 계산의 처리 위치 결정: DB vs 애플리케이션
| key | value |
|---|---|
| title | 위치 기반 거리 계산의 처리 위치 결정: DB vs 애플리케이션 |
| context | Haversine 공식으로 거리 계산 정확도를 확보한 뒤, 이를 실제 서비스에 적용하는 단계에서 처리 위치를 결정해야 함 |
| option_1_name | DB에서 Haversine 계산 |
| option_2_name | 애플리케이션(Java)에서 Haversine 계산 |
| c01_name | DB CPU 부하 |
| c01_opt1 | 모든 row에 삼각함수 연산 필요. DB CPU 부하 |
| c01_opt2 | DB는 단순 조회만 수행. 삼각함수 연산은 Java에서 처리 |
| c02_name | 네트워크 전송량 |
| c02_opt1 | 필요한 결과만 반환. 전송량 최소화 |
| c02_opt2 | 전체 데이터를 DB에서 애플리케이션으로 전송. 네트워크·메모리 부담 |
| c03_name | 삼각함수 정밀도 |
| c03_opt1 | DB 내장 수학 함수 사용 |
| c03_opt2 | Java Math 라이브러리의 정밀한 삼각함수 활용 |
| c04_name | 인덱스 활용 |
| c04_opt1 | WHERE절에 함수 사용 시 인덱스 활용 불가 |
| c04_opt2 | DB는 BETWEEN으로 인덱스 활용 가능. 함수 연산은 Java에서 분리 |
| decision | 하이브리드: DB에서 BETWEEN으로 1차 필터링 + Java에서 Haversine으로 2차 필터링 |
| decision_reason | BETWEEN의 사각형이 Haversine의 원을 포함하므로 1차 필터링에서 누락 없음. DB는 인덱스 활용 가능한 단순 범위 조회만 수행하고, 삼각함수 연산은 축소된 후보군에 대해서만 Java에서 실행. 정확도 손해 없이 양쪽의 단점을 제거 |
| final_result | DB 부하 최소화 + 네트워크 전송량 축소 + 거리 정확도 유지 |
| insight_1 | 의사결정 시 선택지의 장단점을 구조적으로 비교하는 습관을 갖게 됐다 |
| insight_2 | 어디까지 DB에서 처리하고 어디서부터 애플리케이션에서 처리할지, 역할 분담이라는 관점을 갖게 됐다 |
| followup_q1 | Spatial 기능을 쓰면 하이브리드보다 나은가? |
| followup_q2 | |

<!--
c01~c04 우선순위 순서 (포트폴리오 게재용):
  핵심 판단: c01 DB CPU 부하, c02 네트워크 전송량
  보조 판단: c03 삼각함수 정밀도, c04 인덱스 활용

  스토리 흐름:
  c01~c02에서 양쪽의 핵심 트레이드오프 파악 (DB 부하 vs 네트워크 전송량)
  → c03에서 정밀도 차이 확인
  → c04에서 인덱스 활용 가능성 발견 → 하이브리드 결론의 근거

insight_1 방향: 첫 프로젝트에서의 의사결정 경험
insight_1 예상 꼬리질문: 다른 프로젝트에서도 이런 비교를 한 경험이 있나?

insight_2 방향: DB vs 애플리케이션 역할 분담
insight_2 예상 꼬리질문: 어떤 기준으로 DB에서 할지 Java에서 할지 결정하나?

followup_a1: MySQL Spatial 기능(데이터 타입 + 함수 + 인덱스)을 쓰면 DB 레벨에서 ST_Distance_Sphere + 공간 인덱스 기반 필터링이 가능하므로, 하이브리드보다 구현이 단순하고 성능도 우수할 수 있음. 당시에는 Spatial 기능을 인지하지 못했고, 하이브리드 방식으로 충분한 결과를 확보함. 지금 다시 한다면 Spatial 기능을 우선 검토할 것.
-->


<!--
## 의사결정 맥락 (면접 대비용)

상황: Haversine 공식 도입으로 정확도는 확보. 이제 실제 서비스에 적용해야 함.
문제: Haversine 계산을 어디서 할 것인가?

선택지 분석:

Option A: DB에서 계산
SELECT * FROM places
WHERE haversine(my_lat, my_lon, lat, lon) <= 1000;
→ 장점: 결과만 전송되므로 네트워크 효율적
→ 단점: WHERE절에 함수가 있으면 인덱스 사용 불가 (Full Table Scan)
→ 모든 row에 sin, cos, atan2 연산 → DB CPU 부하

Option B: Java에서 계산
SELECT * FROM places; -- 전체 조회
→ Java에서 for문 돌면서 haversine 계산 후 필터링
→ 장점: DB 부하 없음
→ 단점: 전체 데이터 전송 → 네트워크·메모리 낭비

하이브리드 결정:
SELECT * FROM places
WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?;
→ DB: 인덱스 활용 가능한 BETWEEN으로 사각형 범위 1차 필터링
→ Java: 축소된 후보군에 대해 Haversine 2차 필터링
→ 사각형 ⊃ 원이므로 누락 없음

핵심 판단:
"어디서 계산할까"의 정답은 한쪽이 아니라 각 레이어의 강점을 조합하는 것.
DB는 인덱스 기반 범위 조회에 강하고, 애플리케이션은 복잡한 수학 연산에 강함.
-->
