function safeTime(dateString) {
  if (!dateString) return null;

  const d = new Date(dateString);
  if (!isNaN(d)) return d;

  const parsed = new Date(Date.parse(dateString));
  if (!isNaN(parsed)) return parsed;

  return null;
}

/* ================= TIME FORMAT ================= */
function getTimeAgo(dateString) {
  if (!dateString) return "Unknown";

  const published = new Date(dateString);
  if (isNaN(published)) return "Unknown";

  const now = new Date();
  const diffMs = now - published;

  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffHr < 48) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return published.toDateString();
}

/* ================= SENTIMENT ================= */
let newsCount = 0;
let negativeCountInBlock = 0;

function analyzeSentiment(title = "") {
  const positiveWords = ["surge", "rise", "bull", "gain", "growth", "rally", "jump", "strong"];
  const negativeWords = ["drop", "loss", "fall", "bear", "decline", "weak"];

  const intensifiers = ["very", "huge", "massive", "strongly", "sharply"];
  const negations = ["not", "no", "never", "hardly"];

  const words = title.toLowerCase().split(/\W+/);

  let score = 0;

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let prevWord = words[i - 1];

    let multiplier = 1;

    if (intensifiers.includes(prevWord)) {
      multiplier = 2;
    }

    let isNegated = negations.includes(prevWord);

    if (positiveWords.includes(word)) {
      score += isNegated ? -1 * multiplier : 1 * multiplier;
    }

    if (negativeWords.includes(word)) {
      score += isNegated ? 1 * multiplier : -1 * multiplier;
    }
  }

  // Determine sentiment
  let sentiment = "neutral";
  if (score > 1) sentiment = "strong positive";
  else if (score === 1) sentiment = "positive";
  else if (score === -1) sentiment = "negative";
  else if (score < -1) sentiment = "strong negative";

  // ---- CONTROL LOGIC ----
  newsCount++;

  // Reset every 7 news
  if ((newsCount - 1) % 7 === 0) {
    negativeCountInBlock = 0;
  }

  // Allow only 1 negative per 7-news block
  if (sentiment.includes("negative")) {
    if (negativeCountInBlock >= 1) {
      return "skip"; // block extra negative news
    }
    negativeCountInBlock++;
  }

  return sentiment;
}

/* ================= IMPORTANCE ================= */
function rankImportance(title = "") {
  const keywords = ["bitcoin", "eth", "ethereum", "sec", "etf", "fed"];

  let score = 1;

  keywords.forEach(k => {
    if (title.toLowerCase().includes(k)) score += 2;
  });

  return score;
}

/* ================= MAIN ENGINE ================= */
function processNews(news) {
  if (!Array.isArray(news)) return [];

  let processed = news.map(item => {
    const dateObj = safeTime(item.publishedAt);

    return {
      id: item.url, // 🔥 IMPORTANT FIX (stable React key)
      title: item.title || "",
      url: item.url || "",
      image: item.image || null,
      source: item.source || "Unknown",

      // unify content
      content: item.description || item.content || "",

      sentiment: analyzeSentiment(item.title || ""),
      importance: rankImportance(item.title || ""),

      time: getTimeAgo(dateObj),
      timestamp: dateObj ? dateObj.getTime() : 0
    };
  });

  processed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return processed;
}

module.exports = {
  processNews,
  safeTime
};