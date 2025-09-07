<script lang="ts">
  const { parent, children } = $props();
</script>

{#if parent.category === "group"}
<li>
  <p class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
    <span>{parent.origin ?? parent.key}</span>
  </p>
  <ul class="w-full bg-secondary-back rounded-md p-2">
    {#each children as child}
      <li>
        <a href={`#${child.id}`} class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
          <span>{child.origin}</span>
          <span class="font-light">{child.category}</span>
        </a>
      </li>
    {/each}
  </ul>
</li>
{:else if children.length > 0}
<ul>
  <li>
    <a href={`#${parent.id}`} class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
      <span>{parent.origin ?? parent.key}</span>
      <span class="font-light">{parent.category}</span>
    </a>  
  </li>
  {#each children as child}
    <li>
      <a href={`#${child.id}`} class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
        <span>{child.origin}</span>
        <span class="font-light">{child.category}</span>
      </a>
    </li>
  {/each}
</ul>
{:else}
<li>
  <a href={`#${parent.id}`} class="flex flex-col w-full border-b-gray-200 border-b-[0.5px]">
    <span>{parent.origin ?? parent.key}</span>
    <span class="font-light">{parent.category}</span>
  </a>  
</li>
{/if}