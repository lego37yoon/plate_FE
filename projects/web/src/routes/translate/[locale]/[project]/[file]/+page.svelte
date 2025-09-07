<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { ChevronRight } from "@lucide/svelte";
    import ResourceList from "../../../../../components/ResourceList.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata[0].name} ({data.locale}) : Plate</title>
</svelte:head>

<section id="resource_desc">
  <p class="text-primary flex gap-1 items-center mb-2">
    <a class="font-light" href={localizeHref(`/`)}>Plate</a>
    <ChevronRight size={16} />
    <a class="font-light" href={localizeHref(`/locale/${data.locale}`)}>{data.locale}</a>
    <ChevronRight size={16} />
    <a class="font-light" href={localizeHref(`/locale/${data.locale}/${data.metadata[0].project_id}`)}>{data.metadata[0].projects.name}</a>
    <ChevronRight size={16} />
    <span class="font-semibold">{data.metadata[0].name}</span>
  </p>
</section>

<ul id="resource_list" class="w-1/4 bg-secondary-back rounded-md p-2 overflow-scroll">
  {#each data.resources.parent as item}
    <ResourceList parent={item} children={data.resources.child.filter((child) => child.parent_id === item.id)} />
  {/each}
</ul>

<style>
  #resource_list {
    height: calc(100vh - 10rem);
  }
</style>