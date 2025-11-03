<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import GlossaryList from "$lib/components/GlossaryList.svelte";
  import Input from "$lib/components/Input.svelte";
  import SuggestionList from "$lib/components/SuggestionList.svelte";
  import { m } from "$lib/paraglide/messages";
  import { BookType, Check, ChevronDown, ChevronUp, Funnel, Search } from "@lucide/svelte";
  import { Button, Select } from "bits-ui";

  const { data, form } = $props();
  let search_word = $state<string>("");
  let locale = $state<string>();
  let searchResult = $state<boolean>(false);
</script>

<svelte:head>
  <title>{m["glossary.tab_glossary"]()} / {m["glossary.tab_history"]()} : Plate</title>
</svelte:head>

<div>
  <h1 class="text-primary text-3xl mb-6">
    {m["glossary.tab_glossary"]()} / {m["glossary.tab_history"]()}
  </h1>
</div>

<form class="p-4 flex gap-2" method="POST" action="?/search" use:enhance={() => { return async ({ result }) => { await applyAction(result); }}}>
  <Select.Root type="single" onValueChange={(v) => (searchResult = (v === "true"))}>
    <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="search_type" id="search_type" aria-label={m["glossary.search_is_type_label"]()}>
      <span class="inline-flex gap-2 items-center">
        <Funnel size={20} class="text-gray-400" />
        {searchResult ? m["glossary.search_is_result_toggle"]() : m["glossary.search_is_origin_toggle"]()}
      </span>
      <ChevronDown size={16} class="text-gray-500" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content class="focus-override border-muted bg-background shadow-sm outline-hidden z-50 h-max max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 bg-white"
        sideOffset={10}>
        <Select.ScrollUpButton class="flex w-full items-center justify-center">
          <ChevronUp size={16} class="text-gray-500" />
        </Select.ScrollUpButton>
        <Select.Viewport>
          <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={"false"} label={m["glossary.search_is_origin_toggle"]()}>
            {#snippet children({ selected })}
              {m["glossary.search_is_origin_toggle"]()}
              {#if selected || !searchResult}
                <div class="ml-auto">
                  <Check aria-label="check" />
                </div>
              {/if}
            {/snippet}
          </Select.Item>
          <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={"true"} label={m["glossary.search_is_result_toggle"]()}>
            {#snippet children({ selected })}
              {m["glossary.search_is_result_toggle"]()}
              {#if selected || searchResult}
                <div class="ml-auto">
                  <Check aria-label="check" />
                </div>
              {/if}
            {/snippet}
          </Select.Item>
        </Select.Viewport>
        <Select.ScrollDownButton class="flex w-full items-center justify-center">
          <ChevronDown size={16} class="text-gray-500" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>

  <Select.Root type="single" onValueChange={(v) => (locale = v)}>
    <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="search_lang" id="search_lang" aria-label={m["glossary.search_language"]()}>
      <span class="inline-flex gap-2 items-center">
        <BookType size={20} class="text-gray-400" />
        {locale ? data.lang_codes.find((lang) => lang.code === locale)?.origin_name : m["account.pref_lang_select"]()}
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
          {#each data.lang_codes as lang}
          <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={lang.code} label={lang.origin_name}>
            {#snippet children({ selected })}
              {lang.origin_name} ({lang.code})
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

  <input type="hidden" name="isResult" bind:value={searchResult} />
  <input type="hidden" name="locale" bind:value={locale} />

  <Input name="search" type="text" max placeholder={m["glossary.search_placeholder"]()} bind:value={search_word} />

  <Button.Root type="submit" class="bg-secondary text-lime-900 flex gap-2 p-4 rounded-xl items-center">
    <Search />
    <span>{m["glossary.search_btn"]()}</span>
  </Button.Root>
</form>

{#if form}
<section id="results">
  {#key form.suggestions}
  <SuggestionList results={form.suggestions} id={0} />
  {/key}
  <GlossaryList glossary_data={form.glossaries} suggest_hidden={data.session ? true : false} origin={search_word} form={null} suggest_text={{ text: search_word, focus: false }} />
</section>
{/if}
