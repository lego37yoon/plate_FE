export type UserRole = "super_admin" | "project_manager" | "l10n_manager" | "l10n_reviewer" | "l10n_contributor" | undefined;

export type UserInfo = { id: number, uid: string, nick: string, role: UserRole, avatar: string, pref_lang: string }