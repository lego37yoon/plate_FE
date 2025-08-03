<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { Button, Label } from "bits-ui";
    import { ArrowRight, TriangleAlert } from "lucide-svelte";
    import type { PageProps } from "./$types";

    let isError = $state(false);
    let errorMessage = $state("");
    let { form }:PageProps = $props();


    async function validatePassword(e : SubmitEvent) {
      isError = false;
      
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const password = formData.get("password");
      const retype = formData.get("retype");

      if (password === retype) {
        e.preventDefault();
        isError = true;
        errorMessage = m["account.change_password_not_same"]()
      }
    }
</script>

<svelte:head>
  <title>{m["title.reset"]()} : Plate</title>
</svelte:head>

<h1 class="text-3xl text-primary">{m["account.change_password_title"]()}</h1>
<p class="mb-6 font-normal text-sm text-lime-900">{m["account.reset_desc"]()}</p>

<form onsubmit={(e) => validatePassword(e)} method="POST">
  {#if isError || form?.isError}
  <section id="error-message" class="flex gap-2 border border-red-900 bg-red-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <TriangleAlert size={24} class="text-red-900" />
    <span class="text-red-900">{isError ? errorMessage : form?.errorMessage}</span>
  </section>
  {/if}

  <Label.Root id="password-label" for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
    {m["account.password"]()}
  </Label.Root>
  <input
    id="password"
    type="password"
    class="h-input rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
    name="password" required
  />

  <Button.Root type="submit" class="rounded-lg bg-lime-800 text-white shadow-sm text-base flex justify-center items-center p-2 my-2 w-full md:max-w-80 gap-1">
    <span>{m["account.change_password_btn"]()}</span>
    <ArrowRight size={20} />
  </Button.Root>
</form>