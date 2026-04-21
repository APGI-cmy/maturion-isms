import { create } from 'zustand';
interface FreeAssessmentState {
  sessionToken: string | null;
  baselineMaturity: number | null;
  setResult: (token: string, maturity: number) => void;
  reset: () => void;
}
export const useFreeAssessmentStore = create<FreeAssessmentState>((set) => ({
  sessionToken: null, baselineMaturity: null,
  setResult: (sessionToken, baselineMaturity) => set({ sessionToken, baselineMaturity }),
  reset: () => set({ sessionToken: null, baselineMaturity: null }),
}));
