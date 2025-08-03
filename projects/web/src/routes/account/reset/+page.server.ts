import { localizeHref } from "$lib/paraglide/runtime";
import type { Actions } from "./$types";
import { m } from "$lib/paraglide/messages";

export const actions: Actions = {
  default: async ({ request, locals: { supabase }}) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email.toString(), {
      redirectTo: localizeHref("/account/reset/confirm")
    });

    if (error) {
      return { 
        isError: true,
        errorMessage: m["account.reset_send_failed"]()
      }
    }

    return { 
      isError: false,
      resultMessage: m["account.reset_send_success"]()
    }
  }
}