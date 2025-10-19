<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';
  import { Button, Separator } from 'bits-ui';
  import { ChevronRight, ListFilter, Plus } from "@lucide/svelte";
  import { getContext } from 'svelte';

  const account = getContext<{ data: { role: UserRole | null | undefined } | null}>("account");

  const role: UserRole | null | undefined = account && account.data ? account.data.role : null;

  let { data } = $props();
</script>
{#if data.files && data.files.length > 0}
<svetle:head>
  <title>{m["title.files"]({ project: data.files[0].projects.name })} : Plate</title>
</svetle:head>


<section id="file_list_desc">
  <h1 class="text-primary text-3xl">{m["title.files"]({ project: data.files[0].projects.name })}</h1>
  <p class="text-primary flex gap-1 items-center mb-4">
    <a class="font-light" href={localizeHref("/projects")}>{m["menu.proj"]()}</a>
    <ChevronRight size={16} />
    <a class="font-light" href={localizeHref(`/projects/${data.files[0].project_id}`)}>{data.files[0].projects.name}</a>
    <ChevronRight size={16} />
    <span class="font-semibold">{data.locale}</span>
  </p>
  <div class="grid grid-cols-3 gap-2 text-gray-600 w-fit my-2">
    <!-- Insert description for local team if database ready -->
  </div>  
</section>

<section id="button-set" class="flex justify-between">
  <div id="sort-and-filter" class="flex gap-2">
    <input type="text"
      class="border py-2 pe-2 ps-9 text-md rounded-lg border-gray-400 font-normal focus:ring-primary focus:ring-2 focus:ring-offset-2
            bg-[url(/search.svg)] bg-no-repeat bg-position-icon"
      placeholder={m["files.search_placeholder"]()} />
    <Button.Root type="button" class="rounded-lg bg-secondary flex justify-center items-center aspect-square cursor-pointer">
      <ListFilter />
    </Button.Root> 
  </div>
  <div id="manage-and-docs" class="flex gap-2 flex-wrap">
    {#if role && ["super_admin"].includes(role)}
      <Button.Root href={localizeHref("/projects/add")} class="rounded-lg bg-secondary flex gap-2 justify-center items-center py-2 px-3">
        <Plus />
        {m["files.add_files_btn"]()}
      </Button.Root>
    {/if}
  </div>
</section>

<section id="project_list" class="py-2">
  <table class="overflow-scroll w-full">
    <thead class="border border-transparent border-y-gray-300" >
      <tr class="text-primary">
        <th class="font-semibold min-w-1/3 w-1/2 text-start p-2">{m["files.header_name"]()}</th>
        <th class="font-semibold text-end">{m["files.header_progress"]()}</th>
      </tr>
    </thead>
    <tbody>
      {#each data.files as file}
      <tr>
        <td class="min-w-1/3 w-1/2 shrink text-start p-2">
          <a href={localizeHref(`/translate/${data.locale}/${file.project_id}/${file.id}`)}>
            {file.name}
          </a>
        </td>
        <td class="text-end"></td>
      </tr>
      {/each}
    </tbody>
  </table>
</section>

<section id="total-count">
  <Separator.Root class="bg-gray-300 my-4 w-full block h-px" />
  <div class="flex justify-between gap-2 text-primary">
    <p>{m["files.total_count"]({ count: data.files.length })}</p>
    <p></p>
  </div>
</section>
{/if}