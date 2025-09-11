import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"

type Item = {
    id: number;
    key: string;
    origin: string;
    category: string;
    parent_id: number | null;
    group_idx: number | null;
    context: string | null;
}

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const dataReq = await Promise.all([
    supabase.from("resources").select(`id, key, origin, category, parent_id, group_idx, context, results(origin_id, approved, author, result, lang_code)`).eq("file_id", params.file).eq("results.lang_code", params.locale).eq("results.approved", true),
    supabase.from("files").select(`name, project_id, projects(name)`).eq("id", params.file),
  ]);

  if (dataReq[0].error || dataReq[1].error) {
    error(500, dataReq[0].error?.message ?? dataReq[1].error?.message);
  }

  const parents: Item[] = [];
  const children: Item[] = [];
  
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
    metadata: dataReq[1].data,
    locale: params.locale,
  }
}