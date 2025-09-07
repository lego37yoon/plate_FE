import type { PageServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals: { supabase }}) => {
  const { data, error } = await supabase.from("files").select(`
    id,
    project_id,
    name,
    src,
    type,
    projects(
      name,
      version,
      id
    )
  `).eq("project_id", params.project).eq("type", "resource");

  if (error) {
    throw kitError(500, error.message); 
  } else {
    return { files: data, locale: params.code };
  }
}