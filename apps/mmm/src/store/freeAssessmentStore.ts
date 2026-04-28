import { create } from 'zustand';

export interface DomainScore {
  domain_id: string;
  domain_name: string;
  score: number;
}

interface FreeAssessmentState {
  sessionToken: string | null;
  baselineMaturity: number | null;
  domainScores: DomainScore[] | null;
  setResult: (token: string, maturity: number, domainScores?: DomainScore[]) => void;
  reset: () => void;
}

export const useFreeAssessmentStore = create<FreeAssessmentState>((set) => ({
  sessionToken: null,
  baselineMaturity: null,
  domainScores: null,
  setResult: (sessionToken, baselineMaturity, domainScores = null) =>
    set({ sessionToken, baselineMaturity, domainScores }),
  reset: () => set({ sessionToken: null, baselineMaturity: null, domainScores: null }),
}));
