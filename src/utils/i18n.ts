import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';

const resources = {
  en: {
    translation: en,
  },
};

let languageCode = 'en';

try {
  // Try loading RNLocalize if native bindings present
  const RNLocalize = require('react-native-localize');
  const locales = RNLocalize.getLocales();
  if (locales && locales[0] && locales[0].languageCode) {
    languageCode = locales[0].languageCode;
  }
} catch (e) {
  // Fallback to default language
  languageCode = 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
