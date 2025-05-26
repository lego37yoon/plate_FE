<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { Button, Popover, Separator } from 'bits-ui';
  import { Calendar, ChevronRight, HelpCircle, ListFilter, Plus, Regex } from 'lucide-svelte';
  import { getContext } from 'svelte';
  import type { UserRole } from '../../../types/account.js';

  const { data: { role } } : { data : { role : UserRole | null | undefined }} = getContext("account");

  let { data } = $props();
</script>
{#if data.projects && data.projects.length > 0}
<svetle:head>
  <title>{data.projects[0].name} : Plate</title>
</svetle:head>

<section id="project_desc">
  <h1 class="text-3xl text-primary">{data.projects[0].name}</h1>
  <p class="text-primary flex gap-1 items-center mb-4">
    <a class="font-light" href={localizeHref("/home")}>Projects</a>
    <ChevronRight size={16} />
    <span class="font-semibold">{data.projects[0].name}</span>
  </p>
  <div class="grid grid-cols-3 gap-2 text-gray-600 w-fit my-2">
    <span class="inline-flex gap-2 me-3 items-center">
      <Calendar size={16} />
      {m["projects.header_last_updated"]()}
    </span>
    <span class="col-span-2">{data.projects[0].last_updated}</span>
    <span class="inline-flex gap-2 me-3 items-center">
      <Regex size={16} />
      {m["projects.header_version"]()}
    </span>
    <span class="col-span-2">{data.projects[0].version}</span>
    <p class="font-normal col-span-3 bg-secondary-back p-2 rounded-lg">{data.projects[0].desc}</p>
  </div>  
</section>

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
    {#if role && ["super_admin", "project_manager"].includes(role)}
      <Button.Root type="button" class="rounded-lg bg-secondary flex gap-2 justify-center items-center py-2 px-3 cursor-pointer">
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
        <th class="font-semibold min-w-1/3 w-full text-start p-2">{m["projects.header_languages"]()}</th>
        <th class="font-semibold text-end">{m["projects.header_files"]()}</th>
        <th class="font-semibold flex gap-1 justify-end items-center p-2">
          <span>{m["projects.header_progress"]()}</span>
          <Popover.Root>
          <Popover.Trigger class="text-gray-400 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-50 p-1">
            <HelpCircle size={16}/>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content class="border-lime-50 border rounded-lg shadow-md max-w-80 w-full p-4 m-2 bg-white dark:bg-lime-900">
              <p class="font-normal">{m["projects.header_progress_tooltip"]()}</p>
            </Popover.Content>
          </Popover.Portal>
          </Popover.Root>
        </th>
      </tr>
    </thead>
    <tbody>
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