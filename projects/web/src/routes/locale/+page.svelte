<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { Button, Separator } from 'bits-ui';
  import { ListFilter, Plus } from "@lucide/svelte";
  import { getContext } from 'svelte';
  import type { UserRole } from '../../types/account.js';

  const account = getContext<{ data: { role: UserRole | null | undefined } | null}>("account");

  const role: UserRole | null | undefined = account && account.data ? account.data.role : null;

  let { data } = $props();
</script>
{#if data.projects && data.projects.length > 0}
<svetle:head>
  <title>{m["title.lang"]()} : Plate</title>
</svetle:head>

<h1 class="text-primary text-3xl mb-6">{m["title.lang"]()}</h1>

<section id="button-set" class="flex justify-between">
  <div id="sort-and-filter" class="flex gap-2">
    <input type="text"
      class="border py-2 pe-2 ps-9 text-md rounded-lg border-gray-400 font-normal focus:ring-primary focus:ring-2 focus:ring-offset-2
            bg-[url(/search.svg)] bg-no-repeat bg-position-icon"
      placeholder={m["locale.search_placeholder"]()} />
    <Button.Root type="button" class="rounded-lg bg-secondary flex justify-center items-center aspect-square cursor-pointer">
      <ListFilter />
    </Button.Root> 
  </div>
  <div id="manage-and-docs" class="flex gap-2 flex-wrap">
    {#if role && ["super_admin"].includes(role)}
      <Button.Root href={localizeHref("/projects/add")} class="rounded-lg bg-secondary flex gap-2 justify-center items-center py-2 px-3">
        <Plus />
        {m["locale.add_language_btn"]()}
      </Button.Root>
    {/if}
  </div>
</section>

<section id="project_list" class="py-2">
  <table class="overflow-scroll w-full">
    <thead class="border border-transparent border-y-gray-300" >
      <tr class="text-primary">
        <th class="font-semibold min-w-1/3 w-1/2 text-start p-2">{m["projects.header_languages"]()}</th>
        <th class="font-semibold text-end">{m["locale.header_code"]()}</th>
        <th class="font-semibold text-end">{m["locale.header_projects"]()}</th>
      </tr>
    </thead>
    <tbody>
      {#each data.projects as lang : { code: string, }}
      <tr>
        <td class="min-w-1/3 w-1/2 shrink text-start p-2">
          <a href={localizeHref(`/locale/${lang.code}/`)}>
            {data.languages[lang.code].origin_name}
          </a>
        </td>
        <td class="text-end">{lang.code}</td>
        <td class="text-end">{lang.count}</td>
      </tr>
      {/each}
    </tbody>
</section>

<section id="total-count">
  <Separator.Root class="bg-gray-300 my-4 w-full block h-px" />
  <div class="flex justify-between gap-2 text-primary">
    <p>{m["locale.total_count"]({ count: data.projects.length })}</p>
    <p></p>
  </div>
</section>
{/if}