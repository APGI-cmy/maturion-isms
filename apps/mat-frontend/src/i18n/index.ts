// Internationalization configuration
export const defaultLocale = 'en';

export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
    },
    nav: {
      dashboard: 'Dashboard',
      audits: 'Audits',
      criteria: 'Criteria',
      evidence: 'Evidence',
      scoring: 'Scoring',
      reports: 'Reports',
    },
  },
};

export function t(key: string, locale: string = defaultLocale): string {
  const keys = key.split('.');
  let value: any = translations[locale as keyof typeof translations];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
