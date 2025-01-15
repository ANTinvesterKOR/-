// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
async function fetchBriefsFromAPI() {
  const url = "https://static.newsfilter.io/landing-page/briefs.json"; // JSON 데이터 URL
  const req = new Request(url);
  
  try {
    const response = await req.loadJSON();
    console.log("API Response:", response); // JSON 응답 디버깅
    return response.slice(0, 5); // 상위 5개만 반환
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
}

async function createWidget() {
  let widget = new ListWidget();
  widget.backgroundColor = new Color("#1e1e1e"); // 어두운 배경색

  // 헤더
  let header = widget.addText("Latest Briefs");
  header.font = Font.boldSystemFont(14); // 헤더 글자 크기
  header.textColor = Color.white();

  widget.addSpacer(6);

  let briefs;

  try {
    briefs = await fetchBriefsFromAPI();
  } catch (e) {
    let errorText = widget.addText("Failed to load briefs.");
    errorText.textColor = Color.red();
    return widget;
  }

  // 최신 5개 브리프 표시
  for (const brief of briefs) {
    const title = brief.article.title || "No title"; // 제목 가져오기
    const text = brief.text || "No content"; // 요약 텍스트 가져오기
    const url = brief.article.url || "https://newsfilter.io"; // 기사 URL 가져오기
    const stocks = brief.article.symbols.join(", ").toUpperCase() || "No stocks"; // 대문자로 주식명 표시

    let stockLine = widget.addText(stocks); // 주식명 대문자 형태로 표시
    stockLine.font = Font.boldSystemFont(12); // 주식명 글자 크기
    stockLine.textColor = Color.white();
    stockLine.lineLimit = 1; // 주식명 한 줄로 표시

    let titleLine = widget.addText(title);
    titleLine.font = Font.boldSystemFont(12); // 제목 글자 크기
    titleLine.textColor = Color.white();
    titleLine.lineLimit = 2; // 제목을 2줄로 표시

    let summaryLine = widget.addText(text);
    summaryLine.font = Font.systemFont(9); // 요약 글자 크기
    summaryLine.textColor = new Color("#cccccc");
    summaryLine.lineLimit = 2; // 요약은 최대 두 줄 표시

    widget.addSpacer(4); // 기사 간 간격 추가
  }

  // 전체 페이지 이동 URL
  widget.url = "https://newsfilter.io";

  // 새로고침 시간 설정 (5분 후 새로고침)
  widget.refreshAfterDate = new Date(Date.now() + 1 * 60 * 1000);

  return widget;
}

async function main() {
  let widget = await createWidget();
  Script.setWidget(widget);
  Script.complete();
}

await main();