import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../public/locales/en/translation.json";
import ar from "../public/locales/ar/translation.json";

i18n
  .use(HttpApi) // Load translations via HTTP
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind React and i18next
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: "en", // Default language
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
    // backend: {
    //   loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
    //   // loadPath: "./{{lng}}.json", // Match Shopify's folder structure
    // },
  });

export default i18n;
