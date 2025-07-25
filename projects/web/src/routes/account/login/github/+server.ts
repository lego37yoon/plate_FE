import { localizeHref } from "$lib/paraglide/runtime";
import { redirect } from "@sveltejs/kit";

export const GET = async (event) => {
  const { url, locals: { supabase }} = event;

  const code = url.searchParams.get("code") as string;
  const next = url.searchParams.get("next") ?? "/";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();

    if (!error) {
      if (user) {
        const { data } = await supabase.from("user").select().eq("uid", user.id);

        if (!data || data.length === 0) {
          throw redirect(303, "/account/signup/step2");
        }
      }

      throw redirect(303, `/${next.slice(1)}`);
    }
  }
  
  throw redirect(303, "/auth/auth-code-error");
}