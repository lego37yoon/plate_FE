<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { Separator, Avatar, Popover, Button } from "bits-ui";
    import { Moon, Sun, Monitor, UserRoundCog, LogOut } from "lucide-svelte";

    type UserRole = "super_admin" | "project_manager" | "l10n_manager" | "l10n_reviewer" | "l10n_contributor" | undefined;

    let { userRole, userName, userEmail, userImage, userProject, currentScreenMode }: {
        userRole: UserRole,
        userName: string | undefined,
        userEmail: string | undefined,
        userImage: string | undefined,
        userProject: string | undefined,
        currentScreenMode: "light" | "dark" | "system" 
    } = $props();
</script>

<!--
    TO-DO
    직책에 따라 Avatar 색상 변경
-->

<Popover.Root>
    <Popover.Trigger>
        <Avatar.Root class="rounded-full h-12 w-12 text-base">
            <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
                <Avatar.Image src={userImage} alt={`Account Settings for ${userName}`} />
                <Avatar.Fallback class="border">{userName ? userName : "P"}</Avatar.Fallback>    
            </div>
        </Avatar.Root>
    </Popover.Trigger>
    <Popover.Portal>
        <Popover.Content class="shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-30 rounded-xl border-0 flex">
            <section id="profile" class="flex gap-4 hover:bg-gray-100 rounded-xl">
                <Avatar.Root class="rounded-full h-12 w-12 text-base">
                    <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
                        <Avatar.Image src={userImage} alt={`Account Settings for ${userName}`} />
                        <Avatar.Fallback class="border">{userName ? userName : "P"}</Avatar.Fallback>
                    </div>
                </Avatar.Root>
                <div>
                    <p class="text-2xl">{userName}</p>
                    <p class="text-gray-500">
                        {userEmail}</p>
                    <p class="text-gray-300">
                        {userRole && userProject ? 
                            m.profile_role_and_project({ role: m[`role.${userRole}`], proj: userProject}):
                            userRole ?
                                m[`role.${userRole}`]:
                                m.profile_login
                        }
                    </p>
                </div>
                <Separator.Root class="bg-gray-500 -mx-4 mb-6 mt-[17px] block h-px" />
                <Button.Root class="flex gap-2 p-4 hover:bg-gray-100 rounded-xl">
                    {#if currentScreenMode === "light"}
                        <Moon />
                        {m.profile_switch_dark_btn}
                    {:else if currentScreenMode === "dark"}
                        <Monitor />
                        {m.profile_switch_system_btn}
                    {:else}
                        <Sun />
                        {m.profile_switch_light_btn}
                    {/if}
                </Button.Root>
                {#if userRole}
                <Button.Root href="/account/settings" class="flex gap-2 p-4 hover:bg-gray-100 rounded-xl">
                    <UserRoundCog />
                    {m.profile_account_settings_btn}
                </Button.Root>
                {/if}
                <Separator.Root class="bg-gray-500 -mx-4 mb-6 mt-[17px] block h-px" />
                <Button.Root class="flex gap-2 text-gray-500 p-4 hover:bg-gray-100 rounded-xl">
                    <LogOut />
                    {userRole ? m.profile_logout_btn : m.profile_login_btn}
                </Button.Root>
            </section>
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>