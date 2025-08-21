import { m } from "$lib/paraglide/messages";
import { localizeHref } from "$lib/paraglide/runtime";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
  login: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();
    
    const email = formData.get("email");
    const password = formData.get("password");

    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toString(),
        password: password.toString()
      });

      if (error) {
        return {
          error: true,
          message: m["account.error_failed_login"]()
        }
      } else {
        throw redirect(303, localizeHref("/"));
      }
    } else {
      let errorMessage : string;

      if (email) {  
        errorMessage = m["account.error_password_blank"]()
      } else if (password) {
        errorMessage = m["account.error_email_blank"]()
      } else {
        errorMessage = m["account.error_failed_login"]()
      }
      
      return {
        error: true,
        message: errorMessage
      }
    }
  },
  
  github: async ({ locals: { supabase }}) => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: localizeHref("/account/login/github")
        }
      });

      if (error) {
        return {
          error: true,
          message: m["account.start_github_error"]()
        }
      } else {
        redirect(303, data.url);
      }

  }
}