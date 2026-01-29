# Troubleshooting A: 문제해결형

## Template
문제 상황 → 시도 과정 → 최종 결과 → 인사이트

## Case: DB 인덱스 최적화
| key | value |
|---|---|
| title | DB 인덱스 최적화를 통한 상품 목록 조회 성능 93% 개선 |
| problem | Full Table Scan으로 상품 목록 조회 응답시간 2.5초 |
| try_1_title | 단일 인덱스 (category) |
| try_1_desc | category 단일 컬럼 인덱스 생성 |
| try_1_result | 2.5초 → 1.8초 (28%↓) |
| try_1_limit | 여전히 filesort 발생 |
| try_2_title | 단일 인덱스 (created_at) |
| try_2_desc | created_at 단일 컬럼 인덱스 생성 |
| try_2_result | 2.1초 (16%↓) |
| try_2_limit | filesort 제거, category 필터링 비효율 |
| try_3_title | 복합 인덱스 |
| try_3_desc | (category, created_at DESC) 복합 인덱스 적용 |
| try_3_result | 180ms (93%↓) ✓ |
| try_3_limit | 조회 패턴 전체 커버 |
| final_result | 2.5s → 180ms (93%↓) |
| insight | 인덱스는 WHERE 조건 + 정렬/페이징 패턴까지 포함한 설계 문제이며, 단일 인덱스로는 복합 조건을 효율적으로 처리할 수 없음 |
