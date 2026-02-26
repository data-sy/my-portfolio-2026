// ============================================================================
// Portfolio PoC - Figma Plugin
// ============================================================================

const COLORS = {
  primary900: { r: 0.102, g: 0.102, b: 0.180 },
  primary700: { r: 0.176, g: 0.176, b: 0.267 },
  primary400: { r: 0.420, g: 0.443, b: 0.502 },
  white: { r: 1, g: 1, b: 1 },
  divider: { r: 0.898, g: 0.906, b: 0.922 },
  green: { r: 0.063, g: 0.725, b: 0.506 }
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

async function loadFonts() {
  const fonts = [
    { family: "Noto Sans KR", style: "Regular" },
    { family: "Noto Sans KR", style: "Medium" },
    { family: "Noto Sans KR", style: "Bold" }
  ];
  
  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
    } catch (e) {
      console.warn(`폰트 로드 실패: ${font.family}`);
    }
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : COLORS.primary700;
}

function createText(options) {
  const {
    content = "",
    fontStyle = "Regular",
    fontSize = 14,
    color = COLORS.primary700,
    width = null
  } = options;
  
  const text = figma.createText();
  text.fontName = { family: "Noto Sans KR", style: fontStyle };
  text.characters = content;
  text.fontSize = fontSize;
  text.fills = [{ type: "SOLID", color }];
  
  if (width) {
    text.resize(width, text.height);
    text.textAutoResize = "HEIGHT";
  }
  
  text.lineHeight = { value: fontSize * 1.5, unit: "PIXELS" };
  
  return text;
}

function createAutoLayoutFrame(options) {
  const {
    name = "Frame",
    direction = "VERTICAL",
    padding = 0,
    itemSpacing = 0,
    width = null,
    fills = [],
    cornerRadius = 0
  } = options;
  
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  
  const p = typeof padding === 'number' ? padding : 0;
  frame.paddingTop = p;
  frame.paddingBottom = p;
  frame.paddingLeft = p;
  frame.paddingRight = p;
  
  frame.itemSpacing = itemSpacing;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = width ? "FIXED" : "AUTO";
  frame.fills = fills;
  frame.cornerRadius = cornerRadius;
  
  if (width) frame.resize(width, frame.height);
  
  return frame;
}

// ============================================================================
// 트러블슈팅 페이지 생성
// ============================================================================

function createTroubleshootingPage(data) {
  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;
  const MARGIN = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  
  // 페이지 프레임
  const page = figma.createFrame();
  page.name = `PoC - ${data.company || 'default'}`;
  page.resize(PAGE_WIDTH, PAGE_HEIGHT);
  page.fills = [{ type: "SOLID", color: COLORS.white }];
  
  let currentY = MARGIN;
  
  // ─────────────────────────────────────────────
  // 1. 하이라이트 박스 (회사별 커스텀)
  // ─────────────────────────────────────────────
  if (data.highlight && data.highlight.enabled) {
    const highlightBox = createAutoLayoutFrame({
      name: "Highlight",
      padding: 16,
      width: CONTENT_WIDTH,
      fills: [{ 
        type: "SOLID", 
        color: hexToRgb(data.highlight.color),
        opacity: 0.1
      }],
      cornerRadius: 8
    });
    
    const highlightText = createText({
      content: data.highlight.text,
      fontStyle: "Bold",
      fontSize: 15,
      color: hexToRgb(data.highlight.color),
      width: CONTENT_WIDTH - 32
    });
    
    highlightBox.appendChild(highlightText);
    highlightBox.x = MARGIN;
    highlightBox.y = currentY;
    page.appendChild(highlightBox);
    
    currentY += highlightBox.height + 24;
  }
  
  // ─────────────────────────────────────────────
  // 2. 제목
  // ─────────────────────────────────────────────
  const title = createText({
    content: data.troubleshooting.title,
    fontStyle: "Bold",
    fontSize: 24,
    color: COLORS.primary900,
    width: CONTENT_WIDTH
  });
  title.x = MARGIN;
  title.y = currentY;
  page.appendChild(title);
  
  currentY += title.height + 24;
  
  // ─────────────────────────────────────────────
  // 3. 문제 상황
  // ─────────────────────────────────────────────
  const problemBox = createAutoLayoutFrame({
    name: "Problem",
    padding: 20,
    width: CONTENT_WIDTH,
    itemSpacing: 12,
    fills: [{ type: "SOLID", color: { r: 0.98, g: 0.95, b: 0.95 } }],
    cornerRadius: 8
  });
  
  const problemLabel = createText({
    content: "❌ 문제 상황",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  const problemDesc = createText({
    content: data.troubleshooting.problem,
    fontSize: 14,
    color: COLORS.primary700,
    width: CONTENT_WIDTH - 40
  });
  
  problemBox.appendChild(problemLabel);
  problemBox.appendChild(problemDesc);
  problemBox.x = MARGIN;
  problemBox.y = currentY;
  page.appendChild(problemBox);
  
  currentY += problemBox.height + 24;
  
  // ─────────────────────────────────────────────
  // 4. 결과
  // ─────────────────────────────────────────────
  const resultBox = createAutoLayoutFrame({
    name: "Result",
    padding: 20,
    width: CONTENT_WIDTH,
    itemSpacing: 12,
    fills: [{ type: "SOLID", color: { r: 0.94, g: 0.99, b: 0.96 } }],
    cornerRadius: 8
  });
  
  const resultLabel = createText({
    content: "✅ 결과",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  const resultValue = createText({
    content: data.troubleshooting.result,
    fontStyle: "Bold",
    fontSize: 20,
    color: COLORS.green,
    width: CONTENT_WIDTH - 40
  });
  
  resultBox.appendChild(resultLabel);
  resultBox.appendChild(resultValue);
  resultBox.x = MARGIN;
  resultBox.y = currentY;
  page.appendChild(resultBox);
  
  currentY += resultBox.height + 24;
  
  // ─────────────────────────────────────────────
  // 5. 인사이트
  // ─────────────────────────────────────────────
  const insightBox = createAutoLayoutFrame({
    name: "Insight",
    padding: 20,
    width: CONTENT_WIDTH,
    itemSpacing: 12,
    fills: [{ type: "SOLID", color: { r: 0.95, g: 0.96, b: 0.99 } }],
    cornerRadius: 8
  });
  
  const insightLabel = createText({
    content: "💡 인사이트",
    fontStyle: "Bold",
    fontSize: 16,
    color: COLORS.primary900
  });
  
  const insightDesc = createText({
    content: data.troubleshooting.insight,
    fontSize: 14,
    color: COLORS.primary700,
    width: CONTENT_WIDTH - 40
  });
  
  insightBox.appendChild(insightLabel);
  insightBox.appendChild(insightDesc);
  insightBox.x = MARGIN;
  insightBox.y = currentY;
  page.appendChild(insightBox);
  
  currentY += insightBox.height + 24;
  
  // ─────────────────────────────────────────────
  // 6. 회사별 강조 사항 (있으면)
  // ─────────────────────────────────────────────
  if (data.troubleshooting.emphasis) {
    const emphasisBox = createAutoLayoutFrame({
      name: "Emphasis",
      padding: 16,
      width: CONTENT_WIDTH,
      fills: [{ type: "SOLID", color: { r: 1, g: 0.98, b: 0.93 } }],
      cornerRadius: 8
    });
    
    const emphasisText = createText({
      content: `📌 ${data.troubleshooting.emphasis}`,
      fontStyle: "Medium",
      fontSize: 13,
      color: COLORS.primary700,
      width: CONTENT_WIDTH - 32
    });
    
    emphasisBox.appendChild(emphasisText);
    emphasisBox.x = MARGIN;
    emphasisBox.y = currentY;
    page.appendChild(emphasisBox);
  }
  
  return page;
}

// ============================================================================
// 메인 로직
// ============================================================================

figma.showUI(__html__, { width: 320, height: 240 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    try {
      // 폰트 로드
      await loadFonts();
      
      // 페이지 생성
      const page = createTroubleshootingPage(msg.data);
      
      // 현재 페이지에 추가
      figma.currentPage.appendChild(page);
      
      // 뷰포트 이동
      figma.viewport.scrollAndZoomIntoView([page]);
      
      // 성공 메시지
      figma.ui.postMessage({ 
        type: 'generation-complete',
        company: msg.data.company
      });
      
      figma.notify(`✅ ${msg.data.company || '기본'} 포트폴리오 생성 완료!`);
      
    } catch (error) {
      figma.ui.postMessage({ 
        type: 'generation-error',
        error: error.message
      });
      
      figma.notify(`❌ 생성 실패: ${error.message}`);
    }
  }
};
