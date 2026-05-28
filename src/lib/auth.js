import { supabase } from "$lib/supabaseClient";

/**
 * @param {string} email
 * @param {string} password
 */
export async function registerClient(email, password) {
  const username = email.split("@")[0];

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "client",
        username,
        name: username,
      },
    },
  });

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
  };
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function loginClient(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
  };
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error };
  }

  const { data: level, error: levelError } = await supabase
    .schema("hr")
    .rpc("current_level");

  if (levelError) {
    await supabase.auth.signOut();
    return { user: null, error: levelError };
  }

  if (level !== 2) {
    await supabase.auth.signOut();

    return {
      user: null,
      error: {
        message: "Este usuario no tiene permisos de administrador.",
      },
    };
  }

  return {
    user: data.user,
    error: null,
  };
}

export async function logout() {
  return await supabase.auth.signOut();
}
