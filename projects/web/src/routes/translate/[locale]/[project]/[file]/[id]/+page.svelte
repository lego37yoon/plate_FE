<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { ChevronRight, ChevronDown, CornerDownLeft, PanelLeftClose, PanelLeftOpen } from "@lucide/svelte";
  import ResourceList from "$lib/components/ResourceList.svelte";
  import { Accordion, Button } from "bits-ui";
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import GlossaryList from "$lib/components/GlossaryList.svelte";
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import SuggestionList from "$lib/components/SuggestionList.svelte";
  import type { Session } from "@supabase/supabase-js";
  import { getContext, setContext } from "svelte";
  import type { ActionData } from "./$types";

  type CurrentItem = {
    type: "parent" | "child",
    index: number,
    data: Resources,
    next: number
  }

  type OriginData = {
    parent: Resources[],
    child: Resources[],
    metadata: { 
      name: string, project_id: number, projects: { name: string }
    }[],
    locale: string,
    current: CurrentItem,
    session: Session | null
  }

  let { data, form } : { data: OriginData, form: ActionData }  = $props();
  const panelDefault = new MediaQuery('width >= 48rem');
  let panelState = $state<boolean|null>(null);
  let suggest_text = $state<{ text: string, focus: boolean }>({ 
    text: "", focus: true 
  });
  let glossaries = $state<Dictionary[]>(data.current.data.dictionary);
  let text_area = $state<HTMLTextAreaElement>();
  let commitButton = $state<HTMLButtonElement|null>(null);
  // TODO: Remove Suggestion and click other resources may display wrong status of results. (Gray)
  let newResult : { data: Results[] | undefined, id: number | undefined } = $state({ data: undefined, id: undefined });
  setContext("Suggestion", newResult);

  $effect(() => {
    if (text_area) {
      text_area.focus();
    }

    if (data.current.data.id && suggest_text.text === "") {
      if (data.current.data.category !== "group") {
        if (data.current.data.results.length > 0) {
          suggest_text.text = data.current.data.results.find((item) => item.approved)?.result ?? "";
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

    if (form && form.type === "Suggestion") {
      newResult.data = form.new;
      newResult.id = Number(form.origin);
      console.log(form.origin);
    }
  });

  const userInfo : { data: UserInfo | undefined } = getContext("account");
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
      {#key data.parent}        
      {#each data.parent as item}
        <ResourceList parent={item} children={data.child.filter((child) => child.parent_id === item.id)} id={data.current.data.id} />
      {/each}
      {/key}
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
    {#key data.current.data.id}
    <div id="translation_area" class="flex flex-col gap-2">
      <div id="suggest_form" class="p-4 rounded-md w-full h-full bg-secondary-back">
        <!-- Resource and Results -->
        <p class="flex gap-2 items-center">
          <span class={`rounded-md text-sm p-2 bg-emerald-100`}>{
            data.current && (
              data.current.data.category !== undefined &&
              data.current.data.category !== "group"
            ) 
            ? m[`resources.${data.current?.data.category}`]()
            : data.current?.data.category}</span>
          <span>{data.current?.data.origin}</span>
        </p>
        {#if data.current?.data.context}
        <p>
          <span>{m["l10n.context"]()}</span>
          <span>{data.current.data.context}</span>
        </p>
        {/if}
        <hr class="border-gray-400 my-2">
        <form class="flex flex-col items-end gap-2" method="POST" action="?/commit" use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success" && data.current) {
              goto(`${data.current.next}`, { noScroll: true, keepFocus: true });
              suggest_text.text = "";
            } else {
              await applyAction(result);
            }
          }
        }}>
          <input type="hidden" name="user_id" value={userInfo.data ? userInfo.data.id : undefined} />
          <textarea placeholder={m["l10n.input_placeholder"]()} name="suggest_message" class="rounded-md border-0 w-full min-h-24 disabled:bg-gray-200" bind:value={suggest_text.text} bind:this={text_area} required onkeyup={e => {
            if (e.ctrlKey && e.key === "Enter" && commitButton) {
              commitButton.click();
            }
          }}></textarea>
          <Button.Root type="submit" class="flex gap-2 rounded-md bg-secondary text-lime-900 p-3 w-min disabled:bg-gray-400 disabled:text-lime-50" disabled={data.session ? false : true} bind:ref={commitButton}>
            <CornerDownLeft />
            <span>{m["l10n.input_commit"]()}</span>
          </Button.Root>
        </form>
        <!-- Comments --> <!-- Suggestions -->
      </div>
      <Accordion.Root type="multiple" class="p-4 min-w-1/4 h-full overflow-scroll flex flex-col gap-2" value={["glossary"]}>
        <Accordion.Item value="suggested" class="border-primary border rounded-md p-2">
          <Accordion.Header>
            <Accordion.Trigger class="flex justify-between w-full accordion">
              <p>{m["l10n.input_suggestions_title"]()}</p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true}>
            {#snippet child({ props, open })}
              {#if open}
              <div {...props} transition:slide={{ duration: 300 }}>
                {#key form}
                <SuggestionList results={form && form.type === "Suggestion" ? form.new as Results[] : data.current.data.results} id={data.current.data.id} />
                {/key}
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
          <Accordion.Content forceMount={true}>
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
            <Accordion.Trigger class="flex justify-between w-full accordion">
              <p>
                <span>{m["glossary.tab_glossary"]()}</span>
              </p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true}>
            {#snippet child({ props, open })}
              {#if open}
              <GlossaryList bind:suggest_text={suggest_text}
                glossary_data={glossaries} suggest_hidden={data.session ? true : false} 
                form={form && form.type === "Glossary" ? form.new as Dictionary[] : null}
                {...props}
              /> 
              {/if}
            {/snippet}
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="auto_suggestion" class="border-primary border rounded-md p-2">
          <Accordion.Header>
            <Accordion.Trigger class="flex justify-between w-full accordion">
              <p>{m["glossary.tab_history"]()} · {m["glossary.tab_machine"]()}</p>
              <ChevronDown />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content forceMount={true}>
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

  :global(div[data-state="open"] > button.accordion > svg) {
    rotate: 180deg;
  }
</style>