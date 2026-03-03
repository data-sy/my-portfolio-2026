# Troubleshooting A: 문제해결형

## No Offset 방식으로 대용량 페이징 성능 개선
| key | value |
|---|---|
| title | No Offset 방식으로 대용량 페이징 성능 개선 |
| problem | 대용량 페이징 조회 시 OFFSET 값이 커질수록 응답시간 급증 |
| try_1_title | 기본 OFFSET 페이징 + 인덱스 |
| try_1_desc | ORDER BY 컬럼에 인덱스 추가한 기본 OFFSET/LIMIT 방식 |
| try_1_result | 초반 페이지 빠르나 후반 페이지 성능 저하 |
| try_1_limit | OFFSET 50000이면 50000건을 읽고 버림 — 페이지가 깊어질수록 비효율 |
| try_2_title | 커버링 인덱스 |
| try_2_desc | SELECT에 필요한 컬럼만 인덱스에 포함, 테이블 접근 최소화 |
| try_2_result | OFFSET 비용 감소 |
| try_2_limit | 여전히 OFFSET만큼 스캔 필요, 근본 해결 아님 |
| try_3_title | No Offset (커서 기반 페이징) |
| try_3_desc | WHERE id < :lastId ORDER BY id DESC LIMIT 20 — 이전 페이지 마지막 ID 기준 조회 |
| try_3_result | 페이지 위치 무관하게 일정 속도 유지 ✓ |
| try_3_limit | 특정 페이지 번호로 직접 이동 불가 (무한스크롤 등에 적합) |
| final_result | 응답시간 ?ms → ?ms (?%↓) |
| insight_1 | OFFSET 페이징의 문제는 "읽고 버리는" 구조. 페이지 번호가 아니라 마지막 위치 기준으로 조회하면 항상 인덱스 범위 스캔만 수행하여 일정 성능 유지 |
| insight_2 | No Offset은 UX 제약이 있음. 특정 페이지 점프가 필요한 관리자 화면에는 부적합. 사용자 목록(무한스크롤)과 관리자 화면(페이지 번호)의 페이징 전략을 분리하는 것이 현실적 |
| followup_q1 | 커서 기반 페이징에서 정렬 기준이 고유하지 않으면 어떻게 하나? |
| followup_q2 | OFFSET 방식을 완전히 대체할 수 없는 상황은? |

<!-- TODO: 성능 측정 후 final_result 수치 업데이트 -->

<!--
insight_1 방향: OFFSET의 내부 동작 이해, 커서 방식의 원리
insight_1 예상 꼬리질문: OFFSET이 왜 느린지 실행계획으로 설명? / B-Tree 인덱스에서 OFFSET은 어떻게 동작하나? / No Offset이 항상 빠른 이유는?

insight_2 방향: UX 제약 인식, 전략 분리 판단
insight_2 예상 꼬리질문: 무한스크롤 외에 No Offset이 적합한 UI는? / 관리자 화면에서 OFFSET 성능을 개선하는 방법은? / 두 전략을 혼용한 사례는?

followup_a1: created_at처럼 중복 가능한 컬럼이면 (created_at, id) 복합 조건 사용. WHERE (created_at, id) < (:lastDate, :lastId) 형태로 고유성 보장.
followup_a2: 관리자 화면에서 특정 페이지로 점프해야 하는 경우, 검색 조건으로 범위를 좁힌 후 OFFSET 사용. 또는 전체 건수가 제한적인 경우 OFFSET도 허용 가능.
-->


<!--
## 문제 해결 맥락 (면접 대비용)

상황: 상품 목록 페이징 조회
SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 50000;
→ 50000건을 읽고 버린 뒤 20건만 반환

시도 1: 인덱스 추가
- 왜? created_at 인덱스로 정렬 비용 제거
- 한계: 정렬은 빨라졌으나 OFFSET 스캔 비용은 동일

시도 2: 커버링 인덱스
- 왜? 테이블 랜덤 I/O를 줄여 OFFSET 스캔 비용 감소
- 한계: 여전히 OFFSET만큼 인덱스를 순회해야 함

시도 3: No Offset
- 왜? OFFSET 자체를 제거하여 항상 인덱스 범위 스캔만 수행
- 핵심: WHERE id < :lastId로 시작점을 직접 지정

인사이트 연결:
OFFSET은 "앞에서 N번째부터"를 의미하므로 항상 처음부터 세야 함.
커서 방식은 "이 지점 다음부터"를 의미하므로 시작점이 명확.
데이터가 많아질수록 이 차이는 극적으로 벌어짐.
-->
