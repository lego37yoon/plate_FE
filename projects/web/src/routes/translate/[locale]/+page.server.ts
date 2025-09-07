import { localizeHref } from "$lib/paraglide/runtime";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = ({ params }) => {
  redirect(303, localizeHref(`/locale/${params.locale}`));
}