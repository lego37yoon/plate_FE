import { PUBLIC_BASE_URL } from "$env/static/public";
import { m } from "$lib/paraglide/messages";
import { localizeHref } from "$lib/paraglide/runtime";
import { type Actions, error as kitError } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const actions: Actions = {
  confirm: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");
    const redirectURL = `${PUBLIC_BASE_URL}${localizeHref("/account/signup/step2")}`

    // TODO: Check already have an account if SDK supports

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
      } else {
        return {
          success: true
        }
      }
    } else {
      let errorMessage = m["account.error_failed_login"]();
      if (email) {
        errorMessage = m["account.error_password_blank"]();
      } else if (password) {
        errorMessage = m["account.error_email_blank"]();
      }

      return {
        error: true,
        message: errorMessage
      }
    }
  },

  resend: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();
    
    const email = formData.get("email");
    const redirectURL = `${PUBLIC_BASE_URL}${localizeHref("/account/signup/step2")}`

    if (email) {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.toString(),
        options: {
          emailRedirectTo: redirectURL
        }
      });

      if (error) {
        return {
          error: true,
          message: m["account.error_failed_login"]()
        }
      } else {
        return {
          success: true
        }
      }
    } else {
      return {
        error: true,
        message: m["account.error_email_blank"]()
      }
    }
  }
}