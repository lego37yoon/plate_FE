<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { returnFileSize } from "$lib/plate/files";
  import { Checkbox, Label, Select } from "bits-ui";
  import { Check, ChevronDown, ChevronUp, StickyNote, Wand } from "@lucide/svelte";
  import type { DocCategories } from "../types/others";

  let { img, file, type, idx } : { img?: { alt: string }, file: File, type?: "doc", idx?: number } = $props();

  const categories : DocCategories[] = ["none"];
  let category = $state<DocCategories|undefined>(undefined);
</script>

<li class={`flex gap-4 flex-wrap mt-1 items-center rounded-lg bg-secondary w-full md:max-w-80 p-4`}>
  {#if img}
  <img class="w-20 h-20 rounded-full" src={URL.createObjectURL(file)} alt={img.alt} />
  {:else}
  <StickyNote size={42} />
  {/if}
  <p class="flex flex-col justify-center">
    <span class="text-base">
      {file.name}
    </span>
    <span class="text-gray-500 text-sm">
      {returnFileSize(file.size)}
    </span>
  </p>
  {#if type === "doc"}
  <div class="flex gap-2 items-center">
    <Checkbox.Root class="border-primary bg-lime-900 data-[state=unchecked]:border-secondary data-[state=unchecked]:bg-white data-[state=unchecked]:hover:border-primary peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]" aria-labelledby={`doc-${idx}-label`} name={`doc-${idx}-rule`} id={`doc-${idx}-rule`}>
      {#snippet children({ checked })}
        <div class=" inline-flex items-center justify-center">
          {#if checked}
            <Check size={15} class="text-white" />
          {/if}
        </div>
      {/snippet}
    </Checkbox.Root>
    <Label.Root for={`doc-${idx}-rule`} id={`doc-${idx}-label`} class="text-sm font-medium leading-none">
      {m["projects.add_project_docs_contains_rules"]()}
    </Label.Root>
  </div>
  <Select.Root type="single" onValueChange={(v) => {
    category = v as DocCategories;
  }}>
    <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name={`doc-${idx}-category`} id={`doc-${idx}-category`} aria-label={m["projects.add_project_docs_type"]()}>
      <span class="inline-flex gap-2 items-center">
        <Wand size={20} class="text-gray-400" />
        {category ? m[`document.type_${category}`]() : m["projects.add_project_docs_type"]()}
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
          {#each categories as item}
          <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={item} label={m[`document.type_${item}`]()}>
            {#snippet children({ selected })}
              <span class="text-base">{m[`document.type_${item}`]()}</span>
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
  <input type="hidden" name={`doc-category_real`} value={category} />
  {/if}
</li>