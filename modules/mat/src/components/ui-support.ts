/**
 * UI Support Component
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §6, §7
 * Implements responsive design, accessibility (WCAG 2.1 AA), and internationalization (i18n)
 * FRS: FR-062, FR-064, FR-065
 * TRS: TR-033, TR-034, TR-035
 */

/**
 * Responsive breakpoints per architecture specification
 * Architecture: ui-component-architecture.md §6 — Responsive Design (TR-034)
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const;

/**
 * Device type classification
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Responsive layout configuration per viewport
 */
export interface ResponsiveLayoutConfig {
  device: DeviceType;
  columns: number;
  navigationStyle: 'bottom-tabs' | 'drawer' | 'sidebar';
  chartLayout: 'stacked' | 'grid';
  touchTargetSize: number;
  modalBehavior: 'full-screen' | 'full-width' | 'dialog';
  fontSize: { base: number; heading: number };
}

/**
 * Determines device type from viewport width
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Device type classification
 */
export function getDeviceType(viewportWidth: number): DeviceType {
  if (viewportWidth < RESPONSIVE_BREAKPOINTS.mobile) return 'mobile';
  if (viewportWidth < RESPONSIVE_BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

/**
 * Gets responsive layout configuration for a given viewport width
 * Architecture: ui-component-architecture.md §6 — Viewport-Specific Adaptations
 * FRS: FR-062
 * TRS: TR-034
 *
 * @param viewportWidth - Current viewport width in pixels
 * @returns Responsive layout configuration
 */
export function getResponsiveLayout(viewportWidth: number): ResponsiveLayoutConfig {
  const device = getDeviceType(viewportWidth);

  switch (device) {
    case 'mobile':
      return {
        device: 'mobile',
        columns: 1,
        navigationStyle: 'bottom-tabs',
        chartLayout: 'stacked',
        touchTargetSize: 44,
        modalBehavior: 'full-screen',
        fontSize: { base: 16, heading: 20 }
      };
    case 'tablet':
      return {
        device: 'tablet',
        columns: 2,
        navigationStyle: 'drawer',
        chartLayout: 'stacked',
        touchTargetSize: 44,
        modalBehavior: 'full-width',
        fontSize: { base: 16, heading: 24 }
      };
    case 'desktop':
      return {
        device: 'desktop',
        columns: 3,
        navigationStyle: 'sidebar',
        chartLayout: 'grid',
        touchTargetSize: 32,
        modalBehavior: 'dialog',
        fontSize: { base: 14, heading: 28 }
      };
  }
}

/**
 * Validates that responsive layout meets minimum touch target sizes
 * Architecture: ui-component-architecture.md §6 — Mobile (<768px)
 *
 * @param layout - Layout configuration to validate
 * @returns Validation result
 */
export function validateTouchTargets(layout: ResponsiveLayoutConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const minSize = 44; // WCAG 2.1 minimum touch target (44x44px)

  if (layout.device === 'mobile' && layout.touchTargetSize < minSize) {
    errors.push(`Mobile touch targets must be at least ${minSize}px, got ${layout.touchTargetSize}px`);
  }
  if (layout.device === 'tablet' && layout.touchTargetSize < minSize) {
    errors.push(`Tablet touch targets must be at least ${minSize}px, got ${layout.touchTargetSize}px`);
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================
// Accessibility (WCAG 2.1 AA) — FRS: FR-064, TRS: TR-033
// ============================================================

/**
 * WCAG 2.1 AA compliance check result
 */
export interface AccessibilityCheckResult {
  wcag_level: 'A' | 'AA' | 'AAA';
  checks: AccessibilityCheck[];
  passed: number;
  failed: number;
  compliant: boolean;
}

/**
 * Individual accessibility check
 */
export interface AccessibilityCheck {
  rule: string;
  criterion: string;
  description: string;
  passed: boolean;
  details?: string;
}

/**
 * ARIA role configuration
 */
export interface AriaConfig {
  role: string;
  'aria-label': string;
  'aria-describedby'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: string;
  tabindex?: string;
}

/**
 * Validates WCAG 2.1 AA compliance for a component configuration
 * Architecture: ui-component-architecture.md §7 — Accessibility (TR-033)
 * FRS: FR-064
 *
 * @param config - Component accessibility configuration
 * @returns Accessibility check result
 */
export function validateAccessibility(config: {
  hasAriaLabels: boolean;
  hasKeyboardNav: boolean;
  contrastRatio: number;
  hasScreenReaderSupport: boolean;
  hasFocusIndicators: boolean;
  hasSkipLinks: boolean;
  hasAltText: boolean;
}): AccessibilityCheckResult {
  const checks: AccessibilityCheck[] = [];

  // WCAG 1.1.1 — Non-text Content
  checks.push({
    rule: '1.1.1',
    criterion: 'Non-text Content',
    description: 'All images and icons have alt text or ARIA labels',
    passed: config.hasAltText
  });

  // WCAG 1.4.3 — Contrast (Minimum)
  checks.push({
    rule: '1.4.3',
    criterion: 'Contrast (Minimum)',
    description: 'Text contrast ratio meets AA minimum (4.5:1 for normal text)',
    passed: config.contrastRatio >= 4.5,
    details: `Contrast ratio: ${config.contrastRatio}:1`
  });

  // WCAG 2.1.1 — Keyboard
  checks.push({
    rule: '2.1.1',
    criterion: 'Keyboard',
    description: 'All functionality is available from keyboard',
    passed: config.hasKeyboardNav
  });

  // WCAG 2.4.1 — Bypass Blocks
  checks.push({
    rule: '2.4.1',
    criterion: 'Bypass Blocks',
    description: 'Skip links are provided to bypass navigation',
    passed: config.hasSkipLinks
  });

  // WCAG 2.4.7 — Focus Visible
  checks.push({
    rule: '2.4.7',
    criterion: 'Focus Visible',
    description: 'Focus indicators are visible on all interactive elements',
    passed: config.hasFocusIndicators
  });

  // WCAG 4.1.2 — Name, Role, Value
  checks.push({
    rule: '4.1.2',
    criterion: 'Name, Role, Value',
    description: 'ARIA labels and roles are correctly applied',
    passed: config.hasAriaLabels
  });

  // Screen reader support
  checks.push({
    rule: '1.3.1',
    criterion: 'Info and Relationships',
    description: 'Screen reader support with correct semantic structure',
    passed: config.hasScreenReaderSupport
  });

  const passed = checks.filter(c => c.passed).length;
  const failed = checks.filter(c => !c.passed).length;

  return {
    wcag_level: 'AA',
    checks,
    passed,
    failed,
    compliant: failed === 0
  };
}

/**
 * Generates ARIA configuration for dashboard components
 *
 * @param componentType - Type of dashboard component
 * @param label - Component label
 * @returns ARIA configuration
 */
export function getDashboardAriaConfig(
  componentType: 'chart' | 'metric-card' | 'data-table' | 'navigation',
  label: string
): AriaConfig {
  switch (componentType) {
    case 'chart':
      return {
        role: 'img',
        'aria-label': label,
        'aria-describedby': `${componentType}-description`,
        tabindex: '0'
      };
    case 'metric-card':
      return {
        role: 'status',
        'aria-label': label,
        'aria-live': 'polite',
        'aria-atomic': 'true'
      };
    case 'data-table':
      return {
        role: 'table',
        'aria-label': label,
        'aria-describedby': `${componentType}-description`
      };
    case 'navigation':
      return {
        role: 'navigation',
        'aria-label': label
      };
  }
}

// ============================================================
// Internationalization (i18n) — FRS: FR-065, TRS: TR-035
// ============================================================

/**
 * Supported locales
 */
export type SupportedLocale = 'en' | 'af';

/**
 * Translation dictionary
 */
export interface TranslationDictionary {
  locale: SupportedLocale;
  translations: Record<string, string>;
}

/**
 * i18n configuration
 */
export interface I18nConfig {
  defaultLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
  fallbackLocale: SupportedLocale;
}

/**
 * English translations
 */
const EN_TRANSLATIONS: Record<string, string> = {
  'dashboard.title': 'Audit Dashboard',
  'dashboard.global': 'Global Dashboard',
  'dashboard.domain': 'Domain Dashboard',
  'dashboard.mps': 'MPS Dashboard',
  'dashboard.maturityLevel': 'Maturity Level',
  'dashboard.completionPercentage': 'Completion Percentage',
  'dashboard.scoredCriteria': 'Scored Criteria',
  'dashboard.totalCriteria': 'Total Criteria',
  'report.title': 'Audit Report',
  'report.generate': 'Generate Report',
  'report.export': 'Export',
  'report.format.docx': 'DOCX Report',
  'report.format.pdf': 'PDF Report',
  'report.format.json': 'JSON Export',
  'report.format.excel': 'Excel Export',
  'report.executiveSummary': 'Executive Summary',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.delete': 'Delete',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.loading': 'Loading...',
  'common.noData': 'No data available',
  'criteria.status.not_started': 'Not Started',
  'criteria.status.in_progress': 'In Progress',
  'criteria.status.confirmed': 'Confirmed',
  'criteria.status.not_used': 'Not Used'
};

/**
 * Afrikaans translations
 */
const AF_TRANSLATIONS: Record<string, string> = {
  'dashboard.title': 'Oudit Kontroleskerm',
  'dashboard.global': 'Globale Kontroleskerm',
  'dashboard.domain': 'Domein Kontroleskerm',
  'dashboard.mps': 'MPS Kontroleskerm',
  'dashboard.maturityLevel': 'Volwassenheidsvlak',
  'dashboard.completionPercentage': 'Voltooiingspersentasie',
  'dashboard.scoredCriteria': 'Gegradeerde Kriteria',
  'dashboard.totalCriteria': 'Totale Kriteria',
  'report.title': 'Ouditverslag',
  'report.generate': 'Genereer Verslag',
  'report.export': 'Voer Uit',
  'report.format.docx': 'DOCX Verslag',
  'report.format.pdf': 'PDF Verslag',
  'report.format.json': 'JSON Uitvoer',
  'report.format.excel': 'Excel Uitvoer',
  'report.executiveSummary': 'Uitvoerende Opsomming',
  'common.save': 'Stoor',
  'common.cancel': 'Kanselleer',
  'common.confirm': 'Bevestig',
  'common.delete': 'Verwyder',
  'common.search': 'Soek',
  'common.filter': 'Filter',
  'common.loading': 'Laai...',
  'common.noData': 'Geen data beskikbaar nie',
  'criteria.status.not_started': 'Nie Begin Nie',
  'criteria.status.in_progress': 'In Vordering',
  'criteria.status.confirmed': 'Bevestig',
  'criteria.status.not_used': 'Nie Gebruik Nie'
};

/**
 * Default i18n configuration
 */
export const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLocale: 'en',
  supportedLocales: ['en', 'af'],
  fallbackLocale: 'en'
};

/**
 * Gets the translation dictionary for a specific locale
 *
 * @param locale - Target locale
 * @returns Translation dictionary
 */
export function getTranslations(locale: SupportedLocale): TranslationDictionary {
  const translations = locale === 'af' ? AF_TRANSLATIONS : EN_TRANSLATIONS;
  return { locale, translations };
}

/**
 * Translates a key to the specified locale
 *
 * @param key - Translation key
 * @param locale - Target locale
 * @returns Translated string, or key if translation not found
 */
export function translate(key: string, locale: SupportedLocale): string {
  const dict = getTranslations(locale);
  return dict.translations[key] || key;
}

/**
 * Formats a number according to locale conventions
 *
 * @param value - Number to format
 * @param locale - Target locale
 * @param options - Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  locale: SupportedLocale,
  options?: { decimals?: number; style?: 'decimal' | 'percent' }
): string {
  const intlLocale = locale === 'af' ? 'af-ZA' : 'en-ZA';
  const formatter = new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 2,
    style: options?.style === 'percent' ? 'percent' : 'decimal'
  });
  return formatter.format(options?.style === 'percent' ? value / 100 : value);
}

/**
 * Formats a date according to locale conventions
 *
 * @param date - Date to format
 * @param locale - Target locale
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: SupportedLocale): string {
  const intlLocale = locale === 'af' ? 'af-ZA' : 'en-ZA';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Gets the i18n configuration
 *
 * @returns i18n configuration
 */
export function getI18nConfig(): I18nConfig {
  return { ...DEFAULT_I18N_CONFIG };
}

/**
 * Validates that all required translation keys exist for a locale
 *
 * @param locale - Locale to validate
 * @returns Validation result
 */
export function validateLocaleCompleteness(locale: SupportedLocale): {
  valid: boolean;
  missingKeys: string[];
  totalKeys: number;
  translatedKeys: number;
} {
  const enDict = getTranslations('en');
  const targetDict = getTranslations(locale);
  const allKeys = Object.keys(enDict.translations);
  const missingKeys = allKeys.filter(key => !(key in targetDict.translations));

  return {
    valid: missingKeys.length === 0,
    missingKeys,
    totalKeys: allKeys.length,
    translatedKeys: allKeys.length - missingKeys.length
  };
}
