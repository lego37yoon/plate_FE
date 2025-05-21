import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET:RequestHandler = ({ cookies }) => {
  cookies.delete("user", { path: "/" });
  
  const remain = cookies.get("user");

  if (remain) {
    return error(500, "Failed to delete cookie for user");
  } else {
    return Response.json({ sucess: true });
  }
}