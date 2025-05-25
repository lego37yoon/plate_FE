import { SUPER_ADMIN_EMAIL } from "$env/static/private";
import { m } from "$lib/paraglide/messages";
import { UploadObject } from "$lib/s3/client";
import { type Actions, error as kitError } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const actions: Actions = {
  default: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();
    const nickname = formData.get("nickname");
    const pref_lang = formData.get("pref_lang_real");
    const avatar = formData.get("avatar") as File;

    const { data: { user } } = await supabase.auth.getUser();

    if (avatar && user && pref_lang && nickname) {
      
      const uploadReq = await UploadObject(avatar, avatar.name, `avatar/${user.id}`);
      
      if (uploadReq) {
        const { error } = await supabase.from("user").insert({
          "uid": user.id,
          "nick": nickname.toString(),
          "role": user.email === SUPER_ADMIN_EMAIL ? "super_admin" : "l10n_contributor",
          "avatar": uploadReq,
          "pref_lang": pref_lang.toString()
        });

        if (error) {
          console.log(error);
          return {
            error: true,
            message: m["account.signup_complete_error"]()
          }
        } else {
          return {
            success: true,
            message: m["account.signup_complete_success"]()
          }
        }
      } else {
        return {
          error: true,
          message: m["account.signup_complete_error"]()
        }
      }
    }
  }
}

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  const { data, error } = await supabase.from("lang_codes").select();

  if (error) {
    kitError(500, error.details);
  } else {
    return { lang_codes: data };
  }
}