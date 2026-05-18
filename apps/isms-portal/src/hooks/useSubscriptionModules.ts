export interface SubscriptionModule {
  id: string;
  name: string;
  monthly_price: number;
  yearly_discount_percentage: number;
}

export const useSubscriptionModules = () => {
  return {
    modules: [] as SubscriptionModule[],
    loading: false,
  };
};
