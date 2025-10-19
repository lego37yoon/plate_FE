<script lang="ts">
  import { getContext, setContext } from "svelte";

  const { resource, id } : { 
    resource: Resources, id: number
  } = $props();
  let resultData = $state(resource.results);

  let newData: { data: Results[] | undefined, id: number | undefined } = getContext("Suggestion");
  let resourceItem : HTMLLIElement | undefined = undefined;

  $effect(() => {
    // 스크롤은 선택된 항목일 때만
    if (resource.id === id && resourceItem) {
      resourceItem.scrollIntoView({ behavior: "smooth"});
    }

    if (resource.id === id && newData && newData.data && newData.id === resource.id) {
      resultData = newData.data;
      setContext("Suggestion", { data: undefined, id: undefined });
    }
  });

  $inspect(newData);
</script>

<li class={`rounded-md ${resource.id === id ? "outline-lime-950 outline-2" : ""}`} bind:this={resourceItem}>
  <a href={`${resource.id}`} class={`flex flex-col w-full p-1 border-b-gray-200 border-b-[0.5px]`}>
    <p class="flex gap-2 items-center">
      <span class={`rounded-full p-1 min-w-8 min-h-8 text-center shrink-0 font-light text-sm ${
        resultData.length > 0 ?
          resultData.find((i) => i.approved === true) ?
          `text-white bg-lime-700` : resultData.find((i) => i.approved === false) ? `text-gray-900 bg-red-400` : `text-gray-900 bg-amber-400`
        : `text-gray-900 bg-gray-300`
      }`}>
        {resource.category !== "none" ? resource.category : ""}
      </span>
      <span>{resource.origin ?? resource.key}</span>
    </p>
    <p class="font-light min-h-6"></p>
  </a>
</li>