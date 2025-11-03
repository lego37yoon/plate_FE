import type { PageServerLoad } from "./$types";
import { error as kitError, type Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data, error } = await supabase.from("lang_codes").select("*");

  if (error) {
    kitError(500, error.message);
  }

  return {
    lang_codes: data
  }
}

export const actions: Actions = {
  search: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const search_word = formData.get("search") as string;
    const locale = formData.get("locale") as string; 
    const isResult = formData.get("isResult") === "true";

    const glossaryReq = await supabase.from("dictionary").select("*").ilike(isResult ? "result" : "origin", `%${search_word}%`).eq("lang_code", locale);
    const suggestionReq = await supabase.from("results").select("*, resources(origin)").ilike(isResult ? "result" : "resources.origin", `%${search_word}%`).eq("lang_code", locale).not("resources", "is", null);
  
    if (glossaryReq.error) {
      kitError(500, glossaryReq.error.message);
    } else if (suggestionReq.error) {
      kitError(500, suggestionReq.error.message);
    }

    console.log(suggestionReq.data);

    return {
      glossaries: glossaryReq.data,
      suggestions: suggestionReq.data
    };
  }
} satisfies Actions;