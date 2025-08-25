<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { Button, Label } from "bits-ui";
    import { ArrowRight, CheckCircle2, Info, TriangleAlert } from "@lucide/svelte";
    import type { PageProps } from "./$types";
    import { applyAction, enhance } from "$app/forms";

    let { form }: PageProps = $props();
    let requireResend = $state(false);

    async function signup() {
      localStorage.setItem("recentLogin", "password");

      setTimeout(() => {
        requireResend = true;
      }, 3000);
    }
</script>

<svelte:head>
  <title>{m["title.signup"]()} : Plate</title>
</svelte:head>

<h1 class="text-3xl mb-6 text-primary">{m["title.signup"]()}</h1>

<form method="POST" action="?/confirm" onsubmit={signup} use:enhance={() => {
  
  return async ({ result, update }) => {
    await applyAction(result);
    update({ reset: false });
  }
}}>
  {#if form?.error}
  <section id="error-message" class="flex gap-2 border border-red-900 bg-red-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <TriangleAlert size={24} class="text-red-900" />
    <span class="text-red-900">{form.message}</span>
  </section>
  {:else if form?.success}
  <section id="require-resend" class="flex gap-2 border border-lime-900 bg-green-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <CheckCircle2 size={24} class="text-lime-900" />
    <p class="text-lime-900">
      {m["account.reset_send_success"]()}
    </p>
  </section>
  {/if}

  <Label.Root id="email-label" for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
    {m["account.email"]()}
  </Label.Root>
  <p id="email-desc" class="text-sm text-gray-500 mb-1">{m["account.email_desc"]()}</p>
  <input
    id="email"
    type="email"
    class="h-input rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
    name="email" required aria-describedby="email-desc"
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
    <span>{m["account.signup_next_btn"]()}</span>
    <ArrowRight size={20} />
  </Button.Root>

  {#if requireResend}
  <section id="require-resend" class="flex gap-2 border border-lime-900 bg-green-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <Info size={24} class="text-lime-900" />
    <p>
      <span class="text-lime-900">{m["account.signup_resend_q"]()}</span>
      <Button.Root class="underline cursor-pointer" formaction="?/resend">{m["account.signup_resend_btn"]()}</Button.Root>
    </p>
  </section>
  {/if}
</form>