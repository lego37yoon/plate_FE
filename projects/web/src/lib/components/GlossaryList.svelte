<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { ArrowRight, BadgeCheck, Check, CornerDownLeft, Inbox, Info, Lightbulb, TriangleAlert } from "@lucide/svelte";
  import { Button, Label } from "bits-ui";
  import { slide } from "svelte/transition";
  import Input from "./Input.svelte";
  import { applyAction, enhance } from "$app/forms";
  import { getContext } from "svelte";

  let { suggest_text = $bindable(), glossary_data, suggest_hidden, form } : {
    suggest_text: { text: string, focus: boolean },
    glossary_data: Dictionary[],
    suggest_hidden: boolean,
    form: Dictionary[] | null
  } = $props();
  let openSuggestNew = $state(false);
  const userInfo : { data: UserInfo | undefined } = getContext("account");

  function updateValue(value: string) {
    suggest_text.text += value;
    suggest_text.focus = true;
  }
</script>

<div id="glossary_area" class="pt-2" transition:slide={{ duration: 300 }}>
  <ul>
    {#each glossary_data as glossary}
    <li class="flex gap-2">
      <Button.Root type="button" onclick={() => updateValue(glossary.result)} class="w-full rounded-md p-2 bg-secondary-back hover:bg-secondary flex gap-2">
        {#if glossary.approved}
        <BadgeCheck />
        {:else}
        <TriangleAlert />
        {/if}
        <span class="font-bold">{glossary.origin}</span>
        <span>{glossary.result}</span>
      </Button.Root>
      {#if userInfo.data && userInfo.data.role !== "l10n_contributor" && !glossary.approved}
      <form method="POST" action="?/glossary_approve" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === "success") {
            // Make glossary data into new data
          } else {
            await applyAction(result);
          }
        }
      }}>
        <Button.Root type="submit" onclick={() => updateValue(glossary.result)} class="rounded-md p-2 hover:underline flex gap-2">
          <Check />
          <span>{m["glossary.suggest_approve"]()}</span>
        </Button.Root>
      </form>
      {/if}
    </li>
    {:else}
    <li class="text-center flex flex-col gap-2 items-center p-2">
      <Inbox />
      <p>{m["glossary.no_words"]()}</p>
    </li>
    {/each}
  </ul>
  <p class="flex gap-2 items-center font-normal border-secondary border p-2 rounded-md mt-2">
    <Info class="shrink-0 me-2" />
    <span>{m["glossary.word_warning"]()}</span>
    {#if suggest_hidden}
    <Button.Root type="button" class="rounded-md p-2 bg-secondary-back hover:bg-secondary flex gap-2 items-center shrink-0" onclick={() => {
      openSuggestNew = !openSuggestNew
    }}>
      <Lightbulb />
      <span>{m["glossary.suggest_new"]()}</span>
    </Button.Root>
    {/if}
  </p>
  {#if openSuggestNew}
  <form id="glossary" method="POST" action="?/glossary_new" class="flex gap-2 my-2 px-2 justify-between items-center" transition:slide={{ duration: 300 }} use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        // Make glossary data into new data
      } else {
        await applyAction(result);
      }
    }
  }}>
    <div class="flex gap-2 items-center text-gray-500">
      <Lightbulb class="me-2" />
      <div class="text-sm flex flex-col">
        <Label.Root for="suggest_word_origin">{m["glossary.suggest_src"]()}</Label.Root>
        <Input id="suggest_word_origin" type="text" name="suggest_word_origin" />
      </div>
      <ArrowRight />
      <div class="text-sm flex flex-col">
        <Label.Root for="suggest_word_result">{m["glossary.suggest_result"]()}</Label.Root>
        <Input id="suggest_word_result" type="text" name="suggest_word_result" />
      </div>
    </div>
    <Button.Root type="submit" class="rounded-md p-2 bg-secondary-back hover:bg-secondary flex gap-2 items-center text-lime-950">
      <CornerDownLeft />
      {m["glossary.suggest_commit"]()}
    </Button.Root>
  </form>
  {/if}
</div>