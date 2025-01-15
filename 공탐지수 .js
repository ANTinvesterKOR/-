// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
// @name FearAndGreedWidget
// @desc Display Fear & Greed Index with rating and score, with rating color change and uppercase rating
// @icon 📈
// @category finance

function getTodayString() {
  let now = new Date();
  let yyyy = now.getFullYear();
  let mm = String(now.getMonth() + 1).padStart(2, "0");
  let dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function fetchFearAndGreed(dateStr) {
  let url = `https://production.dataviz.cnn.io/index/fearandgreed/graphdata/${dateStr}`;
  let req = new Request(url);
  return await req.loadJSON();
}

function getRatingColor(rating) {
  // Define color ranges for the ratings
  if (rating === "EXTREME FEAR") {
    return new Color("#FF0000");  // Red for Extreme Fear
  } else if (rating === "FEAR") {
    return new Color("#FF6600");  // Orange for Fear
  } else if (rating === "NEUTRAL") {
    return new Color("#FFFF00");  // Yellow for Neutral
  } else if (rating === "GREED") {
    return new Color("#66FF66");  // Light Green for Greed
  } else if (rating === "EXTREME GREED") {
    return new Color("#00FF00");  // Green for Extreme Greed
  }
  return Color.white(); // Default if rating is not recognized
}

function formatDate(date, timezone) {
  let options = { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: false, 
    timeZone: timezone 
  };
  let formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(date);
}

async function createWidget() {
  let widget = new ListWidget();
  widget.backgroundColor = new Color("#000000");  // Black background
  
  let todayStr = getTodayString();
  let data;
  
  try {
    data = await fetchFearAndGreed(todayStr);
  } catch (e) {
    let errorText = widget.addText("API Error: " + e);
    errorText.textColor = Color.red();
    return widget;
  }
  
  // Fear & Greed
  let score = data.fear_and_greed.score;  
  let rating = data.fear_and_greed.rating.toUpperCase();  // Convert rating to uppercase
  let ts = data.fear_and_greed.timestamp;

  // KST and NYC time format
  let now = new Date(ts);
  let kstTime = formatDate(now, "Asia/Seoul");
  let nycTime = formatDate(now, "America/New_York");

  // Widget setup
  let header = widget.addText("CNN Fear & Greed Index");
  header.font = Font.boldSystemFont(16);
  header.textColor = Color.white();
  
  let dateLine = widget.addText(`KST: ${kstTime} KST (UTC+9)`); 
  dateLine.font = Font.systemFont(10);
  dateLine.textColor = new Color("#999999");

  widget.addSpacer(4);

  let nycDateLine = widget.addText(`NYC: ${nycTime} EST(UTC-5)`);
  nycDateLine.font = Font.systemFont(10);
  nycDateLine.textColor = new Color("#999999");
  
  widget.addSpacer(8);
  
  // Display score and rating
  let scoreLine = widget.addText(`Score: ${score.toFixed(2)}`);
  scoreLine.textColor = Color.white();
  scoreLine.font = Font.systemFont(14);
  
  // Get the rating color
  let ratingColor = getRatingColor(rating);  // Get color based on rating
  let ratingLine = widget.addText(`Rating: ${rating}`);
  ratingLine.textColor = ratingColor;  // Apply color

  ratingLine.font = Font.systemFont(14);

  widget.addSpacer(8);
  
  // Set widget URL to open CNN Fear & Greed Index on tap
  widget.url = "https://money.cnn.com/data/fear-and-greed/";
  
  return widget;
}

async function main() {
  let widget = await createWidget();
  Script.setWidget(widget);
  Script.complete();
}

await main();