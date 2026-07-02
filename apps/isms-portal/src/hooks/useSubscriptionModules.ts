export interface SubscriptionModule {
  id: string;
  name: string;
  monthly_price: number;
  yearly_discount_percentage: number;
}

const STATIC_SUBSCRIPTION_MODULES: SubscriptionModule[] = [
  {
    id: 'maturity-roadmap',
    name: 'Maturity Roadmap',
    monthly_price: 250,
    yearly_discount_percentage: 10,
  },
  {
    id: 'project-implementation',
    name: 'Project Implementation Tracker',
    monthly_price: 150,
    yearly_discount_percentage: 10,
  },
];

export const useSubscriptionModules = () => {
  return {
    modules: STATIC_SUBSCRIPTION_MODULES,
    loading: false,
  };
};
