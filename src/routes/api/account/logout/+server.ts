import { error as kitError, json, type RequestHandler } from "@sveltejs/kit";

export const GET:RequestHandler = async ({ cookies, locals: { supabase } }) => {
  cookies.delete("user", { path: "/" });
  
  const remain = cookies.get("user");
  const { error } = await supabase.auth.signOut();

  if (remain || error) {
    return kitError(500, "Failed to logout");
  } else {
    return Response.json({ sucess: true });
  }
}