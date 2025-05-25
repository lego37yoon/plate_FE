import type { LayoutServerLoad } from "./$types";
import { error as kitError, redirect } from "@sveltejs/kit";
import type { UserInfo } from "../types/account";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_URL } from "$env/static/public";
import { localizeHref } from "$lib/paraglide/runtime";

export const load: LayoutServerLoad = async ({ url, cookies, locals: { safeGetSession, supabase } }) => {
  
  const { session, user } = await safeGetSession();
  const userInfo = cookies.get("user");

  let userData : UserInfo | null = null;

  if (session && user) {
    if (userInfo) {
      userData = JSON.parse(userInfo);
    } else if (!url.pathname.includes("/account/signup/step2")) {
      const { data, error } = await supabase.from("user").select().eq("uid", user.id);

      if (data) {

        if (data.length > 0) {
          userData = data[0];
          if (userData) {
            cookies.set("user", JSON.stringify(userData), { path: "/" });
          }
        } else {
          throw redirect(303, localizeHref("/account/signup/step2"));
        }
      } else {
        throw redirect(303, localizeHref("/account/signup/step2"));
      }
    }
  }
  
  return { session, cookies: cookies.getAll(), info: userData };
}