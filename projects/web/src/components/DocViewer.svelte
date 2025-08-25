<script lang="ts">
    import { browser } from "$app/environment";
    import { Button, Separator } from "bits-ui";
    import { Calendar, UserRound, X } from "lucide-svelte";
    import MarkdownIt from "markdown-it";

    const { doc } : { doc: Docs } = $props();
    const mdParser = MarkdownIt();
    let renderResult = $state<string|null>(null);

    function closeViewer() {
        doc.isOpen = false;
    }

    if (browser && doc.body) {
        renderResult = mdParser.render(doc.body);
    }
</script>

<section id="docs" class="shadow-md -ms-4 ps-6 py-4 pe-4 rounded-xl my-2 me-2 bg-white z-0 flex flex-col shrink "> 
    <div id="docs-buttonset" class="flex justify-between items-center">
        <h1 class="text-3xl text-primary">{doc.meta ? doc.meta.title.slice(0, -3) : "Untitled"}</h1>
        <Button.Root onclick={closeViewer} class="rounded-md p-2 bg-secondary">
            <X size={24} />
        </Button.Root>
    </div>

    <Separator.Root class="bg-gray-300 my-4 w-full block h-px" />
    
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