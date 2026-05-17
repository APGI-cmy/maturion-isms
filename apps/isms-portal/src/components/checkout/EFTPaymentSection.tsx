import React from 'react';
import { Button } from '@/components/ui/button';

interface EFTPaymentSectionProps {
  totalAmount: number;
  isYearly: boolean;
  selectedModules: string[];
  isBundle: boolean;
}

export const EFTPaymentSection: React.FC<EFTPaymentSectionProps> = ({ totalAmount, isYearly }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        EFT/Bank transfer details — coming soon.
      </p>
      <p className="text-sm font-semibold">
        Total: ${totalAmount.toLocaleString()}/{isYearly ? 'year' : 'month'}
      </p>
      <Button variant="outline" className="w-full" disabled>
        Confirm EFT Payment (Coming Soon)
      </Button>
    </div>
  );
};
