// Portfolio Component Generator - 테스트 버전
// 핵심 컴포넌트 3개만 생성

const COLORS = {
  primary900: { r: 0.102, g: 0.102, b: 0.180 },
  primary400: { r: 0.420, g: 0.447, b: 0.502 },
  primary100: { r: 0.953, g: 0.957, b: 0.965 },
  white: { r: 1, g: 1, b: 1 },
  accentGreen: { r: 0.063, g: 0.725, b: 0.506 },
};

async function main() {
  // 폰트 1개만 로드 (테스트)
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  figma.notify("⏳ 폰트 로드 완료, 컴포넌트 생성 중...");

  const page = figma.currentPage;
  let yOffset = 0;
  const GAP = 100;

  // 1. 콘텐츠 프레임 (가장 단순)
  const frame = figma.createComponent();
  frame.name = "TEST/Content Frame";
  frame.resize(794, 1123);
  frame.fills = [{ type: 'SOLID', color: COLORS.white }];
  frame.y = yOffset;
  yOffset += frame.height + GAP;

  // 2. 기술스택 태그 (텍스트 포함)
  const tag = figma.createComponent();
  tag.name = "TEST/Tech Tag";
  tag.layoutMode = "HORIZONTAL";
  tag.paddingTop = 4;
  tag.paddingRight = 12;
  tag.paddingBottom = 4;
  tag.paddingLeft = 12;
  tag.fills = [{ type: 'SOLID', color: COLORS.primary100 }];
  tag.cornerRadius = 4;
  
  const tagText = figma.createText();
  tagText.characters = "Spring";
  tagText.fontSize = 12;
  tagText.fontName = { family: "Inter", style: "Regular" };
  tagText.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  tag.appendChild(tagText);
  tag.y = yOffset;
  yOffset += 50 + GAP;

  // 3. 성과 카드 (숫자 강조)
  const card = figma.createComponent();
  card.name = "TEST/Metric Card";
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
  value.characters = "85%";
  value.fontSize = 32;
  value.fontName = { family: "Inter", style: "Regular" };
  value.fills = [{ type: 'SOLID', color: COLORS.accentGreen }];
  
  const label = figma.createText();
  label.characters = "개선";
  label.fontSize = 14;
  label.fontName = { family: "Inter", style: "Regular" };
  label.fills = [{ type: 'SOLID', color: COLORS.primary900 }];
  
  card.appendChild(value);
  card.appendChild(label);
  card.y = yOffset;

  figma.notify("✅ 테스트 컴포넌트 3개 생성 완료!");
  figma.closePlugin();
}

main();
