import type { PageServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  const { data, error } = await supabase.from("projects").select(`
    *,
    files(count),
    langs(
      code,
      lang_codes (
        origin_name
      )
    )
  `);

  if (error) {
    throw kitError(500, error.message); 
  } else {
    return { projects: data };
  }
}