<script lang="ts">
    import GlossaryList from "$lib/components/GlossaryList.svelte";
  import Input from "$lib/components/Input.svelte";
    import SuggestionList from "$lib/components/SuggestionList.svelte";
  import { m } from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime.js";
  import { BookType, Check, ChevronDown, ChevronUp, Search } from "@lucide/svelte";
  import { Button, Label, Select } from "bits-ui";

  const { data, form } = $props();
  let search_word = $state<string>("");
  let locale = $state<string>();

  $effect(() => {
    if (search_word !== "") {

    } else {

    }
  });
</script>

<svelte:head>
  <title>{m["glossary.tab_glossary"]()} / {m["glossary.tab_history"]()} : Plate</title>
</svelte:head>

<div>
  <h1 class="text-primary text-3xl mb-6">
    {m["glossary.tab_glossary"]()} / {m["glossary.tab_history"]()}
  </h1>
</div>

<form class="p-4 flex gap-2" method="POST" action="?/search">
  <Label.Root id="pref_lang-label" for="pref_lang" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
    {m["glossary.search_language"]()}
  </Label.Root>
  <Select.Root type="single" onValueChange={(v) => (locale = v)}>
    <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="pref_lang" id="pref_lang" aria-describedby="pref_lang-desc" aria-labelledby="pref_lang-label">
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

  <input type="hidden" name="locale" bind:value={locale} />

  <Input name="search" type="text" max placeholder={m["glossary.search_placeholder"]()} bind:value={search_word} />

  <Button.Root type="submit" class="bg-secondary text-lime-900 flex gap-2 p-4 rounded-xl items-center">
    <Search />
    <span>{m["glossary.search_btn"]()}</span>
  </Button.Root>
</form>

{#if form}
<section id="results">
  <SuggestionList results={form.suggestions} id={0} />
  <GlossaryList glossary_data={form.glossaries} suggest_hidden={data.session ? true : false} origin={search_word} form={null} suggest_text={{ text: search_word, focus: false }} />
</section>
{/if}
