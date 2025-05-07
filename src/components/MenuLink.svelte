<script lang="ts">
    import type { Snippet } from "svelte";

    const { href, target, enabled, children  } : {
        href: string,
        target?: string,
        enabled: boolean,
        children: Snippet<[]>
    } = $props();
</script>

<a href={href} class={`font-light p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 ${enabled ? "font-bold" :""}`} target={target}>
    {@render children()}
</a>