import type { PageServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  const { data, error } = await supabase.from("projects").select(`
      id, name, version, files(count), langs(count)
    `).eq("files.type", "resource");

  if (error) {
    throw kitError(500, error.message); 
  } else {
    return { projects: data };
  }
}