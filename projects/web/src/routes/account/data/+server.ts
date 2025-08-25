import { redirect, type RequestHandler } from "@sveltejs/kit";
import type { UserInfo } from "../../../types/account";
import { localizeHref } from "$lib/paraglide/runtime";
import { PUBLIC_BASE_URL } from "$env/static/public";

export const GET:RequestHandler = async({ cookies, url, locals: { safeGetSession, supabase } }) => {
  const userInfo = cookies.get("user");
  let userData : UserInfo | null = null;
  const { session, user } = await safeGetSession();

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
          return Response.json({
            redirect: true,
            url: `${PUBLIC_BASE_URL}${localizeHref("/account/signup/step2")}`
          });
        }
      } else {
        return Response.json({
          redirect: true,
          url: `${PUBLIC_BASE_URL}${localizeHref("/account/signup/step2")}`
        });
      }
    }
  }

  return Response.json(userData);
}