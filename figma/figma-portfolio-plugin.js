/**
 * ============================================================================
 * 📐 포트폴리오 Figma 플러그인 v1.1
 * ============================================================================
 * 
 * v1.1 변경사항:
 * - 폰트 사이즈 스펙 문서 기준으로 조정
 * - figma.createFrame() → figma.createComponent() 선택적 변환 (asComponent)
 * - 컴포넌트 30개 + 템플릿 7개 모두 페이지에 생성 (그룹핑)
 * - 텍스트 생성 순서 수정 (fontName → characters)
 * - 페이지 생성 비동기 처리 (figma.setCurrentPageAsync)
 * - counterAxisSizing: "FILL" → "AUTO" 수정
 * - 페이지 이름: "📦 Portfolio Components & Templates"
 * 
 * ============================================================================
 */

// ============================================================================
// 📐 기본 설정 & 컬러 시스템
// ============================================================================

const CONFIG = {
  PAGE_WIDTH: 794,
  PAGE_HEIGHT: 1123,
  MARGIN_HORIZONTAL: 40,
  MARGIN_VERTICAL: 48,
  CONTENT_WIDTH: 714,
  CONTENT_HEIGHT: 1027,
  SPACING: {
    SECTION: 24,
    SECTION_LARGE: 32,
    COMPONENT: 16,
    ELEMENT: 8,
    ELEMENT_LARGE: 12
  }
};

const COLORS = {
  primary900: { r: 0.102, g: 0.102, b: 0.180 },
  primary700: { r: 0.176, g: 0.176, b: 0.267 },
  primary400: { r: 0.420, g: 0.443, b: 0.502 },
  primary100: { r: 0.953, g: 0.957, b: 0.965 },
  watermark:  { r: 0.800, g: 0.816, b: 0.839 },
  accentBlue: { r: 0.231, g: 0.510, b: 0.965 },
  accentGreen:{ r: 0.063, g: 0.725, b: 0.506 },
  accentAmber:{ r: 0.961, g: 0.620, b: 0.043 },
  accentRed:  { r: 0.937, g: 0.267, b: 0.267 },
  divider:    { r: 0.898, g: 0.906, b: 0.922 },
  white:      { r: 1, g: 1, b: 1 }
};

const TECH_COLORS = {
  'Java': { r: 0.004, g: 0.451, b: 0.588 },
  'Spring': { r: 0.427, g: 0.702, b: 0.247 },
  'Spring Boot': { r: 0.427, g: 0.702, b: 0.247 },
  'Python': { r: 0.216, g: 0.463, b: 0.671 },
  'JavaScript': { r: 0.969, g: 0.875, b: 0.118 },
  'Swift': { r: 0.976, g: 0.322, b: 0.227 },
  'SwiftUI': { r: 0.976, g: 0.322, b: 0.227 },
  'Vue': { r: 0.255, g: 0.722, b: 0.514 },
  'MySQL': { r: 0.004, g: 0.451, b: 0.588 },
  'Redis': { r: 0.863, g: 0.227, b: 0.224 },
  'Docker': { r: 0.161, g: 0.627, b: 0.875 },
  'AWS': { r: 1, g: 0.600, b: 0.200 },
  'Neo4j': { r: 0.004, g: 0.569, b: 0.659 },
  'TensorFlow': { r: 1, g: 0.522, b: 0 },
  'FastAPI': { r: 0, g: 0.588, b: 0.533 },
  'JPA': { r: 0.357, g: 0.200, b: 0.090 },
  'default': { r: 0.420, g: 0.443, b: 0.502 }
};

// ============================================================================
// 🔧 유틸리티 함수
// ============================================================================

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

async function loadFonts() {
  const fonts = [
    { family: "Merriweather", style: "Bold" },
    { family: "Merriweather", style: "Regular" },
    { family: "Noto Sans KR", style: "Regular" },
    { family: "Noto Sans KR", style: "Medium" },
    { family: "Noto Sans KR", style: "Bold" }
  ];
  
  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
    } catch (e) {
      console.warn(`폰트 로드 실패: ${font.family} ${font.style}`);
      try {
        await figma.loadFontAsync({ family: "Inter", style: font.style === "Bold" ? "Bold" : "Regular" });
      } catch (e2) {
        console.warn(`폴백 폰트도 로드 실패`);
      }
    }
  }
}

/**
 * 프레임 또는 컴포넌트 생성 (asComponent 플래그로 구분)
 */
function createBaseFrame(asComponent = false) {
  return asComponent ? figma.createComponent() : figma.createFrame();
}

/**
 * 텍스트 노드 생성 헬퍼 (fontName 먼저 설정 후 characters)
 */
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
  
  const text = figma.createText();
  text.fontName = { family: fontFamily, style: fontStyle };
  text.characters = content;
  text.fontSize = fontSize;
  text.fills = [{ type: "SOLID", color }];
  text.x = x;
  text.y = y;
  text.textAlignHorizontal = textAlignHorizontal;
  text.textAlignVertical = textAlignVertical;
  
  if (width) {
    text.resize(width, text.height);
    text.textAutoResize = "HEIGHT";
  }
  
  if (lineHeight) {
    text.lineHeight = { value: lineHeight, unit: "PIXELS" };
  }
  
  return text;
}

/**
 * Auto Layout 프레임 생성 헬퍼
 */
function createAutoLayoutFrame(options) {
  const {
    name = "Frame",
    direction = "VERTICAL",
    padding = { top: 0, right: 0, bottom: 0, left: 0 },
    itemSpacing = 0,
    primaryAxisSizing = "AUTO",
    counterAxisSizing = "AUTO",
    width = null,
    height = null,
    fills = [],
    cornerRadius = 0,
    clipsContent = false
  } = options;
  
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.paddingTop = padding.top || padding.vertical || 0;
  frame.paddingBottom = padding.bottom || padding.vertical || 0;
  frame.paddingLeft = padding.left || padding.horizontal || 0;
  frame.paddingRight = padding.right || padding.horizontal || 0;
  frame.itemSpacing = itemSpacing;
  frame.primaryAxisSizingMode = primaryAxisSizing;
  frame.counterAxisSizingMode = counterAxisSizing === "FILL" ? "AUTO" : counterAxisSizing;
  frame.fills = fills;
  frame.cornerRadius = cornerRadius;
  frame.clipsContent = clipsContent;
  
  if (width !== null) frame.resize(width, frame.height);
  if (height !== null) frame.resize(frame.width, height);
  
  return frame;
}

function createDivider(width = CONFIG.CONTENT_WIDTH, color = COLORS.divider) {
  const line = figma.createLine();
  line.name = "Divider";
  line.resize(width, 0);
  line.strokes = [{ type: "SOLID", color }];
  line.strokeWeight = 1;
  return line;
}

// ============================================================================
// 🧩 컴포넌트 1: Layout/Content Frame
// ============================================================================

function createLayoutContentFrame(asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Layout/Content Frame";
  frame.resize(CONFIG.PAGE_WIDTH, CONFIG.PAGE_HEIGHT);
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.clipsContent = true;
  frame.layoutMode = "VERTICAL";
  frame.paddingTop = CONFIG.MARGIN_VERTICAL;
  frame.paddingBottom = CONFIG.MARGIN_VERTICAL;
  frame.paddingLeft = CONFIG.MARGIN_HORIZONTAL;
  frame.paddingRight = CONFIG.MARGIN_HORIZONTAL;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 2: Header/Project Watermark
// ============================================================================

function createProjectWatermark(projectName = "Project", version = "v1.0", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Header/Project Watermark";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 0;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 1);
  frame.primaryAxisAlignItems = "SPACE_BETWEEN";
  frame.fills = [];
  
  const nameText = createText({
    content: projectName,
    fontFamily: "Merriweather",
    fontStyle: "Bold",
    fontSize: 48,
    color: COLORS.watermark
  });
  
  const versionText = createText({
    content: version,
    fontFamily: "Merriweather",
    fontStyle: "Regular",
    fontSize: 18,
    color: COLORS.watermark
  });
  
  frame.appendChild(nameText);
  frame.appendChild(versionText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 3: Header/Troubleshooting Title
// ============================================================================

function createTroubleshootingTitle(title = "트러블슈팅 제목") {
  const text = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 24,
    color: COLORS.primary900,
    width: CONFIG.CONTENT_WIDTH
  });
  text.name = "Header/Troubleshooting Title";
  return text;
}

// ============================================================================
// 🧩 컴포넌트 4: Header/Section
// ============================================================================

function createSectionHeader(title = "섹션 제목", emoji = "📌", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Header/Section";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 8;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [];
  
  const emojiText = createText({
    content: emoji,
    fontSize: 16
  });
  
  const titleText = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  frame.appendChild(emojiText);
  frame.appendChild(titleText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 5: TOC/Project Item
// ============================================================================

function createTocProjectItem(number = "01", title = "프로젝트 제목", description = "프로젝트 설명", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "TOC/Project Item";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 16;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 1);
  frame.fills = [];
  
  const numberText = createText({
    content: number,
    fontFamily: "Merriweather",
    fontStyle: "Bold",
    fontSize: 24,
    color: COLORS.accentBlue
  });
  
  const contentFrame = createAutoLayoutFrame({
    name: "Content",
    direction: "VERTICAL",
    itemSpacing: 4,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  contentFrame.layoutGrow = 1;
  
  const titleText = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 18,
    color: COLORS.primary900
  });
  
  const descText = createText({
    content: description,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 14,
    color: COLORS.primary400,
    width: 600
  });
  
  contentFrame.appendChild(titleText);
  contentFrame.appendChild(descText);
  
  frame.appendChild(numberText);
  frame.appendChild(contentFrame);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 6: TOC/Header
// ============================================================================

function createTocHeader() {
  const text = createText({
    content: "CONTENTS",
    fontFamily: "Merriweather",
    fontStyle: "Bold",
    fontSize: 36,
    color: COLORS.primary900
  });
  text.name = "TOC/Header";
  return text;
}

// ============================================================================
// 🧩 컴포넌트 7: TOC/Divider
// ============================================================================

function createTocDivider() {
  const divider = createDivider(CONFIG.CONTENT_WIDTH, COLORS.divider);
  divider.name = "TOC/Divider";
  return divider;
}

// ============================================================================
// 🧩 컴포넌트 8: Project/Meta Info
// ============================================================================

function createProjectMetaInfo(data = {}, asComponent = false) {
  const {
    period = "2024.03 ~ 2024.12",
    role = "백엔드 개발",
    techStack = ["Java", "Spring Boot", "MySQL"]
  } = data;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Project/Meta Info";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 16;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(220, 1);
  frame.fills = [];
  
  const periodSection = createMetaSection("기간", period);
  const roleSection = createMetaSection("역할", role);
  
  const techSection = createAutoLayoutFrame({
    name: "Tech Stack Section",
    direction: "VERTICAL",
    itemSpacing: 8,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const techLabel = createText({
    content: "기술스택",
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 12,
    color: COLORS.primary400
  });
  
  const techGroup = createTechStackGroup(techStack);
  
  techSection.appendChild(techLabel);
  techSection.appendChild(techGroup);
  
  frame.appendChild(periodSection);
  frame.appendChild(roleSection);
  frame.appendChild(techSection);
  
  return frame;
}

function createMetaSection(label, value) {
  const frame = createAutoLayoutFrame({
    name: `Meta ${label}`,
    direction: "VERTICAL",
    itemSpacing: 4,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const labelText = createText({
    content: label,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 12,
    color: COLORS.primary400
  });
  
  const valueText = createText({
    content: value,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 15,
    color: COLORS.primary900
  });
  
  frame.appendChild(labelText);
  frame.appendChild(valueText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 9: Project/Metric Hero
// ============================================================================

function createMetricHero(metrics = [], asComponent = false) {
  const defaultMetrics = [
    { value: "85%↓", label: "응답시간" },
    { value: "3x↑", label: "처리량" },
    { value: "99.9%", label: "안정성" }
  ];
  
  const data = metrics.length > 0 ? metrics : defaultMetrics;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Project/Metric Hero";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 16;
  frame.paddingTop = 24;
  frame.paddingBottom = 24;
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 1);
  frame.fills = [{ type: "SOLID", color: COLORS.primary100 }];
  frame.cornerRadius = 12;
  frame.primaryAxisAlignItems = "SPACE_BETWEEN";
  
  data.forEach((metric, index) => {
    const card = createMetricCard(metric.value, metric.label, index === 0 ? COLORS.accentGreen : (index === 1 ? COLORS.accentBlue : COLORS.accentAmber));
    card.layoutGrow = 1;
    frame.appendChild(card);
  });
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 10: Project/Mockup Placeholder
// ============================================================================

function createMockupPlaceholder(label = "Mockup Placeholder", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Project/Mockup Placeholder";
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(CONFIG.CONTENT_WIDTH, 300);
  frame.fills = [{ type: "SOLID", color: COLORS.primary100 }];
  frame.cornerRadius = 12;
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  
  const text = createText({
    content: label,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 16,
    color: COLORS.primary400,
    textAlignHorizontal: "CENTER"
  });
  
  frame.appendChild(text);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 11: Tag/Tech Stack
// ============================================================================

function createTechStackTag(tech = "Spring Boot", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Tag/Tech Stack";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 8;
  frame.paddingTop = 6;
  frame.paddingBottom = 6;
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: "SOLID", color: COLORS.primary100 }];
  frame.cornerRadius = 6;
  
  const icon = figma.createRectangle();
  icon.name = "Icon";
  icon.resize(20, 20);
  icon.cornerRadius = 4;
  icon.fills = [{ type: "SOLID", color: TECH_COLORS[tech] || TECH_COLORS.default }];
  
  const text = createText({
    content: tech,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 14,
    color: COLORS.primary700
  });
  
  frame.appendChild(icon);
  frame.appendChild(text);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 12: Tag/Tech Stack Group
// ============================================================================

function createTechStackGroup(techList = ["Java", "Spring Boot", "MySQL"], asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Tag/Tech Stack Group";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 8;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.layoutWrap = "WRAP";
  frame.counterAxisSpacing = 8;
  frame.fills = [];
  
  techList.forEach(tech => {
    const tag = createTechStackTag(tech);
    frame.appendChild(tag);
  });
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 13: Card/Metric
// ============================================================================

function createMetricCard(value = "85%↓", label = "응답시간", color = COLORS.accentGreen, asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Card/Metric";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 8;
  frame.paddingTop = 24;
  frame.paddingBottom = 24;
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.cornerRadius = 12;
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  
  const valueText = createText({
    content: value,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 36,
    color: color,
    textAlignHorizontal: "CENTER"
  });
  
  const labelText = createText({
    content: label,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 14,
    color: COLORS.primary700,
    textAlignHorizontal: "CENTER"
  });
  
  frame.appendChild(valueText);
  frame.appendChild(labelText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 14: Card/Metric Group
// ============================================================================

function createMetricGroup(metrics = [], asComponent = false) {
  const defaultMetrics = [
    { value: "85%↓", label: "응답시간", color: COLORS.accentGreen },
    { value: "3x↑", label: "처리량", color: COLORS.accentBlue },
    { value: "99.9%", label: "안정성", color: COLORS.accentAmber }
  ];
  
  const data = metrics.length > 0 ? metrics : defaultMetrics;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Card/Metric Group";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 16;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [];
  
  data.forEach(metric => {
    const card = createMetricCard(metric.value, metric.label, metric.color);
    frame.appendChild(card);
  });
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 15: Card/Attempt Sequential
// ============================================================================

function createAttemptCard(data = {}, asComponent = false) {
  const {
    attemptNumber = 1,
    title = "쿼리 최적화",
    description = "N+1 문제 해결을 위해 fetch join 적용",
    result = "2.3s → 1.8s (22% 개선)",
    status = "partial"
  } = data;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Card/Attempt Sequential";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 0;
  frame.paddingTop = 20;
  frame.paddingBottom = 20;
  frame.paddingLeft = 0;
  frame.paddingRight = 20;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 140);
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.cornerRadius = 12;
  frame.strokes = [{ type: "SOLID", color: COLORS.divider }];
  frame.strokeWeight = 1;
  
  const accentBar = figma.createRectangle();
  accentBar.name = "Accent Bar";
  accentBar.resize(4, 140);
  accentBar.fills = [{ type: "SOLID", color: COLORS.accentBlue }];
  accentBar.topLeftRadius = 12;
  accentBar.bottomLeftRadius = 12;
  
  const contentFrame = createAutoLayoutFrame({
    name: "Content",
    direction: "VERTICAL",
    itemSpacing: 8,
    padding: { left: 16 },
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  contentFrame.layoutGrow = 1;
  
  const headerFrame = createAutoLayoutFrame({
    name: "Header",
    direction: "HORIZONTAL",
    itemSpacing: 8,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const badge = createAutoLayoutFrame({
    name: "Badge",
    direction: "HORIZONTAL",
    padding: { top: 2, bottom: 2, left: 8, right: 8 },
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO",
    fills: [{ type: "SOLID", color: COLORS.accentBlue }],
    cornerRadius: 4
  });
  
  const badgeText = createText({
    content: `시도 ${attemptNumber}`,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 12,
    color: COLORS.white
  });
  badge.appendChild(badgeText);
  
  const titleText = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  headerFrame.appendChild(badge);
  headerFrame.appendChild(titleText);
  
  const descText = createText({
    content: description,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 14,
    color: COLORS.primary700,
    width: CONFIG.CONTENT_WIDTH - 60
  });
  
  const resultText = createText({
    content: `→ 결과: ${result}`,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 14,
    color: COLORS.accentGreen
  });
  
  contentFrame.appendChild(headerFrame);
  contentFrame.appendChild(descText);
  contentFrame.appendChild(resultText);
  
  frame.appendChild(accentBar);
  frame.appendChild(contentFrame);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 16: Card/Improvement Independent
// ============================================================================

function createImprovementCard(data = {}, asComponent = false) {
  const {
    title = "캐싱 적용",
    description = "Redis 캐싱으로 반복 조회 최적화",
    improvement = "70%↓"
  } = data;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Card/Improvement Independent";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 12;
  frame.paddingTop = 20;
  frame.paddingBottom = 20;
  frame.paddingLeft = 20;
  frame.paddingRight = 20;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.cornerRadius = 12;
  frame.resize(220, 140);
  frame.strokes = [{ type: "SOLID", color: COLORS.divider }];
  frame.strokeWeight = 1;
  
  const titleText = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  const descText = createText({
    content: description,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 14,
    color: COLORS.primary400,
    width: 180
  });
  
  const improvementText = createText({
    content: improvement,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 24,
    color: COLORS.accentGreen
  });
  
  frame.appendChild(titleText);
  frame.appendChild(descText);
  frame.appendChild(improvementText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 17: Box/Insight
// ============================================================================

function createInsightBox(content = "인사이트 내용을 입력하세요.", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Box/Insight";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 8;
  frame.paddingTop = 16;
  frame.paddingBottom = 16;
  frame.paddingLeft = 20;
  frame.paddingRight = 20;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(470, 1);
  frame.fills = [{ type: "SOLID", color: hexToRgb("#EFF6FF") }];
  frame.cornerRadius = 8;
  
  const header = createSectionHeader("인사이트", "💡");
  
  const contentText = createText({
    content: content,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 14,
    color: COLORS.primary700,
    width: 430
  });
  
  frame.appendChild(header);
  frame.appendChild(contentText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 18: Box/Question Basic
// ============================================================================

function createQuestionBasic(question = "질문 내용", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Box/Question Basic";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 12;
  frame.paddingTop = 16;
  frame.paddingBottom = 16;
  frame.paddingLeft = 20;
  frame.paddingRight = 20;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 60);
  frame.fills = [{ type: "SOLID", color: COLORS.primary100 }];
  frame.cornerRadius = 8;
  frame.counterAxisAlignItems = "CENTER";
  
  const emoji = createText({
    content: "💭",
    fontSize: 20
  });
  
  const text = createText({
    content: `"${question}"`,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 16,
    color: COLORS.primary700
  });
  
  frame.appendChild(emoji);
  frame.appendChild(text);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 19: Box/Question Derived
// ============================================================================

function createQuestionDerived(question = "파생 질문", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Box/Question Derived";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 8;
  frame.paddingTop = 16;
  frame.paddingBottom = 16;
  frame.paddingLeft = 16;
  frame.paddingRight = 16;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.cornerRadius = 8;
  frame.resize(345, 80);
  frame.strokes = [{ type: "SOLID", color: COLORS.divider }];
  frame.strokeWeight = 1;
  frame.counterAxisAlignItems = "CENTER";
  frame.primaryAxisAlignItems = "CENTER";
  
  const labelText = createText({
    content: "❓",
    fontSize: 16
  });
  
  const text = createText({
    content: question,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900,
    textAlignHorizontal: "CENTER"
  });
  
  frame.appendChild(labelText);
  frame.appendChild(text);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 20: Box/Problem
// ============================================================================

function createProblemBox(content = "문제 상황을 설명합니다.", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Box/Problem";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 8;
  frame.paddingTop = 20;
  frame.paddingBottom = 20;
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 70);
  frame.fills = [{ type: "SOLID", color: hexToRgb("#FEF2F2") }];
  frame.cornerRadius = 12;
  
  const contentText = createText({
    content: content,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 15,
    color: COLORS.primary700,
    width: CONFIG.CONTENT_WIDTH - 48
  });
  
  frame.appendChild(contentText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 21: Box/Conclusion
// ============================================================================

function createConclusionBox(data = {}, asComponent = false) {
  const {
    title = "결과",
    content = "2.3s → 0.4s (85%↓)"
  } = data;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Box/Conclusion";
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 8;
  frame.paddingTop = 24;
  frame.paddingBottom = 24;
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 90);
  frame.fills = [{ type: "SOLID", color: hexToRgb("#ECFDF5") }];
  frame.cornerRadius = 12;
  
  const headerFrame = createAutoLayoutFrame({
    name: "Header",
    direction: "HORIZONTAL",
    itemSpacing: 8,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const emoji = createText({
    content: "✅",
    fontSize: 14
  });
  
  const titleText = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 14,
    color: COLORS.accentGreen
  });
  
  headerFrame.appendChild(emoji);
  headerFrame.appendChild(titleText);
  
  const contentText = createText({
    content: content,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 32,
    color: COLORS.primary900
  });
  
  frame.appendChild(headerFrame);
  frame.appendChild(contentText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 22: Table/Comparison
// ============================================================================

function createComparisonTable(data = {}, asComponent = false) {
  const {
    leftTitle = "☕ Java/Spring",
    rightTitle = "🍎 iOS/Swift",
    leftItems = ["synchronized", "ReentrantLock", "@Transactional"],
    rightItems = ["DispatchQueue", "Actor", "async/await"]
  } = data;
  
  const frame = createBaseFrame(asComponent);
  frame.name = "Table/Comparison";
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = 0;
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  frame.resize(CONFIG.CONTENT_WIDTH, 1);
  frame.fills = [{ type: "SOLID", color: COLORS.white }];
  frame.cornerRadius = 8;
  frame.strokes = [{ type: "SOLID", color: COLORS.divider }];
  frame.strokeWeight = 1;
  
  const leftColumn = createComparisonColumn(leftTitle, leftItems);
  const rightColumn = createComparisonColumn(rightTitle, rightItems);
  
  leftColumn.layoutGrow = 1;
  rightColumn.layoutGrow = 1;
  
  const divider = figma.createRectangle();
  divider.name = "Center Divider";
  divider.resize(1, 300);
  divider.fills = [{ type: "SOLID", color: COLORS.divider }];
  
  frame.appendChild(leftColumn);
  frame.appendChild(divider);
  frame.appendChild(rightColumn);
  
  return frame;
}

function createComparisonColumn(title, items) {
  const column = createAutoLayoutFrame({
    name: "Column",
    direction: "VERTICAL",
    itemSpacing: 12,
    padding: { top: 16, bottom: 16, left: 16, right: 16 },
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const titleText = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  column.appendChild(titleText);
  
  items.forEach(item => {
    const itemText = createText({
      content: `• ${item}`,
      fontFamily: "Noto Sans KR",
      fontStyle: "Regular",
      fontSize: 14,
      color: COLORS.primary700
    });
    column.appendChild(itemText);
  });
  
  return column;
}

// ============================================================================
// 🧩 컴포넌트 23: Utility/Flow Arrow
// ============================================================================

function createFlowArrow(asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Utility/Flow Arrow";
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(CONFIG.CONTENT_WIDTH, 40);
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  frame.fills = [];
  
  const arrow = createText({
    content: "↓",
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 20,
    color: COLORS.primary400,
    textAlignHorizontal: "CENTER"
  });
  
  frame.appendChild(arrow);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 24: Block/Code
// ============================================================================

function createCodeBlock(code = "SELECT * FROM users;", asComponent = false) {
  const frame = createBaseFrame(asComponent);
  frame.name = "Block/Code";
  frame.layoutMode = "VERTICAL";
  frame.paddingTop = 12;
  frame.paddingBottom = 12;
  frame.paddingLeft = 16;
  frame.paddingRight = 16;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(CONFIG.CONTENT_WIDTH, 1);
  frame.fills = [{ type: "SOLID", color: { r: 0.15, g: 0.15, b: 0.15 } }];
  frame.cornerRadius = 8;
  
  const codeText = createText({
    content: code,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 13,
    color: { r: 0.9, g: 0.9, b: 0.9 },
    width: CONFIG.CONTENT_WIDTH - 32
  });
  
  frame.appendChild(codeText);
  
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 25: Cover/Main Title
// ============================================================================

function createCoverMainTitle() {
  const text = createText({
    content: "Portfolio",
    fontFamily: "Merriweather",
    fontStyle: "Bold",
    fontSize: 56,
    color: COLORS.primary900,
    textAlignHorizontal: "CENTER"
  });
  text.name = "Cover/Main Title";
  return text;
}

// ============================================================================
// 🧩 컴포넌트 26: Cover/Version
// ============================================================================

function createCoverVersion(version = "v1.0.0") {
  const text = createText({
    content: version,
    fontFamily: "Merriweather",
    fontStyle: "Regular",
    fontSize: 16,
    color: COLORS.watermark,
    textAlignHorizontal: "CENTER"
  });
  text.name = "Cover/Version";
  return text;
}

// ============================================================================
// 🧩 컴포넌트 27: Cover/Name
// ============================================================================

function createCoverName(name = "이소연") {
  const text = createText({
    content: name,
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 36,
    color: COLORS.primary900,
    textAlignHorizontal: "CENTER"
  });
  text.name = "Cover/Name";
  return text;
}

// ============================================================================
// 🧩 컴포넌트 28: Cover/Job Title
// ============================================================================

function createCoverJobTitle(title = "Server Engineer") {
  const text = createText({
    content: title,
    fontFamily: "Noto Sans KR",
    fontStyle: "Medium",
    fontSize: 18,
    color: COLORS.accentBlue,
    textAlignHorizontal: "CENTER"
  });
  text.name = "Cover/Job Title";
  return text;
}

// ============================================================================
// 🧩 컴포넌트 29: Cover/Profile Image
// ============================================================================

function createCoverProfileImage() {
  const frame = figma.createEllipse();
  frame.name = "Cover/Profile Image";
  frame.resize(160, 160);
  frame.fills = [{ type: "SOLID", color: COLORS.primary100 }];
  frame.strokes = [{ type: "SOLID", color: COLORS.divider }];
  frame.strokeWeight = 1;
  return frame;
}

// ============================================================================
// 🧩 컴포넌트 30: Cover/Introduction
// ============================================================================

function createCoverIntroduction(text = "") {
  const defaultText = "안녕하세요. 개발자 이소연입니다.\n수학 강사로 일하며 느낀 문제를 직접 해결하다가 개발에 빠졌습니다.\n이후 개인 앱을 출시해 피드백으로 개선해온 경험이 있습니다.\n지금은 API 응답 속도를 추적하고 개선하는 성능 튜닝에 집중하고 있습니다.";
  
  const content = text || defaultText;
  
  const textNode = createText({
    content: content,
    fontFamily: "Noto Sans KR",
    fontStyle: "Regular",
    fontSize: 15,
    color: COLORS.primary700,
    textAlignHorizontal: "CENTER",
    width: CONFIG.CONTENT_WIDTH,
    lineHeight: 24
  });
  textNode.name = "Cover/Introduction";
  
  return textNode;
}

// ============================================================================
// 📑 템플릿 T1: Cover (표지)
// ============================================================================

function createTemplateCover(data = {}) {
  const {
    version = "v1.0.0",
    name = "이소연",
    jobTitle = "Server Engineer",
    introduction = ""
  } = data;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Cover";
  page.itemSpacing = 0;
  page.counterAxisAlignItems = "CENTER";
  
  const topSpacer = figma.createFrame();
  topSpacer.name = "Top Spacer";
  topSpacer.resize(CONFIG.CONTENT_WIDTH, 80);
  topSpacer.fills = [];
  
  const mainTitle = createCoverMainTitle();
  const versionText = createCoverVersion(version);
  
  const spacer1 = figma.createFrame();
  spacer1.name = "Spacer";
  spacer1.resize(CONFIG.CONTENT_WIDTH, 48);
  spacer1.fills = [];
  
  const nameText = createCoverName(name);
  const jobTitleText = createCoverJobTitle(jobTitle);
  
  const spacer2 = figma.createFrame();
  spacer2.name = "Spacer";
  spacer2.resize(CONFIG.CONTENT_WIDTH, 32);
  spacer2.fills = [];
  
  const profileImage = createCoverProfileImage();
  
  const spacer3 = figma.createFrame();
  spacer3.name = "Spacer";
  spacer3.resize(CONFIG.CONTENT_WIDTH, 32);
  spacer3.fills = [];
  
  const intro = createCoverIntroduction(introduction);
  
  const bottomSpacer = figma.createFrame();
  bottomSpacer.name = "Bottom Spacer";
  bottomSpacer.resize(CONFIG.CONTENT_WIDTH, 1);
  bottomSpacer.fills = [];
  bottomSpacer.layoutGrow = 1;
  
  page.appendChild(topSpacer);
  page.appendChild(mainTitle);
  page.appendChild(versionText);
  page.appendChild(spacer1);
  page.appendChild(nameText);
  page.appendChild(jobTitleText);
  page.appendChild(spacer2);
  page.appendChild(profileImage);
  page.appendChild(spacer3);
  page.appendChild(intro);
  page.appendChild(bottomSpacer);
  
  return page;
}

// ============================================================================
// 📑 템플릿 T2: Contents (목차)
// ============================================================================

function createTemplateContents(projects = []) {
  const defaultProjects = [
    { number: "01", title: "대규모 트래픽 환경 성능 튜닝", description: "100만 회원 규모 트래픽 환경에서 성능 병목을 개선한 백엔드 프로젝트" },
    { number: "02", title: "QuickLabelTimer", description: "앱스토어 출시 iOS 타이머 앱" },
    { number: "03", title: "My Math Teacher", description: "틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스" },
    { number: "04", title: "skeleton-gym", description: "영상에서 관절점을 추출해 운동 자세와 횟수를 분석하는 프로그램" },
    { number: "05", title: "plogging community", description: "플로깅 활동을 공유하는 커뮤니티 웹 프로젝트" }
  ];
  
  const data = projects.length > 0 ? projects : defaultProjects;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Contents";
  page.itemSpacing = 24;
  
  const header = createTocHeader();
  const divider = createTocDivider();
  
  page.appendChild(header);
  page.appendChild(divider);
  
  data.forEach((project, index) => {
    const item = createTocProjectItem(project.number, project.title, project.description);
    page.appendChild(item);
    
    if (index < data.length - 1) {
      const itemDivider = createTocDivider();
      page.appendChild(itemDivider);
    }
  });
  
  return page;
}

// ============================================================================
// 📑 템플릿 T3: Project Intro A (성과 중심)
// ============================================================================

function createTemplateProjectIntroA(data = {}) {
  const {
    projectName = "Traffic",
    version = "v1.0",
    metrics = [
      { value: "85%↓", label: "응답시간" },
      { value: "3x↑", label: "처리량" },
      { value: "99.9%", label: "안정성" }
    ],
    meta = {
      period: "2024.03 ~ 2024.12",
      role: "백엔드 개발",
      techStack: ["Java", "Spring Boot", "JPA", "Redis", "MySQL"]
    },
    tasks = ["쿼리 최적화", "인덱스 설계", "캐싱 적용"],
    insight = "카디널리티를 고려한 인덱스 설계의 중요성을 체감했습니다."
  } = data;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Project Intro A";
  page.itemSpacing = 24;
  
  const watermark = createProjectWatermark(projectName, version);
  const metricHero = createMetricHero(metrics);
  
  const bottomSection = createAutoLayoutFrame({
    name: "Bottom Section",
    direction: "HORIZONTAL",
    itemSpacing: 24,
    primaryAxisSizing: "FIXED",
    counterAxisSizing: "AUTO",
    width: CONFIG.CONTENT_WIDTH
  });
  
  const metaInfo = createProjectMetaInfo(meta);
  
  const rightSection = createAutoLayoutFrame({
    name: "Right Section",
    direction: "VERTICAL",
    itemSpacing: 16,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  rightSection.layoutGrow = 1;
  
  const tasksSection = createAutoLayoutFrame({
    name: "Tasks Section",
    direction: "VERTICAL",
    itemSpacing: 8,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const tasksHeader = createSectionHeader("한 일", "📌");
  tasksSection.appendChild(tasksHeader);
  
  tasks.forEach(task => {
    const taskText = createText({
      content: `• ${task}`,
      fontFamily: "Noto Sans KR",
      fontStyle: "Regular",
      fontSize: 14,
      color: COLORS.primary700
    });
    tasksSection.appendChild(taskText);
  });
  
  const sectionDivider = createDivider(470);
  const insightBox = createInsightBox(insight);
  
  rightSection.appendChild(tasksSection);
  rightSection.appendChild(sectionDivider);
  rightSection.appendChild(insightBox);
  
  bottomSection.appendChild(metaInfo);
  bottomSection.appendChild(rightSection);
  
  page.appendChild(watermark);
  page.appendChild(metricHero);
  page.appendChild(bottomSection);
  
  return page;
}

// ============================================================================
// 📑 템플릿 T4: Project Intro B (이미지 중심)
// ============================================================================

function createTemplateProjectIntroB(data = {}) {
  const {
    projectName = "QuickLabel",
    version = "v1.0",
    mockupLabel = "앱 스크린샷",
    meta = {
      period: "2024.01 ~ 2024.06",
      role: "iOS 개발",
      techStack: ["Swift", "SwiftUI"]
    },
    tasks = ["기능 A 개발", "기능 B 개발", "출시 및 운영"],
    insight = "사용자 피드백 반영 경험을 쌓았습니다."
  } = data;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Project Intro B";
  page.itemSpacing = 24;
  
  const watermark = createProjectWatermark(projectName, version);
  const mockup = createMockupPlaceholder(mockupLabel);
  
  const bottomSection = createAutoLayoutFrame({
    name: "Bottom Section",
    direction: "HORIZONTAL",
    itemSpacing: 24,
    primaryAxisSizing: "FIXED",
    counterAxisSizing: "AUTO",
    width: CONFIG.CONTENT_WIDTH
  });
  
  const metaInfo = createProjectMetaInfo(meta);
  
  const rightSection = createAutoLayoutFrame({
    name: "Right Section",
    direction: "VERTICAL",
    itemSpacing: 16,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  rightSection.layoutGrow = 1;
  
  const tasksSection = createAutoLayoutFrame({
    name: "Tasks Section",
    direction: "VERTICAL",
    itemSpacing: 8,
    primaryAxisSizing: "AUTO",
    counterAxisSizing: "AUTO"
  });
  
  const tasksHeader = createSectionHeader("한 일", "📌");
  tasksSection.appendChild(tasksHeader);
  
  tasks.forEach(task => {
    const taskText = createText({
      content: `• ${task}`,
      fontFamily: "Noto Sans KR",
      fontStyle: "Regular",
      fontSize: 14,
      color: COLORS.primary700
    });
    tasksSection.appendChild(taskText);
  });
  
  const sectionDivider = createDivider(470);
  const insightBox = createInsightBox(insight);
  
  rightSection.appendChild(tasksSection);
  rightSection.appendChild(sectionDivider);
  rightSection.appendChild(insightBox);
  
  bottomSection.appendChild(metaInfo);
  bottomSection.appendChild(rightSection);
  
  page.appendChild(watermark);
  page.appendChild(mockup);
  page.appendChild(bottomSection);
  
  return page;
}

// ============================================================================
// 📑 템플릿 T5: Troubleshooting A (순차적 개선)
// ============================================================================

function createTemplateTroubleshootingA(data = {}) {
  const {
    projectName = "MMT",
    version = "v1.0",
    title = "DB 인덱싱으로 조회 성능 85% 개선",
    problem = "조회 API 응답 시간 2.3초로 사용자 이탈 발생",
    attempts = [
      { attemptNumber: 1, title: "쿼리 최적화", description: "N+1 문제 해결을 위해 fetch join 적용", result: "2.3s → 1.8s (22% 개선)", status: "partial" },
      { attemptNumber: 2, title: "인덱스 추가", description: "카디널리티 분석 후 복합 인덱스 설계", result: "1.8s → 0.8s (56% 개선)", status: "partial" },
      { attemptNumber: 3, title: "캐싱 적용", description: "Redis 캐싱으로 반복 조회 최적화", result: "0.8s → 0.4s (50% 개선)", status: "success" }
    ],
    conclusion = { title: "결과", content: "2.3s → 0.4s (85%↓)" }
  } = data;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Troubleshooting A";
  page.itemSpacing = 8;
  
  const watermark = createProjectWatermark(projectName, version);
  const titleText = createTroubleshootingTitle(title);
  const problemHeader = createSectionHeader("문제상황", "🔴");
  const problemBox = createProblemBox(problem);
  const arrow1 = createFlowArrow();
  const solutionHeader = createSectionHeader("해결 과정", "🔧");
  
  page.appendChild(watermark);
  page.appendChild(titleText);
  page.appendChild(problemHeader);
  page.appendChild(problemBox);
  page.appendChild(arrow1);
  page.appendChild(solutionHeader);
  
  attempts.forEach((attempt) => {
    const card = createAttemptCard(attempt);
    page.appendChild(card);
  });
  
  const arrow2 = createFlowArrow();
  page.appendChild(arrow2);
  
  const conclusionBox = createConclusionBox(conclusion);
  page.appendChild(conclusionBox);
  
  return page;
}

// ============================================================================
// 📑 템플릿 T6: Troubleshooting B (언어 비교)
// ============================================================================

function createTemplateTroubleshootingB(data = {}) {
  const {
    projectName = "MMT",
    version = "v1.0",
    title = "동시성 제어: Java vs iOS 비교",
    leftTitle = "☕ Java/Spring",
    rightTitle = "🍎 iOS/Swift",
    leftItems = ["synchronized", "ReentrantLock", "@Transactional"],
    rightItems = ["DispatchQueue", "Actor", "async/await"],
    insight = "양쪽 언어 경험에서 배운 동시성 제어의 공통 원칙과 차이점을 이해했습니다."
  } = data;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Troubleshooting B";
  page.itemSpacing = 24;
  
  const watermark = createProjectWatermark(projectName, version);
  const titleText = createTroubleshootingTitle(title);
  
  const comparisonTable = createComparisonTable({
    leftTitle,
    rightTitle,
    leftItems,
    rightItems
  });
  
  const insightBox = createInsightBox(insight);
  insightBox.resize(CONFIG.CONTENT_WIDTH, insightBox.height);
  
  page.appendChild(watermark);
  page.appendChild(titleText);
  page.appendChild(comparisonTable);
  page.appendChild(insightBox);
  
  return page;
}

// ============================================================================
// 📑 템플릿 T7: Troubleshooting C (시나리오 + 독립 개선)
// ============================================================================

function createTemplateTroubleshootingC(data = {}) {
  const {
    projectName = "MMT",
    version = "v1.0",
    title = "대규모 트래픽 대응 설계",
    scenario = "사용자 1000만명이면?",
    questions = [
      "동시 요청이 폭증하면?",
      "동시 수정이 발생하면?"
    ],
    improvements = [
      { title: "캐싱", description: "Redis 캐싱으로 반복 조회 최적화", improvement: "70%↓" },
      { title: "비동기", description: "메시지 큐로 비동기 처리", improvement: "50%↓" },
      { title: "샤딩", description: "DB 샤딩으로 분산 처리", improvement: "3x↑" }
    ],
    conclusion = { title: "최종 결과", content: "TPS: 100 → 10,000 (100x↑)" }
  } = data;
  
  const page = createLayoutContentFrame();
  page.name = "Template/Troubleshooting C";
  page.itemSpacing = 8;
  
  const watermark = createProjectWatermark(projectName, version);
  const titleText = createTroubleshootingTitle(title);
  const scenarioBox = createQuestionBasic(scenario);
  const arrow1 = createFlowArrow();
  
  const questionsFrame = createAutoLayoutFrame({
    name: "Questions",
    direction: "HORIZONTAL",
    itemSpacing: 24,
    primaryAxisSizing: "FIXED",
    counterAxisSizing: "AUTO",
    width: CONFIG.CONTENT_WIDTH
  });
  questionsFrame.primaryAxisAlignItems = "CENTER";
  
  questions.forEach(q => {
    const questionBox = createQuestionDerived(q);
    questionsFrame.appendChild(questionBox);
  });
  
  const arrow2 = createFlowArrow();
  const improvementHeader = createSectionHeader("개선안", "🔧");
  
  const improvementsFrame = createAutoLayoutFrame({
    name: "Improvements",
    direction: "HORIZONTAL",
    itemSpacing: 16,
    primaryAxisSizing: "FIXED",
    counterAxisSizing: "AUTO",
    width: CONFIG.CONTENT_WIDTH
  });
  
  improvements.forEach(imp => {
    const card = createImprovementCard(imp);
    card.layoutGrow = 1;
    improvementsFrame.appendChild(card);
  });
  
  const arrow3 = createFlowArrow();
  const conclusionBox = createConclusionBox(conclusion);
  
  page.appendChild(watermark);
  page.appendChild(titleText);
  page.appendChild(scenarioBox);
  page.appendChild(arrow1);
  page.appendChild(questionsFrame);
  page.appendChild(arrow2);
  page.appendChild(improvementHeader);
  page.appendChild(improvementsFrame);
  page.appendChild(arrow3);
  page.appendChild(conclusionBox);
  
  return page;
}

// ============================================================================
// 🚀 메인 실행 함수
// ============================================================================

async function main() {
  await loadFonts();
  
  // 새 페이지 생성 및 비동기 설정
  const newPage = figma.createPage();
  newPage.name = "📦 Portfolio Components & Templates";
  await figma.setCurrentPageAsync(newPage);
  
  const allNodes = [];
  let currentY = 0;
  const GAP = 50;
  
  // ============================================================================
  // 컴포넌트 그룹 생성 (30개) - asComponent = true
  // ============================================================================
  
  const componentLabel = createText({
    content: "🧩 Components (30개)",
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 24,
    color: COLORS.primary900
  });
  componentLabel.x = 0;
  componentLabel.y = 0;
  newPage.appendChild(componentLabel);
  allNodes.push(componentLabel);
  
  currentY = 50;
  
  // Row 1: Layout & Headers (1-4)
  const comp1 = createLayoutContentFrame(true);
  comp1.x = 0; comp1.y = currentY;
  
  const comp2 = createProjectWatermark("Project", "v1.0", true);
  comp2.x = CONFIG.PAGE_WIDTH + GAP; comp2.y = currentY;
  
  const comp3_text = createTroubleshootingTitle("트러블슈팅 제목");
  comp3_text.x = CONFIG.PAGE_WIDTH + GAP; comp3_text.y = currentY + 80;
  
  const comp4 = createSectionHeader("섹션 제목", "📌", true);
  comp4.x = CONFIG.PAGE_WIDTH + GAP; comp4.y = currentY + 130;
  
  newPage.appendChild(comp1);
  newPage.appendChild(comp2);
  newPage.appendChild(comp3_text);
  newPage.appendChild(comp4);
  allNodes.push(comp1, comp2, comp3_text, comp4);
  
  // Row 2: TOC (5-7)
  currentY += 200;
  
  const comp5 = createTocProjectItem("01", "프로젝트 제목", "프로젝트 설명", true);
  comp5.x = 0; comp5.y = currentY;
  
  const comp6 = createTocHeader();
  comp6.x = CONFIG.CONTENT_WIDTH + GAP; comp6.y = currentY;
  
  const comp7 = createTocDivider();
  comp7.x = CONFIG.CONTENT_WIDTH + GAP; comp7.y = currentY + 60;
  
  newPage.appendChild(comp5);
  newPage.appendChild(comp6);
  newPage.appendChild(comp7);
  allNodes.push(comp5, comp6, comp7);
  
  // Row 3: Project Components (8-10)
  currentY += 100;
  
  const comp8 = createProjectMetaInfo({}, true);
  comp8.x = 0; comp8.y = currentY;
  
  const comp9 = createMetricHero([], true);
  comp9.x = 250; comp9.y = currentY;
  
  const comp10 = createMockupPlaceholder("Mockup", true);
  comp10.x = 250; comp10.y = currentY + 150;
  
  newPage.appendChild(comp8);
  newPage.appendChild(comp9);
  newPage.appendChild(comp10);
  allNodes.push(comp8, comp9, comp10);
  
  // Row 4: Tags (11-12)
  currentY += 500;
  
  const comp11 = createTechStackTag("Spring Boot", true);
  comp11.x = 0; comp11.y = currentY;
  
  const comp12 = createTechStackGroup(["Java", "Spring", "MySQL"], true);
  comp12.x = 150; comp12.y = currentY;
  
  newPage.appendChild(comp11);
  newPage.appendChild(comp12);
  allNodes.push(comp11, comp12);
  
  // Row 5: Cards (13-16)
  currentY += 60;
  
  const comp13 = createMetricCard("85%↓", "응답시간", COLORS.accentGreen, true);
  comp13.x = 0; comp13.y = currentY;
  
  const comp14 = createMetricGroup([], true);
  comp14.x = 200; comp14.y = currentY;
  
  currentY += 150;
  
  const comp15 = createAttemptCard({ attemptNumber: 1, title: "쿼리 최적화", description: "N+1 문제 해결", result: "2.3s → 1.8s" }, true);
  comp15.x = 0; comp15.y = currentY;
  
  const comp16 = createImprovementCard({ title: "캐싱", description: "Redis 적용", improvement: "70%↓" }, true);
  comp16.x = CONFIG.CONTENT_WIDTH + GAP; comp16.y = currentY;
  
  newPage.appendChild(comp13);
  newPage.appendChild(comp14);
  newPage.appendChild(comp15);
  newPage.appendChild(comp16);
  allNodes.push(comp13, comp14, comp15, comp16);
  
  // Row 6: Boxes (17-21)
  currentY += 170;
  
  const comp17 = createInsightBox("인사이트 내용", true);
  comp17.x = 0; comp17.y = currentY;
  
  const comp18 = createQuestionBasic("질문 내용", true);
  comp18.x = 500; comp18.y = currentY;
  
  currentY += 100;
  
  const comp19 = createQuestionDerived("파생 질문", true);
  comp19.x = 0; comp19.y = currentY;
  
  const comp20 = createProblemBox("문제 상황 설명", true);
  comp20.x = 380; comp20.y = currentY;
  
  currentY += 100;
  
  const comp21 = createConclusionBox({ title: "결과", content: "2.3s → 0.4s (85%↓)" }, true);
  comp21.x = 0; comp21.y = currentY;
  
  newPage.appendChild(comp17);
  newPage.appendChild(comp18);
  newPage.appendChild(comp19);
  newPage.appendChild(comp20);
  newPage.appendChild(comp21);
  allNodes.push(comp17, comp18, comp19, comp20, comp21);
  
  // Row 7: Table & Utility (22-24)
  currentY += 120;
  
  const comp22 = createComparisonTable({}, true);
  comp22.x = 0; comp22.y = currentY;
  
  currentY += 350;
  
  const comp23 = createFlowArrow(true);
  comp23.x = 0; comp23.y = currentY;
  
  const comp24 = createCodeBlock("SELECT * FROM users WHERE status = 'active';", true);
  comp24.x = CONFIG.CONTENT_WIDTH + GAP; comp24.y = currentY;
  
  newPage.appendChild(comp22);
  newPage.appendChild(comp23);
  newPage.appendChild(comp24);
  allNodes.push(comp22, comp23, comp24);
  
  // Row 8: Cover Components (25-30)
  currentY += 80;
  
  const comp25 = createCoverMainTitle();
  comp25.x = 0; comp25.y = currentY;
  
  const comp26 = createCoverVersion("v1.0.0");
  comp26.x = 250; comp26.y = currentY;
  
  const comp27 = createCoverName("이소연");
  comp27.x = 400; comp27.y = currentY;
  
  const comp28 = createCoverJobTitle("Server Engineer");
  comp28.x = 600; comp28.y = currentY;
  
  currentY += 60;
  
  const comp29 = createCoverProfileImage();
  comp29.x = 0; comp29.y = currentY;
  
  const comp30 = createCoverIntroduction();
  comp30.x = 200; comp30.y = currentY;
  
  newPage.appendChild(comp25);
  newPage.appendChild(comp26);
  newPage.appendChild(comp27);
  newPage.appendChild(comp28);
  newPage.appendChild(comp29);
  newPage.appendChild(comp30);
  allNodes.push(comp25, comp26, comp27, comp28, comp29, comp30);
  
  // ============================================================================
  // 템플릿 그룹 생성 (7개) - 프레임으로 생성 (내부에 컴포넌트 X)
  // ============================================================================
  
  currentY += 250;
  
  const templateLabel = createText({
    content: "📑 Templates (7개)",
    fontFamily: "Noto Sans KR",
    fontStyle: "Bold",
    fontSize: 24,
    color: COLORS.primary900
  });
  templateLabel.x = 0;
  templateLabel.y = currentY;
  newPage.appendChild(templateLabel);
  allNodes.push(templateLabel);
  
  currentY += 50;
  
  // Row 1: T1-T4
  const t1 = createTemplateCover();
  t1.x = 0; t1.y = currentY;
  
  const t2 = createTemplateContents();
  t2.x = CONFIG.PAGE_WIDTH + GAP; t2.y = currentY;
  
  const t3 = createTemplateProjectIntroA();
  t3.x = (CONFIG.PAGE_WIDTH + GAP) * 2; t3.y = currentY;
  
  const t4 = createTemplateProjectIntroB();
  t4.x = (CONFIG.PAGE_WIDTH + GAP) * 3; t4.y = currentY;
  
  newPage.appendChild(t1);
  newPage.appendChild(t2);
  newPage.appendChild(t3);
  newPage.appendChild(t4);
  allNodes.push(t1, t2, t3, t4);
  
  // Row 2: T5-T7
  currentY += CONFIG.PAGE_HEIGHT + GAP;
  
  const t5 = createTemplateTroubleshootingA();
  t5.x = 0; t5.y = currentY;
  
  const t6 = createTemplateTroubleshootingB();
  t6.x = CONFIG.PAGE_WIDTH + GAP; t6.y = currentY;
  
  const t7 = createTemplateTroubleshootingC();
  t7.x = (CONFIG.PAGE_WIDTH + GAP) * 2; t7.y = currentY;
  
  newPage.appendChild(t5);
  newPage.appendChild(t6);
  newPage.appendChild(t7);
  allNodes.push(t5, t6, t7);
  
  // 뷰포트 조정
  figma.viewport.scrollAndZoomIntoView(allNodes);
  
  figma.notify("✅ 컴포넌트 30개 + 템플릿 7개가 생성되었습니다!");
}

// 플러그인 실행
main().then(() => {
  figma.closePlugin();
});
