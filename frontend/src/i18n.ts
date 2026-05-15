import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.json";

i18next.use(initReactI18next).init({
  resources: translations,

  lng:
    typeof window !== "undefined"
      ? localStorage.getItem("lang") || "en"
      : "en",

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18next;