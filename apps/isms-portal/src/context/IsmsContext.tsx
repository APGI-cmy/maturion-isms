import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  createEntitlementState,
  hasModuleEntitlement,
  readStoredEntitlementState,
  type EntitlementState,
  type IsmsModuleKey,
} from '@/lib/entitlements';
import { PENDING_CHECKOUT_STORAGE_KEY, type SubscriptionSelection } from '@/lib/subscription';

interface IsmsContextValue {
  entitlement: EntitlementState;
  refreshEntitlement: () => void;
  grantMockEntitlement: (selection: Partial<SubscriptionSelection>) => void;
  hasEntitlement: (moduleKey: IsmsModuleKey) => boolean;
}

const IsmsContext = createContext<IsmsContextValue>({
  entitlement: createEntitlementState(),
  refreshEntitlement: () => undefined,
  grantMockEntitlement: () => undefined,
  hasEntitlement: () => false,
});

export const IsmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entitlement, setEntitlement] = useState<EntitlementState>(() => readStoredEntitlementState());

  const value = useMemo<IsmsContextValue>(() => ({
    entitlement,
    refreshEntitlement: () => setEntitlement(readStoredEntitlementState()),
    grantMockEntitlement: (selection) => {
      const nextSelection = { ...selection, completedAt: new Date().toISOString() };
      window.localStorage.setItem(PENDING_CHECKOUT_STORAGE_KEY, JSON.stringify(nextSelection));
      setEntitlement(createEntitlementState(nextSelection));
    },
    hasEntitlement: (moduleKey) => hasModuleEntitlement(entitlement, moduleKey),
  }), [entitlement]);

  return <IsmsContext.Provider value={value}>{children}</IsmsContext.Provider>;
};

export const useIsms = (): IsmsContextValue => useContext(IsmsContext);
