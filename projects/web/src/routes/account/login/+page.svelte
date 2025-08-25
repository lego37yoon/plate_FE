<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { localizeHref } from "$lib/paraglide/runtime";
    import { Button, Label, Separator } from "bits-ui";
    import { ArrowRight, Code, Info, RefreshCw, TriangleAlert, UserRoundPlus } from "@lucide/svelte";
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import { applyAction, enhance } from "$app/forms";

    let { form }: PageProps = $props();

    let isError = $state(form?.error);
    let errorMessage = $state(form?.message);
    let recentLogin = $state<string|null>(null);

    async function login() {
      localStorage.setItem("recentLogin", "password");
      isError = false;
    }

    async function loginWithGithub() {
      localStorage.setItem("recentLogin", "github");
      isError = false;
    }

    onMount(() => {
      recentLogin = localStorage.getItem("recentLogin");
    });
</script>

<svelte:head>
  <title>{m["title.login"]()} : Plate</title>
</svelte:head>

<h1 class="text-3xl mb-6 text-primary">{m["title.login"]()}</h1>

<form method="POST" action="?/login" onsubmit={login} use:enhance={() => {
  
  return async ({ result, update }) => {
    await applyAction(result);
    update({ reset: false });
  }
}}>
  {#if isError}
  <section id="error-message" class="flex gap-2 border border-red-900 bg-red-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <TriangleAlert size={24} class="text-red-900" />
    <span class="text-red-900">{errorMessage}</span>
  </section>
  {/if}

  <Label.Root id="email-label" for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
    {m["account.email"]()}
  </Label.Root>
  <input
    id="email"
    type="email"
    class="h-input rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
    name="email" required
  />
  <Label.Root id="password-label" for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
    {m["account.password"]()}
  </Label.Root>
  <input
    id="password"
    type="password"
    class="h-input rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
    name="password" required
  />
  <Button.Root type="submit" class="rounded-lg bg-lime-800 text-white shadow-sm text-base flex justify-center items-center p-2 my-2 w-full md:max-w-80 gap-1 cursor-pointer">
  <span>{m["account.login_btn"]()}</span>
    <ArrowRight size={20} />
  </Button.Root>
</form>

<form method="POST" action="?/github" onsubmit={loginWithGithub} use:enhance={() => {
  
  return async ({ result, update }) => {
    await applyAction(result);
    update({ reset: false });
  }
}}>  
  <Button.Root type="submit" class="rounded-lg bg-black text-white shadow-sm text-base flex justify-center items-center p-2 my-2 w-full md:max-w-80 gap-1 cursor-pointer" onclick={loginWithGithub} formaction="?/github">
    <span>{m["account.start_github_btn"]()}</span>
    <Code size={20} />
  </Button.Root>
</form>

{#if recentLogin}
<section id="recent-login" class="flex gap-2 border border-lime-900 bg-green-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
  <Info size={24} class="text-lime-900" />
  <span class="text-lime-900">{m["account.last_login"]({ method: (recentLogin === "github" ? "GitHub" : m["account.password"]()) })}</span>
</section>
{/if}

<Separator.Root class="bg-gray-300 my-4 w-full md:max-w-80 block h-px" />

<section id="account-tools" class="flex flex-col gap-2">
  <a href={localizeHref("/account/reset")} class="text-gray-700">
    <RefreshCw size={16} class="inline" />
    {m["account.reset_btn"]()}</a>
  <a href={localizeHref("/account/signup")} class="text-lime-900">
    <UserRoundPlus size={16} class="inline" />
    {m["account.signup_btn"]()}
  </a>
</section>