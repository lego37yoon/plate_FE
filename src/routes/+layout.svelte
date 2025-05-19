<script lang="ts">
  import '../app.css';
  import "@ibm/plex-sans-kr/css/ibm-plex-sans-kr-all.css"
  import Header from '../components/Header.svelte';
  import DocViewer from '../components/DocViewer.svelte';
  import { writable } from 'svelte/store';
  import type { Snippet } from 'svelte';
  import { m } from '$lib/paraglide/messages';

  let { children, data } : 
    { children: Snippet, data: 
      { meta: Docs, doc?: string, error?: number } } = $props();

  let error_message : string = ;
  
  switch (data.error) {
    case 1:
      error_message = m["doc.error_1"];
      break;
    default:
      error_message = m["doc.error_default"]
      break;
  }

  const isOpen = writable(false);
</script>

<Header enabled={[null]} />
<main>
  <section class="shadow-md z-10">
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
