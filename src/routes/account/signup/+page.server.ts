import { PUBLIC_BASE_URL } from "$env/static/public";
import { m } from "$lib/paraglide/messages";
import { localizeHref } from "$lib/paraglide/runtime";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");
    const redirectURL = `${PUBLIC_BASE_URL}${localizeHref("/account/signup/step2")}`

    if (email && password) {
      const { error } = await supabase.auth.signUp({
        email: email.toString(),
        password: password.toString(),
        options: {
          emailRedirectTo: redirectURL
        }
      });

      if (error) {
        return {
          error: true,
          message: m["account.error_failed_login"]()
        }
      }
    } else {
      let errorMessage = m["account.error_failed_login"]()
      if (email) {
        errorMessage = m["account.error_password_blank"]()
      } else if (password) {
        errorMessage = m["account.error_email_blank"]()
      }

      return {
        error: true,
        message: errorMessage
      }
    }
  }
}