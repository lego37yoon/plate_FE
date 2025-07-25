<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { localizeHref } from "$lib/paraglide/runtime";
    import { supabase } from "$lib/supabase";
    import { redirect } from "@sveltejs/kit";
    import { Button, Label, Separator } from "bits-ui";
    import { ArrowRight, Code, Info, RefreshCw, TriangleAlert, UserRoundPlus } from "lucide-svelte";

    let isError = $state(false);
    let errorMessage = $state("");
    let resultMessage = $state("");

    async function reset(e : SubmitEvent) {
      e.preventDefault();

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const email = formData.get("email");
      
      isError = false;

      if (email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.toString(), {
          redirectTo: localizeHref("/account/reset/step2")
        });

        if (error) {
          errorMessage = m["account.reset_send_failed"]();
          isError = true;
        } else {
          resultMessage = m["account.reset_send_success"]();

          setTimeout(() => { 
            resultMessage = m["account.reset_send_after_info"]();
          }, 10000);
        }
      }
    }
</script>

<svelte:head>
  <title>{m["title.reset"]()} : Plate</title>
</svelte:head>

<h1 class="text-3xl text-primary">{m["title.reset"]()}</h1>
<p class="mb-6 font-normal text-sm text-lime-900">{m["account.reset_desc"]()}</p>

<form onsubmit={(e) => reset(e)}>
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

  <Button.Root type="submit" class="rounded-lg bg-lime-800 text-white shadow-sm text-base flex justify-center items-center p-2 my-2 w-full md:max-w-80 gap-1">
    <span>{m["account.reset_send_btn"]()}</span>
    <ArrowRight size={20} />
  </Button.Root>

  {#if resultMessage.length > 0}
  <section id="result-message" class="flex gap-2 border border-lime-900 bg-green-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <Info size={24} class="text-lime-900" />
    <span class="text-lime-900">{resultMessage}</span>
  </section>
  {/if}
</form>