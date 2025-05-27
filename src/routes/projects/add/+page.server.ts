import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  const [codeReq, userReq] = await Promise.all([
    supabase.from("lang_codes").select("code, origin_name"),
    supabase.from("user").select("id, nick, avatar, pref_lang")
  ]);

  if (codeReq.error || userReq.error) {
    throw error(500, `Fetching Language Code = ${codeReq.error ?? "Successful"} / Fetching User List = ${userReq.error ?? "Successful"}`);
  } else {
    return {
      lang_codes: codeReq.data,
      users: userReq.data
    }
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase }}) => {

  }
}