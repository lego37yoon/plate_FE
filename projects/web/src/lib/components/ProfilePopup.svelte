<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import type { User } from "@supabase/supabase-js";
    import { Separator, Avatar, Popover, Button } from "bits-ui";
    import { Moon, Sun, Monitor, UserRoundCog, LogOut, LogIn } from "@lucide/svelte";
    import { error as kitError } from "@sveltejs/kit";
    import { writable } from "svelte/store";
    import { getContext } from "svelte";
    import type { UserInfo } from "../types/account";
    import { localizeHref } from "$lib/paraglide/runtime";
    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";

    let { user }: {
        user?: User | null
    } = $props();

    const currentScreenMode : { mode : "system" | "light" | "dark" } = getContext("screenMode");
    const userInfo : { data: UserInfo | undefined } = getContext("account");
    const isOpen = writable(false);

    async function logout() {
        isOpen.set(false);
        const deleteCookieReq = await fetch("/account/logout");
        
        if (!deleteCookieReq.ok) {
            kitError(
                500,
                m.profile_logout_error()
            );
        } else {
            goto(localizeHref("/"), { invalidateAll: true });
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
        if (user) {
            switch(userInfo.data?.role) {
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
        } else {
            return "border-primary";
        }
    }
</script>
<Popover.Root bind:open={$isOpen}>
    <Popover.Trigger>
        <Avatar.Root class={`cursor-pointer rounded-full h-12 w-12 text-lg data-[status=loaded]:${getRingColor()} data-[status=loading]:border-transparent`}>
            <div class={`flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 ${getRingColor()}`}>
                {#if userInfo.data && userInfo.data.avatar}
                <Avatar.Image src={userInfo.data.avatar} alt={`Account Settings for ${userInfo.data.nick}`} />
                {:else}
                <span class="rounded-full h-full w-full grow flex items-center justify-center leading-0">
                    {userInfo.data ? userInfo.data.nick : "P"}
                </span>
                {/if}
            </div>
        </Avatar.Root>
    </Popover.Trigger>
    <Popover.Portal>
        <Popover.Content forceMount>
            {#snippet child({ wrapperProps, props, open })}
            {#if open}
            <div {...wrapperProps}>
            <div {...props} class="z-30 rounded-xl border-0 flex flex-col max-w-[328px] bg-white shadow-profile p-2 me-2 mt-2" transition:fade={{ duration: 100 }}>
                <Button.Root id="profile" class="flex gap-4 items-center hover:bg-gray-100 rounded-xl p-4" href={!user ? localizeHref("/account/login") : localizeHref("/account/profile")} onclick={() => isOpen.set(false)}>
                    <Avatar.Root delayMs={200} class={`rounded-full h-16 w-16 text-base border-2 ${getRingColor()}`}>
                        <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
                            {#if userInfo.data && userInfo.data.avatar}
                            <Avatar.Image src={userInfo.data.avatar} alt={`Account Settings for ${userInfo.data.nick}`} />
                            {:else}
                            <span class="text-primary rounded-full h-full w-full grow flex items-center justify-center leading-0 text-2xl">
                                {userInfo.data ? userInfo.data.nick : "P"}
                            </span>
                            {/if}
                        </div>
                    </Avatar.Root>
                    <div class="text-start">
                        <p class="text-xl text-primary">{userInfo.data ? userInfo.data.nick : m.profile_please_login()}</p>
                        <p class="text-gray-500">
                            {user ? user.email : "example@example.com"}</p>
                        <p class="text-gray-300">
                            {userInfo.data ? 
                                userInfo.data.role === "project_manager" ? 
                                    m.profile_role_and_project({ role: m[`role.${userInfo.data.role}`](), proj: ""}):
                                userInfo.data.role ?
                                    m[`role.${userInfo.data.role}`]():
                                    m.profile_login()
                                :m.profile_get_role()
                            }
                        </p>
                    </div>
                </Button.Root>
                <Separator.Root class="bg-gray-300 my-1 block h-px" />
                <Button.Root class="flex gap-2 p-4 hover:bg-gray-100 rounded-xl cursor-pointer" onclick={changeMode} type="button">
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
                {#if user}
                <Button.Root href={localizeHref("/account/settings")} class="flex gap-2 p-4 hover:bg-gray-100 rounded-xl">
                    <UserRoundCog />
                    {m.profile_account_settings_btn()}
                </Button.Root>
                {/if}
                <Separator.Root class="bg-gray-300 my-1 block h-px" />
                {#if user}
                <Button.Root class="flex gap-2 text-gray-500 p-4 hover:bg-gray-100 rounded-xl cursor-pointer" onclick={async () => logout()} type="button">
                    <LogOut />
                    {m.profile_logout_btn()}
                </Button.Root>
                {:else}
                <Button.Root class="flex gap-2 text-gray-500 p-4 hover:bg-gray-100 rounded-xl" href={localizeHref("/account/login")} onclick={() => isOpen.set(false)}>
                    <LogIn />
                    {m.profile_login_btn()}
                </Button.Root>
                {/if}
            </div>
            </div>
            {/if}
            {/snippet}
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>