import { getSupabaseBrowserClient } from './client';

export async function requireAdminSession() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { supabase: null, isAdmin: false, error: 'Supabase is not configured.' };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    return { supabase, isAdmin: false, error: 'Please sign in.' };
  }

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('user_id,email')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return { supabase, isAdmin: false, error: 'This account is not an admin.' };
  }

  return { supabase, isAdmin: true, error: null };
}
