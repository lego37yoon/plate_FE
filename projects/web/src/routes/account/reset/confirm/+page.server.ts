import { localizeHref } from "$lib/paraglide/runtime";
import type { Actions } from "./$types";
import { m } from "$lib/paraglide/messages";
import { error as kitError } from "@sveltejs/kit";

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
        return {
          errorMessage: m["account.change_password_failed"](),
          isError: true
        }
      } else {
        const { error } = await supabase.auth.signOut();
        const deleteCookieReq = await fetch("/api/account/logout");
        
        if (!deleteCookieReq.ok || error && error.status) {
          kitError(
              error ? (error.status ?? 500) : 500,
              m.profile_logout_error()
          );
        }
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