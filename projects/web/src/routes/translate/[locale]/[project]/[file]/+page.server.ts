import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const dataReq = await Promise.all([
    supabase.from("resources").select(`id, key, origin, category, parent_id, group_idx, context, results(origin_id, approved, author, result, lang_code)`).eq("file_id", params.file).eq("results.lang_code", params.locale),
    supabase.from("files").select(`name, project_id, projects(name)`).eq("id", params.file),
    supabase.from("dictionary").select("*").eq("lang_code", params.locale)
  ]);

  if (dataReq[0].error || dataReq[1].error || dataReq[2].error) {
    error(500, dataReq[0].error?.message ?? dataReq[1].error?.message ?? dataReq[2].error?.message);
  }

  const parents: Resources[] = [];
  const children: Resources[] = [];
  
  dataReq[0].data.forEach((item) => {
    if (item.category === "group" || !item.parent_id) {
      parents.push(item);
    } else {
      children.push(item);
    }
  });

  return {
    resources: {
      parent: parents,
      child: children
    },
    glossary: dataReq[2].data as Dictionary[],
    metadata: dataReq[1].data,
    locale: params.locale,
  }
}

export const actions: Actions = {
  commit: async ({ request, locals: { supabase }}) => {
    const form = await request.formData();
    const suggestMessage = form.get("suggest_message");

    console.log(suggestMessage);
  },
  approve: async ({ request, locals: { supabase } }) => {

  },
  deny: async ({ request, locals: { supabase } }) => {

  },
  suggest_delete: async ({ request, locals: { supabase } }) => {

  },
  glossary_new: async ({ request, locals: { supabase }}) => {
    console.log("new word submitted");
  },
  glossary_approve: async ({ request, locals: { supabase } }) => {

  },
  comment_new: async ({ request, locals: { supabase } }) => {

  },
  comment_update: async ({ request, locals: { supabase } }) => {
    
  },
  comment_delete: async ({ request, locals: { supabase } }) => {

  }
}