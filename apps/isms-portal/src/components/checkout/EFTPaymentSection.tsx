import React from 'react';
import { Button } from '@/components/ui/button';

interface EFTPaymentSectionProps {
  totalAmount: number;
  isYearly: boolean;
  selectedModules: string[];
  isBundle: boolean;
  onMockSuccess: () => void;
}

export const EFTPaymentSection: React.FC<EFTPaymentSectionProps> = ({ totalAmount, isYearly, onMockSuccess }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        EFT/bank transfer is mocked for W3. No production invoice or banking instruction is issued.
      </p>
      <p className="text-sm font-semibold">
        Total: ${totalAmount.toLocaleString()}/{isYearly ? 'year' : 'month'}
      </p>
      <Button variant="outline" className="w-full" onClick={onMockSuccess}>
        Confirm mock EFT checkout
      </Button>
    </div>
  );
};
