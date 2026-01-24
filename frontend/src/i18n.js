import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ru from './locales/ru.json';
import pl from './locales/pl.json';
import lv from './locales/lv.json';
import uk from './locales/uk.json';
import be from './locales/be.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  pl: { translation: pl },
  lv: { translation: lv },
  uk: { translation: uk },
  be: { translation: be },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
