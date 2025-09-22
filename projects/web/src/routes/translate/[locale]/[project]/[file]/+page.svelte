<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { localizeHref, urlPatterns } from "$lib/paraglide/runtime";
  import { ChevronRight, ChevronDown, CornerDownLeft, PanelLeftClose, PanelLeftOpen } from "@lucide/svelte";
  import ResourceList from "../../../../../components/ResourceList.svelte";
  import { page } from "$app/state";
  import { Accordion, Button } from "bits-ui";
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import GlossaryList from "../../../../../components/GlossaryList.svelte";
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  type currentItem = {
    type: "parent" | "child",
    index: number,
    data: Resources,
    nextParent: number
  }

  let { data, form } = $props();
  const panelDefault = new MediaQuery('width >= 48rem');
  let panelState = $state<boolean|null>(null);
  let selectedItem = $state<currentItem>();
  let suggest_text = $state<{ text: string, focus: boolean }>({ 
    text: "", focus: true 
  });
  let glossaries = $state<Dictionary[]>(data.glossary);
  let text_area = $state<HTMLTextAreaElement>();

  function setCurrentData(
    id: number, selectedItem: currentItem | undefined
  ) : currentItem | undefined {
    const parentItemIndex = data.resources.parent.findIndex((i) => i.id === id);
    
    if (parentItemIndex !== -1) {
      if (data.resources.parent[parentItemIndex].category === "group") {
        const childFirstItem = data.resources.child.find((i) => id === i.parent_id);
            
        goto(childFirstItem ? `#${childFirstItem.id}` : "/", { noScroll: true, keepFocus: true });
      } else {
        return {
          type: "parent",
          index: parentItemIndex,
          data: data.resources.parent[parentItemIndex],
          nextParent: data.resources.parent.length > parentItemIndex + 1 
          ? data.resources.parent[parentItemIndex + 1].id
          : data.resources.parent[0].id
        }
      }
    }
    
    const childItemIndex = data.resources.child.findIndex((i) => i.id === id);
    if (childItemIndex !== -1) {
      const childItem = data.resources.child[childItemIndex];
      const nextParentLoc = data.resources.parent.findIndex((item) => item.id === childItem.parent_id) + 1;

      const nextParentIndex = data.resources.parent[
        data.resources.parent.length > nextParentLoc ? nextParentLoc : 0
      ].id;

      return {
        type: "child",
        index: childItemIndex,
        data: childItem,
        nextParent: nextParentIndex
      }
    }

    return selectedItem;
  }

  $effect(() => {
    if (page.url.hash) {
      const id = Number(page.url.hash.slice(1));

      if (!isNaN(id) && (!selectedItem || selectedItem.data.id !== id)) {
        selectedItem = setCurrentData(id, selectedItem);

        if (selectedItem) {
          if (selectedItem.data.category !== "group") {
            if (selectedItem.data.results.length > 0) {
              suggest_text.text = selectedItem.data.results.find((item) => item.approved)?.result ?? "";
            } else {
              suggest_text.text = "";
            }

            glossaries = data.glossary.filter((item) => selectedItem?.data.origin.includes(item.origin));
          }
        }
      }
    } else {
      if (data.resources.parent.length > 0) {
        if (
          data.resources.parent[0].category === "group"
          && data.resources.child.length > 0
        ) {
          selectedItem = { 
            type: "child", index: 0,
            data: data.resources.child[0],
            nextParent: 
              data.resources.parent.length > 0 
              ? data.resources.parent[1].id 
              : data.resources.parent[0].id
          };
        } else if (data.resources.parent[0].category !== "group") {
          selectedItem = { 
            type: "parent", index: 0,
            data: data.resources.parent[0],
            nextParent:
              data.resources.parent.length > 0 
              ? data.resources.parent[1].id 
              : data.resources.parent[0].id
          };
        }
      }
    }

    if (suggest_text.focus && text_area) {
      text_area.focus();
      suggest_text.focus = false;
    }

    if (!data.session && text_area) {
      text_area.disabled = true;
    }
  });
</script>

<svelte:head>
  <title>{data.metadata[0].name} ({data.locale}) : Plate</title>
</svelte:head>

<div class="flex gap-2">
  {#if (panelDefault.current && panelState === null) || panelState}
  <nav class="block w-full md:max-w-1/3 lg:max-w-1/4 " transition:slide={{ duration: 500, axis: "x" }}>
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
    <ul id="resource_list" class=" rounded-md overflow-scroll p-0.5">
      {#each data.resources.parent as item}
        <ResourceList parent={item} children={data.resources.child.filter((child) => child.parent_id === item.id)} hash={page.url.hash ? page.url.hash : `#${selectedItem?.data.id}`} />
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
            selectedItem && (
              selectedItem.data.category !== undefined &&
              selectedItem.data.category !== "group"
            ) 
            ? m[`resources.${selectedItem?.data.category}`]()
            : selectedItem?.data.category}</span>
          <span>{selectedItem?.data.origin}</span>
        </p>
        {#if selectedItem?.data.context}
        <p>
          <span>{m["l10n.context"]()}</span>
          <span>{selectedItem.data.context}</span>
        </p>
        {/if}
        <hr class="border-gray-400 my-2">
        <form class="flex flex-col items-end gap-2" method="POST" action="?/commit" use:enhance={({ formData, action, cancel }) => {
          return async ({ result }) => {
            if (result.type === "success" && selectedItem) {
              if (selectedItem.type === "parent") {
                const child = data.resources.child.find((i) => i.parent_id === selectedItem?.data.id);
                if (child) {
                  goto(`#${child.id}`, { noScroll: true, keepFocus: true });
                } else {
                  goto(`#${selectedItem.nextParent}`, { noScroll: true, keepFocus: true });
                }
              } else if (data.resources.child.length > selectedItem.index + 1) {
                goto(`#${data.resources.child[selectedItem.index + 1].id}`, { noScroll: true, keepFocus: true });
              } else {
                goto(`#${selectedItem.nextParent}`, { noScroll: true, keepFocus: true });
              }
              
            } else {
              await applyAction(result);
            }
          }
        }}>
          <textarea placeholder={m["l10n.input_placeholder"]()} name="suggest_message" class="rounded-md border-0 w-full min-h-24 disabled:bg-gray-200" bind:value={suggest_text.text} bind:this={text_area}></textarea>
          <Button.Root type="submit" class="flex gap-2 rounded-md bg-secondary text-lime-900 p-3 w-min disabled:bg-gray-400 disabled:text-lime-50" disabled={data.session ? false : true}>
            <CornerDownLeft />
            <span>{m["l10n.input_commit"]()}</span>
          </Button.Root>
        </form>
        <!-- Comments --> <!-- Suggestions -->
      </div>
      <Accordion.Root type="multiple" class="p-4 min-w-1/4 h-full flex flex-col gap-2" value={["suggested", "glossary", "auto_suggestion"]}>
        <Accordion.Item value="suggested" class="border-primary border rounded-md p-2">
          <Accordion.Header>
            <Accordion.Trigger class="flex justify-between w-full">
              <p>{m["l10n.input_suggestions_title"]()}</p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true} hiddenUntilFound>
            {#snippet child({ props, open })}
              {#if open}
              <div {...props} transition:slide={{ duration: 300 }}>
                Blah 1
              </div>
              {/if}
            {/snippet}
          </Accordion.Content>
        </Accordion.Item>
        <!-- <Accordion.Item value="comments" class="border-primary border rounded-md p-2">
          <Accordion.Header>
            <Accordion.Trigger class="flex justify-between w-full">
              <p>
                <span>{m["l10n.input_comment_title"]()}</span>
                <span class="mx-2 px-1 bg-secondary rounded-full">0</span>
              </p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true} hiddenUntilFound>
            {#snippet child({ props, open })}
              {#if open}
              <div {...props} transition:slide={{ duration: 300 }}>
                Blah 2
              </div>
              {/if}
            {/snippet}
          </Accordion.Content>
        </Accordion.Item> -->
        <!-- Glossary -->
        <Accordion.Item value="glossary" class="border-primary border rounded-md p-2">
          <Accordion.Header>
            <Accordion.Trigger class="flex justify-between w-full">
              <p>{m["glossary.tab_glossary"]()}</p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true} hiddenUntilFound>
            {#snippet child({ props, open })}
              {#if open}
              <GlossaryList bind:suggest_text={suggest_text} glossary_data={glossaries} suggest_hidden={data.session ? true : false} {...props} /> 
              {/if}
            {/snippet}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="auto_suggestion" class="border-primary border rounded-md p-2">
          <Accordion.Header>
            <Accordion.Trigger class="flex justify-between w-full">
              <p>{m["glossary.tab_history"]()} · {m["glossary.tab_machine"]()}</p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true} hiddenUntilFound>
            {#snippet child({ props, open })}
              {#if open}
              <div {...props} transition:slide={{ duration: 300 }}>
                Blah 4
              </div>
              {/if}
            {/snippet}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
    {/key}
  </section>
  {/if}
</div>

<style>
  #resource_list {
    height: calc(100vh - 11.5rem);
  }

  :global(div[data-state="open"] > button > svg) {
    rotate: 180deg;
  }
</style>