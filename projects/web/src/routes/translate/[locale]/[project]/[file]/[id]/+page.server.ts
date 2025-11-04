import { error as kitError } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load:PageServerLoad = async ({ params, locals: { supabase } }) => {
  const req = await Promise.all([
    supabase.rpc("resources_with_dictionary", 
    { "resource_id": params.id, "file": params.file, "locale": params.locale }),
    supabase.from("files").select(`id, name, src, type, project_id, projects(name)`).eq("project_id", params.project)
  ])

  if (req[0].error) {
    kitError(500, `RPC Error: ${req[0].error.message}`);
  } else if (req[1].error) {
    kitError(500, req[1].error.message);
  } else {
    const parents: Resources[] = [];
    const children: Resources[] = [];
    let currentItem: Resources|null = null;
    let currentMeta: { 
      type: null | "parent" | "child",
      index: number, next: number 
    } = {
      type: null, index: -1, next: -1
    }
  
    req[0].data.forEach((item : Resources) => {
      let index: number = -1;
      let type: "parent" | "child" = "parent";

      if (item.category === "group" || !item.parent_id) {
        index = parents.push(item) - 1;
      } else {
        index = children.push(item) - 1;
        type = "child";
      }
      
      if (item.id === Number(params.id)) {
        // resource category should not called by anyone
        if (item.category === "group") {
          kitError(400, "Category Group does not have any translation materials");
        }

        currentItem = item
        currentMeta.index = index;
        currentMeta.type = type;
      }
    });

    if (currentItem) {
      const item = currentItem as Resources;
      // for parent category
      if (currentMeta.type === "parent" && currentItem) {
        // CAUTION: should update group index if resource file updated
        const nextChild = children.find((i) => i.parent_id === item.id && i.group_idx === 0);

        if (nextChild) { // check if children exists
          currentMeta.next = nextChild.id;
        } else {
          // starting from current point, check if next parents with contents
          let nextIndex = currentMeta.index;
          
          while(currentMeta.next < 0 && nextIndex < parents.length) {
            nextIndex++;

            // if non-group parent exists after / before current item, allocate it
            if (nextIndex < parents.length &&
              parents[nextIndex].category !== "group"
            ) {
              currentMeta.next = parents[nextIndex].id;
            } else if (nextIndex === currentMeta.index) {
              // if next index is same as current index, then this phrase failed
              if (children.length > 0) {
                // both non-group parents and item's children does not exist, then set the first children item as next index.
                currentMeta.next = children[0].id
              } else {
                // if children also not exists, then current item would be the only item in this file.
                currentMeta.next = item.id;
              }
              break;
            } else { // go to the first index to find more
              nextIndex = 0;
            }
          }
        }
      } else { // for child category
        if (currentMeta.index < children.length - 1) {
          currentMeta.next = children[currentMeta.index + 1].id;
        } else { // check next parent
          const currentParent = parents.findIndex((i) => item.parent_id = i.id);

          if (currentParent &&
            currentParent + 1 < parents.length
          ) {
            currentMeta.next = parents[currentParent + 1].id;
          } else {
            currentMeta.next = parents[0].id;
          }
        }
      }
    }

    if (currentItem === null || currentMeta.index === -1) {
      kitError(404, `Cannot found data from current file`);
    } else {
      console.log(req[1].data.find((i) => i.id === Number(params.file)))

      return {
        parent: parents,
        child: children,
        metadata: [req[1].data.find((i) => i.id === Number(params.file))],
        locale: params.locale,
        current: {
          ...currentMeta,
          data: currentItem as Resources
        },
        files: req[1].data.filter((i) => i.type === "doc")
      }
    }
  }
}

export const actions: Actions = {
  commit: async ({ request, params, locals: { supabase }}) => {
    const form = await request.formData();
    const suggestMessage = form.get("suggest_message");
    const user_id = form.get("user_id");

    if (user_id) {
      const { data, error } = await supabase.from("results").insert({ 
        origin_id: params.id,
        approved: null,
        author: Number(user_id),
        result: suggestMessage,
        lang_code: params.locale
      });

      if (error) {
        kitError(500, error.message);
      } else {
        return {
          status: 200,
          type: "Commit",
          message: "Update Successful"
        }
      }
    } else {
      kitError(400, "Please login before commit")
    }
  },
  suggest_manage: async ({ request, params, locals: { supabase } }) => {
    const form = await request.formData();
    const command_type = form.get("command_type");
    const suggest_id = form.get("suggest_id");
    const origin_id = form.get("origin_id");
    const user_role = form.get("user_role");

    console.log(form.values());
    console.log("hello from suggest managing actions")

    if (user_role !== "l10n_contributor") {
      let updateError;

      if (command_type === "approve") {
        const { error } = await supabase.from("results").update({ approved: true }).eq("id", suggest_id);
        updateError = error;
      } else if (command_type === "deny") {
        const { error } = await supabase.from("results").update({ approved: false }).eq("id", suggest_id);
        updateError = error;
      }
      const refreshReq = await supabase.from("results").select("*").eq("origin_id", Number(origin_id)).eq("lang_code", params.locale);

      if (updateError) {
        kitError(400, updateError.message);
      } else if (refreshReq.error) {
        kitError(500, refreshReq.error.message);
      } else {
        return {
          status: 200,
          new: refreshReq.data,
          origin: origin_id,
          type: "Suggestion",
          message: "Update Successful"
        }
      }

    } else {
      kitError(400, "Contributor cannot approve translation");
    }
  },
  suggest_delete: async ({ request, params, locals: { supabase } }) => {
    const form = await request.formData();
    const suggest_id = form.get("suggest_id");
    const suggest_author = form.get("suggest_author");
    const origin_id = form.get("origin_id");
    const approved = form.get("suggest_approved");
    const user_id = form.get("user_id");
    const user_role = form.get("user_role");

    if ((user_id === suggest_author && approved !== "true") || user_role !== "l10n_contributor") {
      const deleteReq = await supabase.from("results").delete().eq("id", suggest_id);
      const updateReq = await supabase.from("results").select("*").eq("origin_id", Number(origin_id)).eq("lang_code", params.locale);

      if (deleteReq.error) {
        kitError(400, deleteReq.error.message);
      } else if (updateReq.error) {
        kitError(500, updateReq.error.message);
      } else {
        return {
          status: 200,
          new: updateReq.data,
          origin: origin_id,
          type: "Suggestion",
          message: "Update Successful"
        }
      }
    }
  },
  glossary_new: async ({ request, params, locals: { supabase }}) => {
    const form = await request.formData();
    const origin = form.get("suggest_word_origin");
    const origin_full = form.get("suggest_src");
    const result = form.get("suggest_word_result");

    const insertReq = await supabase.from("dictionary").insert({ lang_code: params.locale, origin: origin, result: result, approved: false });
    
    if (insertReq.error) {
      kitError(400, insertReq.error.message);
    } else {
      const { data, error } = await supabase.rpc("refresh_dictionary", { "locale": params.locale, "origin_full": origin_full });

      if (error) {
        kitError(400, error.message);
      } else {
        return {
          status: 200,
          new: data,
          type: "Glossary",
          message: "Update Successful"
        }
      }
    }
  },
  glossary_approve: async ({ request, params, locals: { supabase } }) => {
    const form = await request.formData();
    const id = form.get("id");
    const command_type = form.get("command_type");
    const origin_full = form.get("suggest_src");

    if (command_type !== "delete") {
      const updateReq = await supabase.from("dictionary").update({ approved: command_type === "approve" }).eq("id", id);

      if (updateReq.error) {
        kitError(500, updateReq.error.message);
      }
    } else if (command_type === "delete") {
      const updateReq = await supabase.from("dictionary").delete().eq("id", id);

      if (updateReq.error) {
        kitError(500, updateReq.error.message);
      }
    } else {
      kitError(400, "Unknown command type");
    }

    const { data, error } = await supabase.rpc("refresh_dictionary", { "locale": params.locale, "origin_full": origin_full });

    if (error) {
      kitError(500, error.message);
    } else {
      return {
        status: 200,
        new: data,
        type: "Glossary",
        message: "Update Successful"
      }
    }
  },
  comment_new: async ({ request, locals: { supabase } }) => {

  },
  comment_update: async ({ request, locals: { supabase } }) => {
    
  },
  comment_delete: async ({ request, locals: { supabase } }) => {
    
  },
} satisfies Actions;