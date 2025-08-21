import { createBrowserClient, createServerClient, isBrowser } from "@supabase/ssr";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_URL } from "$env/static/public";
import type { LayoutLoad } from "./$types";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { goto } from "$app/navigation";

export const load:LayoutLoad = async ({ url, data, depends, fetch }) => {
  depends("supabase:auth");

  const supabase = isBrowser() 
  ? createBrowserClient(PUBLIC_SUPABASE_PROJECT_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global: { fetch, },
    })
  : createServerClient(PUBLIC_SUPABASE_PROJECT_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: { fetch, }, cookies: { getAll: async () => data.cookies ?? null }, 
  });

  const { data: { session }, } = await supabase.auth.getSession();
  const { data: { user }, } = await supabase.auth.getUser();

  const docId = url.searchParams.get("doc");
  const infoReq = await fetch("/account/data");
  
  if (infoReq.ok) {
    if (infoReq.redirected) {
      goto(infoReq.url);
    }
    
    const info = await infoReq.json();
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
            session, supabase, user, info
          };
        } else {
          return {
            meta: data[0],
            error: 1,
            session, supabase, user, info
          }
        }
      }
    }

    return { session, supabase, user, info }; 
  }
  
  return { session, supabase, user };
}