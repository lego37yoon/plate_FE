import { redirect, type Handle } from '@sveltejs/kit';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_PROJECT_URL } from '$env/static/public';
import { sequence } from '@sveltejs/kit/hooks';
import { deLocalizeHref, localizeHref } from '$lib/paraglide/runtime';

const supabaseServer: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_PROJECT_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options}) => {
					event.cookies.set(name, value, { ...options, path: "/" })
				})
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()

		if (!session) {
			return { session: null, user: null }
		}

		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser()

		if (error) {
			return { session: null, user: null }
		}

		return { session, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version"
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const privatePaths = ["/account/profile", "/projects/settings", "/org/settings", "/account/reset/step2"];
	const authPaths = ["/account/login", "/account/signup"];

	console.log(deLocalizeHref(event.url.pathname));

	if (!event.locals.user && privatePaths.includes(deLocalizeHref(event.url.pathname))) {
		redirect(303, "/account/login");
	}

	if (event.locals.user && authPaths.includes(deLocalizeHref(event.url.pathname)) && !event.url.pathname.includes("step2")) {
		redirect(303, "/projects");
	}

	return resolve(event);
}

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
	});
});

export const handle: Handle = sequence(supabaseServer, authGuard, handleParaglide);
