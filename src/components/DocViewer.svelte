<script lang="ts">
    import { Button } from "bits-ui";
    import { Calendar, UserRound, X } from "lucide-svelte";

    const { isOpen, title, author, date, children } = $props();

    function closeViewer() {
        isOpen.set(false)
    }

</script>

<section id="docs" class="shadow-md z-0 flex flex-col"> 
    <div id="docs-buttonset">
        <Button.Root onclick={closeViewer} class="rounded-md">
            <X size={48} />
        </Button.Root>
    </div>
    <h1>{title}</h1>
    <div id="docs-info">
        <p class="text-gray-400 flex gap-2">
            <Calendar />
            {date}
        </p>
        <p class="text-gray-400 flex gap-2">
            <UserRound />
            {author}
        </p>
    </div>
    {@render children()}
</section>