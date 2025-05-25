import type { LayoutServerLoad } from "./$types";
import { error as kitError, redirect } from "@sveltejs/kit";
import type { UserInfo } from "../types/account";
import { localizeHref } from "$lib/paraglide/runtime";

export const load: LayoutServerLoad = async ({ url, cookies, depends, locals: { safeGetSession, supabase } }) => {
  const { session, user } = await safeGetSession();

  return { session, cookies: cookies.getAll() };
}