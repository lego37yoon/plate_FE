<script lang="ts">
  import ResourceItem from "./ResourceItem.svelte";

  const { parent, children, hash } : { 
    parent: Resources, children: Resources[], hash: string
  } = $props();
</script>

{#if parent.category === "group"}
<li>
  <p class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
    <span>{parent.origin ?? parent.key}</span>
  </p>
  <ul class="w-full bg-secondary-back rounded-md p-1">
    {#each children as child}
      <ResourceItem resource={child} {hash} />
    {/each}
  </ul>
</li>
{:else if children.length > 0}
<ul>
  <ResourceItem resource={parent} {hash} />
  {#each children as child}
    <ResourceItem resource={child} {hash} />
  {/each}
</ul>
{:else}
<ResourceItem resource={parent} {hash} />
{/if}