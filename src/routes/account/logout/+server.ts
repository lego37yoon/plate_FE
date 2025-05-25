import { error as kitError, type Actions, type RequestHandler } from "@sveltejs/kit";

export const GET:RequestHandler = async ({ cookies, locals: { supabase } }) => {
  const { error } = await supabase.auth.signOut();
  cookies.delete("user", { path: "/" });
  
  const remain = cookies.get("user");

  if (remain || error) {
    console.log(remain, error);

    return kitError(500, "Failed to logout");
  } else {
    return Response.json({ sucess: true });
  }
}