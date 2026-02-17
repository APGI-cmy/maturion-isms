export interface Audit {
  id: string;
  name: string;
  standard: string;
  organisation_id: string;
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Criterion {
  id: string;
  standard: string;
  clause_number: string;
  clause_text: string;
  parent_id?: string;
  is_leaf: boolean;
}

export interface Evidence {
  id: string;
  audit_id: string;
  criterion_id: string;
  type: 'text' | 'photo' | 'voice' | 'document';
  content: string;
  created_at: string;
}

export interface Finding {
  id: string;
  audit_id: string;
  criterion_id: string;
  ai_score?: number;
  human_score?: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}
