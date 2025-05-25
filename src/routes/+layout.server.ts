import type { LayoutServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";
import type { UserInfo } from "../types/account";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_URL } from "$env/static/public";

export const load: LayoutServerLoad = async ({ cookies, locals: { safeGetSession } }) => {
  
  const { session } = await safeGetSession();
  const userInfo = cookies.get("user");

  let userData : UserInfo | null = null;

  if (session && session.user) {
    if (userInfo) {
      userData = JSON.parse(userInfo);
    } else {
      const req = await fetch(`${PUBLIC_SUPABASE_PROJECT_URL}/rest/v1/user?uid=${session.user.id}`, {
        method: "GET",
        headers: {
          "apiKey": PUBLIC_SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${PUBLIC_SUPABASE_ANON_KEY}`
        }
      });

      if (req.ok) {
        const data = await req.json();

        if (data.length > 0) {
          userData = data[0];
          if (userData) {
            cookies.set("user", userData.toString(), { path: "/" });
          }
        }
      } else {
        kitError(401, "userInfo.NotFound");
      }
    }
  }
  
  return { session, cookies: cookies.getAll(), info: userData };
}