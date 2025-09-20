<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { localizeHref, urlPatterns } from "$lib/paraglide/runtime";
  import { ChevronRight, CornerDownLeft, PanelLeftClose, PanelLeftOpen } from "@lucide/svelte";
  import ResourceList from "../../../../../components/ResourceList.svelte";
  import { page } from "$app/state";
  import { Button } from "bits-ui";
  import { MediaQuery } from "svelte/reactivity";
  import { fade } from "svelte/transition";

  let { data } = $props();
  const panelDefault = new MediaQuery('width >= 48rem');
  let panelState = $state<boolean|null>(null);
  let selectedItem = $state<number>(-1);
  let selectedItemObject = $state<Resources>();

  if (data.resources.parent.length > 0) {
    if (
      data.resources.parent[0].category === "group"
      && data.resources.child.length > 0
    ) {
      selectedItem = data.resources.child[0].id;
      selectedItemObject = data.resources.child[0];
    } else if (data.resources.parent[0].category !== "group") {
      selectedItem = data.resources.parent[0].id;
      selectedItemObject = data.resources.parent[0];
    }
  }

  $effect(() => {
    if (page.url.hash) {
      const id = Number(page.url.hash.slice(1));

      selectedItemObject = 
        data.resources.parent.find((i) => i.id === id)
        ?? data.resources.child.find((i) => i.id === id);
    }
  })
</script>

<svelte:head>
  <title>{data.metadata[0].name} ({data.locale}) : Plate</title>
</svelte:head>

<div class="flex gap-2">
  {#if (panelDefault.current && panelState === null) || panelState}
  <nav class="block w-full md:max-w-1/3 lg:max-w-1/4 " transition:fade>
    <section id="resource_desc" class="flex justify-between items-center mb-4 ms-1">
      <p class="text-primary flex gap-1 items-center pt-2">
        <a class="font-light" href={localizeHref(`/`)}>Plate</a>
        <ChevronRight size={16} />
        <a class="font-light" href={localizeHref(`/locale/${data.locale}`)}>{data.locale}</a>
        <ChevronRight size={16} />
        <a class="font-light" href={localizeHref(`/locale/${data.locale}/${data.metadata[0].project_id}`)}>{data.metadata[0].projects.name}</a>
        <ChevronRight size={16} />
        <span class="font-semibold">{data.metadata[0].name}</span>
      </p>
      <Button.Root type="button" aria-label={m["l10n.input_hide_panel_btn"]()} onclick={() => panelState = false}
        class="rounded-lg bg-secondary text-white shadow-sm text-base flex justify-center items-center p-2 md:max-w-80 gap-1 md:hidden">
        <PanelLeftClose size={24} class="text-lime-900" />
      </Button.Root>
    </section>
    <ul id="resource_list" class=" rounded-md p-2 overflow-scroll">
      {#each data.resources.parent as item}
        <ResourceList parent={item} children={data.resources.child.filter((child) => child.parent_id === item.id)} hash={page.url.hash ? page.url.hash : `#${selectedItem}`} />
      {/each}
    </ul>
  </nav>
  {/if}
  
  {#if (!panelState && !panelDefault.current) || panelDefault.current}
  <section class={ panelState ? "w-3/4 h-full" : "w-full h-full" }>
    <div id="button_bar" class="w-full flex mb-2">
      {#if (panelState && panelDefault.current) || !panelState}
      <Button.Root type="button" aria-label={m["l10n.input_hide_panel_btn"]()} onclick={() => { 
        if (panelDefault.current && panelState === null) {
          panelState = false;
        } else {
          panelState = !panelState;
        }
      }}
        class="rounded-lg bg-secondary text-white shadow-sm text-base flex justify-center items-center p-2 md:max-w-80 gap-1">
        {#if panelState || (panelDefault.current && panelState === null)}
        <PanelLeftClose size={24} class="text-lime-900" />
        {:else}
        <PanelLeftOpen size={24} class="text-lime-900" />
        {/if}
      </Button.Root>
      {/if}
    </div>
    {#key page.url.hash}
    <div id="translation_area" class="flex flex-col gap-2">
      <div id="suggest_form" class="p-4 rounded-md w-full h-full bg-secondary-back">
        <!-- Resource and Results -->
        <p class="flex gap-2 items-center">
          <span class={`rounded-md text-sm p-2 bg-emerald-100`}>{
            selectedItemObject && (
              selectedItemObject.category !== undefined &&
              selectedItemObject.category !== "group"
            ) 
            ? m[`resources.${selectedItemObject?.category}`]()
            : selectedItemObject?.category}</span>
          <span>{selectedItemObject?.origin}</span>
        </p>
        {#if selectedItemObject?.context}
        <p>
          <span>{m["l10n.context"]()}</span>
          <span>{selectedItemObject.context}</span>
        </p>
        {/if}
        <hr class="border-gray-400 my-2">
        <form class="flex flex-col items-end gap-2">
          <textarea placeholder={m["l10n.input_placeholder"]()} id="suggest_message" class="rounded-md border-0 w-full min-h-24"></textarea>
          <Button.Root type="submit" class="flex gap-2 rounded-md bg-secondary text-lime-900 p-3 w-min">
            <CornerDownLeft />
            <span>{m["l10n.input_commit"]()}</span>
          </Button.Root>
        </form>
        <!-- Comments --> <!-- Suggestions -->
      </div>
      <div id="additional_data" class="p-4 min-w-1/4 h-full">
        <!-- Glossary -->
        <!-- Machine Translations / Translation Memories -->
        <div class="border-primary border rounded-md">
          <h3>Glossary</h3>
        </div>
        <div class="border-primary border rounded-md">
          <h3>Automatic Suggestions</h3>
        </div>
      </div>
    </div>
    {/key}
  </section>
  {/if}
</div>

<style>
  #resource_list {
    height: calc(100vh - 11.5rem);
  }
</style>