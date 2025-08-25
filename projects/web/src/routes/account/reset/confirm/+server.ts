import { redirect } from '@sveltejs/kit'
import { type EmailOtpType } from '@supabase/supabase-js'
import { localizeHref } from '$lib/paraglide/runtime.js'

export const GET = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event;
  const token_hash = url.searchParams.get('token_hash') as string;
  const type = url.searchParams.get('type') as EmailOtpType | null;
  const next = url.searchParams.get('next') ?? "/";

  const redirectTo = new URL(url);
  redirectTo.pathname = localizeHref("/account/reset/new");
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      redirect(303, redirectTo);
    }
  }

  redirectTo.pathname = "/account/error";
  redirect(303, redirectTo);
}