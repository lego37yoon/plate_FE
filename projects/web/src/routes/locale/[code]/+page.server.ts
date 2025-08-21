import type { PageServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals: { supabase }}) => {
  const { data, error } = await supabase.from("langs").select(`
    project_id,
    code,
    projects(
      name,
      version,
      files(count),
      lang_codes (
        origin_name
      )
    )
  `).eq("code", params.code);

  if (error) {
    throw kitError(500, error.message); 
  } else {
    return { projects: data };
  }
}