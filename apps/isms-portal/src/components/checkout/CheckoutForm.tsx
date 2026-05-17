import React from 'react';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  totalAmount: number;
  isYearly: boolean;
  selectedModules: string[];
  isBundle: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalAmount, isYearly }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Card payment processing — coming soon.
      </p>
      <p className="text-sm font-semibold">
        Total: ${totalAmount.toLocaleString()}/{isYearly ? 'year' : 'month'}
      </p>
      <Button className="w-full" disabled>
        Pay Now (Coming Soon)
      </Button>
    </div>
  );
};
