/**
 * AuditContext — Global Audit Selection Provider
 * GAP-015: Wire consuming pages away from local selectedAuditId state
 * FRS: FR-002 (Audit Selection)
 * Task: Wave 16-2R T-W162R-UI-003
 */
import { createContext, useContext, useState } from 'react';

interface AuditContextValue {
  selectedAuditId: string;
  setSelectedAuditId: (id: string) => void;
}

const AuditContext = createContext<AuditContextValue>({
  selectedAuditId: '',
  setSelectedAuditId: () => {},
});
AuditContext.displayName = 'AuditContext';

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [selectedAuditId, setSelectedAuditId] = useState<string>('');

  const value: AuditContextValue = {
    selectedAuditId,
    setSelectedAuditId,
  };

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuditContext(): AuditContextValue {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  return context;
}
