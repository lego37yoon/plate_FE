<script lang="ts">
  const { resource, hash } : { 
    resource: Resources, hash: string
  } = $props();
  let resourceItem : HTMLLIElement | undefined = undefined;

  $effect(() => {
    if (resource.id === Number(hash.slice(1)) && resourceItem) {
      resourceItem.scrollIntoView({ behavior: "smooth"});
    }
  })
</script>

<li class={`rounded-md ${
  resource.id === Number(hash.slice(1)) ? 
    "outline-lime-950 outline-2" :""
}`} bind:this={resourceItem}>
  <a href={`${resource.id}`} class={`flex flex-col w-full p-1 border-b-gray-200 border-b-[0.5px]`}>
    <p class="flex gap-2 items-center">
      <span class={`rounded-full p-1 min-w-8 min-h-8 text-center shrink-0 font-light text-sm ${
        resource.results.length > 0 ?
          resource.results.find((i) => i.approved === true) ?
          `text-white bg-lime-700` : `text-gray-900 bg-amber-400`
        : `text-gray-900 bg-gray-300`
      }`}>
        {resource.category !== "none" ? resource.category : ""}
      </span>
      <span>{resource.origin ?? resource.key}</span>
    </p>
    <p class="font-light min-h-6"></p>
  </a>
</li>