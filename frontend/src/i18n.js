import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.json";

i18n.use(initReactI18next).init({
  resources: translations,

  // 🔥 LOAD SAVED LANGUAGE (IMPORTANT)
  lng: localStorage.getItem("lang") || "en",

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;