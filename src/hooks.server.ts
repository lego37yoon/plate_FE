import { redirect, type Handle } from '@sveltejs/kit';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
	}
}

const supabaseServer: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, {
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
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session;
	event.locals.user = user;

	const privatePaths = ["/account/profile", "/projects/settings", "/org/settings"];
	const authPaths = ["/account/login", "/account/signup"];

	if (!event.locals.session && privatePaths.includes(event.url.pathname)) {
		redirect(303, "/account/login");
	}

	if (event.locals.session && authPaths.includes(event.url.pathname)) {
		redirect(303, "/account/profile");
	}

	return resolve(event);
}

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
	});
});

export const handle: Handle = sequence(handleParaglide, supabaseServer, authGuard);
