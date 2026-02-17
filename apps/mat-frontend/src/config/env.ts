export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key',
};
