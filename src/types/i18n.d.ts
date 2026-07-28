declare const process: {
  env: Record<string, string | undefined>;
};

declare const __DEV__: boolean;

declare module 'i18next' {
  interface i18n {
    use(module: any): this;
    init(options?: any, callback?: any): Promise<any>;
    t(key: string, options?: any): string;
    changeLanguage(lng: string): Promise<any>;
    language: string;
  }
  const i18nInstance: i18n;
  export default i18nInstance;
}

declare module 'react-i18next' {
  export const initReactI18next: any;
  export function useTranslation(): {
    t: (key: string, options?: any) => string;
    i18n: any;
  };
  export const Translation: any;
}

declare module 'react-native-localize' {
  export function getLocales(): Array<{
    countryCode: string;
    languageCode: string;
    languageTag: string;
    isRTL: boolean;
  }>;
}
