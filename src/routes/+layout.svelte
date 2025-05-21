<script lang="ts">
  import '../app.css';
  import "@ibm/plex-sans-kr/css/ibm-plex-sans-kr-all.css"
  import Header from '../components/Header.svelte';
  import DocViewer from '../components/DocViewer.svelte';
  import { writable } from 'svelte/store';
  import { onMount, setContext, type Snippet } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import { invalidate } from '$app/navigation';
    import type { Session, SupabaseClient } from '@supabase/supabase-js';
    import type { UserInfo } from '../types/account';

  let { children, data } : 
    { children: Snippet, data: 
      { meta: Docs, doc?: string, error?: number, session: Session | null, supabase: SupabaseClient, userData: UserInfo } } = $props();
    let { session, supabase } = $derived(data);

  let error_message = $state<string>(m["doc.error_unknown"]());
  
  switch (data.error) {
    case 1:
      error_message = m["doc.error_1"]();
      break;
  }

  const isOpen = writable(false);
  const theme = $state<{ mode : "system"|"light"|"dark"}>({ mode: "system" });
  setContext("screenMode", theme);
  setContext("account", data.userData);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth")
      }
    })

    return () => data.subscription.unsubscribe();
  })
</script>

<Header enabled={[null]} />
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
