# Troubleshooting B: 비교분석형

## Java vs Swift 언어 철학 비교
| key | value |
|---|---|
| title | Java vs Swift 언어 철학 비교 |
| context | 언어마다 안전성을 보장하는 시점이 다른 이유는? |
| target_a | ☕ Java (Spring) |
| target_b | 🍎 Swift (SwiftUI) |
| criteria_1 | Null 안전성 |
| cri_1_a | 약함 (모든 참조 타입 null 허용) |
| cri_1_b | 강함 (Optional 타입 시스템 강제) |
| criteria_2 | 메모리 관리 |
| cri_2_a | GC (런타임 자동 수집) |
| cri_2_b | ARC (컴파일 타임 카운팅) |
| criteria_3 | 타입 시스템 |
| cri_3_a | Reference Type 중심 |
| cri_3_b | Value Type (struct) 중심 |
| criteria_4 | 설계 패러다임 |
| cri_4_a | OOP (상속 기반) |
| cri_4_b | POP (Protocol 기반) |
| result | Java는 서버 생태계를, Swift는 모바일 환경을 배경으로 탄생 |
| result_desc | Java는 런타임 유연성을, Swift는 컴파일 타임 확정성을 우선시 |
| insight_1 | Swift의 컴파일 타임 강제를 경험하니, Java로 돌아와서도 Optional과 @NonNull을 적극 활용하게 됨 |

<!--
insight_1 방향: 컴파일 타임 vs 런타임 안전성 체감
insight_1 예상 꼬리질문: 

Q: Swift에서 Optional을 어떻게 처리했나?
A: guard let으로 early return 패턴 (조건 실패 시 빠른 종료), if let으로 안전한 바인딩, Optional Chaining(?.)으로 연속 접근, Nil Coalescing(??)으로 기본값 제공. QuickLabel에서 저장된 타이머 데이터 불러올 때 `savedTimer?.duration ?? 60` 같은 패턴 사용

Q: Java Optional을 실제로 어떻게 활용했나?
A: MMT 프로젝트에서 사용자 검색 기능을 Optional<User>로 반환하도록 설계. 호출부에서 map/flatMap 체이닝으로 null 체크 분기 제거. `userRepo.findById(id).map(User::getName).orElse("Unknown")` 패턴. orElseThrow()로 명시적 예외 처리도 활용

Q: @NonNull 어노테이션은 어떻게 쓰나?
A: Lombok의 @NonNull과 함께 사용하면 메서드 시작 부분에 null 체크 코드가 자동 생성됨. IDE 경고도 받을 수 있어서 컴파일 전에 문제 발견 가능. 다만 어노테이션이라 완벽한 강제는 아님 (Swift와 차이)

Q: 왜 Java는 모든 타입을 Optional로 안 만들었을까?
A: Java는 1995년 탄생 당시 null 안전성 개념이 희미했고, 이미 방대한 레거시 코드가 존재해서 모든 타입을 바꾸면 하위 호환성이 깨짐. Optional은 Java 8(2014)에 추가됐지만 기존 타입 시스템은 유지. Kotlin이 나중에 언어 레벨에서 이 문제 해결

Q: Value Type과 Reference Type 차이는? (criteria_3으로 자연스럽게 연결)
A: QuickLabel에서 타이머 설정을 struct로 관리했는데, 복사되니까 여러 곳에서 수정해도 서로 영향이 없어서 안전했습니다. Java는 기본적으로 Reference Type이라 같은 객체를 여러 곳에서 참조하면 의도치 않은 변경이 발생할 수 있어서, 이 경험 후 Java에서도 불변 객체(final 필드, 방어적 복사)를 더 신경쓰게 됐습니다

Q: 두 언어 경험이 실제 코드 작성에 어떤 영향을 줬나?
A: Swift의 컴파일 타임 강제를 경험하니, Java로 돌아와서도 "컴파일러가 잡을 수 있는 건 컴파일 타임에"라는 원칙을 적용하게 됐습니다. 예를 들어 null 체크를 런타임 방어 코드 대신 Optional로, 타입 캐스팅 대신 제네릭으로 처리. 반대로 Java의 유연성을 경험하니 Swift에서 불필요한 타입 제약을 줄이는 법도 배웠습니다

TOP4에서 밀려난 비교 관점들:

1. DI 패턴
- Java: @Autowired로 프레임워크가 자동 주입 (리플렉션 기반)
- Swift: init()으로 수동 주입 (생성자 기반)
- 밀려난 이유: 이건 언어 차이가 아니라 프레임워크(Spring) 유무의 차이. 언어 본질 비교에서 제외
- 면접 대비: "DI 패턴 자체는 동일하지만 구현 방식이 다릅니다. Spring은 런타임 리플렉션으로 의존성 해결, Swift는 컴파일 타임에 타입 확정. Swift에서 수동 DI를 구현해보니 IoC Container가 내부적으로 하는 일(빈 생성, 의존성 그래프 관리, 생명주기 관리)을 구체적으로 이해하게 됐습니다"

2. 에러 처리
- Java: Checked/Unchecked Exception, try-catch (RuntimeException으로 우회 가능)
- Swift: do-try-catch, throws 선언 강제 (우회 불가능, try! 사용 시 크래시)
- 밀려난 이유: Null 안전성과 겹치는 면이 있음 (둘 다 "컴파일러 강제 수준"의 스펙트럼)
- 면접 대비: "에러 처리도 안전성 보장 시점의 연장선입니다. Swift는 throws를 함수 시그니처에 명시해야 하고 호출부에서 반드시 try를 써야 합니다. Java의 Checked Exception과 비슷한 철학이지만, Java는 RuntimeException으로 우회 가능한 반면 Swift는 우회 자체가 불가능해서 더 강제적입니다"

3. 비동기 처리
- Java: CompletableFuture, @Async 어노테이션, Virtual Thread (Java 21+)
- Swift: async/await (언어 레벨 지원), Actor 모델
- 밀려난 이유: Java의 비동기는 주로 라이브러리 레벨, Swift는 언어 레벨이라 직접 비교 어려움
- 면접 대비: "Swift의 async/await는 언어에 내장되어 있어 컴파일러가 문맥 전환을 관리합니다. Java는 CompletableFuture로 수동 체이닝하거나, 최신 버전에서는 Virtual Thread로 경량 스레드 기반 동시성을 처리합니다. 둘 다 비동기지만 Swift는 컴파일러 지원, Java는 런타임 라이브러리라는 차이가 있습니다"
-->

<!--
## 비교 분석 맥락 (면접 대비용)

왜 이 비교를 했나:
- 백엔드(Java Spring) 개발 후 iOS(Swift SwiftUI) 앱 개발 경험
- 같은 문제를 다른 시점(컴파일 vs 런타임)에서 해결하는 차이 체감
- 언어 전환이 단순 문법 학습이 아니라 "언제 안전성을 보장하는가"의 패러다임 전환

두 언어의 탄생 배경과 철학:

**Java (1995 - 서버 생태계 목표)**
- 목표: "Write Once, Run Anywhere" (플랫폼 독립성)
- 환경: 기업용 서버 애플리케이션 (항상 켜져 있음, GC pause 감수 가능)
- 철학: 개발자 편의성 > 성능 예측성, 런타임 유연성으로 프레임워크 생태계 지원
- 설계 결정:
  - GC: 개발자가 메모리 걱정 안 해도 됨, 서버는 pause 감수 가능
  - null 허용: 1990년대엔 "null 안전성" 개념 자체가 희미, 런타임 유연성 우선
  - Reference Type: 객체지향의 정석 (Smalltalk 영향), 객체 공유로 효율성
  - OOP: 당시 주류 패러다임, 상속 기반 재사용

**Swift (2014 - 모바일 성능 목표)**
- 목표: Objective-C의 문제 해결 (런타임 에러, 메모리 관리 복잡성)
- 환경: 모바일 (배터리 제약, 메모리 제약, 60fps 필수, 앱 크래시 용납 불가)
- 철학: 컴파일 타임 안전성 > 개발자 편의성, 성능 예측 가능성
- 설계 결정:
  - Optional 강제: 앱 크래시 원천 차단 (Haskell의 Maybe 타입 영향)
  - ARC: GC pause 없이 성능 예측 가능, 컴파일 타임에 retain/release 삽입
  - Value Type: 멀티코어 시대, 공유 상태 문제 원천 차단, 함수형 패러다임
  - POP: 상속의 문제점 인식 (Fragile Base Class Problem, Composition over Inheritance)

**일관된 흐름:**
- Java: 런타임 유연성 우선 → 모든 설계 결정이 이를 지원 (null 허용, GC, Reference Type)
- Swift: 컴파일 안전성 우선 → 모든 설계 결정이 이를 지원 (Optional 강제, ARC, Value Type)

비교 관점 선정 이유:
1. Null 안전성: 가장 체감 큰 차이, 일상적 코딩 패턴에 직접 영향
2. 메모리 관리: 성능과 직결, GC pause vs 예측 가능한 해제 시점
3. 타입 시스템: 동시성 안전성의 근본 차이 (공유 상태 vs 복사)
4. 설계 패러다임: 코드 재사용 방식의 철학적 차이 (상속 vs 조합)

결론 도출 과정:
- Java의 강점: 런타임 유연성, 풍부한 생태계, 프레임워크 편의성
- Swift의 강점: 컴파일 타임 안전성, 메모리 예측 가능성, 타입 안전성
- 공통점: "안전한 코드"라는 목표는 동일, 보장 시점만 다름
- 핵심: 탄생 배경(서버 vs 모바일)이 설계 철학을 결정 → 안전성 보장 시점이 달라짐

인사이트 연결:
언어마다 안전성을 보장하는 **시점**이 다름 (컴파일 vs 런타임).
Swift의 컴파일 타임 강제를 경험하니, Java의 런타임 유연성이 왜 필요한지 이해됨.
역으로 Java의 NPE 고통을 겪으니, Swift의 Optional 강제가 왜 존재하는지 납득.
**환경이 다르면 최적해도 달라진다**는 걸 깨달음 (서버는 pause 감수 vs 모바일은 60fps 필수).
새로운 언어를 배울 때도 "이 언어는 어떤 환경을 타겟으로 하고, 언제 무엇을 강제하나?"라는 관점으로 접근.

## 실제 삽질 에피소드

Optional 삽질 (insight_1 배경):
- Java에서 user.getName()이 NPE로 터지는 걸 당연하게 여김
- Swift로 넘어가서 user.name 접근 시 빨간 줄 (컴파일 에러) 발생
- "왜 이렇게 번거롭게 만들었지?"라고 생각하며 강제 언래핑(!) 남발
- QuickLabel 앱 실행 중 특정 기능 터치 → 💥 크래시
- 디버깅 로그 보니 "Fatal error: Unexpectedly found nil" → "아, 이게 NPE구나"
- guard let / if let 패턴, Optional Chaining에 익숙해지니 런타임 에러 거의 사라짐
- Java로 돌아와서 "컴파일러가 강제하지 않으니 내가 강제해야겠다"는 마인드 전환
- Optional.ofNullable(), map/flatMap, orElseThrow(), @NonNull 적극 활용 시작
- 결과: MMT 프로젝트에서 NPE 발생률 크게 감소, 방어 코드 대신 타입으로 표현

Value Type 삽질:
- Java 습관대로 struct를 class처럼 사용 (메서드에서 상태 변경 후 반환)
- struct는 복사되니까 변경사항이 원본에 반영 안 됨 → "왜 안 바뀌지?"
- mutating func 키워드를 알게 되고, "언제 복사되는가"를 이해
- QuickLabel에서 타이머 설정(TimerConfig struct)을 여러 뷰에서 수정했는데 서로 영향 없음 체감
- "아, 이래서 멀티스레드에서 안전하구나" 깨달음 (공유 상태 문제 원천 차단)
- Java로 돌아와서 "왜 Java는 모든 게 Reference일까?" 고민
- 불변 객체의 가치를 재발견: final 필드, 방어적 복사, Record 타입 (Java 14+)
- 결과: 동시성 버그 감소, 상태 관리 복잡도 감소

메모리 관리 삽질:
- Java GC가 알아서 해주니까 신경 안 씀
- Swift에서 강한 참조 순환(strong reference cycle) 때문에 메모리 릭 발생
- QuickLabel에서 ViewController와 Timer 간 순환 참조로 화면 닫아도 타이머 계속 돌아감
- 앱 메모리 사용량이 계속 증가 → Instruments로 확인하니 ViewController가 해제 안 됨
- weak/unowned 키워드로 해결: `timer = Timer.scheduledTimer { [weak self] in ... }`
- 참조 관계 설계의 중요성 깨달음 (누가 누구를 소유하는가)
- Java로 돌아와서도 순환 참조 패턴을 의식적으로 피하게 됨
- 특히 리스너, 콜백 등록 시 약한 참조 고려 (WeakReference 활용)
-->
