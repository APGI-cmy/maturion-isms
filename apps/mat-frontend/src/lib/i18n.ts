/**
 * i18n Configuration
 * FRS: FR-065 (Internationalization)
 * TRS: TR-047
 */
export const i18nConfig = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr'],
};

export function useTranslation() {
  return {
    t: (key: string) => key,
    language: 'en',
  };
}
