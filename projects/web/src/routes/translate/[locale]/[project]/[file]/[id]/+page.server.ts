import { error as kitError } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load:PageServerLoad = async ({ params, locals: { supabase } }) => {
  const req = await Promise.all([
    supabase.rpc("resources_with_dictionary", 
    { "resource_id": params.id, "file": params.file, "locale": params.locale }),
    supabase.from("files").select(`name, project_id, projects(name)`).eq("id", params.file)
  ])

  if (req[0].error) {
    kitError(500, `RPC Error: ${req[0].error.message}`);
  } else if (req[1].error) {
    kitError(500, req[1].error.message);
  } else {
    const parents: Resources[] = [];
    const children: Resources[] = [];
    let currentItem;
  
    req[0].data.forEach((item : Resources) => {
      if (item.category === "group" || !item.parent_id) {
        parents.push(item);
      } else {
        children.push(item);
      }
      
      if (item.id === Number(params.id)) {
        currentItem = item
      }
    });

    return {
      parent: parents,
      child: children,
      metadata: req[1].data,
      locale: params.locale,
      current: currentItem
    }
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