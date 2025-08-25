<script lang="ts">
    import { browser } from "$app/environment";
    import { Button, Separator } from "bits-ui";
    import { Calendar, LoaderCircle, UserRound, X } from "@lucide/svelte";
    import MarkdownIt from "markdown-it";
    import hljs from "highlight.js";
    import { blur } from "svelte/transition";

    const { doc } : { doc: Docs } = $props();

    let renderResult = $state<string|null>(null);
    let iconRotation = $state(0);
    let rotateInterval: NodeJS.Timeout|undefined;

    function closeViewer() {
        doc.isOpen = false;
    }

    if (browser && doc.body) {
        renderResult = null;
        const mdParser = MarkdownIt({
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value;
                    } catch (e) {
                        console.log("highlighting failed");
                    }
                }
                
                return "";
            }
        });
        renderResult = mdParser.render(doc.body);
    }

    $effect(() => {
        if (!renderResult && doc.isOpen) {
            rotateInterval = setInterval(() =>  {
                iconRotation < 360 ? iconRotation += 15 : iconRotation = 0;
            }, 45);
        } else {
            if (rotateInterval) {
                clearTimeout(rotateInterval);
            }
        }
    });
</script>

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
<div id="docs-view" class="font-normal text-wrap min-w-0 theme-atom-one-light overflow-scroll" in:blur={{ duration: 500, delay: 0 }}>
    {#if renderResult !== null}
    {@html renderResult}
    {:else}
    <div id="loading-view" class="flex w-full h-full grow items-center justify-center">
        <LoaderCircle size={48} style={`transform: rotate(${iconRotation}deg)`} class="text-primary" />
    </div>
    {/if}
</div>

<style>
    #docs-view :global(h1),
    #docs-view :global(h2),
    #docs-view :global(h3),
    #docs-view :global(h4),
    #docs-view :global(h5),
    #docs-view :global(h6),
    #docs-view :global(ol),
    #docs-view :global(ul),
    #docs-view :global(pre) {
        margin: 0.25rem 0;
    }

    #docs-view :global(h1) {
        font-size: 1.8rem;
        font-weight: 500;
    }

    #docs-view :global(h2) {
        font-size: 1.6rem;
    }

    #docs-view :global(h3) {
        font-size: 1.4rem;
        font-weight: 500;
    }

    #docs-view :global(h4) {
        font-size: 1.2rem;
    }

    #docs-view :global(h5) {
        font-size: 1.1rem;
        font-weight: 500;
    }

    #docs-view :global(h6) {
        font-size: 1.1rem;
    }

    #docs-view :global(p) {
        text-indent: 0.25rem;
    }

    #docs-view :global(a) {
        text-decoration: underline;
        color: var(--color-primary);
    }

    #docs-view :global(a img) {
        display: inline;
    }

    #docs-view :global(pre) {
        text-wrap: wrap;
        background: var(--color-gray-100);
        padding: 1rem;
        border-radius: 4px;
    }

    #docs-view :global(blockquote) {
        background: var(--color-secondary-back);
        
        border-left: 0.25rem var(--color-primary) solid;
        padding: 0.25rem 0.5rem;
        margin: 1rem 0;
    }

    #docs-view :global(ol), #docs-view :global(ul) {
        margin-inline-start: 2rem;
    }

    #docs-view :global(ol) {
        list-style: decimal;
    }

    #docs-view :global(ul) {
        list-style: disc;
    }
</style>