import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

const userLang = navigator.language || navigator.userLanguage;

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
      
      },
    },
    fr: {
      translation: {
        
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});



i18n.use(initReactI18next).init({
  resources: {},
  lng: userLang.split('-')[0],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});


export default i18n;
