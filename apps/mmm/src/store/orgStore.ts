import { create } from 'zustand';
interface OrgState {
  currentOrgId: string | null;
  currentFrameworkId: string | null;
  setOrg: (orgId: string) => void;
  resetOnOrgSwitch: () => void; // NBR-003: reset on org switch
}
export const useOrgStore = create<OrgState>((set) => ({
  currentOrgId: null,
  currentFrameworkId: null,
  setOrg: (orgId) => set({ currentOrgId: orgId, currentFrameworkId: null }),
  resetOnOrgSwitch: () => set({ currentOrgId: null, currentFrameworkId: null }), // NBR-003
}));
