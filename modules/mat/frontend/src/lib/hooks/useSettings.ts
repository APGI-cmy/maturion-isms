/**
 * Custom hooks for settings management
 * FRS: FR-025 to FR-026 (Settings)
 * Task: 5.6.6
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  organisation_id?: string;
  preferences?: {
    language?: string;
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

export interface OrganisationSettings {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  report_template?: 'standard' | 'detailed' | 'executive';
}

/**
 * Fetch current user profile
 */
export function useUserProfile() {
  return useQuery<UserProfile | null, Error>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile yet, return basic info from auth user
          return {
            id: user.id,
            email: user.email || '',
          };
        }
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      return data;
    },
  });
}

/**
 * Update user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Partial<UserProfile>>({
    mutationFn: async (updates) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

/**
 * Fetch organisation settings
 */
export function useOrganisationSettings(organisationId?: string) {
  return useQuery<OrganisationSettings | null, Error>({
    queryKey: ['organisation-settings', organisationId],
    queryFn: async () => {
      if (!organisationId) {
        return null;
      }

      const { data, error } = await supabase
        .from('organisation_settings')
        .select('*')
        .eq('id', organisationId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch organisation settings: ${error.message}`);
      }

      return data;
    },
    enabled: !!organisationId,
  });
}

/**
 * Update organisation settings
 */
export function useUpdateOrganisationSettings() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { organisationId: string; updates: Partial<OrganisationSettings> }>({
    mutationFn: async ({ organisationId, updates }) => {
      const { error } = await supabase
        .from('organisation_settings')
        .upsert({
          id: organisationId,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Failed to update organisation settings: ${error.message}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organisation-settings', variables.organisationId] });
    },
  });
}

/**
 * Upload organisation logo
 */
export function useUploadOrganisationLogo() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, { organisationId: string; file: File }>({
    mutationFn: async ({ organisationId, file }) => {
      // Upload to Supabase Storage
      const filePath = `logos/${organisationId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('organisation-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to upload logo: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('organisation-assets')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organisation-settings', variables.organisationId] });
    },
  });
}
