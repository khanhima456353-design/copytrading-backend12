const axios = require("axios");
const fs = require("fs");

// 🔤 Base English text
const base = {
  welcome: "Welcome to SwanCore",
  login: "Login",
  continue: "Continue",
  email: "Enter email or phone",
  agree: "I agree to Terms",
  google: "Continue with Google",
  apple: "Continue with Apple",
  or: "or",
  verify: "Verify OTP",
  price: "Price",
  balance: "Balance",
  history: "Trade History",
  buy: "BUY",
  sell: "SELL"
};

// 🌍 30 languages
const languages = [
  "hi","ja","zh","es","fr","de","ru","ar","pt","tr",
  "ko","it","nl","pl","uk","th","vi","id","ms","tl",
  "cs","hu","ro","sv","da","fi","no","el","he"
];

const API_URL = "https://libretranslate.de/translate";

async function translateText(text, target) {
  try {
    const res = await axios.post(API_URL, {
      q: text,
      source: "en",
      target: target,
      format: "text"
    });
    return res.data.translatedText;
  } catch (err) {
    console.log("Error:", target, text);
    return text; // fallback
  }
}

async function generateTranslations() {
  const output = {
    en: { translation: base }
  };

  for (let lang of languages) {
    console.log("Translating:", lang);

    const translated = {};

    for (let key in base) {
      translated[key] = await translateText(base[key], lang);
    }

    output[lang] = { translation: translated };
  }

  // 📝 Save file
  fs.writeFileSync(
    "translations.json",
    JSON.stringify(output, null, 2)
  );

  console.log("✅ DONE → translations.json created");
}

generateTranslations();