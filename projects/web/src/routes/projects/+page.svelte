<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { Button, Popover, Separator } from "bits-ui";
  import { HelpCircle, ListFilter, Plus } from "@lucide/svelte";
  import { getContext } from "svelte";
  import type { UserRole } from "../../types/account";

  const { data: { role } } : { data : { role : UserRole | null | undefined }} = getContext("account");

  const { data } = $props();
</script>

<svelte:head>
  <title>{m["title.projects"]()} : Plate</title>
</svelte:head>

<h1 class="text-primary text-3xl mb-6">{m["title.projects"]()}</h1>

<section id="button-set" class="flex justify-between">
  <div id="sort-and-filter" class="flex gap-2">
    <input type="text"
      class="border py-2 pe-2 ps-9 text-md rounded-lg border-gray-400 font-normal focus:ring-primary focus:ring-2 focus:ring-offset-2
            bg-[url(/search.svg)] bg-no-repeat bg-position-icon"
      placeholder={m["projects.search_placeholder"]()} />
    <Button.Root type="button" class="rounded-lg bg-secondary flex justify-center items-center aspect-square cursor-pointer">
      <ListFilter />
    </Button.Root> 
  </div>
  <div id="manage-and-docs" class="flex gap-2 flex-wrap">
    {#if role && ["super_admin"].includes(role)}
      <Button.Root href={localizeHref("/projects/add")} class="rounded-lg bg-secondary flex gap-2 justify-center items-center py-2 px-3">
        <Plus />
        {m["projects.add_project_btn"]()}
      </Button.Root>
    {/if}
  </div>
</section>

<section id="project_list" class="py-2 overflow-scroll">
  <table class="overflow-scroll w-full">
    <thead class="border border-transparent border-y-gray-300" >
      <tr class="text-primary">
        <th class="font-semibold min-w-1/3 w-1/2 text-start p-2">{m["projects.header_name"]()}</th>
        <th class="font-semibold text-end">{m["projects.header_version"]()}</th>
        <th class="font-semibold text-end">{m["projects.header_languages"]()}</th>
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
      {#each data.projects as project}
      <tr>
        <td class="min-w-1/3 w-1/2 shrink text-start p-2">
          <a href={localizeHref(`/projects/${project.id}`)}>
            {project.name}
          </a>
        </td>
        <td class="text-end">{project.version}</td>
        <td class="text-end">{project.langs[0].count}</td>
        <td class="text-end">{project.files[0].count}</td>
      </tr>
      {/each}
  </table>
</section>

<section id="total-count">
  <Separator.Root class="bg-gray-300 my-4 w-full block h-px" />
  <div class="flex justify-between gap-2 text-primary">
    <p>{m["projects.total_count"]({ count: data.projects.length })}</p>
    <p></p>
  </div>
</section>