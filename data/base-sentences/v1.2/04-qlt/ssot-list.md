# QuickLabelTimer SSOT (Single Source of Truth) 패턴 분석

> 프로젝트 전반에서 발견된 단일 진실 공급원 패턴과 일관성 유지 설계 정리

---

## 1. Repository 계층 — 데이터 중앙 관리

### 1-1. TimerRepository (실행 중인 타이머의 SSOT)

- **파일 경로:** `QuickLabelTimer/Repositories/TimerRepository.swift`
- **패턴 설명:** 모든 실행 중인 타이머 데이터를 `@Published var timers`로 단일 관리. UserDefaults 키 `"running_timers"` 하나에 저장. CRUD 메서드를 통해서만 데이터 변경 가능하며, `timersPublisher`로 구독자에게 변경 사항을 일괄 전파.
- **코드 예시:**
  ```swift
  @MainActor
  protocol TimerRepositoryProtocol {
      var timersPublisher: Published<[TimerData]>.Publisher { get }
      func addTimer(_ timer: TimerData)
      func updateTimer(_ timer: TimerData)
      @discardableResult func removeTimer(byId id: UUID) -> TimerData?
  }
  ```
- **트러블슈팅 활용:** **B** — 타이머 데이터가 꼬이거나 동기화 안 될 때, 이 Repository가 유일한 데이터 소스임을 확인하는 것이 디버깅 출발점

### 1-2. PresetRepository (즐겨찾기 프리셋의 SSOT)

- **파일 경로:** `QuickLabelTimer/Repositories/PresetRepository.swift`
- **패턴 설명:** 모든 프리셋 데이터를 `@Published var userPresets`로 단일 관리. `isHiddenInList` 소프트 삭제 패턴으로 복원 가능. `visiblePresetsCount` 계산 프로퍼티로 일관된 개수 계산 보장.
- **코드 예시:**
  ```swift
  var visiblePresetsCount: Int {
      userPresets.filter { !$0.isHiddenInList }.count
  }
  ```
- **트러블슈팅 활용:** **B** — 프리셋이 사라지거나 개수가 안 맞을 때 이 Repository의 `userPresets` 배열 확인이 핵심

---

## 2. Service 계층 — 비즈니스 로직 단일 경로

### 2-1. TimerService (타이머 조작의 SSOT)

- **파일 경로:** `QuickLabelTimer/Services/TimerService.swift`
- **패턴 설명:** 모든 타이머 생명주기(추가/일시정지/재개/중지/재시작/삭제)를 이 서비스를 통해서만 수행. 1Hz tick 루프, 알림 스케줄링, Scene phase 복원도 모두 여기서 관리. View/ViewModel에서 직접 데이터 수정 금지.
- **코드 예시:**
  ```swift
  // ViewModel에서
  timerService.pauseTimer(id: timer.id)  // O
  timer.status = .paused                  // X (직접 수정 금지)
  ```
- **트러블슈팅 활용:** **B, D** — 타이머 상태 전환 버그 시 Service 메서드 흐름 추적. 백그라운드 복귀 시 타이머 동기화 문제도 여기서 확인

### 2-2. TimerCompletionHandler (완료 처리의 SSOT)

- **파일 경로:** `QuickLabelTimer/Services/TimerCompletionHandler.swift`
- **패턴 설명:** 타이머 완료 후 처리를 `(presetId, endAction)` 조합에 따라 4가지 시나리오로 단일 관리. 10초 카운트다운, 프리셋 저장/숨기기 등 모든 완료 로직이 한 곳에 집중.
- **코드 예시:**
  ```swift
  switch (latestTimer.presetId, latestTimer.endAction) {
  case (.none, .preserve):     // 즉석 타이머 + 저장
  case (.none, .discard):      // 즉석 타이머 + 폐기
  case (.some(_), .preserve):  // 프리셋 타이머 + 저장
  case (.some(_), .discard):   // 프리셋 타이머 + 폐기
  }
  ```
- **트러블슈팅 활용:** **D** — 타이머 완료 후 프리셋이 저장 안 되거나 삭제 안 될 때 이 핸들러의 분기 확인

---

## 3. 설정 중앙 관리

### 3-1. AppConfig (상수값의 SSOT)

- **파일 경로:** `QuickLabelTimer/Configuration/AppConfig.swift`
- **패턴 설명:** 앱 전체에서 사용하는 모든 수치 상수를 한 곳에서 관리. 하드코딩 대신 `AppConfig.maxConcurrentTimers` 같이 참조하여 일관성 보장.
- **코드 예시:**
  ```swift
  enum AppConfig {
      static let maxConcurrentTimers = 6
      static let maxFavoritesPresets = 20
      static let maxLabelLength = 100
      static let deleteCountdownSeconds = 30
      static let repeatingNotificationCount = 10
      static let notificationRepeatingInterval: TimeInterval = 3.0
      static let notificationSystemLimit = 64
  }
  ```
- **트러블슈팅 활용:** **E** — 최대 타이머 개수, 알림 한도 등 정책 관련 문제 시 이 파일만 확인

---

## 4. 상태 머신 — UI 상태의 단일 변환

### 4-1. TimerInteractionState + TimerData Extension

- **파일 경로:**
  - `QuickLabelTimer/Models/Interaction/TimerInteractionState.swift`
  - `QuickLabelTimer/Views/Components/TimerRow/Interaction/TimerData+InteractionState.swift`
- **패턴 설명:** 내부 `TimerData.status`를 UI용 `TimerInteractionState`로 변환하는 계산 프로퍼티가 단일 존재. 여러 View에서 중복 변환 로직 없이 이 프로퍼티만 참조.
- **코드 예시:**
  ```swift
  extension TimerData {
      var interactionState: TimerInteractionState {
          switch status {
          case .running:   return .running
          case .paused:    return .paused
          case .stopped:   return .stopped
          case .completed: return .completed
          }
      }
  }
  ```
- **트러블슈팅 활용:** **D** — 버튼 상태가 잘못 표시될 때 이 변환 로직과 `makeButtonSet()` 매핑 확인

### 4-2. TimerButtonMapping (버튼 매핑의 SSOT)

- **파일 경로:** `QuickLabelTimer/Views/Components/TimerRow/Interaction/TimerButtonMapping.swift`
- **패턴 설명:** `makeButtonSet(for:endAction:)` 함수가 InteractionState → 좌/우 버튼 조합을 단일 결정. 모든 View가 이 함수 결과만 사용.
- **코드 예시:**
  ```swift
  func makeButtonSet(for state: TimerInteractionState, endAction: TimerEndAction) -> TimerButtonSet {
      // state별 좌/우 버튼 조합 결정
  }
  ```
- **트러블슈팅 활용:** **D** — 특정 상태에서 잘못된 버튼이 보일 때 이 매핑 테이블 확인

---

## 5. 알림 관리 — 단일 스케줄링/취소

### 5-1. NotificationUtils (알림 작업의 SSOT)

- **파일 경로:** `QuickLabelTimer/Notifications/NotificationUtils.swift`
- **패턴 설명:** 알림 스케줄링, 취소, 사운드 생성을 모두 static 메서드로 중앙 관리. ID 형식 `"{timerId}_{index}"` 강제. prefix 기반 일괄 취소로 누락 방지.
- **코드 예시:**
  ```swift
  static func cancelNotifications(withPrefix prefix: String, completion: (() -> Void)? = nil) {
      let group = DispatchGroup()
      group.enter()
      cancelPending(withPrefix: prefix) { group.leave() }
      group.enter()
      cancelDelivered(withPrefix: prefix) { group.leave() }
      group.notify(queue: .main) { completion?() }
  }
  ```
- **트러블슈팅 활용:** **B, E** — 알림이 안 울리거나 취소 안 될 때 이 유틸의 스케줄링/취소 로직 확인

### 5-2. LocalNotificationDelegate (포그라운드 알림의 SSOT)

- **파일 경로:** `QuickLabelTimer/Notifications/LocalNotificationDelegate.swift`
- **패턴 설명:** 앱이 포그라운드일 때 알림 표시 규칙을 단일 관리. 첫 번째 알림(index == 0)만 표시하고 나머지는 억제.
- **코드 예시:**
  ```swift
  func userNotificationCenter(...willPresent notification:...) {
      let index = extractIndex(from: identifier, userInfo: content.userInfo)
      guard index == 0 else {
          completionHandler([])  // 첫 번째 외 억제
          return
      }
      completionHandler([.banner, .list, .sound])
  }
  ```
- **트러블슈팅 활용:** **B** — 포그라운드에서 알림이 안 보이거나 중복 표시될 때 이 델리게이트 확인

---

## 6. 공유 유틸리티 — 중복 방지 모듈

### 6-1. LabelSanitizer (텍스트 정제의 SSOT)

- **파일 경로:** `QuickLabelTimer/Utils/LabelSanitizer.swift`
- **패턴 설명:** 레이블 입력 정제(줄바꿈 제거, 공백 정리, 길이 제한)를 단일 함수로 관리. 타이머 생성 시 `AddTimerViewModel.startTimer()`에서 호출.
- **코드 예시:**
  ```swift
  enum LabelSanitizer {
      static func sanitizeOnSubmit(_ input: String, maxLength: Int) -> String {
          var result = input
              .replacingOccurrences(of: #"\s*\n+\s*"#, with: " ", options: .regularExpression)
              .trimmingCharacters(in: .whitespacesAndNewlines)
          if result.count > maxLength { result = String(result.prefix(maxLength)) }
          return result
      }
  }
  ```
- **트러블슈팅 활용:** **E** — 레이블에 이상한 문자가 들어가거나 잘리는 문제 시 이 정제 로직 확인

### 6-2. Logger+Extension (로깅의 SSOT)

- **파일 경로:** `QuickLabelTimer/Utils/Logger+Extension.swift`
- **패턴 설명:** `Bundle.main.bundleIdentifier` 기반 subsystem을 한 번만 정의. 모든 로거가 `Logger.withCategory(_:)`로 생성되어 일관된 subsystem 보장.
- **코드 예시:**
  ```swift
  extension Logger {
      private static var subsystem = Bundle.main.bundleIdentifier!
      static func withCategory(_ category: String) -> Logger {
          return Logger(subsystem: subsystem, category: category)
      }
  }
  ```
- **트러블슈팅 활용:** **B** — 로그 필터링 시 subsystem이 일관되어 Console.app에서 효율적 디버깅 가능

### 6-3. Accessibility+Helpers (접근성 문자열의 SSOT)

- **파일 경로:** `QuickLabelTimer/Utils/Accessibility+Helpers.swift`
- **패턴 설명:** 모든 접근성 레이블/힌트를 `enum A11yText` 하위 네임스페이스로 중앙 관리. View에서 직접 문자열 작성 대신 `A11yText.TimerRow.startLabel` 같이 참조.
- **코드 예시:**
  ```swift
  enum A11yText {
      enum TimerRow {
          static func runningLabel(label: String, time: String) -> String {
              return String(format: String(localized: "%@, 남은 시간 %@"), label, time)
          }
      }
  }
  ```
- **트러블슈팅 활용:** **E** — VoiceOver 문제 시 이 파일에서 접근성 문자열 일괄 확인

### 6-4. TimeUtils (시간 포맷의 SSOT)

- **파일 경로:** `QuickLabelTimer/Utils/TimeUtils.swift`
- **패턴 설명:** `TimeFormatter.formatRemaining()`과 `formatEndTime()` 등 시간 포맷팅을 단일 함수로 관리. 여러 View에서 동일 포맷 보장.
- **트러블슈팅 활용:** **E** — 시간 표시 형식이 잘못될 때 이 포매터 확인

---

## 7. 알람 정책 — 단일 결정 로직

### 7-1. AlarmNotificationPolicy (사운드/진동 정책의 SSOT)

- **파일 경로:** `QuickLabelTimer/Models/AlarmNotificationPolicy.swift`
- **패턴 설명:** `(soundOn, vibrationOn)` 불리언 조합을 `.soundAndVibration`, `.vibrationOnly`, `.silent` 세 가지 정책으로 단일 변환. 양방향 변환(`asBools`) 지원.
- **코드 예시:**
  ```swift
  static func determine(soundOn: Bool, vibrationOn: Bool) -> AlarmNotificationPolicy {
      if soundOn { return .soundAndVibration }
      else { return vibrationOn ? .vibrationOnly : .silent }
  }
  ```
- **트러블슈팅 활용:** **D** — 알람 모드가 예상과 다를 때 이 결정 로직 확인

---

## 8. 데이터 모델 — 불변성과 마이그레이션

### 8-1. TimerData (타이머 상태 모델의 SSOT)

- **파일 경로:** `QuickLabelTimer/Models/TimerData.swift`
- **패턴 설명:** `formattedTime`, `totalSeconds`, `interactionState` 등 파생 값을 계산 프로퍼티로 단일 정의. `updating()` 메서드로 불변 업데이트 패턴 적용.
- **코드 예시:**
  ```swift
  var totalSeconds: Int { hours * 3600 + minutes * 60 + seconds }

  func updating(status: TimerStatus? = nil, remainingSeconds: Int? = nil) -> TimerData {
      // 새 인스턴스 반환 (직접 변경 X)
  }
  ```
- **트러블슈팅 활용:** **B, D** — 시간 계산 오류나 상태 불일치 시 이 모델의 계산 프로퍼티와 updating() 흐름 확인

### 8-2. TimerPreset (프리셋 마이그레이션의 SSOT)

- **파일 경로:** `QuickLabelTimer/Models/TimerPreset.swift`
- **패턴 설명:** `init(from decoder:)`에서 새 프로퍼티에 대한 마이그레이션을 기본값과 함께 단일 처리. 기존 데이터와의 호환성 보장.
- **코드 예시:**
  ```swift
  init(from decoder: Decoder) throws {
      lastUsedAt = try container.decodeIfPresent(Date.self, forKey: .lastUsedAt) ?? createdAt
  }
  ```
- **트러블슈팅 활용:** **B** — 앱 업데이트 후 데이터가 깨지는 문제 시 마이그레이션 로직 확인

---

## 9. 의존성 주입 — 단일 인스턴스 생성점

### 9-1. QuickLabelTimerApp (앱 전체 DI의 SSOT)

- **파일 경로:** `QuickLabelTimer/QuickLabelTimerApp.swift`
- **패턴 설명:** Repository, Service, ViewModel 인스턴스를 앱 진입점(`init()`)에서 단 한 번만 생성. `@StateObject`로 보유하고 `.environmentObject()`로 하위 View에 전파. 중복 인스턴스 생성 방지.
- **코드 예시:**
  ```swift
  init() {
      let timerRepo = TimerRepository()
      let presetRepo = PresetRepository()
      let timerService = TimerService(timerRepository: timerRepo, presetRepository: presetRepo)
      _timerRepository = StateObject(wrappedValue: timerRepo)
      _timerService = StateObject(wrappedValue: timerService)
  }
  ```
- **트러블슈팅 활용:** **B, D** — 데이터 불일치 문제 시 인스턴스가 하나만 존재하는지 확인

---

## 10. ViewModel — Combine 구독으로 반응형 연결

### 10-1. RunningTimersViewModel

- **파일 경로:** `QuickLabelTimer/ViewModels/RunningTimersViewModel.swift`
- **패턴 설명:** `timerRepository.timersPublisher`를 구독하여 정렬된 타이머 목록을 `@Published` 프로퍼티에 자동 반영. Repository가 변경되면 View가 자동 업데이트.
- **코드 예시:**
  ```swift
  timerRepository.timersPublisher
      .map { timers in timers.sorted { $0.createdAt > $1.createdAt } }
      .assign(to: \.sortedTimers, on: self)
      .store(in: &cancellables)
  ```
- **트러블슈팅 활용:** **D** — UI에 타이머가 안 보이거나 순서가 틀릴 때 구독 체인 확인

### 10-2. FavoriteTimersViewModel

- **파일 경로:** `QuickLabelTimer/ViewModels/FavoriteTimersViewModel.swift`
- **패턴 설명:** 두 Repository(Preset + Timer)를 동시 구독. `visiblePresets`와 `runningPresetIds`를 각각 단일 Publisher에서 파생하여 일관성 유지.
- **트러블슈팅 활용:** **D** — 즐겨찾기 목록과 실행 상태가 불일치할 때 두 Publisher 구독 확인

---

## 11. 프로토콜 추상화 — 테스트 가능성과 느슨한 결합

### 11-1. 주요 프로토콜 목록

- **파일 경로:** 각 Repository/Service 파일 상단
- **패턴 설명:** `TimerRepositoryProtocol`, `PresetRepositoryProtocol`, `TimerServiceProtocol` 등 주요 컴포넌트가 프로토콜 기반. ViewModel은 구체 클래스가 아닌 프로토콜에 의존하여 Mock 테스트 가능.
- **코드 예시:**
  ```swift
  // ViewModel은 프로토콜에 의존
  init(timerService: any TimerServiceProtocol,
       timerRepository: TimerRepositoryProtocol) { ... }
  ```
- **트러블슈팅 활용:** **D, E** — 테스트에서 Mock 객체 주입으로 특정 시나리오 재현 가능

---

## 12. 로컬라이제이션 — 문자열의 SSOT

### 12-1. Localizable.xcstrings

- **파일 경로:** `QuickLabelTimer/Localizable.xcstrings`
- **패턴 설명:** 모든 사용자 대면 문자열을 단일 파일에서 관리 (en/ko). 키 네이밍 규칙 `{category}.{screen}.{element}` 적용. Swift 코드에 하드코딩된 문자열 없음.
- **트러블슈팅 활용:** **E** — 번역 누락이나 잘못된 텍스트 표시 시 이 파일에서 키 검색

---

## 요약: SSOT 패턴 전체 맵

| 카테고리 | SSOT 소스 | 관리 대상 | 트러블슈팅 유형 |
|---------|----------|----------|--------------|
| 데이터 저장 | TimerRepository | 실행 중인 타이머 | B |
| 데이터 저장 | PresetRepository | 즐겨찾기 프리셋 | B |
| 비즈니스 로직 | TimerService | 타이머 생명주기 전체 | B, D |
| 완료 처리 | TimerCompletionHandler | 완료 후 시나리오 4가지 | D |
| 설정값 | AppConfig | 모든 수치 상수 | E |
| UI 상태 | TimerInteractionState | 상태 → 버튼 매핑 | D |
| 알림 | NotificationUtils | 스케줄링/취소 | B, E |
| 알림 표시 | LocalNotificationDelegate | 포그라운드 표시 규칙 | B |
| 텍스트 정제 | LabelSanitizer | 레이블 입력 검증 | E |
| 로깅 | Logger+Extension | subsystem 일관성 | B |
| 접근성 | A11yText | 접근성 문자열 | E |
| 시간 포맷 | TimeUtils | 시간 표시 형식 | E |
| 알람 정책 | AlarmNotificationPolicy | 사운드/진동 결정 | D |
| 데이터 모델 | TimerData.updating() | 불변 업데이트 | B, D |
| 마이그레이션 | TimerPreset init(from:) | 이전 데이터 호환 | B |
| 의존성 주입 | QuickLabelTimerApp | 인스턴스 단일 생성 | B, D |
| 반응형 연결 | ViewModel Combine 구독 | Repository → View 전파 | D |
| 프로토콜 | Protocol 추상화 | 느슨한 결합/테스트 | D, E |
| 문자열 | Localizable.xcstrings | 다국어 텍스트 | E |


## SSOT 설명 우선순위 TOP 5

| 순위 | 패턴 | 이유 |
|------|------|------|
| 1 | **3. TimerService** | SSOT의 핵심 "데이터 수정 경로 단일화"를 가장 잘 보여줌. 부수효과(알림) 관리까지 포함되어 실무적 깊이 있음. 백엔드 면접에서 Service 계층 질문과 연결 가능 |
| 2 | **15. TimerData** | 불변 업데이트 패턴 + 파생값 계산 프로퍼티. "왜 이렇게 설계했나" 설명하기 좋음. Java의 Record, Kotlin의 data class와 연결 가능 |
| 3 | **4. TimerCompletionHandler** | 2×2 매트릭스(프리셋/즉석 × 저장/폐기)로 분기 관리. 복잡한 케이스를 구조화한 사례. 비즈니스 로직 정리 능력 어필 |
| 4 | **17. QuickLabelTimerApp (DI)** | 의존성 주입의 단일 생성점. Java Spring과 비교 설명 가능. 근데 이미 insight_1 (DI 비교)에서 다룸 |
| 5 | **6. TimerInteractionState** | 상태 머신 중간 계층. 근데 DDD 트러블슈팅에서 다룰 예정이라 중복 |

**결론:**

- **1순위 TimerService** - 가장 SSOT답고, 다른 곳에서 안 다룸
- 2순위 TimerData도 좋지만 DDD에서 언급될 수 있음
- 4, 5순위는 이미 다른 트러블슈팅에서 다뤄질 예정

---

**문서 버전:** 1.0
**분석 기준:** 2026-01-30
**분석 대상:** QuickLabelTimer 전체 소스코드
