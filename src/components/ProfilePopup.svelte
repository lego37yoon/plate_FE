<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import type { User } from "@supabase/supabase-js";
    import { Separator, Avatar, Popover, Button } from "bits-ui";
    import { Moon, Sun, Monitor, UserRoundCog, LogOut, LogIn } from "lucide-svelte";
    import { error as kitError } from "@sveltejs/kit";
    import { getContext } from "svelte";
    import type { UserInfo } from "../types/account";
    import { localizeHref } from "$lib/paraglide/runtime";

    let { user }: {
        user?: User | null
    } = $props();

    const currentScreenMode : { mode : "system" | "light" | "dark" } = getContext("screenMode");
    const userInfo : UserInfo | undefined = getContext("account");


    async function logout() {
        const deleteCookieReq = await fetch("/api/account/logout");
        
        if (!deleteCookieReq.ok) {
            kitError(
                500,
                m.profile_logout_error()
            );
        }
    }

    function changeMode() {
        switch(currentScreenMode.mode) {
            case "light":
                currentScreenMode.mode = "dark";
                break;
            case "dark":
                currentScreenMode.mode = "system";
                break;
            case "system":
                currentScreenMode.mode = "light";
                break;
        }
    }

    function getRingColor() {
        switch(userInfo?.role) {
            case "project_manager":
            case "super_admin":
                return "border-proj-mngr";
            case "l10n_manager":
            case "l10n_reviewer":
                return "border-local-team";
            case "l10n_contributor":
                return "border-contributor";
            default:
                return "border-primary";
        }
    }
</script>

<Popover.Root>
    <Popover.Trigger>
        <Avatar.Root class={`cursor-pointer rounded-full h-12 w-12 text-lg data-[status=loaded]:${getRingColor()} data-[status=loading]:border-transparent`}>
            <div class={`flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 ${getRingColor()}`}>
                {#if userInfo && userInfo.avatar}
                <Avatar.Image src={userInfo.avatar} alt={`Account Settings for ${userInfo.nick}`} />
                {:else}
                <Avatar.Fallback class="border-2 rounded-full h-full w-full grow flex items-center justify-center leading-0">{userInfo ? userInfo.nick : "P"}</Avatar.Fallback>
                {/if}
            </div>
        </Avatar.Root>
    </Popover.Trigger>
    <Popover.Portal>
        <Popover.Content class="shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-30 rounded-xl border-0 flex flex-col max-w-[328px] bg-white shadow-profile p-2 me-2 mt-2">
            <Button.Root id="profile" class="flex gap-4 items-center hover:bg-gray-100 rounded-xl p-4" href={user === undefined ? localizeHref("/account/login") : localizeHref("/account/profile")}>
                <Avatar.Root delayMs={200} class={`rounded-full h-16 w-16 text-base border-2 ${getRingColor()}`}>
                    <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
                        {#if userInfo && userInfo.avatar}
                        <Avatar.Image src={userInfo.avatar} alt={`Account Settings for ${userInfo.nick}`} />
                        {:else}
                        <Avatar.Fallback class="border-primary text-primary border-2 rounded-full h-full w-full grow flex items-center justify-center leading-0 text-2xl">{userInfo ? userInfo.nick : "P"}</Avatar.Fallback>
                        {/if}
                    </div>
                </Avatar.Root>
                <div class="text-start">
                    <p class="text-xl text-primary">{userInfo ? userInfo.nick : m.profile_please_login()}</p>
                    <p class="text-gray-500">
                        {user ? user.email : "example@example.com"}</p>
                    <p class="text-gray-300">
                        {userInfo ? 
                            userInfo.role === "project_manager" ? 
                                m.profile_role_and_project({ role: m[`role.${userInfo.role}`](), proj: ""}):
                            userInfo.role ?
                                m[`role.${userInfo.role}`]():
                                m.profile_login()
                            :m.profile_get_role()
                        }
                    </p>
                </div>
            </Button.Root>
            <Separator.Root class="bg-gray-300 my-1 block h-px" />
            <Button.Root class="flex gap-2 p-4 hover:bg-gray-100 rounded-xl" onclick={changeMode} type="button">
                {#if currentScreenMode.mode === "light"}
                    <Moon />
                    {m.profile_switch_dark_btn()}
                {:else if currentScreenMode.mode === "dark"}
                    <Monitor />
                    {m.profile_switch_system_btn()}
                {:else}
                    <Sun />
                    {m.profile_switch_light_btn()}
                {/if}
            </Button.Root>
            {#if userInfo && userInfo.role}
            <Button.Root href={localizeHref("/account/settings")} class="flex gap-2 p-4 hover:bg-gray-100 rounded-xl">
                <UserRoundCog />
                {m.profile_account_settings_btn()}
            </Button.Root>
            {/if}
            <Separator.Root class="bg-gray-300 my-1 block h-px" />
            {#if user}
            <Button.Root class="flex gap-2 text-gray-500 p-4 hover:bg-gray-100 rounded-xl" onclick={async () => logout()} type="button">
                <LogOut />
                {m.profile_logout_btn()}
            </Button.Root>
            {:else}
            <Button.Root class="flex gap-2 text-gray-500 p-4 hover:bg-gray-100 rounded-xl" href={localizeHref("/account/login")}>
                <LogIn />
                {m.profile_login_btn()}
            </Button.Root>
            {/if}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>