// Portfolio Component Generator for Figma
// 사용법: Figma > Plugins > Development > New Plugin > 이 코드 붙여넣기 > Run

// 20개 컴포넌트 전체 생성
// 컴포넌트 1-5: 콘텐츠 프레임, 프로젝트 워터마크, 트러블슈팅 제목, 목차 항목, 프로젝트 메타 정보
// 컴포넌트 6-10: 기술스택 태그, 기술스택 그룹, 성과 카드, 성과 카드 그룹, 인사이트 박스
// 컴포넌트 11-15: 질문 박스(기본), 질문 박스(파생), 문제상황 박스, 시도 카드(순차형), 개선 카드(독립형)
// 컴포넌트 16-20: 비교 테이블, 결론 박스, 섹션 헤더, 플로우 화살표, 코드 블록
// Components 1-5: Layout/Content Frame, Header/Project Watermark, Header/Troubleshooting Title, TOC/Project Item, Project/Meta Info
// Components 6-10: Tag/Tech Stack, Tag/Tech Stack Group, Card/Metric, Card/Metric Group, Box/Insight
// Components 11-15: Box/Question Basic, Box/Question Derived, Box/Problem, Card/Attempt Sequential, Card/Improvement Independent
// Components 16-20: Table/Comparison, Box/Conclusion, Header/Section, Utility/Flow Arrow, Block/Code

// Portfolio Component Generator for Figma
// 사용법: Figma > Plugins > Development > New Plugin > 이 코드 붙여넣기 > Run

// 30개 컴포넌트 + 7개 템플릿 생성
// 기존 컴포넌트 1-20: Layout/Content Frame, Header/Project Watermark, 등
// 신규 컴포넌트 21-30: Cover/Main Title, Cover/Version, Cover/Name, Cover/Job Title, 
//                      Cover/Profile Image, Cover/Introduction, TOC/Header, TOC/Divider,
//                      Project/Metric Hero, Project/Mockup Placeholder
// 템플릿 T1-T7: Template/Cover, Template/Contents, Template/Project Intro A/B,
//              Template/Troubleshooting A/B/C

const COLORS = {
  primary900: { r: 0.102, g: 0.102, b: 0.180 },
  primary700: { r: 0.176, g: 0.176, b: 0.267 },
  primary400: { r: 0.420, g: 0.447, b: 0.502 },
  primary100: { r: 0.953, g: 0.957, b: 0.965 },
  accentBlue: { r: 0.231, g: 0.510, b: 0.965 },
  accentGreen: { r: 0.063, g: 0.725, b: 0.506 },
  accentAmber: { r: 0.961, g: 0.620, b: 0.043 },
  accentRed: { r: 0.937, g: 0.267, b: 0.267 },
  white: { r: 1, g: 1, b: 1 },
  bgGray: { r: 0.976, g: 0.980, b: 0.984 },
  bgCode: { r: 0.118, g: 0.118, b: 0.118 },
  bgProblem: { r: 0.996, g: 0.949, b: 0.949 },
  bgSolution: { r: 0.926, g: 0.992, b: 0.961 },
  bgQuestion: { r: 0.937, g: 0.965, b: 1 },
  divider: { r: 0.898, g: 0.906, b: 0.922 }, // #E5E7EB
};

const FONTS = {
  heading: { family: "Merriweather", style: "Bold" },
  headingRegular: { family: "Merriweather", style: "Regular" },
  bodyBold: { family: "Noto Sans KR", style: "Bold" },
  bodySemiBold: { family: "Noto Sans KR", style: "Medium" },
  bodyMedium: { family: "Noto Sans KR", style: "Medium" },
  bodyRegular: { family: "Noto Sans KR", style: "Regular" },
};

// 콘텐츠 데이터
const CONTENT_DATA = {
  cover: {
    name: "이소연",
    jobTitle: "Server Engineer",
    introduction: "안녕하세요. 개발자 이소연입니다.\n수학 강사로 일하며 느낀 문제를 직접 해결하다가 개발에 빠졌습니다.\n이후 개인 앱을 출시해 피드백으로 개선해온 경험이 있습니다.\n지금은 API 응답 속도를 추적하고 개선하는 성능 튜닝에 집중하고 있습니다."
  },
  projects: [
    { num: "01", name: "대규모 트래픽 환경 성능 튜닝 프로젝트", desc: "100만 회원 규모 트래픽 환경에서 성능 병목을 개선한 백엔드 프로젝트" },
    { num: "02", name: "QuickLabelTimer", desc: "앱스토어 출시 iOS 타이머 앱" },
    { num: "03", name: "My Math Teacher", desc: "틀린 문제에서 부족한 선수지식을 역추적하는 수학 진단 웹서비스" },
    { num: "04", name: "skeleton-gym", desc: "영상에서 관절점을 추출해 운동 자세와 횟수를 분석하는 프로그램" },
    { num: "05", name: "plogging community", desc: "플로깅 활동을 공유하는 커뮤니티 웹 프로젝트" }
  ]
};

async function main() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync(FONTS.heading);
  await figma.loadFontAsync(FONTS.headingRegular);
  await figma.loadFontAsync(FONTS.bodyBold);
  await figma.loadFontAsync(FONTS.bodySemiBold);
  await figma.loadFontAsync(FONTS.bodyMedium);
  await figma.loadFontAsync(FONTS.bodyRegular);

  figma.notify("⏳ 30개 컴포넌트 + 7개 템플릿 생성 중...");

  const page = figma.createPage();
  page.name = "📦 Portfolio Components & Templates";
  await figma.setCurrentPageAsync(page);

  let yOffset = 0;
  const GAP = 100;

  // ========== 기존 컴포넌트 1-20 ==========
  const contentFrame = createContentFrame();
  contentFrame.y = yOffset;
  yOffset += contentFrame.height + GAP;

  const watermark = createWatermark();
  watermark.y = yOffset;
  yOffset += watermark.height + GAP;

  const tsTitle = createTroubleshootingTitle();
  tsTitle.y = yOffset;
  yOffset += tsTitle.height + GAP;

  const tocItem = createTocItem();
  tocItem.y = yOffset;
  yOffset += tocItem.height + GAP;

  const metaInfo = createProjectMeta();
  metaInfo.y = yOffset;
  yOffset += metaInfo.height + GAP;

  const techTag = createTechTag();
  techTag.y = yOffset;
  yOffset += techTag.height + GAP;

  const techGroup = createTechTagGroup();
  techGroup.y = yOffset;
  yOffset += techGroup.height + GAP;

  const metricCard = createMetricCard();
  metricCard.y = yOffset;
  yOffset += metricCard.height + GAP;

  const metricGroup = createMetricCardGroup();
  metricGroup.y = yOffset;
  yOffset += metricGroup.height + GAP;

  const insightBox = createInsightBox();
  insightBox.y = yOffset;
  yOffset += insightBox.height + GAP;

  const questionBasic = createQuestionBoxBasic();
  questionBasic.y = yOffset;
  yOffset += questionBasic.height + GAP;

  const questionDerived = createQuestionBoxDerived();
  questionDerived.y = yOffset;
  yOffset += questionDerived.height + GAP;

  const problemBox = createProblemBox();
  problemBox.y = yOffset;
  yOffset += problemBox.height + GAP;

  const attemptCard = createAttemptCard();
  attemptCard.y = yOffset;
  yOffset += attemptCard.height + GAP;

  const improvementCard = createImprovementCard();
  improvementCard.y = yOffset;
  yOffset += improvementCard.height + GAP;

  const comparisonTable = createComparisonTable();
  comparisonTable.y = yOffset;
  yOffset += comparisonTable.height + GAP;

  const conclusionBox = createConclusionBox();
  conclusionBox.y = yOffset;
  yOffset += conclusionBox.height + GAP;

  const sectionHeader = createSectionHeader();
  sectionHeader.y = yOffset;
  yOffset += sectionHeader.height + GAP;

  const flowArrow = createFlowArrow();
  flowArrow.y = yOffset;
  yOffset += flowArrow.height + GAP;

  const codeBlock = createCodeBlock();
  codeBlock.y = yOffset;
  yOffset += codeBlock.height + GAP;

  // ========== 신규 컴포넌트 21-30 ==========
  const coverMainTitle = createCoverMainTitle();
  coverMainTitle.y = yOffset;
  yOffset += coverMainTitle.height + GAP;

  const coverVersion = createCoverVersion();
  coverVersion.y = yOffset;
  yOffset += coverVersion.height + GAP;

  const coverName = createCoverName();
  coverName.y = yOffset;
  yOffset += coverName.height + GAP;

  const coverJobTitle = createCoverJobTitle();
  coverJobTitle.y = yOffset;
  yOffset += coverJobTitle.height + GAP;

  const coverProfileImage = createCoverProfileImage();
  coverProfileImage.y = yOffset;
  yOffset += coverProfileImage.height + GAP;

  const coverIntro = createCoverIntroduction();
  coverIntro.y = yOffset;
  yOffset += coverIntro.height + GAP;

  const tocHeader = createTocHeader();
  tocHeader.y = yOffset;
  yOffset += tocHeader.height + GAP;

  const tocDivider = createTocDivider();
  tocDivider.y = yOffset;
  yOffset += tocDivider.height + GAP;

  const metricHero = createMetricHero();
  metricHero.y = yOffset;
  yOffset += metricHero.height + GAP;

  const mockupPlaceholder = createMockupPlaceholder();
  mockupPlaceholder.y = yOffset;
  yOffset += mockupPlaceholder.height + GAP;

  // ========== 템플릿 T1-T7 ==========
  yOffset += 200; // 템플릿 전 추가 간격

  const templateCover = createTemplateCover();
  templateCover.y = yOffset;
  templateCover.x = 0;

  const templateContents = createTemplateContents();
  templateContents.y = yOffset;
  templateContents.x = 900;

  const templateProjectA = createTemplateProjectIntroA();
  templateProjectA.y = yOffset;
  templateProjectA.x = 1800;

  const templateProjectB = createTemplateProjectIntroB();
  templateProjectB.y = yOffset;
  templateProjectB.x = 2700;

  yOffset += 1200;

  const templateTsA = createTemplateTroubleshootingA();
  templateTsA.y = yOffset;
  templateTsA.x = 0;

  const templateTsB = createTemplateTroubleshootingB();
  templateTsB.y = yOffset;
  templateTsB.x = 900;

  const templateTsC = createTemplateTroubleshootingC();
  templateTsC.y = yOffset;
  templateTsC.x = 1800;

  figma.notify("✅ 30개 컴포넌트 + 7개 템플릿 생성 완료!");
  figma.closePlugin();
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
  
  component.layoutMode = "VERTICAL";
  component.paddingLeft = 40;
  component.paddingRight = 40;
  component.paddingTop = 48;
  component.paddingBottom = 48;
  component.itemSpacing = 24;
  
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
  projectName.fontName = FONTS.heading;
  projectName.characters = "MMT";
  projectName.fontSize = 56;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const version = figma.createText();
  version.name = "Version";
  version.fontName = FONTS.headingRegular;
  version.characters = "v1.0";
  version.fontSize = 18;
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
  title.fontName = FONTS.bodyBold;
  title.characters = "DB 인덱싱으로 조회 성능 85% 개선";
  title.fontSize = 24;
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
  number.fontName = FONTS.heading;
  number.characters = "01";
  number.fontSize = 20;
  number.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  
  const textGroup = figma.createFrame();
  textGroup.name = "Text Group";
  textGroup.layoutMode = "VERTICAL";
  textGroup.itemSpacing = 4;
  textGroup.fills = [];
  textGroup.layoutGrow = 1;
  
  const projectName = figma.createText();
  projectName.name = "Project Name";
  projectName.fontName = FONTS.bodySemiBold;
  projectName.characters = "MMT (My Math Teacher)";
  projectName.fontSize = 18;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const description = figma.createText();
  description.name = "Description";
  description.fontName = FONTS.bodyRegular;
  description.characters = "수학 학습 관리 플랫폼";
  description.fontSize = 14;
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
  
  const periodLabel = figma.createText();
  periodLabel.fontName = FONTS.bodyMedium;
  periodLabel.characters = "기간";
  periodLabel.fontSize = 12;
  periodLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const periodValue = figma.createText();
  periodValue.fontName = FONTS.bodyRegular;
  periodValue.characters = "2024.03 - 2024.12";
  periodValue.fontSize = 14;
  periodValue.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const roleLabel = figma.createText();
  roleLabel.fontName = FONTS.bodyMedium;
  roleLabel.characters = "역할";
  roleLabel.fontSize = 12;
  roleLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const roleValue = figma.createText();
  roleValue.fontName = FONTS.bodyRegular;
  roleValue.characters = "백엔드 개발";
  roleValue.fontSize = 14;
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
  text.fontName = FONTS.bodyMedium;
  text.characters = "Spring";
  text.fontSize = 12;
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
    text.fontName = FONTS.bodyMedium;
    text.characters = tagName;
    text.fontSize = 12;
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
  value.fontName = FONTS.bodyBold;
  value.characters = "85%↓";
  value.fontSize = 32;
  value.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  value.textAlignHorizontal = "CENTER";
  
  const label = figma.createText();
  label.name = "Label";
  label.fontName = FONTS.bodyRegular;
  label.characters = "응답시간 개선";
  label.fontSize = 14;
  label.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  label.textAlignHorizontal = "CENTER";
  
  const detail = figma.createText();
  detail.name = "Detail";
  detail.fontName = FONTS.bodyRegular;
  detail.characters = "2.3s → 0.4s";
  detail.fontSize = 12;
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
    value.fontName = FONTS.bodyBold;
    value.characters = metric.value;
    value.fontSize = 32;
    value.fills = [{ type: 'SOLID', color: metric.color }];
    
    const label = figma.createText();
    label.fontName = FONTS.bodyRegular;
    label.characters = metric.label;
    label.fontSize = 14;
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
  header.fontName = FONTS.bodySemiBold;
  header.characters = "💡 인사이트";
  header.fontSize = 14;
  header.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  
  const content = figma.createText();
  content.name = "Content";
  content.fontName = FONTS.bodyRegular;
  content.characters = "인덱스 설계 시 카디널리티와 쿼리 패턴을 함께 고려해야 한다는 것을 배웠습니다.";
  content.fontSize = 14;
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
  emoji.fontName = FONTS.bodyRegular;
  emoji.characters = "💭";
  emoji.fontSize = 24;
  
  const text = figma.createText();
  text.name = "Question";
  text.fontName = FONTS.bodyMedium;
  text.characters = "사용자가 1000만명이 된다면?";
  text.fontSize = 18;
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
  header.fontName = FONTS.bodyMedium;
  header.characters = "❓ 파생 질문";
  header.fontSize = 12;
  header.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const question = figma.createText();
  question.name = "Question";
  question.fontName = FONTS.bodyMedium;
  question.characters = "요청에 부하가 생기진 않을까?";
  question.fontSize = 16;
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
  header.fontName = FONTS.bodySemiBold;
  header.characters = "🔴 문제상황";
  header.fontSize = 16;
  header.fills = [{ type: 'SOLID', color: COLORS.accentRed }];
  
  const content = figma.createText();
  content.name = "Content";
  content.fontName = FONTS.bodyRegular;
  content.characters = "조회 API 응답 시간이 평균 2.3초로, 사용자 이탈률이 증가하고 있었습니다.";
  content.fontSize = 14;
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
  badgeText.fontName = FONTS.bodySemiBold;
  badgeText.characters = "시도 1";
  badgeText.fontSize = 12;
  badgeText.fills = [{ type: 'SOLID', color: COLORS.white }];
  badge.appendChild(badgeText);
  
  const title = figma.createText();
  title.fontName = FONTS.bodySemiBold;
  title.characters = "쿼리 최적화";
  title.fontSize = 16;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  header.appendChild(badge);
  header.appendChild(title);
  
  const content = figma.createText();
  content.name = "Content";
  content.fontName = FONTS.bodyRegular;
  content.characters = "N+1 문제 해결을 위해 fetch join 적용";
  content.fontSize = 14;
  content.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  
  const result = figma.createText();
  result.name = "Result";
  result.fontName = FONTS.bodyMedium;
  result.characters = "→ 결과: 2.3s → 1.8s (22% 개선)";
  result.fontSize = 14;
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
  title.fontName = FONTS.bodySemiBold;
  title.characters = "캐싱 레이어 추가";
  title.fontSize = 14;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const description = figma.createText();
  description.name = "Description";
  description.fontName = FONTS.bodyRegular;
  description.characters = "Redis 캐싱으로 반복 조회 최적화";
  description.fontSize = 12;
  description.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  description.resize(180, 30);
  description.textAutoResize = "HEIGHT";
  
  const metric = figma.createText();
  metric.name = "Metric";
  metric.fontName = FONTS.bodyBold;
  metric.characters = "70%↓";
  metric.fontSize = 28;
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
  javaEmoji.fontName = FONTS.bodyRegular;
  javaEmoji.characters = "☕";
  javaEmoji.fontSize = 18;
  
  const javaTitle = figma.createText();
  javaTitle.fontName = FONTS.bodySemiBold;
  javaTitle.characters = "Java / Spring";
  javaTitle.fontSize = 16;
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
  javaText.fontName = FONTS.bodyRegular;
  javaText.characters = "synchronized, ReentrantLock\n@Transactional";
  javaText.fontSize = 14;
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
  iosEmoji.fontName = FONTS.bodyRegular;
  iosEmoji.characters = "🍎";
  iosEmoji.fontSize = 18;
  
  const iosTitle = figma.createText();
  iosTitle.fontName = FONTS.bodySemiBold;
  iosTitle.characters = "iOS / Swift";
  iosTitle.fontSize = 16;
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
  iosText.fontName = FONTS.bodyRegular;
  iosText.characters = "DispatchQueue, Actor\nasync/await";
  iosText.fontSize = 14;
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
  header.fontName = FONTS.bodySemiBold;
  header.characters = "✅ 결과";
  header.fontSize = 16;
  header.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  const metricRow = figma.createFrame();
  metricRow.layoutMode = "HORIZONTAL";
  metricRow.itemSpacing = 16;
  metricRow.fills = [];
  metricRow.counterAxisAlignItems = "BASELINE";
  
  const mainMetric = figma.createText();
  mainMetric.fontName = FONTS.bodyBold;
  mainMetric.characters = "2.3s → 0.4s";
  mainMetric.fontSize = 32;
  mainMetric.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const percentage = figma.createText();
  percentage.fontName = FONTS.bodyBold;
  percentage.characters = "(85%↓)";
  percentage.fontSize = 24;
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
  emoji.fontName = FONTS.bodyRegular;
  emoji.characters = "🔧";
  emoji.fontSize = 18;
  
  const text = figma.createText();
  text.name = "Text";
  text.fontName = FONTS.bodySemiBold;
  text.characters = "해결 과정";
  text.fontSize = 18;
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
  arrow.fontName = FONTS.bodyRegular;
  arrow.characters = "↓";
  arrow.fontSize = 24;
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
  code.fontName = FONTS.bodyRegular;
  code.characters = "@Transactional\npublic void process() {\n    // logic here\n}";
  code.fontSize = 12;
  code.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  
  component.appendChild(code);
  
  return component;
}

// ===========================================
// 신규 컴포넌트 21-30
// ===========================================

// 21. Cover/Main Title
function createCoverMainTitle() {
  const component = figma.createComponent();
  component.name = "Cover/Main Title";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 8;
  component.fills = [];
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  
  const title = figma.createText();
  title.name = "Title";
  title.fontName = FONTS.heading;
  title.characters = "Portfolio 2026";
  title.fontSize = 48;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  title.textAlignHorizontal = "CENTER";
  
  component.appendChild(title);
  return component;
}

// 22. Cover/Version
function createCoverVersion() {
  const component = figma.createComponent();
  component.name = "Cover/Version";
  component.fills = [];
  
  const version = figma.createText();
  version.name = "Version";
  version.fontName = FONTS.headingRegular;
  version.characters = "v1.0.0";
  version.fontSize = 18;
  version.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  version.textAlignHorizontal = "CENTER";
  
  component.appendChild(version);
  return component;
}

// 23. Cover/Name
function createCoverName() {
  const component = figma.createComponent();
  component.name = "Cover/Name";
  component.fills = [];
  
  const name = figma.createText();
  name.name = "Name";
  name.fontName = FONTS.bodyBold;
  name.characters = CONTENT_DATA.cover.name;
  name.fontSize = 32;
  name.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  name.textAlignHorizontal = "CENTER";
  
  component.appendChild(name);
  return component;
}

// 24. Cover/Job Title
function createCoverJobTitle() {
  const component = figma.createComponent();
  component.name = "Cover/Job Title";
  component.fills = [];
  
  const jobTitle = figma.createText();
  jobTitle.name = "Job Title";
  jobTitle.fontName = FONTS.bodyRegular;
  jobTitle.characters = CONTENT_DATA.cover.jobTitle;
  jobTitle.fontSize = 18;
  jobTitle.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  jobTitle.textAlignHorizontal = "CENTER";
  
  component.appendChild(jobTitle);
  return component;
}

// 25. Cover/Profile Image (원형 180px 플레이스홀더)
function createCoverProfileImage() {
  const component = figma.createComponent();
  component.name = "Cover/Profile Image";
  component.resize(180, 180);
  component.cornerRadius = 90; // 원형
  component.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  component.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.strokeWeight = 2;
  
  // 플레이스홀더 텍스트
  const placeholder = figma.createText();
  placeholder.fontName = FONTS.bodyRegular;
  placeholder.characters = "Profile\nImage";
  placeholder.fontSize = 16;
  placeholder.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  placeholder.textAlignHorizontal = "CENTER";
  placeholder.x = 55;
  placeholder.y = 70;
  
  component.appendChild(placeholder);
  return component;
}

// 26. Cover/Introduction
function createCoverIntroduction() {
  const component = figma.createComponent();
  component.name = "Cover/Introduction";
  component.layoutMode = "VERTICAL";
  component.fills = [];
  component.primaryAxisAlignItems = "CENTER";
  component.resize(634, 100);
  component.primaryAxisSizingMode = "AUTO";
  
  const text = figma.createText();
  text.name = "Introduction";
  text.fontName = FONTS.bodyRegular;
  text.characters = CONTENT_DATA.cover.introduction;
  text.fontSize = 14;
  text.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  text.textAlignHorizontal = "CENTER";
  text.lineHeight = { value: 24, unit: "PIXELS" };
  text.resize(634, 100);
  text.textAutoResize = "HEIGHT";
  
  component.appendChild(text);
  return component;
}

// 27. TOC/Header
function createTocHeader() {
  const component = figma.createComponent();
  component.name = "TOC/Header";
  component.layoutMode = "VERTICAL";
  component.itemSpacing = 16;
  component.fills = [];
  component.resize(714, 60);
  component.primaryAxisSizingMode = "AUTO";
  
  const title = figma.createText();
  title.name = "Title";
  title.fontName = FONTS.heading;
  title.characters = "CONTENTS";
  title.fontSize = 32;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  component.appendChild(title);
  return component;
}

// 28. TOC/Divider
function createTocDivider() {
  const component = figma.createComponent();
  component.name = "TOC/Divider";
  component.resize(714, 1);
  component.fills = [{ type: 'SOLID', color: COLORS.divider }];
  
  return component;
}

// 29. Project/Metric Hero (성과 카드 히어로 영역 714x150)
function createMetricHero() {
  const component = figma.createComponent();
  component.name = "Project/Metric Hero";
  component.layoutMode = "HORIZONTAL";
  component.itemSpacing = 16;
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.fills = [];
  component.resize(714, 150);
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  
  const metrics = [
    { value: "85%↓", label: "응답시간", color: COLORS.accentGreen },
    { value: "3x↑", label: "처리량", color: COLORS.accentBlue },
    { value: "99.9%", label: "안정성", color: COLORS.accentAmber }
  ];
  
  metrics.forEach(metric => {
    const card = figma.createFrame();
    card.name = metric.label + " Card";
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 8;
    card.paddingTop = 24;
    card.paddingRight = 32;
    card.paddingBottom = 24;
    card.paddingLeft = 32;
    card.primaryAxisAlignItems = "CENTER";
    card.counterAxisAlignItems = "CENTER";
    card.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
    card.cornerRadius = 12;
    card.layoutGrow = 1;
    
    const value = figma.createText();
    value.fontName = FONTS.bodyBold;
    value.characters = metric.value;
    value.fontSize = 36;
    value.fills = [{ type: 'SOLID', color: metric.color }];
    value.textAlignHorizontal = "CENTER";
    
    const label = figma.createText();
    label.fontName = FONTS.bodyRegular;
    label.characters = metric.label;
    label.fontSize = 14;
    label.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
    label.textAlignHorizontal = "CENTER";
    
    card.appendChild(value);
    card.appendChild(label);
    component.appendChild(card);
  });
  
  return component;
}

// 30. Project/Mockup Placeholder (이미지 플레이스홀더 714x320)
function createMockupPlaceholder() {
  const component = figma.createComponent();
  component.name = "Project/Mockup Placeholder";
  component.layoutMode = "VERTICAL";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.resize(714, 320);
  component.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  component.cornerRadius = 12;
  component.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  component.strokeWeight = 2;
  component.dashPattern = [8, 8];
  
  const placeholder = figma.createText();
  placeholder.fontName = FONTS.bodyMedium;
  placeholder.characters = "Mockup Placeholder\n(앱/웹/발표 이미지)";
  placeholder.fontSize = 18;
  placeholder.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  placeholder.textAlignHorizontal = "CENTER";
  
  component.appendChild(placeholder);
  return component;
}

// ===========================================
// 템플릿 T1-T7
// ===========================================

// T1. Template/Cover (표지)
function createTemplateCover() {
  const template = figma.createFrame();
  template.name = "Template/Cover";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 120;
  template.paddingBottom = 48;
  template.itemSpacing = 0;
  template.primaryAxisAlignItems = "CENTER";
  template.counterAxisAlignItems = "CENTER";
  
  // Main Title
  const titleGroup = figma.createFrame();
  titleGroup.name = "Title Group";
  titleGroup.layoutMode = "VERTICAL";
  titleGroup.itemSpacing = 8;
  titleGroup.fills = [];
  titleGroup.primaryAxisAlignItems = "CENTER";
  
  const mainTitle = figma.createText();
  mainTitle.fontName = FONTS.heading;
  mainTitle.characters = "Portfolio 2026";
  mainTitle.fontSize = 48;
  mainTitle.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  mainTitle.textAlignHorizontal = "CENTER";
  
  const version = figma.createText();
  version.fontName = FONTS.headingRegular;
  version.characters = "v1.0.0";
  version.fontSize = 18;
  version.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  version.textAlignHorizontal = "CENTER";
  
  titleGroup.appendChild(mainTitle);
  titleGroup.appendChild(version);
  
  // Spacer 48px
  const spacer1 = figma.createFrame();
  spacer1.name = "Spacer";
  spacer1.resize(10, 48);
  spacer1.fills = [];
  
  // Name Group
  const nameGroup = figma.createFrame();
  nameGroup.name = "Name Group";
  nameGroup.layoutMode = "VERTICAL";
  nameGroup.itemSpacing = 8;
  nameGroup.fills = [];
  nameGroup.primaryAxisAlignItems = "CENTER";
  
  const name = figma.createText();
  name.fontName = FONTS.bodyBold;
  name.characters = CONTENT_DATA.cover.name;
  name.fontSize = 32;
  name.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  name.textAlignHorizontal = "CENTER";
  
  const jobTitle = figma.createText();
  jobTitle.fontName = FONTS.bodyRegular;
  jobTitle.characters = CONTENT_DATA.cover.jobTitle;
  jobTitle.fontSize = 18;
  jobTitle.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  jobTitle.textAlignHorizontal = "CENTER";
  
  nameGroup.appendChild(name);
  nameGroup.appendChild(jobTitle);
  
  // Spacer 32px
  const spacer2 = figma.createFrame();
  spacer2.name = "Spacer";
  spacer2.resize(10, 32);
  spacer2.fills = [];
  
  // Profile Image
  const profileImage = figma.createFrame();
  profileImage.name = "Profile Image";
  profileImage.resize(180, 180);
  profileImage.cornerRadius = 90;
  profileImage.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  profileImage.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  profileImage.strokeWeight = 2;
  
  const profileText = figma.createText();
  profileText.fontName = FONTS.bodyRegular;
  profileText.characters = "Profile\nImage";
  profileText.fontSize = 16;
  profileText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  profileText.textAlignHorizontal = "CENTER";
  profileText.x = 55;
  profileText.y = 70;
  profileImage.appendChild(profileText);
  
  // Spacer 32px
  const spacer3 = figma.createFrame();
  spacer3.name = "Spacer";
  spacer3.resize(10, 32);
  spacer3.fills = [];
  
  // Introduction
  const intro = figma.createText();
  intro.name = "Introduction";
  intro.fontName = FONTS.bodyRegular;
  intro.characters = CONTENT_DATA.cover.introduction;
  intro.fontSize = 14;
  intro.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  intro.textAlignHorizontal = "CENTER";
  intro.lineHeight = { value: 24, unit: "PIXELS" };
  intro.resize(634, 100);
  intro.textAutoResize = "HEIGHT";
  
  template.appendChild(titleGroup);
  template.appendChild(spacer1);
  template.appendChild(nameGroup);
  template.appendChild(spacer2);
  template.appendChild(profileImage);
  template.appendChild(spacer3);
  template.appendChild(intro);
  
  return template;
}

// T2. Template/Contents (목차)
function createTemplateContents() {
  const template = figma.createFrame();
  template.name = "Template/Contents";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 48;
  template.paddingBottom = 48;
  template.itemSpacing = 32;
  
  // Header
  const header = figma.createFrame();
  header.name = "Header";
  header.layoutMode = "VERTICAL";
  header.itemSpacing = 16;
  header.fills = [];
  header.resize(714, 60);
  header.primaryAxisSizingMode = "AUTO";
  
  const title = figma.createText();
  title.fontName = FONTS.heading;
  title.characters = "CONTENTS";
  title.fontSize = 32;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const divider = figma.createFrame();
  divider.resize(714, 1);
  divider.fills = [{ type: 'SOLID', color: COLORS.divider }];
  
  header.appendChild(title);
  header.appendChild(divider);
  
  template.appendChild(header);
  
  // Project Items
  CONTENT_DATA.projects.forEach((project, index) => {
    const item = figma.createFrame();
    item.name = "Project " + project.num;
    item.layoutMode = "HORIZONTAL";
    item.itemSpacing = 16;
    item.paddingTop = 24;
    item.paddingBottom = 24;
    item.fills = [];
    item.resize(714, 80);
    item.primaryAxisSizingMode = "FIXED";
    
    const number = figma.createText();
    number.fontName = FONTS.heading;
    number.characters = project.num;
    number.fontSize = 20;
    number.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
    
    const textGroup = figma.createFrame();
    textGroup.layoutMode = "VERTICAL";
    textGroup.itemSpacing = 4;
    textGroup.fills = [];
    textGroup.layoutGrow = 1;
    
    const projectName = figma.createText();
    projectName.fontName = FONTS.bodySemiBold;
    projectName.characters = project.name;
    projectName.fontSize = 18;
    projectName.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
    
    const description = figma.createText();
    description.fontName = FONTS.bodyRegular;
    description.characters = project.desc;
    description.fontSize = 14;
    description.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
    
    textGroup.appendChild(projectName);
    textGroup.appendChild(description);
    
    item.appendChild(number);
    item.appendChild(textGroup);
    
    template.appendChild(item);
    
    // Add divider except for last item
    if (index < CONTENT_DATA.projects.length - 1) {
      const itemDivider = figma.createFrame();
      itemDivider.resize(714, 1);
      itemDivider.fills = [{ type: 'SOLID', color: COLORS.divider }];
      template.appendChild(itemDivider);
    }
  });
  
  return template;
}

// T3. Template/Project Intro A (성과 중심)
function createTemplateProjectIntroA() {
  const template = figma.createFrame();
  template.name = "Template/Project Intro A";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 48;
  template.paddingBottom = 48;
  template.itemSpacing = 24;
  
  // Watermark
  const watermark = figma.createFrame();
  watermark.name = "Watermark";
  watermark.layoutMode = "HORIZONTAL";
  watermark.itemSpacing = 12;
  watermark.fills = [];
  watermark.counterAxisAlignItems = "BASELINE";
  
  const projectName = figma.createText();
  projectName.fontName = FONTS.heading;
  projectName.characters = "Traffic";
  projectName.fontSize = 56;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const versionText = figma.createText();
  versionText.fontName = FONTS.headingRegular;
  versionText.characters = "v1.0";
  versionText.fontSize = 18;
  versionText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  watermark.appendChild(projectName);
  watermark.appendChild(versionText);
  
  // Metric Hero
  const metricHero = figma.createFrame();
  metricHero.name = "Metric Hero";
  metricHero.layoutMode = "HORIZONTAL";
  metricHero.itemSpacing = 16;
  metricHero.fills = [];
  metricHero.resize(714, 150);
  metricHero.primaryAxisSizingMode = "FIXED";
  
  const metrics = [
    { value: "85%↓", label: "응답시간", color: COLORS.accentGreen },
    { value: "3x↑", label: "처리량", color: COLORS.accentBlue },
    { value: "99.9%", label: "안정성", color: COLORS.accentAmber }
  ];
  
  metrics.forEach(metric => {
    const card = figma.createFrame();
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 8;
    card.paddingTop = 24;
    card.paddingRight = 32;
    card.paddingBottom = 24;
    card.paddingLeft = 32;
    card.primaryAxisAlignItems = "CENTER";
    card.counterAxisAlignItems = "CENTER";
    card.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
    card.cornerRadius = 12;
    card.layoutGrow = 1;
    
    const value = figma.createText();
    value.fontName = FONTS.bodyBold;
    value.characters = metric.value;
    value.fontSize = 36;
    value.fills = [{ type: 'SOLID', color: metric.color }];
    
    const label = figma.createText();
    label.fontName = FONTS.bodyRegular;
    label.characters = metric.label;
    label.fontSize = 14;
    label.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
    
    card.appendChild(value);
    card.appendChild(label);
    metricHero.appendChild(card);
  });
  
  // Detail Section (2-column layout)
  const detailSection = createDetailSection();
  
  template.appendChild(watermark);
  template.appendChild(metricHero);
  template.appendChild(detailSection);
  
  return template;
}

// T4. Template/Project Intro B (이미지 중심)
function createTemplateProjectIntroB() {
  const template = figma.createFrame();
  template.name = "Template/Project Intro B";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 48;
  template.paddingBottom = 48;
  template.itemSpacing = 24;
  
  // Watermark
  const watermark = figma.createFrame();
  watermark.name = "Watermark";
  watermark.layoutMode = "HORIZONTAL";
  watermark.itemSpacing = 12;
  watermark.fills = [];
  watermark.counterAxisAlignItems = "BASELINE";
  
  const projectName = figma.createText();
  projectName.fontName = FONTS.heading;
  projectName.characters = "QuickLabel";
  projectName.fontSize = 56;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const versionText = figma.createText();
  versionText.fontName = FONTS.headingRegular;
  versionText.characters = "v1.0";
  versionText.fontSize = 18;
  versionText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  watermark.appendChild(projectName);
  watermark.appendChild(versionText);
  
  // Mockup Placeholder
  const mockup = figma.createFrame();
  mockup.name = "Mockup Placeholder";
  mockup.layoutMode = "VERTICAL";
  mockup.primaryAxisAlignItems = "CENTER";
  mockup.counterAxisAlignItems = "CENTER";
  mockup.resize(714, 320);
  mockup.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  mockup.cornerRadius = 12;
  mockup.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  mockup.strokeWeight = 2;
  mockup.dashPattern = [8, 8];
  
  const placeholder = figma.createText();
  placeholder.fontName = FONTS.bodyMedium;
  placeholder.characters = "Mockup Placeholder\n(앱/웹/발표 이미지)";
  placeholder.fontSize = 18;
  placeholder.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  placeholder.textAlignHorizontal = "CENTER";
  mockup.appendChild(placeholder);
  
  // Detail Section
  const detailSection = createDetailSection();
  
  template.appendChild(watermark);
  template.appendChild(mockup);
  template.appendChild(detailSection);
  
  return template;
}

// Helper: Detail Section (공통)
function createDetailSection() {
  const section = figma.createFrame();
  section.name = "Detail Section";
  section.layoutMode = "HORIZONTAL";
  section.itemSpacing = 24;
  section.fills = [];
  section.resize(714, 500);
  section.primaryAxisSizingMode = "FIXED";
  
  // Left: Meta Info (230px)
  const metaInfo = figma.createFrame();
  metaInfo.name = "Meta Info";
  metaInfo.layoutMode = "VERTICAL";
  metaInfo.itemSpacing = 16;
  metaInfo.paddingTop = 24;
  metaInfo.paddingRight = 24;
  metaInfo.paddingBottom = 24;
  metaInfo.paddingLeft = 24;
  metaInfo.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  metaInfo.cornerRadius = 8;
  metaInfo.resize(230, 500);
  metaInfo.primaryAxisSizingMode = "FIXED";
  
  // Period
  const periodLabel = figma.createText();
  periodLabel.fontName = FONTS.bodyMedium;
  periodLabel.characters = "기간";
  periodLabel.fontSize = 12;
  periodLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const periodValue = figma.createText();
  periodValue.fontName = FONTS.bodyRegular;
  periodValue.characters = "2024.03 - 2024.12";
  periodValue.fontSize = 14;
  periodValue.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  // Role
  const roleLabel = figma.createText();
  roleLabel.fontName = FONTS.bodyMedium;
  roleLabel.characters = "역할";
  roleLabel.fontSize = 12;
  roleLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const roleValue = figma.createText();
  roleValue.fontName = FONTS.bodyRegular;
  roleValue.characters = "백엔드 개발";
  roleValue.fontSize = 14;
  roleValue.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  // Tech Stack Label
  const techLabel = figma.createText();
  techLabel.fontName = FONTS.bodyMedium;
  techLabel.characters = "기술스택";
  techLabel.fontSize = 12;
  techLabel.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  // Tech Tags
  const techGroup = figma.createFrame();
  techGroup.layoutMode = "HORIZONTAL";
  techGroup.itemSpacing = 8;
  techGroup.layoutWrap = "WRAP";
  techGroup.fills = [];
  techGroup.resize(182, 80);
  techGroup.primaryAxisSizingMode = "FIXED";
  
  const tags = ["Spring", "MySQL", "Redis"];
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
    text.fontName = FONTS.bodyMedium;
    text.characters = tagName;
    text.fontSize = 12;
    text.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
    
    tag.appendChild(text);
    techGroup.appendChild(tag);
  });
  
  metaInfo.appendChild(periodLabel);
  metaInfo.appendChild(periodValue);
  metaInfo.appendChild(roleLabel);
  metaInfo.appendChild(roleValue);
  metaInfo.appendChild(techLabel);
  metaInfo.appendChild(techGroup);
  
  // Right: Content (460px)
  const content = figma.createFrame();
  content.name = "Content";
  content.layoutMode = "VERTICAL";
  content.itemSpacing = 24;
  content.fills = [];
  content.resize(460, 500);
  content.primaryAxisSizingMode = "FIXED";
  
  // 한 일 Section
  const workSection = figma.createFrame();
  workSection.layoutMode = "VERTICAL";
  workSection.itemSpacing = 12;
  workSection.fills = [];
  
  const workHeader = figma.createText();
  workHeader.fontName = FONTS.bodySemiBold;
  workHeader.characters = "📌 한 일";
  workHeader.fontSize = 16;
  workHeader.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const workList = figma.createText();
  workList.fontName = FONTS.bodyRegular;
  workList.characters = "• 쿼리 최적화 및 실행 계획 분석\n• 복합 인덱스 설계 및 적용\n• Redis 캐싱 레이어 구현";
  workList.fontSize = 14;
  workList.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  workList.lineHeight = { value: 24, unit: "PIXELS" };
  
  workSection.appendChild(workHeader);
  workSection.appendChild(workList);
  
  // Divider
  const divider = figma.createFrame();
  divider.resize(460, 1);
  divider.fills = [{ type: 'SOLID', color: COLORS.divider }];
  
  // 인사이트 Section
  const insightSection = figma.createFrame();
  insightSection.layoutMode = "VERTICAL";
  insightSection.itemSpacing = 8;
  insightSection.paddingTop = 16;
  insightSection.paddingRight = 20;
  insightSection.paddingBottom = 16;
  insightSection.paddingLeft = 20;
  insightSection.fills = [{ type: 'SOLID', color: COLORS.bgQuestion }];
  insightSection.cornerRadius = 8;
  
  const insightHeader = figma.createText();
  insightHeader.fontName = FONTS.bodySemiBold;
  insightHeader.characters = "💡 인사이트";
  insightHeader.fontSize = 14;
  insightHeader.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  
  const insightText = figma.createText();
  insightText.fontName = FONTS.bodyRegular;
  insightText.characters = "카디널리티와 쿼리 패턴을 함께 고려한 인덱스 설계의 중요성을 배웠습니다.";
  insightText.fontSize = 14;
  insightText.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  insightText.resize(420, 40);
  insightText.textAutoResize = "HEIGHT";
  
  insightSection.appendChild(insightHeader);
  insightSection.appendChild(insightText);
  
  content.appendChild(workSection);
  content.appendChild(divider);
  content.appendChild(insightSection);
  
  section.appendChild(metaInfo);
  section.appendChild(content);
  
  return section;
}

// T5. Template/Troubleshooting A (순차적 개선)
function createTemplateTroubleshootingA() {
  const template = figma.createFrame();
  template.name = "Template/Troubleshooting A";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 48;
  template.paddingBottom = 48;
  template.itemSpacing = 16;
  
  // Watermark
  const watermark = figma.createFrame();
  watermark.layoutMode = "HORIZONTAL";
  watermark.itemSpacing = 12;
  watermark.fills = [];
  watermark.counterAxisAlignItems = "BASELINE";
  
  const projectName = figma.createText();
  projectName.fontName = FONTS.heading;
  projectName.characters = "MMT";
  projectName.fontSize = 56;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const versionText = figma.createText();
  versionText.fontName = FONTS.headingRegular;
  versionText.characters = "v1.0";
  versionText.fontSize = 18;
  versionText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  watermark.appendChild(projectName);
  watermark.appendChild(versionText);
  
  // Title
  const title = figma.createText();
  title.fontName = FONTS.bodyBold;
  title.characters = "DB 인덱싱으로 조회 성능 85% 개선";
  title.fontSize = 24;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  // Problem Section Header
  const problemHeader = figma.createFrame();
  problemHeader.layoutMode = "HORIZONTAL";
  problemHeader.itemSpacing = 8;
  problemHeader.fills = [];
  
  const problemEmoji = figma.createText();
  problemEmoji.fontName = FONTS.bodyRegular;
  problemEmoji.characters = "🔴";
  problemEmoji.fontSize = 18;
  
  const problemText = figma.createText();
  problemText.fontName = FONTS.bodySemiBold;
  problemText.characters = "문제상황";
  problemText.fontSize = 18;
  problemText.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  problemHeader.appendChild(problemEmoji);
  problemHeader.appendChild(problemText);
  
  // Problem Box
  const problemBox = figma.createFrame();
  problemBox.layoutMode = "VERTICAL";
  problemBox.paddingTop = 20;
  problemBox.paddingRight = 24;
  problemBox.paddingBottom = 20;
  problemBox.paddingLeft = 24;
  problemBox.fills = [{ type: 'SOLID', color: COLORS.bgProblem }];
  problemBox.cornerRadius = 8;
  problemBox.resize(714, 80);
  problemBox.primaryAxisSizingMode = "AUTO";
  
  const problemContent = figma.createText();
  problemContent.fontName = FONTS.bodyRegular;
  problemContent.characters = "조회 API 응답 시간이 평균 2.3초로, 사용자 이탈률이 증가하고 있었습니다.";
  problemContent.fontSize = 14;
  problemContent.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  problemBox.appendChild(problemContent);
  
  // Arrow 1
  const arrow1 = createArrowElement();
  
  // Solution Section Header
  const solutionHeader = figma.createFrame();
  solutionHeader.layoutMode = "HORIZONTAL";
  solutionHeader.itemSpacing = 8;
  solutionHeader.fills = [];
  
  const solutionEmoji = figma.createText();
  solutionEmoji.fontName = FONTS.bodyRegular;
  solutionEmoji.characters = "🔧";
  solutionEmoji.fontSize = 18;
  
  const solutionText = figma.createText();
  solutionText.fontName = FONTS.bodySemiBold;
  solutionText.characters = "해결 과정";
  solutionText.fontSize = 18;
  solutionText.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  solutionHeader.appendChild(solutionEmoji);
  solutionHeader.appendChild(solutionText);
  
  // Attempt Cards
  const attempts = [
    { num: "시도 1", title: "쿼리 최적화", content: "N+1 문제 해결을 위해 fetch join 적용", result: "→ 결과: 2.3s → 1.8s (22% 개선)" },
    { num: "시도 2", title: "인덱스 추가", content: "복합 인덱스 설계 및 커버링 인덱스 적용", result: "→ 결과: 1.8s → 0.8s (56% 개선)" },
    { num: "시도 3", title: "캐싱 적용", content: "Redis 캐싱으로 반복 조회 최적화", result: "→ 결과: 0.8s → 0.4s (50% 개선)" }
  ];
  
  template.appendChild(watermark);
  template.appendChild(title);
  template.appendChild(problemHeader);
  template.appendChild(problemBox);
  template.appendChild(arrow1);
  template.appendChild(solutionHeader);
  
  attempts.forEach((attempt, index) => {
    const card = createAttemptCardElement(attempt);
    template.appendChild(card);
    
    if (index < attempts.length - 1) {
      const spacer = figma.createFrame();
      spacer.resize(10, 8);
      spacer.fills = [];
      template.appendChild(spacer);
    }
  });
  
  // Arrow 2
  const arrow2 = createArrowElement();
  template.appendChild(arrow2);
  
  // Conclusion Box
  const conclusionBox = figma.createFrame();
  conclusionBox.layoutMode = "VERTICAL";
  conclusionBox.itemSpacing = 12;
  conclusionBox.paddingTop = 24;
  conclusionBox.paddingRight = 32;
  conclusionBox.paddingBottom = 24;
  conclusionBox.paddingLeft = 32;
  conclusionBox.fills = [{ type: 'SOLID', color: COLORS.bgSolution }];
  conclusionBox.cornerRadius = 8;
  conclusionBox.resize(714, 100);
  conclusionBox.primaryAxisSizingMode = "AUTO";
  
  const conclusionHeader = figma.createText();
  conclusionHeader.fontName = FONTS.bodySemiBold;
  conclusionHeader.characters = "✅ 결과";
  conclusionHeader.fontSize = 16;
  conclusionHeader.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  const metricRow = figma.createFrame();
  metricRow.layoutMode = "HORIZONTAL";
  metricRow.itemSpacing = 16;
  metricRow.fills = [];
  metricRow.counterAxisAlignItems = "BASELINE";
  
  const mainMetric = figma.createText();
  mainMetric.fontName = FONTS.bodyBold;
  mainMetric.characters = "2.3s → 0.4s";
  mainMetric.fontSize = 32;
  mainMetric.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const percentage = figma.createText();
  percentage.fontName = FONTS.bodyBold;
  percentage.characters = "(85%↓)";
  percentage.fontSize = 24;
  percentage.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  metricRow.appendChild(mainMetric);
  metricRow.appendChild(percentage);
  conclusionBox.appendChild(conclusionHeader);
  conclusionBox.appendChild(metricRow);
  
  template.appendChild(conclusionBox);
  
  return template;
}

// T6. Template/Troubleshooting B (언어 비교)
function createTemplateTroubleshootingB() {
  const template = figma.createFrame();
  template.name = "Template/Troubleshooting B";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 48;
  template.paddingBottom = 48;
  template.itemSpacing = 24;
  
  // Watermark
  const watermark = figma.createFrame();
  watermark.layoutMode = "HORIZONTAL";
  watermark.itemSpacing = 12;
  watermark.fills = [];
  watermark.counterAxisAlignItems = "BASELINE";
  
  const projectName = figma.createText();
  projectName.fontName = FONTS.heading;
  projectName.characters = "MMT";
  projectName.fontSize = 56;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const versionText = figma.createText();
  versionText.fontName = FONTS.headingRegular;
  versionText.characters = "v1.0";
  versionText.fontSize = 18;
  versionText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  watermark.appendChild(projectName);
  watermark.appendChild(versionText);
  
  // Title
  const title = figma.createText();
  title.fontName = FONTS.bodyBold;
  title.characters = "동시성 제어: Java vs iOS 비교";
  title.fontSize = 24;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  // Comparison Table
  const compTable = figma.createFrame();
  compTable.layoutMode = "HORIZONTAL";
  compTable.itemSpacing = 0;
  compTable.fills = [];
  compTable.resize(714, 400);
  
  // Java Column
  const javaCol = figma.createFrame();
  javaCol.layoutMode = "VERTICAL";
  javaCol.itemSpacing = 0;
  javaCol.resize(357, 400);
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
  javaEmoji.fontName = FONTS.bodyRegular;
  javaEmoji.characters = "☕";
  javaEmoji.fontSize = 18;
  
  const javaTitle = figma.createText();
  javaTitle.fontName = FONTS.bodySemiBold;
  javaTitle.characters = "Java / Spring";
  javaTitle.fontSize = 16;
  javaTitle.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  javaHeader.appendChild(javaEmoji);
  javaHeader.appendChild(javaTitle);
  
  const javaContent = figma.createFrame();
  javaContent.layoutMode = "VERTICAL";
  javaContent.itemSpacing = 12;
  javaContent.paddingTop = 20;
  javaContent.paddingRight = 20;
  javaContent.paddingBottom = 20;
  javaContent.paddingLeft = 20;
  javaContent.fills = [{ type: 'SOLID', color: COLORS.white }];
  javaContent.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  javaContent.strokeWeight = 1;
  javaContent.resize(357, 350);
  javaContent.primaryAxisSizingMode = "FIXED";
  
  const javaText = figma.createText();
  javaText.fontName = FONTS.bodyRegular;
  javaText.characters = "• synchronized 키워드\n• ReentrantLock\n• @Transactional\n• CompletableFuture";
  javaText.fontSize = 14;
  javaText.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  javaText.lineHeight = { value: 28, unit: "PIXELS" };
  
  javaContent.appendChild(javaText);
  javaCol.appendChild(javaHeader);
  javaCol.appendChild(javaContent);
  
  // iOS Column
  const iosCol = figma.createFrame();
  iosCol.layoutMode = "VERTICAL";
  iosCol.itemSpacing = 0;
  iosCol.resize(357, 400);
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
  iosEmoji.fontName = FONTS.bodyRegular;
  iosEmoji.characters = "🍎";
  iosEmoji.fontSize = 18;
  
  const iosTitle = figma.createText();
  iosTitle.fontName = FONTS.bodySemiBold;
  iosTitle.characters = "iOS / Swift";
  iosTitle.fontSize = 16;
  iosTitle.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  iosHeader.appendChild(iosEmoji);
  iosHeader.appendChild(iosTitle);
  
  const iosContent = figma.createFrame();
  iosContent.layoutMode = "VERTICAL";
  iosContent.itemSpacing = 12;
  iosContent.paddingTop = 20;
  iosContent.paddingRight = 20;
  iosContent.paddingBottom = 20;
  iosContent.paddingLeft = 20;
  iosContent.fills = [{ type: 'SOLID', color: COLORS.white }];
  iosContent.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  iosContent.strokeWeight = 1;
  iosContent.resize(357, 350);
  iosContent.primaryAxisSizingMode = "FIXED";
  
  const iosText = figma.createText();
  iosText.fontName = FONTS.bodyRegular;
  iosText.characters = "• DispatchQueue\n• Actor\n• async/await\n• Task Group";
  iosText.fontSize = 14;
  iosText.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  iosText.lineHeight = { value: 28, unit: "PIXELS" };
  
  iosContent.appendChild(iosText);
  iosCol.appendChild(iosHeader);
  iosCol.appendChild(iosContent);
  
  compTable.appendChild(javaCol);
  compTable.appendChild(iosCol);
  
  // Insight Box
  const insightBox = figma.createFrame();
  insightBox.layoutMode = "VERTICAL";
  insightBox.itemSpacing = 8;
  insightBox.paddingTop = 16;
  insightBox.paddingRight = 20;
  insightBox.paddingBottom = 16;
  insightBox.paddingLeft = 20;
  insightBox.fills = [{ type: 'SOLID', color: COLORS.bgQuestion }];
  insightBox.cornerRadius = 8;
  insightBox.resize(714, 100);
  insightBox.primaryAxisSizingMode = "AUTO";
  
  const insightHeader = figma.createText();
  insightHeader.fontName = FONTS.bodySemiBold;
  insightHeader.characters = "💡 인사이트";
  insightHeader.fontSize = 14;
  insightHeader.fills = [{ type: 'SOLID', color: COLORS.accentBlue }];
  
  const insightText = figma.createText();
  insightText.fontName = FONTS.bodyRegular;
  insightText.characters = "두 언어의 동시성 모델을 비교하며, 각 플랫폼에 적합한 패턴을 선택하는 안목을 기를 수 있었습니다.";
  insightText.fontSize = 14;
  insightText.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  insightText.resize(674, 40);
  insightText.textAutoResize = "HEIGHT";
  
  insightBox.appendChild(insightHeader);
  insightBox.appendChild(insightText);
  
  template.appendChild(watermark);
  template.appendChild(title);
  template.appendChild(compTable);
  template.appendChild(insightBox);
  
  return template;
}

// T7. Template/Troubleshooting C (시나리오 + 독립 개선)
function createTemplateTroubleshootingC() {
  const template = figma.createFrame();
  template.name = "Template/Troubleshooting C";
  template.resize(794, 1123);
  template.fills = [{ type: 'SOLID', color: COLORS.white }];
  template.layoutMode = "VERTICAL";
  template.paddingLeft = 40;
  template.paddingRight = 40;
  template.paddingTop = 48;
  template.paddingBottom = 48;
  template.itemSpacing = 12;
  
  // Watermark
  const watermark = figma.createFrame();
  watermark.layoutMode = "HORIZONTAL";
  watermark.itemSpacing = 12;
  watermark.fills = [];
  watermark.counterAxisAlignItems = "BASELINE";
  
  const projectName = figma.createText();
  projectName.fontName = FONTS.heading;
  projectName.characters = "MMT";
  projectName.fontSize = 56;
  projectName.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  const versionText = figma.createText();
  versionText.fontName = FONTS.headingRegular;
  versionText.characters = "v1.0";
  versionText.fontSize = 18;
  versionText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  watermark.appendChild(projectName);
  watermark.appendChild(versionText);
  
  // Title
  const title = figma.createText();
  title.fontName = FONTS.bodyBold;
  title.characters = "대규모 트래픽 대응 설계";
  title.fontSize = 24;
  title.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  // Basic Question Box
  const questionBasic = figma.createFrame();
  questionBasic.layoutMode = "HORIZONTAL";
  questionBasic.itemSpacing = 12;
  questionBasic.paddingTop = 20;
  questionBasic.paddingRight = 24;
  questionBasic.paddingBottom = 20;
  questionBasic.paddingLeft = 24;
  questionBasic.fills = [{ type: 'SOLID', color: COLORS.bgGray }];
  questionBasic.cornerRadius = 8;
  questionBasic.resize(714, 70);
  questionBasic.primaryAxisSizingMode = "FIXED";
  questionBasic.counterAxisAlignItems = "CENTER";
  
  const qEmoji = figma.createText();
  qEmoji.fontName = FONTS.bodyRegular;
  qEmoji.characters = "💭";
  qEmoji.fontSize = 24;
  
  const qText = figma.createText();
  qText.fontName = FONTS.bodyMedium;
  qText.characters = '"사용자가 1000만명이 된다면?"';
  qText.fontSize = 18;
  qText.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  questionBasic.appendChild(qEmoji);
  questionBasic.appendChild(qText);
  
  // Arrow
  const arrow1 = createArrowElement();
  
  // Derived Questions (2 columns)
  const derivedRow = figma.createFrame();
  derivedRow.layoutMode = "HORIZONTAL";
  derivedRow.itemSpacing = 16;
  derivedRow.fills = [];
  derivedRow.resize(714, 90);
  
  const derivedQuestions = [
    { label: "❓ 요청 부하", question: "동시 요청이 폭증하면?" },
    { label: "❓ 데이터 일관성", question: "동시 수정이 발생하면?" }
  ];
  
  derivedQuestions.forEach(dq => {
    const box = figma.createFrame();
    box.layoutMode = "VERTICAL";
    box.itemSpacing = 8;
    box.paddingTop = 16;
    box.paddingRight = 20;
    box.paddingBottom = 16;
    box.paddingLeft = 20;
    box.fills = [{ type: 'SOLID', color: COLORS.white }];
    box.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
    box.strokeWeight = 2;
    box.cornerRadius = 8;
    box.layoutGrow = 1;
    
    const label = figma.createText();
    label.fontName = FONTS.bodyMedium;
    label.characters = dq.label;
    label.fontSize = 12;
    label.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
    
    const question = figma.createText();
    question.fontName = FONTS.bodyMedium;
    question.characters = dq.question;
    question.fontSize = 16;
    question.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
    
    box.appendChild(label);
    box.appendChild(question);
    derivedRow.appendChild(box);
  });
  
  // Arrow
  const arrow2 = createArrowElement();
  
  // Section Header
  const sectionHeader = figma.createFrame();
  sectionHeader.layoutMode = "HORIZONTAL";
  sectionHeader.itemSpacing = 8;
  sectionHeader.fills = [];
  
  const shEmoji = figma.createText();
  shEmoji.fontName = FONTS.bodyRegular;
  shEmoji.characters = "🔧";
  shEmoji.fontSize = 18;
  
  const shText = figma.createText();
  shText.fontName = FONTS.bodySemiBold;
  shText.characters = "개선안";
  shText.fontSize = 18;
  shText.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  sectionHeader.appendChild(shEmoji);
  sectionHeader.appendChild(shText);
  
  // Improvement Cards (3 columns)
  const improvementRow = figma.createFrame();
  improvementRow.layoutMode = "HORIZONTAL";
  improvementRow.itemSpacing = 16;
  improvementRow.fills = [];
  improvementRow.resize(714, 160);
  
  const improvements = [
    { title: "캐싱 레이어 추가", desc: "Redis 캐싱으로 반복 조회 최적화", metric: "70%↓" },
    { title: "비동기 처리", desc: "이벤트 기반 아키텍처 적용", metric: "50%↓" },
    { title: "DB 샤딩", desc: "수평 분할로 부하 분산", metric: "3x↑" }
  ];
  
  improvements.forEach(imp => {
    const card = figma.createFrame();
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 12;
    card.paddingTop = 20;
    card.paddingRight = 20;
    card.paddingBottom = 20;
    card.paddingLeft = 20;
    card.fills = [{ type: 'SOLID', color: COLORS.white }];
    card.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
    card.strokeWeight = 1;
    card.cornerRadius = 8;
    card.layoutGrow = 1;
    
    const cardTitle = figma.createText();
    cardTitle.fontName = FONTS.bodySemiBold;
    cardTitle.characters = imp.title;
    cardTitle.fontSize = 14;
    cardTitle.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
    
    const cardDesc = figma.createText();
    cardDesc.fontName = FONTS.bodyRegular;
    cardDesc.characters = imp.desc;
    cardDesc.fontSize = 12;
    cardDesc.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
    cardDesc.resize(180, 30);
    cardDesc.textAutoResize = "HEIGHT";
    
    const cardMetric = figma.createText();
    cardMetric.fontName = FONTS.bodyBold;
    cardMetric.characters = imp.metric;
    cardMetric.fontSize = 28;
    cardMetric.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
    
    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    card.appendChild(cardMetric);
    improvementRow.appendChild(card);
  });
  
  // Arrow
  const arrow3 = createArrowElement();
  
  // Conclusion Box
  const conclusionBox = figma.createFrame();
  conclusionBox.layoutMode = "VERTICAL";
  conclusionBox.itemSpacing = 12;
  conclusionBox.paddingTop = 24;
  conclusionBox.paddingRight = 32;
  conclusionBox.paddingBottom = 24;
  conclusionBox.paddingLeft = 32;
  conclusionBox.fills = [{ type: 'SOLID', color: COLORS.bgSolution }];
  conclusionBox.cornerRadius = 8;
  conclusionBox.resize(714, 100);
  conclusionBox.primaryAxisSizingMode = "AUTO";
  
  const conclusionHeader = figma.createText();
  conclusionHeader.fontName = FONTS.bodySemiBold;
  conclusionHeader.characters = "✅ 최종 결과";
  conclusionHeader.fontSize = 16;
  conclusionHeader.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  const metricRow = figma.createFrame();
  metricRow.layoutMode = "HORIZONTAL";
  metricRow.itemSpacing = 16;
  metricRow.fills = [];
  metricRow.counterAxisAlignItems = "BASELINE";
  
  const mainMetric = figma.createText();
  mainMetric.fontName = FONTS.bodyBold;
  mainMetric.characters = "TPS: 100 → 10,000";
  mainMetric.fontSize = 32;
  mainMetric.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  const percentage = figma.createText();
  percentage.fontName = FONTS.bodyBold;
  percentage.characters = "(100x↑)";
  percentage.fontSize = 24;
  percentage.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  metricRow.appendChild(mainMetric);
  metricRow.appendChild(percentage);
  conclusionBox.appendChild(conclusionHeader);
  conclusionBox.appendChild(metricRow);
  
  template.appendChild(watermark);
  template.appendChild(title);
  template.appendChild(questionBasic);
  template.appendChild(arrow1);
  template.appendChild(derivedRow);
  template.appendChild(arrow2);
  template.appendChild(sectionHeader);
  template.appendChild(improvementRow);
  template.appendChild(arrow3);
  template.appendChild(conclusionBox);
  
  return template;
}

// Helper: Arrow Element
function createArrowElement() {
  const arrow = figma.createFrame();
  arrow.resize(714, 40);
  arrow.fills = [];
  arrow.layoutMode = "HORIZONTAL";
  arrow.primaryAxisAlignItems = "CENTER";
  arrow.counterAxisAlignItems = "CENTER";
  
  const arrowText = figma.createText();
  arrowText.fontName = FONTS.bodyRegular;
  arrowText.characters = "↓";
  arrowText.fontSize = 24;
  arrowText.fills = [{ type: 'SOLID', color: COLORS.primary400 }];
  
  arrow.appendChild(arrowText);
  return arrow;
}

// Helper: Attempt Card Element
function createAttemptCardElement(attempt) {
  const card = figma.createFrame();
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 8;
  card.paddingTop = 16;
  card.paddingRight = 24;
  card.paddingBottom = 16;
  card.paddingLeft = 24;
  card.fills = [{ type: 'SOLID', color: COLORS.white }];
  card.strokes = [{ type: 'SOLID', color: COLORS.primary100 }];
  card.strokeWeight = 1;
  card.cornerRadius = 8;
  card.resize(714, 100);
  card.primaryAxisSizingMode = "AUTO";
  
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
  badgeText.fontName = FONTS.bodySemiBold;
  badgeText.characters = attempt.num;
  badgeText.fontSize = 12;
  badgeText.fills = [{ type: 'SOLID', color: COLORS.white }];
  badge.appendChild(badgeText);
  
  const titleText = figma.createText();
  titleText.fontName = FONTS.bodySemiBold;
  titleText.characters = attempt.title;
  titleText.fontSize = 16;
  titleText.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  header.appendChild(badge);
  header.appendChild(titleText);
  
  const content = figma.createText();
  content.fontName = FONTS.bodyRegular;
  content.characters = attempt.content;
  content.fontSize = 14;
  content.fills = [{ type: 'SOLID', color: COLORS.primary700 }];
  
  const result = figma.createText();
  result.fontName = FONTS.bodyMedium;
  result.characters = attempt.result;
  result.fontSize = 14;
  result.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  card.appendChild(header);
  card.appendChild(content);
  card.appendChild(result);
  
  return card;
}

main();
