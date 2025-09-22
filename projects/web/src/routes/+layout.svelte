<script lang="ts">
  import '../app.css';
  import "@ibm/plex-sans-kr/css/ibm-plex-sans-kr-all.css"
  import Header from '../components/Header.svelte';
  import DocViewer from '../components/DocViewer.svelte';
  import { fade, slide } from "svelte/transition";
  import { onMount, setContext, type Snippet } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import { invalidate, onNavigate } from '$app/navigation';
  import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
  import type { UserInfo } from '../types/account';
    import { page } from '$app/state';

  let { children, data } : 
    { children: Snippet, data: 
      {
        error?: number,
        session: Session | null,
        supabase: SupabaseClient,
        user: User | null,
        info: UserInfo | null | undefined,
        path: string
      }
    } = $props();
  let { session, supabase } = $derived(data);

  let error_message = $state<string>(m["doc.error_unknown"]());
  
  switch (data.error) {
    case 1:
      error_message = m["doc.error_1"]();
      break;
  }

  const doc = $state<Docs>({ meta: undefined, isOpen: false, error: false });
  const theme = $state<{ mode : "system"|"light"|"dark" }>({ mode: "system" });
  const info = $state({ data: data.info });

  setContext("doc", doc);
  setContext("screenMode", theme);
  setContext("account", info);

  $effect(() => {
    info.data = data.info
  })

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession && session) {
        if (newSession.expires_at !== session.expires_at) {
          invalidate("supabase:auth");
        }
      }
    });

    return () => data.subscription.unsubscribe();
  });

  onNavigate((navigation) => {
  	if (!document.startViewTransition) return;
    if (page.url.pathname.includes("/translate")) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<Header enabled={[null]} user={data.user} />
<main class="flex">
  <section class="shadow-md rounded-xl z-10 m-2 p-4 bg-white grow shrink min-w-1/2">
    {@render children()}
  </section>
  {#if doc.isOpen}
    <section id="docs" class="shadow-md -ms-4 ps-6 py-4 pe-4 rounded-xl my-2 me-2 bg-white z-0 flex flex-col shrink" transition:slide={{ duration: 500, delay: 0, axis: "x" }}>
      {#key doc.body}
      <DocViewer {doc} />
      {/key}
    </section>
  {/if}
</main>

<style>
  :global(body) {
    font-family: "IBM Plex Sans KR", "Pretendard Variable", "Pretendard", "Noto Sans CJK KR", "Noto Sans KR", sans-serif;
    font-weight: 500;
    background: #FAFBF2
  }

  main.flex {
    max-height: 100vh - 5rem;
  }

</style>
