# 프로젝트 2: 퀵라벨타이머

## 기본 정보
- 프로젝트 이름: 퀵라벨타이머
- 영문 이름: QuickLabelTimer
- 버전: v1.1.0
- 기간: 
  - v1.0.0: 2025.07 ~ 09 (2개월)
  - v1.1.0: 2025.12 (1주)
- 역할: 1인 개발 (기획, 디자인, 개발, 출시, 운영 전체)
- 기술 스택: Swift, SwiftUI

## 프로젝트 개요
- 서비스 설명: 시간을 빠르게 설정하고, '왜 맞췄는지'를 라벨로 기록할 수 있는 iOS 타이머 앱
- 개발 배경: 
  - v1.0.0: AI-Assisted Programming을 실제 서비스 개발에 적용하여 장단점을 파악하고, 앱스토어 출시 및 운영 경험을 통해 설계 능력과 문제 해결 능력 강화
  - v1.1.0: AI-Agent(Claude Code)를 활용한 개발 생산성 실험
- 주요 기능: 퀵 타이머 설정, 라벨 기록, 타이머 히스토리 관리

## 정량적 성과
- 성과 1: 앱스토어 출시 및 n명 다운로드
- 성과 2: 사용자 피드백 반영하여 v1.0.0 → v1.1.0 업데이트
- 성과 3: Java 백엔드 개발자로서 Swift/iOS 독학 후 2개월 만에 출시

## 인사이트
- 배운 점 1: DI는 프레임워크의 기능이 아니라 패턴이다 — Spring 없이 Swift에서 수동 DI를 구현하며 IoC의 본질을 이해
- 배운 점 2: 메모리 모델은 달라도 디버깅 방법론은 같다 — ARC의 순환 참조 문제를 해결하며 소유권 추적 기술 습득
- 배운 점 3: 값 타입 + 함수형 업데이트 패턴이 버그를 줄인다 — Swift Struct 경험을 Java에서도 적용 가능
- 배운 점 4: 언어는 문법일 뿐, 엔지니어링 원리는 전이된다

## 트러블슈팅 목록

### 트러블슈팅 1 (Type: B)
- 제목: 프로토콜 지향 의존성 주입 아키텍처 — Swift vs Java DI 비교
- 주제: Spring의 @Autowired 없이 Swift에서 DI를 어떻게 구현하는가?
- 핵심 차이점:
  - Swift: Protocol로 추상화, init()에서 수동 주입, DIContainer 직접 구성
  - Java: Interface로 추상화, @Autowired로 자동 주입, Spring IoC Container가 관리
- 비교 결과:
  | 관점 | Swift | Java (Spring) |
  |------|-------|---------------|
  | DI 방식 | 수동 생성자 주입 | @Autowired 자동 주입 |
  | 의존성 그래프 | 개발자가 직접 구성 | Spring Container가 관리 |
  | 타입 체크 | 컴파일 타임 | 런타임 |
  | 테스트 | Mock 객체 직접 주입 | @MockBean으로 교체 |
- 배운 점: DI의 핵심 원리는 언어와 무관하게 "구현체가 아닌 추상화에 의존"이라는 동일한 원칙. 프레임워크 없이도 클린 아키텍처 구현 가능

### 트러블슈팅 2 (Type: B)
- 제목: ARC vs GC — 메모리 관리 모델 비교와 순환 참조 해결
- 주제: Java에서는 신경 쓰지 않던 순환 참조가 Swift에서 왜 문제가 되는가?
- 핵심 차이점:
  - Java (GC): 도달 불가능한 객체를 자동 수집, 순환 참조도 GC가 처리
  - Swift (ARC): 참조 카운트 기반, 순환 참조를 감지 못함 → weak/unowned로 수동 해제 필요
- 문제 상황:
```swift
  // ❌ 순환 참조 발생
  timerRepository.timersPublisher
      .sink { self.timers = $0 }  // ViewModel → 클로저 → self → 💥
```
- 해결:
```swift
  // ✅ 해결책
  .sink { [weak self] in self?.timers = $0 }
```
- 비교 결과:
  | 관점 | Java (GC) | Swift (ARC) |
  |------|-----------|-------------|
  | 순환 참조 | GC가 자동 처리 | 수동으로 끊어야 함 |
  | 키워드 | 없음 | weak, unowned |
  | 리스너 해제 | 권장 | 필수 |
- 배운 점: 메모리 디버깅 방법론은 언어 간에 전이된다 — 할당 프로파일링, 소유권 추적, 유지 경로 식별

### 트러블슈팅 3 (Type: B)
- 제목: 값 타입 vs 참조 타입 — Swift Struct와 Java Class 비교
- 주제: Swift는 왜 Class 대신 Struct를 기본으로 사용하는가?
- 핵심 차이점:
  - Java: Class 기반 (참조 타입), 기존 객체를 직접 수정
  - Swift: Struct 기반 (값 타입), 새 인스턴스를 생성하는 함수형 업데이트 패턴
- 비교 결과:
  | 관점 | Java (Class) | Swift (Struct) |
  |------|--------------|----------------|
  | 타입 | 참조 타입 | 값 타입 |
  | 변경 | 기존 객체 수정 | 새 인스턴스 생성 |
  | 동등성 | equals() 구현 | 자동 (Equatable) |
- 구현 비교:
```java
  // Java: 기존 객체 수정
  timer.setStatus(TimerStatus.COMPLETED);
```
```swift
  // Swift: 새 인스턴스 반환
  let updated = timer.updating(status: .completed)
```
- 배운 점: 불변성은 버그를 줄인다 — Java에서도 Lombok @Builder(toBuilder=true)나 Java Records로 같은 패턴 적용 가능
