import { supabase } from "$lib/supabaseClient";

export const authStore = $state({
  user: null,
  loading: true,
});

export async function initAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  authStore.user = user;
  authStore.loading = false;

  supabase.auth.onAuthStateChange((_event, session) => {
    authStore.user = session?.user ?? null;
  });
}
