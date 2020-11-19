import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ru', // use ru by default
    fallbackLng: 'en', // use en if detected lng is not available

    keySeparator: false, // recomend to set to false

    load: 'languageOnly',
    react: { useSuspense: false },
  });

export default i18n;
