<script lang="ts">
  import '../app.css';
  import "@ibm/plex-sans-kr/css/ibm-plex-sans-kr-all.css"
  import Header from '../components/Header.svelte';
  import DocViewer from '../components/DocViewer.svelte';
  import { writable } from 'svelte/store';
  import type { Snippet } from 'svelte';
  import { m } from '$lib/paraglide/messages';
    import { getLocale } from '$lib/paraglide/runtime';

  let { children, data } : 
    { children: Snippet, data: 
      { meta: Docs, doc?: string, error?: number } } = $props();

  let error_message = $state<string>(m["doc.error_unknown"]());
  
  switch (data.error) {
    case 1:
      error_message = m["doc.error_1"]();
      break;
  }

  const isOpen = writable(false);
</script>

<Header enabled={[null]} lang={getLocale()} />
<main>
  <section class="shadow-md rounded-xl z-10 m-2 p-4 bg-white">
    {@render children()}
  </section>
{#if $isOpen && data.doc}
  <DocViewer isOpen={isOpen} docMeta={data.meta} doc={data.doc} />
{:else if $isOpen && data.error}
  <DocViewer isOpen={isOpen} docMeta={data.meta} doc={error_message} />
{/if}

</main>

<style>
  :global(body) {
    font-family: "IBM Plex Sans KR", "Pretendard Variable", "Pretendard", "Noto Sans CJK KR", "Noto Sans KR", sans-serif;
    font-weight: 500;
    background: #FAFBF2
  }

</style>
