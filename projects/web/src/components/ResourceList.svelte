<script lang="ts">
  import ResourceItem from "./ResourceItem.svelte";

  const { parent, children, id } : { 
    parent: Resources, children: Resources[], id: number
  } = $props();
</script>

{#if parent.category === "group"}
<li class="bg-secondary-back rounded-md my-2 py-0.5 px-1">
  <p class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
    <span>{parent.origin ?? parent.key}</span>
  </p>
  <ul class="w-full rounded-md p-1">
    {#each children as child}
      <ResourceItem resource={child} {id} />
    {/each}
  </ul>
</li>
{:else if children.length > 0}
<ul class="bg-secondary-back rounded-md">
  <ResourceItem resource={parent} {id} />
  {#each children as child}
    <ResourceItem resource={child} {id} />
  {/each}
</ul>
{:else}
<ResourceItem resource={parent} {id} />
{/if}