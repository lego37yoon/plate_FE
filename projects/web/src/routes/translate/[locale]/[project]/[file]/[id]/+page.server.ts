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
      return {
        parent: parents,
        child: children,
        metadata: req[1].data,
        locale: params.locale,
        current: {
          ...currentMeta,
          data: currentItem as Resources
        }
      }
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