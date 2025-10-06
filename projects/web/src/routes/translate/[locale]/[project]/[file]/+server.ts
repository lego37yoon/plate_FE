import { error as kitError, redirect } from "@sveltejs/kit";

export const GET = async (event) => {
  const { params, locals: { supabase }} = event;
  const { data, error } = await supabase.from("resources").select("id, parent_id, category, file_id").eq("file_id", params.file);

  if (error) {
    kitError(500, error.message);
  } else {
    const parents: ResourcesMinimum[] = [];
    const children: ResourcesMinimum[] = [];
  
    data.forEach((item : ResourcesMinimum) => {
      if (item.category === "group" || !item.parent_id) {
        parents.push(item);
      } else {
        children.push(item);
      }
    });

    if (parents.length > 0) {
      if (
        parents[0].category === "group"
        && children.length > 0
      ) {
        redirect(303, `${params.file}/${children[0].id}`);
      } else if (parents[0].category !== "group") {
        redirect(303, `${params.file}/${parents[0].id}`);
      }
    }
  }
  kitError(404, "Data Not Found");  
}