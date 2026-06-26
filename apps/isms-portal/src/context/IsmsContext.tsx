import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createEntitlementState,
  hasModuleEntitlement,
  readCompletedEntitlementState,
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

function isSameEntitlementState(left: EntitlementState, right: EntitlementState): boolean {
  return (
    left.isBundle === right.isBundle &&
    left.source === right.source &&
    left.completedAt === right.completedAt &&
    left.entitledModules.length === right.entitledModules.length &&
    left.entitledModules.every((moduleKey, index) => moduleKey === right.entitledModules[index])
  );
}

export const IsmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entitlement, setEntitlement] = useState<EntitlementState>(() => readCompletedEntitlementState());

  const refreshEntitlement = useCallback(() => {
    setEntitlement((current) => {
      const next = readCompletedEntitlementState();
      return isSameEntitlementState(current, next) ? current : next;
    });
  }, []);

  useEffect(() => {
    if (entitlement.completedAt) return undefined;

    const intervalId = window.setInterval(refreshEntitlement, 500);
    return () => window.clearInterval(intervalId);
  }, [entitlement.completedAt, refreshEntitlement]);

  const grantMockEntitlement = useCallback((selection: Partial<SubscriptionSelection>) => {
    const nextSelection = { ...selection, completedAt: new Date().toISOString() };
    window.localStorage.setItem(PENDING_CHECKOUT_STORAGE_KEY, JSON.stringify(nextSelection));
    setEntitlement(createEntitlementState(nextSelection));
  }, []);

  const value = useMemo<IsmsContextValue>(() => ({
    entitlement,
    refreshEntitlement,
    grantMockEntitlement,
    hasEntitlement: (moduleKey) => hasModuleEntitlement(entitlement, moduleKey),
  }), [entitlement, refreshEntitlement, grantMockEntitlement]);

  return <IsmsContext.Provider value={value}>{children}</IsmsContext.Provider>;
};

export const useIsms = (): IsmsContextValue => useContext(IsmsContext);
