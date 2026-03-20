# 📝 code.js v2.1 패치 가이드

> 기존 code.js (v1.1)를 v2.1 스펙에 맞게 수정하기 위한 가이드

---

## 📋 수정 목록 요약

| # | 함수/위치 | 변경 내용 |
|---|----------|----------|
| 1 | `createText()` | lineHeight 자동 설정 (fontSize × 1.5) |
| 2 | `createContentsWatermark()` | 🆕 신규 함수 추가 |
| 3 | `createProjectMetaInfo()` | overview(프로젝트 개요) 파라미터 추가 |
| 4 | `createMockupPlaceholder()` | 높이 300px → 260px |
| 5 | `createAttemptCard()` | description 15px, status별 색상, 높이 AUTO |
| 6 | `createImprovementCard()` | resize 제거 (layoutGrow 사용) |
| 7 | `createInsightBox()` | width 파라미터 추가, 내용 15px |
| 8 | `createQuestionDerived()` | resize 제거 (layoutGrow 사용) |
| 9 | `createConclusionBox()` | 결과 숫자 32px → 28px |
| 10 | `createTemplateContents()` | 워터마크 스타일 헤더, 항목 간격 32px |
| 11 | `createTemplateCover()` | 프로필~자기소개 간격 32px → 40px |
| 12 | `createTemplateProjectIntroA()` | 정량적 성과 섹션, 한 일 15px |
| 13 | `createTemplateProjectIntroB()` | 한 일 15px |
| 14 | `createTemplateTroubleshootingB()` | 인사이트 박스 전체 너비 |
| 15 | `createTemplateTroubleshootingC()` | 파생질문/개선카드 layoutGrow |
| 16 | `PORTFOLIO_DATA` | overview, quantitativeResults 추가 |

---

## 1. createText() - lineHeight 자동 설정

**위치**: 라인 118-152

**수정 전**:
```javascript
function createText(options) {
  const {
    content = "",
    fontFamily = "Noto Sans KR",
    fontStyle = "Regular",
    fontSize = 14,
    color = COLORS.primary700,
    x = 0,
    y = 0,
    width = null,
    textAlignHorizontal = "LEFT",
    textAlignVertical = "TOP",
    lineHeight = null
  } = options;
```

**수정 후**:
```javascript
function createText(options) {
  const {
    content = "",
    fontFamily = "Noto Sans KR",
    fontStyle = "Regular",
    fontSize = 14,
    color = COLORS.primary700,
    x = 0,
    y = 0,
    width = null,
    textAlignHorizontal = "LEFT",
    textAlignVertical = "TOP",
    lineHeight = null,
    autoLineHeight = true  // v2.1: 자동 lineHeight 활성화
  } = options;
```

**그리고** 라인 148-150 부분 수정:

**수정 전**:
```javascript
  if (lineHeight) {
    text.lineHeight = { value: lineHeight, unit: "PIXELS" };
  }
```

**수정 후**:
```javascript
  // v2.1: lineHeight 처리
  if (lineHeight) {
    text.lineHeight = { value: lineHeight, unit: "PIXELS" };
  } else if (autoLineHeight && fontSize >= 14) {
    // 14px 이상에서 자동 lineHeight 적용
    text.lineHeight = { value: fontSize * 1.5, unit: "PIXELS" };
  }
```

---

## 2. createContentsWatermark() - 🆕 신규 함수

**위치**: createProjectWatermark() 함수 다음에 추가 (라인 258 이후)

```javascript
// ============================================================================
// 🧩 컴포넌트 2-1: Header/Contents Watermark (v2.1 신규)
// ============================================================================

function createContentsWatermark(asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Header/Contents Watermark";
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 60);
  frame.fills = [];
  
  const text = createText({
    content: "CONTENTS",
    fontFamily: "Merriweather",
    fontStyle: "Bold",
    fontSize: 48,
    color: COLORS.watermark,
    autoLineHeight: false
  });
  
  frame.appendChild(text);
  
  return frame;
}
```

---

## 3. createProjectMetaInfo() - overview 추가

**위치**: 라인 396-441

**수정 전**:
```javascript
function createProjectMetaInfo(data = {}, asComponent = false) {
  const {
    period = "2024.03 ~ 2024.12",
    role = "백엔드 개발",
    techStack = ["Java", "Spring Boot", "MySQL"]
  } = data;
```

**수정 후**:
```javascript
function createProjectMetaInfo(data = {}, asComponent = false) {
  const {
    period = "2024.03 ~ 2024.12",
    role = "백엔드 개발",
    techStack = ["Java", "Spring Boot", "MySQL"],
    overview = ""  // v2.1: 프로젝트 개요 추가
  } = data;
```

**그리고** 함수 끝부분 (라인 438 이전)에 추가:

```javascript
  // v2.1: 프로젝트 개요 섹션 추가
  if (overview) {
    const overviewDivider = createDivider(200);
    const overviewSection = createAutoLayoutFrame({
      name: "Overview Section",
      direction: "VERTICAL",
      itemSpacing: 8,
      primaryAxisSizing: "AUTO",
      counterAxisSizing: "AUTO"
    });
    
    const overviewHeader = createSectionHeader("프로젝트 개요", "📝");
    const overviewText = createText({
      content: overview,
      fontFamily: "Noto Sans KR",
      fontStyle: "Regular",
      fontSize: 15,
      color: COLORS.primary700,
      width: 200
    });
    
    overviewSection.appendChild(overviewHeader);
    overviewSection.appendChild(overviewText);
    
    frame.appendChild(overviewDivider);
    frame.appendChild(overviewSection);
  }
```

---

## 4. createMockupPlaceholder() - 높이 조정

**위치**: 라인 521

**수정 전**:
```javascript
frame.resize(CONFIG.CONTENT_WIDTH, 300);
```

**수정 후**:
```javascript
frame.resize(CONFIG.CONTENT_WIDTH, 260);  // v2.1: 300 → 260
```

---

## 5. createAttemptCard() - 여러 수정

**위치**: 라인 679-784

### 5-1. 높이 AUTO 설정 (라인 697-698)

**수정 전**:
```javascript
frame.counterAxisSizingMode = "AUTO";
frame.resize(CONFIG.CONTENT_WIDTH, 140);
```

**수정 후**:
```javascript
frame.counterAxisSizingMode = "AUTO";  // v2.1: AUTO로 변경
frame.resize(CONFIG.CONTENT_WIDTH, 100);  // v2.1: 최소 높이
```

### 5-2. description 폰트 크기 (라인 759-766)

**수정 전**:
```javascript
const descText = createText({
  content: description,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 14,
  color: COLORS.primary700,
  width: CONFIG.CONTENT_WIDTH - 60
});
```

**수정 후**:
```javascript
// v2.1: description 폰트 14px → 15px
const descText = createText({
  content: description,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 15,  // v2.1: 14 → 15
  color: COLORS.primary700,
  width: CONFIG.CONTENT_WIDTH - 60
});
```

### 5-3. status별 색상 분기 (라인 768-774)

**수정 전**:
```javascript
const resultText = createText({
  content: `→ 결과: ${result}`,
  fontFamily: "Noto Sans KR",
  fontStyle: "Medium",
  fontSize: 14,
  color: COLORS.accentGreen
});
```

**수정 후**:
```javascript
// v2.1: status에 따른 색상 분기
const resultColor = 
  status === "success" ? COLORS.accentGreen :
  status === "partial" ? COLORS.accentAmber :
  status === "failed"  ? COLORS.accentRed :
  COLORS.accentGreen;

const resultText = createText({
  content: `→ 결과: ${result}`,
  fontFamily: "Noto Sans KR",
  fontStyle: "Medium",
  fontSize: 14,
  color: resultColor,  // v2.1: status별 색상
  autoLineHeight: false
});
```

---

## 6. createImprovementCard() - layoutGrow 지원

**위치**: 라인 809

**수정 전**:
```javascript
frame.resize(220, 140);
```

**수정 후**:
```javascript
// v2.1: resize 제거 - layoutGrow로 균등 분배
// frame.resize(220, 140);  // 삭제
```

---

## 7. createInsightBox() - width 파라미터 + 내용 15px

**위치**: 라인 849-879

### 7-1. 함수 시그니처 변경

**수정 전**:
```javascript
function createInsightBox(content = "인사이트 내용을 입력하세요.", asComponent = false) {
```

**수정 후**:
```javascript
function createInsightBox(content = "인사이트 내용을 입력하세요.", width = null, asComponent = false) {
  const boxWidth = width || 470;  // v2.1: 파라미터로 동적 설정
```

### 7-2. resize 부분 (라인 860)

**수정 전**:
```javascript
frame.resize(470, 100);
```

**수정 후**:
```javascript
frame.resize(boxWidth, 100);  // v2.1: 동적 너비
```

### 7-3. 내용 텍스트 (라인 866-872)

**수정 전**:
```javascript
const contentText = createText({
  content: content,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 14,
  color: COLORS.primary700,
  width: 430
});
```

**수정 후**:
```javascript
// v2.1: 내용 폰트 14px → 15px
const contentText = createText({
  content: content,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 15,  // v2.1: 14 → 15
  color: COLORS.primary700,
  width: boxWidth - 40  // v2.1: 동적 너비
});
```

---

## 8. createQuestionDerived() - layoutGrow 지원

**위치**: 라인 937

**수정 전**:
```javascript
frame.resize(345, 80);
```

**수정 후**:
```javascript
frame.resize(100, 80);  // v2.1: 너비는 layoutGrow로, 높이만 고정
```

---

## 9. createConclusionBox() - 결과 숫자 크기

**위치**: 라인 1044-1049

**수정 전**:
```javascript
const contentText = createText({
  content: content,
  fontFamily: "Noto Sans KR",
  fontStyle: "Bold",
  fontSize: 32,
  color: COLORS.primary900
});
```

**수정 후**:
```javascript
// v2.1: 결과 숫자 32px → 28px
const contentText = createText({
  content: content,
  fontFamily: "Noto Sans KR",
  fontStyle: "Bold",
  fontSize: 28,  // v2.1: 32 → 28
  color: COLORS.primary900,
  autoLineHeight: false
});
```

---

## 10. createTemplateContents() - 워터마크 + 간격

**위치**: 라인 1367-1405

### 10-1. 항목 간격 (라인 1386)

**수정 전**:
```javascript
page.itemSpacing = 24;
```

**수정 후**:
```javascript
page.itemSpacing = 32;  // v2.1: 24 → 32
```

### 10-2. 헤더 변경 (라인 1388-1392)

**수정 전**:
```javascript
const header = createTocHeader();
const divider = createTocDivider();

page.appendChild(header);
page.appendChild(divider);
```

**수정 후**:
```javascript
// v2.1: 워터마크 스타일 헤더로 변경
const watermark = createContentsWatermark();
const divider = createTocDivider();

page.appendChild(watermark);
page.appendChild(divider);
```

---

## 11. createTemplateCover() - 간격 조정

**위치**: 라인 1342-1344

**수정 전**:
```javascript
const spacer3 = figma.createFrame();
spacer3.name = "Spacer";
spacer3.resize(CONFIG.CONTENT_WIDTH, 32);
```

**수정 후**:
```javascript
// v2.1: 프로필~자기소개 간격 32 → 40
const spacer3 = figma.createFrame();
spacer3.name = "Spacer";
spacer3.resize(CONFIG.CONTENT_WIDTH, 40);  // v2.1: 32 → 40
```

---

## 12. createTemplateProjectIntroA() - 정량적 성과 + 한 일 15px

**위치**: 라인 1411-1493

### 12-1. 파라미터 추가 (라인 1412-1427)

**수정 전**:
```javascript
const {
  projectName = "Traffic",
  version = "v1.0",
  metrics = [...],
  meta = {...},
  tasks = [...],
  insight = "..."
} = data;
```

**수정 후**:
```javascript
const {
  projectName = "Traffic",
  version = "v1.0",
  metrics = [...],
  meta = {...},
  tasks = [...],
  quantitativeResults = [],  // v2.1: 정량적 성과 추가
  insight = "..."
} = data;
```

### 12-2. 한 일 폰트 크기 (라인 1468-1474)

**수정 전**:
```javascript
const taskText = createText({
  content: `• ${task}`,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 14,
  color: COLORS.primary700
});
```

**수정 후**:
```javascript
// v2.1: 한 일 폰트 14px → 15px
const taskText = createText({
  content: `• ${task}`,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 15,  // v2.1: 14 → 15
  color: COLORS.primary700
});
```

### 12-3. 정량적 성과 섹션 추가 (tasksSection 뒤에)

```javascript
rightSection.appendChild(tasksSection);

// v2.1: 정량적 성과 섹션 추가
if (quantitativeResults && quantitativeResults.length > 0) {
  const resultsDivider = createDivider(470);
  rightSection.appendChild(resultsDivider);
  
  const resultsSection = createAutoLayoutFrame({
    name: "Quantitative Results Section",
    direction: "VERTICAL",
    itemSpacing: 8,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const resultsHeader = createSectionHeader("정량적 성과", "📊");
  resultsSection.appendChild(resultsHeader);
  
  quantitativeResults.forEach(result => {
    const resultText = createText({
      content: `• ${result}`,
      fontFamily: "Noto Sans KR",
      fontStyle: "Regular",
      fontSize: 15,
      color: COLORS.primary700
    });
    resultsSection.appendChild(resultText);
  });
  
  rightSection.appendChild(resultsSection);
}

const sectionDivider = createDivider(470);
const insightBox = createInsightBox(insight, 470);  // v2.1: 너비 명시
```

---

## 13. createTemplateProjectIntroB() - 한 일 15px

**위치**: 라인 1551-1559

**수정 전**:
```javascript
const taskText = createText({
  content: `• ${task}`,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 14,
  color: COLORS.primary700
});
```

**수정 후**:
```javascript
// v2.1: 한 일 폰트 14px → 15px
const taskText = createText({
  content: `• ${task}`,
  fontFamily: "Noto Sans KR",
  fontStyle: "Regular",
  fontSize: 15,  // v2.1: 14 → 15
  color: COLORS.primary700
});
```

그리고 insightBox 호출 부분:
```javascript
const insightBox = createInsightBox(insight, 470);  // v2.1: 너비 명시
```

---

## 14. createTemplateTroubleshootingB() - 인사이트 전체 너비

**위치**: 라인 1660-1662

**수정 전**:
```javascript
const insightBox = createInsightBox(insight);
```

**수정 후**:
```javascript
// v2.1: 인사이트 박스 전체 너비
const insightBox = createInsightBox(insight, CONFIG.CONTENT_WIDTH);
```

---

## 15. createTemplateTroubleshootingC() - layoutGrow

**위치**: 라인 1713-1716 (파생 질문) + 라인 1730-1734 (개선 카드)

### 15-1. 파생 질문 (라인 1713-1716)

**수정 전**:
```javascript
questions.forEach(q => {
  const questionBox = createQuestionDerived(q);
  questionsFrame.appendChild(questionBox);
});
```

**수정 후**:
```javascript
questions.forEach(q => {
  const questionBox = createQuestionDerived(q);
  questionBox.layoutGrow = 1;  // v2.1: 균등 분배
  questionsFrame.appendChild(questionBox);
});
```

### 15-2. 개선 카드 (라인 1730-1734)

**수정 전**:
```javascript
improvements.forEach(imp => {
  const card = createImprovementCard(imp);
  improvementsFrame.appendChild(card);
});
```

**수정 후**:
```javascript
improvements.forEach(imp => {
  const card = createImprovementCard(imp);
  card.layoutGrow = 1;  // v2.1: 균등 분배
  improvementsFrame.appendChild(card);
});
```

---

## 16. PORTFOLIO_DATA - overview, quantitativeResults 추가

각 프로젝트의 intro 섹션에 다음 필드 추가:

### project1 (Traffic)
```javascript
meta: {
  period: "2026.01 (3주)",
  role: "1인 개발",
  techStack: ["Java", "Spring Boot", "JPA", "MySQL", "Redis"],
  overview: "100만 회원 규모의 트래픽 환경을 가정해 성능 병목을 찾고 최적화한 프로젝트"  // v2.1
},
tasks: [...],
quantitativeResults: [  // v2.1
  "조회 성능: 2.5s → 180ms (93%↓)",
  "랭킹 조회: 200ms → 5ms (98%↓)",
  "N+1 해결: 21쿼리 → 1쿼리 (81%↓)"
],
```

### project2 (QuickLabel)
```javascript
meta: {
  period: "2025.07 ~ 09 (2개월)",
  role: "1인 개발",
  techStack: ["Swift", "SwiftUI"],
  overview: "iOS 앱스토어에 출시한 타이머 앱. 사용자 피드백을 반영해 지속적으로 개선 중"  // v2.1
},
// quantitativeResults는 Type B이므로 없음
```

### project3 (MMT)
```javascript
meta: {
  period: "2024.01 ~ 07 (6개월)",
  role: "1인 개발",
  techStack: ["Java", "Spring Boot", "JPA", "MySQL", "Neo4j", "Redis", "Docker"],
  overview: "틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스"  // v2.1
},
tasks: [...],
quantitativeResults: [  // v2.1
  "API 성능: 232ms → 50ms (78%↓)",
  "배포 시간: 25분 → 7분 (72%↓)",
  "쿼리 속도: 20ms → 2ms (90%↓)"
],
```

### project4 (Skeleton)
```javascript
meta: {
  period: "2021.10 ~ 11 (4주)",
  role: "BE 40%, 발표",
  techStack: ["Python", "Flask", "OpenCV", "MediaPipe"],
  overview: "영상에서 관절점을 추출해 운동 자세와 횟수를 분석하는 시스템"  // v2.1
},
tasks: [...],
quantitativeResults: [  // v2.1
  "개발 시간: 3일 → 0.5일 (83%↓)",
  "로직 구현 기여도: 75%",
  "해커톤 최우수상 (2등)"
],
```

### project5 (Plogging)
```javascript
meta: {
  period: "2021.07 ~ 08 (3주)",
  role: "BE 70%, FE 20%",
  techStack: ["Java", "JSP", "Oracle", "JavaScript", "Kakao Maps"],
  overview: "플로깅 활동을 공유하는 커뮤니티 웹 프로젝트"  // v2.1
},
tasks: [...],
quantitativeResults: [  // v2.1
  "오차율: 32% → 3.69% (88%↓)",
  "BE 구현 기여도: 50%",
  "핵심 로직 기여도: 70%"
],
```

---

## 17. main() 함수 - 페이지 이름 변경

**위치**: 라인 2046

**수정 전**:
```javascript
newPage.name = "📦 Portfolio Components & Templates v1.1";
```

**수정 후**:
```javascript
newPage.name = "📦 Portfolio Components & Templates v2.1";  // v2.1
```

---

## ✅ 체크리스트

- [ ] createText() - autoLineHeight 파라미터 추가
- [ ] createContentsWatermark() - 신규 함수 추가
- [ ] createProjectMetaInfo() - overview 파라미터 + 렌더링 추가
- [ ] createMockupPlaceholder() - 높이 260px
- [ ] createAttemptCard() - description 15px, status 색상, 높이 AUTO
- [ ] createImprovementCard() - resize 제거
- [ ] createInsightBox() - width 파라미터, 내용 15px
- [ ] createQuestionDerived() - resize 수정
- [ ] createConclusionBox() - 결과 숫자 28px
- [ ] createTemplateContents() - 워터마크 헤더, 간격 32px
- [ ] createTemplateCover() - 간격 40px
- [ ] createTemplateProjectIntroA() - 정량적 성과 섹션, 한 일 15px
- [ ] createTemplateProjectIntroB() - 한 일 15px, insightBox 너비
- [ ] createTemplateTroubleshootingB() - insightBox 전체 너비
- [ ] createTemplateTroubleshootingC() - layoutGrow 적용
- [ ] PORTFOLIO_DATA - overview, quantitativeResults 추가
- [ ] main() - 페이지 이름 v2.1
