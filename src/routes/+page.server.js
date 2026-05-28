import { supabase } from "$lib/supabaseClient";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const { data, error } = await supabase
    .schema("clients")
    .rpc("test_connection");

  return {
    now: data,
  };
}
