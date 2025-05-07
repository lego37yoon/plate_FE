<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import MenuLink from "./MenuLink.svelte";
    import ProfilePopup from "./ProfilePopup.svelte";

    type Menu = "proj" | "doc" | "dic" | "lang" | null;

    const { enabled } : { enabled : Array<Menu> } = $props();
</script>

<header class="rounded-xl shadow-xl bg-white dark:bg-gray-800 z-30">
    <a href="/" class="font-bold">
        <!-- 로고는 장식이므로 alt="" 설정 -->
        <img src="/favicon.png" alt="" />
        Plate
    </a>
    <nav class="flex gap-2">
        <MenuLink href="/home" enabled={enabled.includes("proj")}>{m["menu.proj"]}</MenuLink>
        <MenuLink href="/locale" enabled={enabled.includes("lang")}>{m["menu.lang"]}</MenuLink>
        <MenuLink href="/docs" enabled={enabled.includes("doc")}>{m["menu.doc"]}</MenuLink>
        <MenuLink href="/glossary" enabled={enabled.includes("dic")}>{m["menu.glossary"]}</MenuLink>        
    </nav>
    <!-- <ProfilePopup /> prop으로 할지 context로 할지 고려 -->
</header>