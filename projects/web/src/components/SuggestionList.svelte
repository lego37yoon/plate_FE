<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { applyAction, enhance } from "$app/forms";
  import { Check, Inbox } from "@lucide/svelte";
  import { Button } from "bits-ui";
  import type { UserInfo } from "../types/account";
  import { getContext } from "svelte";

  const { results } : { 
    results: Results[]
  } = $props();
  
  const userInfo : { data: UserInfo | undefined } = getContext("account");
</script>

<ul class="rounded-md">
  {#each results as item}
  <li class={`rounded-md flex flex-col w-full p-1 border-b-gray-200 border-b-[0.5px] bg-secondary-back`}>
    <p class="flex gap-2 items-center">
      <span class={`rounded-full p-0.5 min-w-2 min-h-2 text-center shrink-0 font-light text-sm ${
        item.approved === true ?
          `bg-lime-700` : ` bg-amber-400`
      }`}></span>
      <span>{item.result}</span>
    </p>
    <p class="font-light min-h-6">{item.author} | {item.last_updated}</p>
    {#if userInfo.data && userInfo.data.role !== "l10n_contributor" && !item.approved}
    <form method="POST" action="?/glossary_approve" use:enhance={() => {
      return async ({ result }) => {
        if (result.type === "success") {
          // Make sugggestion data into new data
        } else {
          await applyAction(result);
        }
      }
    }}>
      <Button.Root type="submit" class="rounded-md p-2 hover:underline flex gap-2">
        <Check />
        <span>{m["l10n.input_review_approve"]()}</span>
      </Button.Root>
    </form>
    {/if}
  </li>
  {:else}
  <li class="text-center flex flex-col gap-2 items-center p-2">
      <Inbox />
      <p>{m["l10n.input_suggestions_empty"]()}</p>
    </li>
  {/each}
</ul>