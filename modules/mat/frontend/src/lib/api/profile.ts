import { supabase } from '../supabase';
import { getSessionToken } from '../supabase';

export interface UpdateProfileInput {
  display_name?: string;
  email?: string;
  language?: string;
  theme?: string;
}

export async function updateProfile(input: UpdateProfileInput) {
  const token = await getSessionToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', session.user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
