import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import thailand from '../utils/languages/th.json';
import english from '../utils/languages/en.json';
import french from '../utils/languages/fr.json';
import arabic from '../utils/languages/ar.json';
import chinese from '../utils/languages/ch.json';
import Cookie from 'js-cookie';
import { get } from 'lodash';
import config from '@/app/context/config';
import { useContext } from 'react';
import { CustomizerContext } from '@/app/context/customizerContext';

const resources = {
  th: {
    translation: thailand,
  },
  en: {
    translation: english,
  },
  fr: {
    translation: french,
  },
  ar: {
    translation: arabic,
  },
  ch: {
    translation: chinese,
  },
};

export const getLanguage = () => {
  return Cookie.get('language') || config.isLanguage || 'th';
}

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: getLanguage(),
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
