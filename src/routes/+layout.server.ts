import { supabase } from "$lib/supabase";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ url, cookies, locals: { safeGetSession } }) => {
  const docId = url.searchParams.get("doc");
  const { session, user } = await safeGetSession();

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
          session, user, cookies: cookies.getAll()
        };
      } else {
        return {
          meta: data[0],
          error: 1,
          session, user, cookies: cookies.getAll()
        }
      }
    }
  } else {
    return {
      session, user, cookies: cookies.getAll()
    }
  }
}