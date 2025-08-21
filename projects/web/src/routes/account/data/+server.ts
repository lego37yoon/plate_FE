import { redirect, type RequestHandler } from "@sveltejs/kit";
import type { UserInfo } from "../../../types/account";
import { localizeHref } from "$lib/paraglide/runtime";

export const GET:RequestHandler = async({ cookies, url, locals: { safeGetSession, supabase } }) => {
  const userInfo = cookies.get("user");
  let userData : UserInfo | null = null;
  const { session, user } = await safeGetSession();

  console.log(session, user);

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
          redirect(303, localizeHref("/account/signup/step2"));
        }
      } else {
        redirect(303, localizeHref("/account/signup/step2"));
      }
    }
  }

  return Response.json(userData);
}