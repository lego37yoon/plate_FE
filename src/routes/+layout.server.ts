import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ url, cookies, depends, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();

  return { session, cookies: cookies.getAll() };
}