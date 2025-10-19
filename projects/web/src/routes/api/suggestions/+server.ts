// only for refreshing suggestions after approve / deny / delete data
// not for pages
import { error as kitError } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
  const { url, locals: { supabase }} = event;
  const origin = url.searchParams.get("origin");

  if (origin) {
    const { data, error } = await supabase.from("results").select().eq("origin_id", origin);
    
    if (error) {
      kitError(500, error.message);  
    } else {
      return Response.json(data);
    }
  } else {
    kitError(400, "Parameter not provided.");
  }
}