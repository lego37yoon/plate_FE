<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import { m } from "$lib/paraglide/messages";
  import { ChevronDown, ChevronUp, Check, Search, Archive, FileText } from "@lucide/svelte";
  import { Select, Button } from "bits-ui";
  import { getContext } from "svelte";  

  const { data, form } = $props();
  let search_word = $state<string>("");
  let projects = $state<number>();

  const docOrigin = getContext<Docs>("doc");

  async function openDocument(doc: Doc) {
    docOrigin.meta = {
      src: doc.src,
      title: doc.name,
      last: doc.last_updated,
      lang: "markdown"
    };
    const docBodyReq = await fetch(doc.src);

    if (docBodyReq.ok) {
      docOrigin.body = await docBodyReq.text();
    } else {
      docOrigin.error = true;
      docOrigin.errorMessage = docBodyReq.statusText;
    }

    docOrigin.isOpen = true;
  }
</script>

<svelte:head>
  <title>{m["document.title_document"]()} : Plate</title>
</svelte:head>

<div>
  <h1 class="text-primary text-3xl mb-6">
    {m["document.title_document"]()}
  </h1>
</div>

<form class="p-4 flex gap-2" method="POST" action="?/search" use:enhance={() => { return async ({ result }) => { await applyAction(result); }}}>
  <Select.Root type="single" onValueChange={(v) => (projects = Number(v))}>
    <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="search_lang" id="search_lang" aria-label={m["glossary.search_language"]()}>
      <span class="inline-flex gap-2 items-center">
        <Archive size={20} class="text-gray-400" />
        {projects ? data.projects.find((project) => project.id === projects)?.name : m["document.search_select_projects"]()}
      </span>
      <ChevronDown size={16} class="text-gray-500" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="focus-override border-muted bg-background shadow-sm outline-hidden z-50 h-max max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 bg-white"
        sideOffset={10}>
        <Select.ScrollUpButton class="flex w-full items-center justify-center">
          <ChevronUp size={16} class="text-gray-500" />
        </Select.ScrollUpButton>
        <Select.Viewport>
          {#each data.projects as project}
          <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={project.id} label={project.name}>
            {#snippet children({ selected })}
              {project.name}
              {#if selected}
                <div class="ml-auto">
                  <Check aria-label="check" />
                </div>
              {/if}
            {/snippet}
          </Select.Item>
          {/each}
        </Select.Viewport>
        <Select.ScrollDownButton class="flex w-full items-center justify-center">
          <ChevronDown size={16} class="text-gray-500" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>

  <input type="hidden" name="projects" bind:value={projects} />

  <Input name="search" type="text" max placeholder={m["document.search_placeholder"]()} bind:value={search_word} />

  <Button.Root type="submit" class="bg-secondary text-lime-900 flex gap-2 p-4 rounded-xl items-center">
    <Search />
    <span>{m["document.search_btn"]()}</span>
  </Button.Root>
</form>

{#if form}
<section id="document_list">
  <ul>
    {#each form.documents as doc}
    <li>
      <Button.Root type="button" class="rounded-lg bg-secondary-back w-full flex gap-2 items-center py-2 px-3 cursor-pointer" onclick={() => openDocument(doc)}>
        <FileText />
        {doc.name}
      </Button.Root>
    </li>
    {/each}
  </ul>
</section>
{/if}
