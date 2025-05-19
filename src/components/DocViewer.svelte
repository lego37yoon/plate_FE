<script lang="ts">
    import { browser } from "$app/environment";
    import { Button } from "bits-ui";
    import { Calendar, UserRound, X } from "lucide-svelte";
    import MarkdownIt from "markdown-it";
    import type { Writable } from "svelte/store";

    const { isOpen, docMeta, doc } : { isOpen: Writable<boolean>, docMeta: Docs, doc: string } = $props();
    const mdParser = MarkdownIt();
    let renderResult = $state<string|null>(null);

    function closeViewer() {
        isOpen.set(false);
    }

    if (browser) {
        renderResult = mdParser.render(doc);
    }
</script>

<section id="docs" class="shadow-md z-0 flex flex-col"> 
    <div id="docs-buttonset">
        <Button.Root onclick={closeViewer} class="rounded-md">
            <X size={48} />
        </Button.Root>
    </div>
    <h1>{docMeta.title}</h1>
    <div id="docs-info">
        <!-- TODO: GET LAST UPDATED DATA
        <p class="text-gray-400 flex gap-2">
            <Calendar />
            
        </p>
        -->
        <!-- TODO: GET AUTHOR FROM DATA
        <p class="text-gray-400 flex gap-2">
            <UserRound />
            {author}
        </p>
         -->
    </div>
    <div id="docs-view">
        {@html renderResult}
    </div>
</section>