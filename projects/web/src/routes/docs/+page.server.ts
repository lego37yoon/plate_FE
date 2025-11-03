import type { PageServerLoad } from "./$types";
import { error as kitError, type Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    kitError(500, error.message);
  }

  return {
    projects: data
  }
}

export const actions: Actions = {
  search: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const search_word = formData.get("search") as string;
    const projects = formData.get("projects") as string;

    const { data, error } = await supabase.from("files")
      .select("*").ilike("name", `%${search_word}%`).eq("project_id", projects).eq("type", "doc");

    if (error) {
      kitError(500, error.message);
    }

    return {
      documents: data
    }
  }
} satisfies Actions;