export interface SubscriptionSelection {
  selectedModules: string[];
  isBundle: boolean;
  isYearly: boolean;
  source: string | null;
}

export interface OnboardingProfile {
  organisationName: string;
  sector: string;
  primaryGoal: string;
  responsiblePerson: string;
}

export const PENDING_CHECKOUT_STORAGE_KEY = 'isms_pending_checkout';
export const ONBOARDING_PROFILE_STORAGE_KEY = 'isms_onboarding_profile';
export const MATURITY_HANDOFF_STORAGE_KEY = 'isms_maturity_handoff';

export function parseSubscriptionSelection(searchParams: URLSearchParams): SubscriptionSelection {
  const modules = searchParams.get('modules');

  return {
    selectedModules: modules ? modules.split(',').filter(Boolean) : [],
    isBundle: searchParams.get('bundle') === 'true',
    isYearly: searchParams.get('yearly') === 'true',
    source: searchParams.get('source'),
  };
}

export function createCheckoutSearch(selection: SubscriptionSelection): string {
  const params = new URLSearchParams();

  if (selection.isBundle) {
    params.set('bundle', 'true');
  }

  if (selection.selectedModules.length > 0) {
    params.set('modules', selection.selectedModules.join(','));
  }

  params.set('yearly', String(selection.isYearly));

  if (selection.source) {
    params.set('source', selection.source);
  }

  return params.toString();
}

export function isOnboardingProfileComplete(profile: OnboardingProfile): boolean {
  return Boolean(
    profile.organisationName.trim() &&
      profile.sector.trim() &&
      profile.primaryGoal.trim() &&
      profile.responsiblePerson.trim(),
  );
}
