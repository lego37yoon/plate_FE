import { localizeHref } from "$lib/paraglide/runtime";
import type { Actions, PageServerLoad } from "./$types";
import { m } from "$lib/paraglide/messages";
import { error as kitError, redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();
    const password = formData.get("password") as string;
    const retype = formData.get("retype") as string;

    if (password && retype && password === retype) {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.log(error.message);
        return {
          errorMessage: m["account.change_password_failed"](),
          isError: true
        }
      } else {
        redirect(303, "/account/logout");
      }
    } else if (password !== retype) {
        return {
          errorMessage: m["account.change_password_not_same"](),
          isError: true
        }
    } else if (password || retype) {
      return {
        errorMessage: m["account.error_password_blank"](),
        isError: true
      }
    }

    return {
      errorMessage: m["account.change_password_failed"](),
      isError: true
    }

  }
}