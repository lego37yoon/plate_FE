<script lang="ts">
  import { BadgeCheck, TriangleAlert } from "@lucide/svelte";
  import { Button } from "bits-ui";
    import { slide } from "svelte/transition";

  let { suggest_text = $bindable(), glossary_data } : {
    suggest_text: { text: string, focus: boolean },
    glossary_data: Dictionary[]
   } = $props();

  function updateValue(value: string) {
    suggest_text.text += value;
    suggest_text.focus = true;
  }
</script>

<ul transition:slide={{ duration: 300 }}>
  {#each glossary_data as glossary}
  <li>
    <Button.Root type="button" onclick={() => updateValue(glossary.result)} class="w-full rounded-md p-2 bg-secondary-back hover:bg-secondary flex gap-2">
      {#if glossary.approved}
      <BadgeCheck />
      {:else}
      <TriangleAlert />
      {/if}
      <span class="font-bold">{glossary.origin}</span>
      <span>{glossary.result}</span>
    </Button.Root>
  </li>
  {:else}
  <li></li>
  {/each}
</ul>