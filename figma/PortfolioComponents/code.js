async function main() {
  const styles = ["Thin", "Light", "Regular", "Medium",  "SemiBold", "Semi Bold", "Bold", "Black"];
  
  for (const style of styles) {
    try {
      await figma.loadFontAsync({ family: "Noto Sans KR", style: style });
      console.log("✅ Noto Sans KR " + style + " - 사용 가능");
    } catch (e) {
      console.log("❌ Noto Sans KR " + style + " - 없음");
    }
  }
  
  figma.notify("콘솔에서 사용 가능한 폰트 확인!");
  figma.closePlugin();
}

main();
