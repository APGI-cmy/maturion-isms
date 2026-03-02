import { supabase } from '../supabase';
import { getSessionToken } from '../supabase';

export interface CreateAuditInput {
  title: string;
  organisation_id: string;
  status: 'draft' | 'active' | 'completed';
  description?: string;
  framework?: string;
  target_date?: string;
}

export async function createAudit(input: CreateAuditInput) {
  const token = await getSessionToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  const { data, error } = await supabase
    .from('audits')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}
