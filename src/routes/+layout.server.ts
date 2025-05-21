import { supabase } from "$lib/supabase";
import type { AuthError, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { LayoutServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";
import type { UserInfo } from "../types/account";

export const load: LayoutServerLoad = async ({ url, cookies, locals: { safeGetSession } }) => {
  const docId = url.searchParams.get("doc");
  const { session, user } = await safeGetSession();
  const userInfo = cookies.get("user");

  let userData : UserInfo | null = null;

  if (session && user) {
    if (userInfo) {
      userData = JSON.parse(userInfo);
    } else {
      const { data, error } = await supabase.from("user").select().eq("uid", user.id);

      if (error || !userData) {
        kitError(401, "userInfo.NoetFound");
      } else {
        userData = data[0];
        if (userData) {
          cookies.set("user", userData.toString(), { path: "/" });
        }
      }
    }
  }

  if (docId) {
    const { data } : PostgrestSingleResponse<{
      id: number, src: string, title: string, for: string, related: number, lang: string
    }[]|null> = await supabase.from("docs").select().eq("id", docId);

    if (data && data.length > 0) {
      const rawDocReq = await fetch(data[0].src);

      if (rawDocReq.ok) {
        return {
          meta: data[0],
          doc: await rawDocReq.text(),
          session, user, cookies: cookies.getAll(), userData
        };
      } else {
        return {
          meta: data[0],
          error: 1,
          session, user, cookies: cookies.getAll(), userData
        }
      }
    }
  } else {
    return {
      session, user, cookies: cookies.getAll(), userData
    }
  }
}