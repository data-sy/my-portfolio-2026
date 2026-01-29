# Troubleshooting B: 비교분석형

## Template
핵심 질문 → 비교 관점들 → 결론 → 인사이트

## Case: DI 비교 분석
| key | value |
|---|---|
| title | 객체지향 vs 프로토콜 지향 DI 비교 — Java와 Swift의 접근 방식 |
| question | 객체지향(Java)과 프로토콜 지향(Swift)에서 DI 접근 방식은 어떻게 다른가? |
| compare_aspect_1 | 추상화 |
| compare_aspect_2 | DI 방식 |
| compare_aspect_3 | 의존성 관리 |
| compare_aspect_4 | 타입체크 |
| compare_aspect_5 | null |
| compare_a_name | Java (Spring) |
| compare_a_1 | Interface |
| compare_a_2 | @Autowired 자동 |
| compare_a_3 | Spring Container 자동관리 |
| compare_a_4 | 런타임 |
| compare_a_5 | null |
| compare_b_name | Swift |
| compare_b_1 | Protocol |
| compare_b_2 | init() 수동 주입 |
| compare_b_3 | 직접 구성 (DIContainer) |
| compare_b_4 | 컴파일 타임 |
| compare_b_5 | null |
| final_result | DI의 핵심은 "구현체가 아닌 추상화에 의존" — 언어와 프레임워크가 달라도 원칙은 동일 |
| insight | Spring 없이 DI를 직접 구현해보니, 프레임워크가 숨기고 있던 의존성 관리의 본질을 이해하게 됨. 어떤 언어에서도 클린 아키텍처 설계 가능 |
