// Portfolio Component Generator for Figma
// 사용법: Figma > Plugins > Development > New Plugin > 이 코드 붙여넣기 > Run

// ===========================================
// 색상 정의
// ===========================================
const COLORS = {
  primary900: { r: 0.102, g: 0.102, b: 0.180 },    // #1A1A2E
  primary700: { r: 0.176, g: 0.176, b: 0.267 },    // #2D2D44
  primary400: { r: 0.420, g: 0.447, b: 0.502 },    // #6B7280
  primary100: { r: 0.953, g: 0.957, b: 0.965 },    // #F3F4F6
  accentBlue: { r: 0.231, g: 0.510, b: 0.965 },    // #3B82F6
  accentGreen: { r: 0.063, g: 0.725, b: 0.506 },   // #10B981
  accentAmber: { r: 0.961, g: 0.620, b: 0.043 },   // #F59E0B
  accentRed: { r: 0.937, g: 0.267, b: 0.267 },     // #EF4444
  white: { r: 1, g: 1, b: 1 },
  bgGray: { r: 0.976, g: 0.980, b: 0.984 },        // #F9FAFB
  bgCode: { r: 0.118, g: 0.118, b: 0.118 },        // #1E1E1E
  bgProblem: { r: 0.996, g: 0.949, b: 0.949 },     // #FEF2F2
  bgSolution: { r: 0.926, g: 0.992, b: 0.961 },    // #ECFDF5
  bgQuestion: { r: 0.937, g: 0.965, b: 1 },        // #EFF6FF
};

// ===========================================
// 메인 실행
// ===========================================
async function main() {
  // 폰트 로드
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  // 컴포넌트 페이지 생성
  const page = figma.createPage();
  page.name = "📦 Portfolio Components";
  figma.currentPage = page;

  let yOffset = 0;
  const GAP = 100;

  // 1. 콘텐츠 영역 프레임
  const contentFrame = createContentFrame();
  contentFrame.y = yOffset;
  yOffset += contentFrame.height + GAP;

  // 2. 프로젝트 워터마크
  const watermark = createWatermark();
  watermark.y = yOffset;
  yOffset += watermark.height + GAP;

  // 3. 트러블슈팅 제목
  const tsTitle = createTroubleshootingTitle();
  tsTitle.y = yOffset;
  yOffset += tsTitle.height + GAP;

  // 4. 목차 항목
  const tocItem = createTocItem();
  tocItem.y = yOffset;
  yOffset += tocItem.height + GAP;

  // 5. 프로젝트 메타 정보
  const metaInfo = createProjectMeta();
  metaInfo.y = yOffset;
  yOffset += metaInfo.height + GAP;

  // 6. 기술스택 태그 (단일)
  const techTag = createTechTag();
  techTag.y = yOffset;
  yOffset += techTag.height + GAP;

  // 7. 기술스택 그룹
  const techGroup = createTechTagGroup();
  techGroup.y = yOffset;
  yOffset += techGroup.height + GAP;

  // 8. 성과 수치 카드 (단일)
  const metricCard = createMetricCard();
  metricCard.y = yOffset;
  yOffset += metricCard.height + GAP;

  // 9. 성과 카드 그룹
  const metricGroup = createMetricCardGroup();
  metricGroup.y = yOffset;
  yOffset += metricGroup.height + GAP;

  // 10. 인사이트 박스
  const insightBox = createInsightBox();
  insightBox.y = yOffset;
  yOffset += insightBox.height + GAP;

  // 11. 질문 박스 - 기본
  const questionBasic = createQuestionBoxBasic();
  questionBasic.y = yOffset;
  yOffset += questionBasic.height + GAP;

  // 12. 질문 박스 - 파생
  const questionDerived = createQuestionBoxDerived();
  questionDerived.y = yOffset;
  yOffset += questionDerived.height + GAP;

  // 13. 문제상황 박스
  const problemBox = createProblemBox();
  problemBox.y = yOffset;
  yOffset += problemBox.height + GAP;

  // 14. 해결과정 - 순차형 (시도 카드)
  const attemptCard = createAttemptCard();
  attemptCard.y = yOffset;
  yOffset += attemptCard.height + GAP;

  // 15. 해결과정 - 독립형 (개선 카드)
  const improvementCard = createImprovementCard();
  improvementCard.y = yOffset;
  yOffset += improvementCard.height + GAP;

  // 16. 비교 테이블
  const comparisonTable = createComparisonTable();
  comparisonTable.y = yOffset;
  yOffset += comparisonTable.height + GAP;

  // 17. 결론 박스
  const conclusionBox = createConclusionBox();
  conclusionBox.y = yOffset;
  yOffset += conclusionBox.height + GAP;

  // 18. 섹션 헤더
  const sectionHeader = createSectionHeader();
  sectionHeader.y = yOffset;
  yOffset += sectionHeader.height + GAP;

  // 19. 플로우 화살표
  const flowArrow = createFlowArrow();
  flowArrow.y = yOffset;
  yOffset += flowArrow.height + GAP;

  // 20. 코드 블록
  const codeBlock = createCodeBlock();
  codeBlock.y = yOffset;

  figma.notify("✅ 20개 컴포넌트 생성 완료!");
}

// ===========================================
// 컴포넌트 생성 함수들
// ===========================================

// 1. 콘텐츠 영역 프레임
function createContentFrame() {
  const component = figma.createComponent();
  component.name = "Layout/Content Frame";
  component.resize(794, 1123);
  component.fills = [{ type: 'SOLID', color: COLORS.white }];
  
  // Auto Layout 설정
  component.layoutMode = "VERTICAL";
  component.paddingLeft = 40;
  component.paddingRight = 40;
  component.paddingTop = 48;
  component.paddingBottom = 48;
  component.itemSpacing = 24;
  
  // 내부 콘텐츠 영역 표시
  const innerGuide = figma.createFrame();
  innerGuide.name = "Content Area (714 x 1027)";
  innerGuide.resize(714, 1027);
  innerGuide.fills = [{ type: 'SOLID', color: COLORS.bgGray, opacity: 0.3 }];
  innerGuide.strokes = [{ type: 'SOLID', color: COLORS.primary400 }];
  innerGuide.strokeWeight = 1;
  innerGuide.dashPattern = [4, 4];
  
  component.appendChild(innerGuide);
  
  return component;
}

// 2. 프로젝트 워터마크
function createWatermark() {
  const component = figma.createComponent();
  component.name = "Header/Project Watermark";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 12;
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "BASELINE";
  component.fills = [];
  
  const projectName = figma.createText();
  projectName.name = "Project Name";
  projectName.characters = "MMT";
  projectName.fontSize = 56;
  projectName.fontName = { family: "Inter", style: "Bold" };
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const version = figma.createText();
  version.name = "Version";
  version.characters = "v1.0";
  version.fontSize = 18;
  version.fontName = { family: "Inter", style: "Medium" };
  version.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  component.appendChild(projectName);
  component.appendChild(version);
  
  return component;
}

// 3. 트러블슈팅 제목
function createTroubleshootingTitle() {
  const component = figma.createComponent();
  component.name = "Header/Troubleshooting Title";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 8;
  component.fills = [];
  
  const title = figma.createText();
  title.name = "Title";
  title.characters = "DB 인덱싱으로 조회 성능 85% 개선";
  title.fontSize = 24;
  title.fontName = { family: "Inter", style: "Semi Bold" };
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  component.appendChild(title);
  
  return component;
}

// 4. 목차 항목
function createTocItem() {
  const component = figma.createComponent();
  component.name = "TOC/Project Item";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 16;
  component.paddingTop = 24;
  component.paddingBottom = 24;
  component.fills = [];
  component.resize(714, 80);
  component.primaryAxisSizingMode = "FIXED";
  
  const number = figma.createText();
  number.name = "Number";
  number.characters = "01";
  number.fontSize = 20;
  number.fontName = { family: "Inter", style: "Bold" };
  number.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  
  const textGroup = figma.createFrame();
  textGroup.name = "Text Group";
  textGroup.layoutMode = "VERTICAL";
  textGroup.itemSpacing = 4;
  textGroup.fills = [];
  textGroup.layoutGrow = 1;
  
  const projectName = figma.createText();
  projectName.name = "Project Name";
  projectName.characters = "MMT (My Math Teacher)";
  projectName.fontSize = 18;
  projectName.fontName = { family: "Inter", style: "Semi Bold" };
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const description = figma.createText();
  description.name = "Description";
  description.characters = "수학 학습 관리 플랫폼";
  description.fontSize = 14;
  description.fontName = { family: "Inter", style: "Regular" };
  description.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  textGroup.appendChild(projectName);
  textGroup.appendChild(description);
  
  component.appendChild(number);
  component.appendChild(textGroup);
  
  return component;
}

// 5. 프로젝트 메타 정보
function createProjectMeta() {
  const component = figma.createComponent();
  component.name = "Project/Meta Info";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 16;
  component.paddingTop = 24;
  component.paddingRight = 24;
  component.paddingBottom = 24;
  component.paddingLeft = 24;
  component.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  component.cornerRadius = 8;
  component.resize(230, 300);
  component.primaryAxisSizingMode = "FIXED";
  
  // 기간
  const periodLabel = figma.createText();
  periodLabel.characters = "기간";
  periodLabel.fontSize = 12;
  periodLabel.fontName = { family: "Inter", style: "Medium" };
  periodLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const periodValue = figma.createText();
  periodValue.characters = "2024.03 - 2024.12";
  periodValue.fontSize = 14;
  periodValue.fontName = { family: "Inter", style: "Regular" };
  periodValue.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  // 역할
  const roleLabel = figma.createText();
  roleLabel.characters = "역할";
  roleLabel.fontSize = 12;
  roleLabel.fontName = { family: "Inter", style: "Medium" };
  roleLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const roleValue = figma.createText();
  roleValue.characters = "백엔드 개발";
  roleValue.fontSize = 14;
  roleValue.fontName = { family: "Inter", style: "Regular" };
  roleValue.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  component.appendChild(periodLabel);
  component.appendChild(periodValue);
  component.appendChild(roleLabel);
  component.appendChild(roleValue);
  
  return component;
}

// 6. 기술스택 태그 (단일)
function createTechTag() {
  const component = figma.createComponent();
  component.name = "Tag/Tech Stack";
  component.layoutMode = "HORIZONTAL";
  component.paddingTop = 4;
  component.paddingRight = 12;
  component.paddingBottom = 4;
  component.paddingLeft = 12;
  component.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.cornerRadius = 4;
  
  const text = figma.createText();
  text.name = "Tag Text";
  text.characters = "Spring";
  text.fontSize = 12;
  text.fontName = { family: "Inter", style: "Medium" };
  text.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  
  component.appendChild(text);
  
  return component;
}

// 7. 기술스택 그룹
function createTechTagGroup() {
  const component = figma.createComponent();
  component.name = "Tag/Tech Stack Group";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 8;
  component.layoutWrap = "WRAP";
  component.fills = [];
  component.resize(300, 60);
  component.primaryAxisSizingMode = "FIXED";
  
  const tags = ["Spring Boot", "MySQL", "Redis", "Docker", "JPA"];
  tags.forEach(tagName => {
    const tag = figma.createFrame();
    tag.layoutMode = "HORIZONTAL";
    tag.paddingTop = 4;
    tag.paddingRight = 12;
    tag.paddingBottom = 4;
    tag.paddingLeft = 12;
    tag.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
    tag.cornerRadius = 4;
    
    const text = figma.createText();
    text.characters = tagName;
    text.fontSize = 12;
    text.fontName = { family: "Inter", style: "Medium" };
    text.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
    
    tag.appendChild(text);
    component.appendChild(tag);
  });
  
  return component;
}

// 8. 성과 수치 카드 (단일)
function createMetricCard() {
  const component = figma.createComponent();
  component.name = "Card/Metric";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 4;
  component.paddingTop = 24;
  component.paddingRight = 24;
  component.paddingBottom = 24;
  component.paddingLeft = 24;
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.cornerRadius = 8;
  component.resize(140, 120);
  
  const value = figma.createText();
  value.name = "Value";
  value.characters = "85%↓";
  value.fontSize = 32;
  value.fontName = { family: "Inter", style: "Bold" };
  value.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  value.textAlignHorizontal = "CENTER";
  
  const label = figma.createText();
  label.name = "Label";
  label.characters = "응답시간 개선";
  label.fontSize = 14;
  label.fontName = { family: "Inter", style: "Regular" };
  label.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  label.textAlignHorizontal = "CENTER";
  
  const detail = figma.createText();
  detail.name = "Detail";
  detail.characters = "2.3s → 0.4s";
  detail.fontSize = 12;
  detail.fontName = { family: "Inter", style: "Regular" };
  detail.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  detail.textAlignHorizontal = "CENTER";
  
  component.appendChild(value);
  component.appendChild(label);
  component.appendChild(detail);
  
  return component;
}

// 9. 성과 카드 그룹
function createMetricCardGroup() {
  const component = figma.createComponent();
  component.name = "Card/Metric Group";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 16;
  component.fills = [];
  
  const metrics = [
    { value: "85%↓", label: "응답시간", color: COLORS.accentGreen },
    { value: "3x↑", label: "처리량", color: COLORS.accentBlue },
    { value: "99.9%", label: "안정성", color: COLORS.accentAmber }
  ];
  
  metrics.forEach(metric => {
    const card = figma.createFrame();
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 4;
    card.paddingTop = 24;
    card.paddingRight = 24;
    card.paddingBottom = 24;
    card.paddingLeft = 24;
    card.primaryAxisAlignItems = "CENTER";
    card.counterAxisAlignItems = "CENTER";
    card.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
    card.cornerRadius = 8;
    card.resize(140, 100);
    
    const value = figma.createText();
    value.characters = metric.value;
    value.fontSize = 32;
    value.fontName = { family: "Inter", style: "Bold" };
    value.fills = [{ type: 'SOLID', color: metric.color }];
    
    const label = figma.createText();
    label.characters = metric.label;
    label.fontSize = 14;
    label.fontName = { family: "Inter", style: "Regular" };
    label.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
    
    card.appendChild(value);
    card.appendChild(label);
    component.appendChild(card);
  });
  
  return component;
}

// 10. 인사이트 박스
function createInsightBox() {
  const component = figma.createComponent();
  component.name = "Box/Insight";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 8;
  component.paddingTop = 16;
  component.paddingRight = 20;
  component.paddingBottom = 16;
  component.paddingLeft = 20;
  component.fills = [{ type: 'SOLID', color: COLORS.bgQuestion }];
  component.cornerRadius = 8;
  component.resize(460, 100);
  component.primaryAxisSizingMode = "AUTO";
  
  const header = figma.createText();
  header.name = "Header";
  header.characters = "💡 인사이트";
  header.fontSize = 14;
  header.fontName = { family: "Inter", style: "Semi Bold" };
  header.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  
  const content = figma.createText();
  content.name = "Content";
  content.characters = "인덱스 설계 시 카디널리티와 쿼리 패턴을 함께 고려해야 한다는 것을 배웠습니다.";
  content.fontSize = 14;
  content.fontName = { family: "Inter", style: "Regular" };
  content.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  content.resize(420, 50);
  content.textAutoResize = "HEIGHT";
  
  component.appendChild(header);
  component.appendChild(content);
  
  return component;
}

// 11. 질문 박스 - 기본
function createQuestionBoxBasic() {
  const component = figma.createComponent();
  component.name = "Box/Question Basic";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 12;
  component.paddingTop = 20;
  component.paddingRight = 24;
  component.paddingBottom = 20;
  component.paddingLeft = 24;
  component.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  component.cornerRadius = 8;
  component.resize(714, 70);
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  
  const emoji = figma.createText();
  emoji.characters = "💭";
  emoji.fontSize = 24;
  
  const text = figma.createText();
  text.name = "Question";
  text.characters = "사용자가 1000만명이 된다면?";
  text.fontSize = 18;
  text.fontName = { family: "Inter", style: "Medium" };
  text.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  component.appendChild(emoji);
  component.appendChild(text);
  
  return component;
}

// 12. 질문 박스 - 파생
function createQuestionBoxDerived() {
  const component = figma.createComponent();
  component.name = "Box/Question Derived";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 8;
  component.paddingTop = 16;
  component.paddingRight = 20;
  component.paddingBottom = 16;
  component.paddingLeft = 20;
  component.fills = [{ type: 'SOLID', color: COLORS.white }];
  component.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.strokeWeight = 2;
  component.cornerRadius = 8;
  component.resize(340, 90);
  
  const header = figma.createText();
  header.characters = "❓ 파생 질문";
  header.fontSize = 12;
  header.fontName = { family: "Inter", style: "Medium" };
  header.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const question = figma.createText();
  question.name = "Question";
  question.characters = "요청에 부하가 생기진 않을까?";
  question.fontSize = 16;
  question.fontName = { family: "Inter", style: "Medium" };
  question.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  component.appendChild(header);
  component.appendChild(question);
  
  return component;
}

// 13. 문제상황 박스
function createProblemBox() {
  const component = figma.createComponent();
  component.name = "Box/Problem";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 12;
  component.paddingTop = 20;
  component.paddingRight = 24;
  component.paddingBottom = 20;
  component.paddingLeft = 24;
  component.fills = [{ type: 'SOLID', color: COLORS.bgProblem }];
  component.cornerRadius = 8;
  component.resize(714, 120);
  component.primaryAxisSizingMode = "FIXED";
  
  const header = figma.createText();
  header.characters = "🔴 문제상황";
  header.fontSize = 16;
  header.fontName = { family: "Inter", style: "Semi Bold" };
  header.fills = [{ type: 'SOLID', color: COLORS.accentRed }];
  
  const content = figma.createText();
  content.name = "Content";
  content.characters = "조회 API 응답 시간이 평균 2.3초로, 사용자 이탈률이 증가하고 있었습니다.";
  content.fontSize = 14;
  content.fontName = { family: "Inter", style: "Regular" };
  content.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  content.resize(666, 40);
  content.textAutoResize = "HEIGHT";
  
  component.appendChild(header);
  component.appendChild(content);
  
  return component;
}

// 14. 해결과정 - 순차형 (시도 카드)
function createAttemptCard() {
  const component = figma.createComponent();
  component.name = "Card/Attempt Sequential";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 8;
  component.paddingTop = 20;
  component.paddingRight = 24;
  component.paddingBottom = 20;
  component.paddingLeft = 24;
  component.fills = [{ type: 'SOLID', color: COLORS.white }];
  component.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.strokeWeight = 1;
  component.cornerRadius = 8;
  component.resize(714, 140);
  component.primaryAxisSizingMode = "FIXED";
  
  const header = figma.createFrame();
  header.layoutMode = "HORIZONTAL";
  header.itemSpacing = 8;
  header.fills = [];
  header.counterAxisAlignItems = "CENTER";
  
  const badge = figma.createFrame();
  badge.layoutMode = "HORIZONTAL";
  badge.paddingTop = 4;
  badge.paddingRight = 8;
  badge.paddingBottom = 4;
  badge.paddingLeft = 8;
  badge.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  badge.cornerRadius = 4;
  
  const badgeText = figma.createText();
  badgeText.characters = "시도 1";
  badgeText.fontSize = 12;
  badgeText.fontName = { family: "Inter", style: "Semi Bold" };
  badgeText.fills = [{ type: 'SOLID', color: COLORS.white }];
  badge.appendChild(badgeText);
  
  const title = figma.createText();
  title.characters = "쿼리 최적화";
  title.fontSize = 16;
  title.fontName = { family: "Inter", style: "Semi Bold" };
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  header.appendChild(badge);
  header.appendChild(title);
  
  const content = figma.createText();
  content.name = "Content";
  content.characters = "N+1 문제 해결을 위해 fetch join 적용";
  content.fontSize = 14;
  content.fontName = { family: "Inter", style: "Regular" };
  content.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  
  const result = figma.createText();
  result.name = "Result";
  result.characters = "→ 결과: 2.3s → 1.8s (22% 개선)";
  result.fontSize = 14;
  result.fontName = { family: "Inter", style: "Medium" };
  result.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  component.appendChild(header);
  component.appendChild(content);
  component.appendChild(result);
  
  return component;
}

// 15. 해결과정 - 독립형 (개선 카드)
function createImprovementCard() {
  const component = figma.createComponent();
  component.name = "Card/Improvement Independent";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 12;
  component.paddingTop = 20;
  component.paddingRight = 20;
  component.paddingBottom = 20;
  component.paddingLeft = 20;
  component.fills = [{ type: 'SOLID', color: COLORS.white }];
  component.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.strokeWeight = 1;
  component.cornerRadius = 8;
  component.resize(220, 160);
  
  const title = figma.createText();
  title.name = "Title";
  title.characters = "캐싱 레이어 추가";
  title.fontSize = 14;
  title.fontName = { family: "Inter", style: "Semi Bold" };
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const description = figma.createText();
  description.name = "Description";
  description.characters = "Redis 캐싱으로 반복 조회 최적화";
  description.fontSize = 12;
  description.fontName = { family: "Inter", style: "Regular" };
  description.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  description.resize(180, 30);
  description.textAutoResize = "HEIGHT";
  
  const metric = figma.createText();
  metric.name = "Metric";
  metric.characters = "70%↓";
  metric.fontSize = 28;
  metric.fontName = { family: "Inter", style: "Bold" };
  metric.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  component.appendChild(title);
  component.appendChild(description);
  component.appendChild(metric);
  
  return component;
}

// 16. 비교 테이블
function createComparisonTable() {
  const component = figma.createComponent();
  component.name = "Table/Comparison";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 0;
  component.fills = [];
  component.resize(714, 300);
  
  // Java 컬럼
  const javaCol = figma.createFrame();
  javaCol.name = "Java Column";
  javaCol.layoutMode = "VERTICAL";
  javaCol.itemSpacing = 0;
  javaCol.resize(357, 300);
  javaCol.fills = [];
  
  const javaHeader = figma.createFrame();
  javaHeader.layoutMode = "HORIZONTAL";
  javaHeader.itemSpacing = 8;
  javaHeader.paddingTop = 16;
  javaHeader.paddingRight = 20;
  javaHeader.paddingBottom = 16;
  javaHeader.paddingLeft = 20;
  javaHeader.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  javaHeader.resize(357, 50);
  javaHeader.primaryAxisSizingMode = "FIXED";
  javaHeader.counterAxisAlignItems = "CENTER";
  
  const javaEmoji = figma.createText();
  javaEmoji.characters = "☕";
  javaEmoji.fontSize = 18;
  
  const javaTitle = figma.createText();
  javaTitle.characters = "Java / Spring";
  javaTitle.fontSize = 16;
  javaTitle.fontName = { family: "Inter", style: "Semi Bold" };
  javaTitle.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  javaHeader.appendChild(javaEmoji);
  javaHeader.appendChild(javaTitle);
  
  const javaContent = figma.createFrame();
  javaContent.layoutMode = "VERTICAL";
  javaContent.paddingTop = 20;
  javaContent.paddingRight = 20;
  javaContent.paddingBottom = 20;
  javaContent.paddingLeft = 20;
  javaContent.fills = [{ type: 'SOLID', color: COLORS.white }];
  javaContent.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  javaContent.strokeWeight = 1;
  javaContent.resize(357, 250);
  javaContent.primaryAxisSizingMode = "FIXED";
  
  const javaText = figma.createText();
  javaText.characters = "synchronized, ReentrantLock\n@Transactional";
  javaText.fontSize = 14;
  javaText.fontName = { family: "Inter", style: "Regular" };
  javaText.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  
  javaContent.appendChild(javaText);
  javaCol.appendChild(javaHeader);
  javaCol.appendChild(javaContent);
  
  // iOS 컬럼
  const iosCol = figma.createFrame();
  iosCol.name = "iOS Column";
  iosCol.layoutMode = "VERTICAL";
  iosCol.itemSpacing = 0;
  iosCol.resize(357, 300);
  iosCol.fills = [];
  
  const iosHeader = figma.createFrame();
  iosHeader.layoutMode = "HORIZONTAL";
  iosHeader.itemSpacing = 8;
  iosHeader.paddingTop = 16;
  iosHeader.paddingRight = 20;
  iosHeader.paddingBottom = 16;
  iosHeader.paddingLeft = 20;
  iosHeader.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  iosHeader.resize(357, 50);
  iosHeader.primaryAxisSizingMode = "FIXED";
  iosHeader.counterAxisAlignItems = "CENTER";
  
  const iosEmoji = figma.createText();
  iosEmoji.characters = "🍎";
  iosEmoji.fontSize = 18;
  
  const iosTitle = figma.createText();
  iosTitle.characters = "iOS / Swift";
  iosTitle.fontSize = 16;
  iosTitle.fontName = { family: "Inter", style: "Semi Bold" };
  iosTitle.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  iosHeader.appendChild(iosEmoji);
  iosHeader.appendChild(iosTitle);
  
  const iosContent = figma.createFrame();
  iosContent.layoutMode = "VERTICAL";
  iosContent.paddingTop = 20;
  iosContent.paddingRight = 20;
  iosContent.paddingBottom = 20;
  iosContent.paddingLeft = 20;
  iosContent.fills = [{ type: 'SOLID', color: COLORS.white }];
  iosContent.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  iosContent.strokeWeight = 1;
  iosContent.resize(357, 250);
  iosContent.primaryAxisSizingMode = "FIXED";
  
  const iosText = figma.createText();
  iosText.characters = "DispatchQueue, Actor\nasync/await";
  iosText.fontSize = 14;
  iosText.fontName = { family: "Inter", style: "Regular" };
  iosText.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  
  iosContent.appendChild(iosText);
  iosCol.appendChild(iosHeader);
  iosCol.appendChild(iosContent);
  
  component.appendChild(javaCol);
  component.appendChild(iosCol);
  
  return component;
}

// 17. 결론 박스
function createConclusionBox() {
  const component = figma.createComponent();
  component.name = "Box/Conclusion";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 12;
  component.paddingTop = 24;
  component.paddingRight = 32;
  component.paddingBottom = 24;
  component.paddingLeft = 32;
  component.fills = [{ type: 'SOLID', color: COLORS.bgSolution }];
  component.cornerRadius = 8;
  component.resize(714, 120);
  component.primaryAxisSizingMode = "FIXED";
  
  const header = figma.createText();
  header.characters = "✅ 결과";
  header.fontSize = 16;
  header.fontName = { family: "Inter", style: "Semi Bold" };
  header.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  const metricRow = figma.createFrame();
  metricRow.layoutMode = "HORIZONTAL";
  metricRow.itemSpacing = 16;
  metricRow.fills = [];
  metricRow.counterAxisAlignItems = "BASELINE";
  
  const mainMetric = figma.createText();
  mainMetric.characters = "2.3s → 0.4s";
  mainMetric.fontSize = 32;
  mainMetric.fontName = { family: "Inter", style: "Bold" };
  mainMetric.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const percentage = figma.createText();
  percentage.characters = "(85%↓)";
  percentage.fontSize = 24;
  percentage.fontName = { family: "Inter", style: "Bold" };
  percentage.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  metricRow.appendChild(mainMetric);
  metricRow.appendChild(percentage);
  
  component.appendChild(header);
  component.appendChild(metricRow);
  
  return component;
}

// 18. 섹션 헤더
function createSectionHeader() {
  const component = figma.createComponent();
  component.name = "Header/Section";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 8;
  component.fills = [];
  component.counterAxisAlignItems = "CENTER";
  
  const emoji = figma.createText();
  emoji.name = "Emoji";
  emoji.characters = "🔧";
  emoji.fontSize = 18;
  
  const text = figma.createText();
  text.name = "Text";
  text.characters = "해결 과정";
  text.fontSize = 18;
  text.fontName = { family: "Inter", style: "Semi Bold" };
  text.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  component.appendChild(emoji);
  component.appendChild(text);
  
  return component;
}

// 19. 플로우 화살표
function createFlowArrow() {
  const component = figma.createComponent();
  component.name = "Utility/Flow Arrow";
  component.resize(40, 40);
  component.fills = [];
  
  const arrow = figma.createText();
  arrow.characters = "↓";
  arrow.fontSize = 24;
  arrow.fontName = { family: "Inter", style: "Regular" };
  arrow.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  arrow.textAlignHorizontal = "CENTER";
  arrow.x = 8;
  arrow.y = 8;
  
  component.appendChild(arrow);
  
  return component;
}

// 20. 코드 블록
function createCodeBlock() {
  const component = figma.createComponent();
  component.name = "Block/Code";
  component.layoutMode = "VERTICAL";
  component.paddingTop = 16;
  component.paddingRight = 20;
  component.paddingBottom = 16;
  component.paddingLeft = 20;
  component.fills = [{ type: 'SOLID', color: COLORS.bgCode }];
  component.cornerRadius = 8;
  component.resize(340, 120);
  
  const code = figma.createText();
  code.name = "Code";
  code.characters = "@Transactional\npublic void process() {\n    // logic here\n}";
  code.fontSize = 12;
  code.fontName = { family: "Inter", style: "Regular" };
  code.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  
  component.appendChild(code);
  
  return component;
}

// 실행
main();
