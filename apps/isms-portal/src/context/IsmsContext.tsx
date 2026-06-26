import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createEntitlementState,
  hasModuleEntitlement,
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

function readCompletedCheckoutEntitlement(): EntitlementState {
  if (typeof window === 'undefined') return createEntitlementState();

  const stored = window.localStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY);
  if (!stored) return createEntitlementState();

  try {
    const selection = JSON.parse(stored) as Partial<SubscriptionSelection> & { completedAt?: string | null };
    return selection.completedAt ? createEntitlementState(selection) : createEntitlementState();
  } catch {
    window.localStorage.removeItem(PENDING_CHECKOUT_STORAGE_KEY);
    return createEntitlementState();
  }
}

export const IsmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entitlement, setEntitlement] = useState<EntitlementState>(() => readCompletedCheckoutEntitlement());

  const refreshEntitlement = useCallback(() => {
    setEntitlement((current) => {
      const next = readCompletedCheckoutEntitlement();
      return isSameEntitlementState(current, next) ? current : next;
    });
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(refreshEntitlement, 500);
    return () => window.clearInterval(intervalId);
  }, [refreshEntitlement]);

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
