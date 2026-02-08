# Troubleshooting B: 비교분석형

## Java vs Swift 언어 철학 비교 — 객체지향 vs 프로토콜 지향
| key | value |
|---|---|
| title | Java vs Swift 언어 철학 비교 — 객체지향 vs 프로토콜 지향 |
| context | 객체지향(Java)과 프로토콜 지향(Swift)에서 핵심 설계 철학은 어떻게 다른가? |
| target_a | Java (Spring) |
| target_b | Swift (SwiftUI) |
| criteria_1 | Null 안전성 |
| cri_1_a | @Nullable / Optional (선택적) |
| cri_1_b | Optional 타입 시스템 내장 (컴파일 강제) |
| criteria_2 | 추상화 방식 |
| cri_2_a | Interface (단일 상속 + 인터페이스) |
| cri_2_b | Protocol (프로토콜 확장 + 다중 채택) |
| criteria_3 | DI 패턴 |
| cri_3_a | @Autowired 자동 주입 (Spring Container) |
| cri_3_b | init() 수동 주입 (직접 구성) |
| criteria_4 | 타입 체크 |
| cri_4_a | 런타임 (리플렉션 기반) |
| cri_4_b | 컴파일 타임 (제네릭 + 프로토콜) |
| criteria_5 | null |
| cri_5_a | null |
| cri_5_b | null |
| result | 언어와 프레임워크가 달라도 "추상화에 의존, 구현체에 비의존"이라는 원칙은 동일. 표현 방식만 다를 뿐 설계 사고는 전이 가능 |
| result_desc | 같은 원칙을 다른 방식으로 표현 |
| insight_1 | Java의 Optional은 "쓸 수도 있는" 도구지만, Swift의 Optional은 "반드시 처리해야 하는" 타입. 언어가 안전성을 어느 수준에서 강제하는지에 따라 코드 작성 패턴이 달라짐 |
| insight_2 | Spring 없이 DI를 직접 구현해보니, 프레임워크가 숨기고 있던 의존성 관리의 본질을 이해하게 됨. 원리를 이해한 뒤에는 어떤 언어/프레임워크에서도 적용 가능 |
| followup_q1 | Swift의 Protocol과 Java의 Interface는 어떤 차이가 있나? |
| followup_q2 | 두 언어 경험이 실제 개발에서 어떤 이점을 주었나? |

<!--
insight_1 방향: 언어 레벨 안전성 강제의 차이
insight_1 예상 꼬리질문: Java에서 Optional을 왜 안 쓰는 경우가 많나? / Swift에서 Optional Chaining은 어떻게 동작하나? / Kotlin의 Null Safety와 비교하면?

insight_2 방향: 프레임워크 의존 vs 원리 이해
insight_2 예상 꼬리질문: Swift에서 DI Container를 어떻게 직접 구현했나? / Spring의 @Autowired가 내부적으로 하는 일은? / 프레임워크 없이 DI하면 어떤 점이 불편한가?

followup_a1: Protocol은 기본 구현(default implementation)을 extension으로 제공 가능. Java Interface는 default method로 유사하게 가능하나, Protocol은 값 타입(struct)에도 적용 가능하여 더 유연. Protocol은 associated type으로 제네릭 추상화도 지원.
followup_a2: Java의 객체지향 사고로 Swift의 구조를 빠르게 파악. Swift의 컴파일 타임 안전성 경험 후 Java에서도 Optional과 불변 객체를 더 적극적으로 활용. 새로운 언어를 배울 때 "이 언어는 이 문제를 어떻게 해결하지?"라는 관점으로 접근하는 습관 형성.

TOP4에서 밀려난 비교 관점 — 에러 처리:
- Java: Checked/Unchecked Exception (RuntimeException 상속 여부로 구분)
- Swift: do-try-catch (모든 에러 명시적 처리, throws 선언 강제)
- 빠진 이유: QuickLabel 1장 분량에는 4개 관점이 한계. 에러 처리는 Null 안전성과 겹치는 면이 있음 (둘 다 "컴파일러가 얼마나 강제하느냐"의 스펙트럼)
- 면접에서 나오면: "에러 처리도 비교해봤는데, Swift는 throws를 함수 시그니처에 명시해야 하고 호출부에서 반드시 try를 써야 해서 Java의 Checked Exception과 비슷한 철학이지만, Java는 RuntimeException으로 우회 가능한 반면 Swift는 우회 자체가 불가능합니다"
-->


<!--
## 비교 분석 맥락 (면접 대비용)

왜 이 비교를 했나:
- Java(Spring) 백엔드 개발 후 Swift(SwiftUI) iOS 앱 개발 경험
- 같은 문제(Null 처리, 추상화, DI)를 두 언어가 전혀 다르게 접근
- 언어 전환 시 혼란이 아닌 인사이트를 얻음

비교 관점 선정 이유:
- Null 안전성: 가장 체감이 큰 차이, 코드 작성 패턴 변화
- 추상화 방식: 설계의 근본 차이
- DI 패턴: 프레임워크 의존 vs 직접 구현의 대비
- 타입 체크: 런타임 vs 컴파일 타임의 안전성 차이
- (에러 처리: TOP4에서 탈락 → 첫 번째 주석 블록에 대비용 답변 정리)

결론 도출 과정:
- Java의 강점: 풍부한 생태계, 프레임워크 자동화
- Swift의 강점: 컴파일 타임 안전성, 명시적 처리 강제
- 공통점: 추상화 원칙은 동일, 표현 방식만 다름

인사이트 연결:
"언어를 바꾸면 처음부터 다시 배워야 한다"가 아니라,
"같은 원칙을 다른 방식으로 표현하는 것"임을 체험.
이 경험이 새로운 기술 학습에 대한 자신감으로 이어짐.

## 실제 삽질 에피소드

Optional 삽질:
- Java 습관대로 Optional을 if (value != null) 패턴으로 처리하려 했으나, Swift 컴파일러가 Optional 바인딩(guard let / if let)을 강제해서 코드가 컴파일되지 않음
- 처음에는 "왜 이렇게 번거롭게 하지?"라고 느꼈으나, 강제 언래핑(!)으로 우회하다가 런타임 크래시 경험
- 이후 Swift의 Optional Chaining과 guard let 패턴에 익숙해지면서, 오히려 Java에서도 Optional.orElseThrow()를 더 적극적으로 쓰게 됨

DI 삽질:
- @Autowired 습관대로 "어딘가에서 알아서 주입해주겠지"라고 생각했는데, Swift에서는 init()에 직접 넣어줘야 해서 의존성 그래프를 머릿속으로 그리게 됨
- 이 경험이 Spring으로 돌아왔을 때 "컨테이너가 대신 해주는 일"을 구체적으로 이해하는 계기가 됨
-->
