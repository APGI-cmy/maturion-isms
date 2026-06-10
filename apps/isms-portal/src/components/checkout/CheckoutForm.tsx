import React from 'react';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  totalAmount: number;
  isYearly: boolean;
  selectedModules: string[];
  isBundle: boolean;
  onMockSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalAmount, isYearly, onMockSuccess }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Card payment processing is mocked for W3. No production payment is taken.
      </p>
      <p className="text-sm font-semibold">
        Total: ${totalAmount.toLocaleString()}/{isYearly ? 'year' : 'month'}
      </p>
      <Button className="w-full" onClick={onMockSuccess}>
        Complete mock checkout
      </Button>
    </div>
  );
};
