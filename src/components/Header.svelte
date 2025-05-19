<script lang="ts">
    import { m } from "$lib/paraglide/messages";
    import { localizeHref, type Locale } from "$lib/paraglide/runtime";
    import MenuLink from "./MenuLink.svelte";
    import ProfilePopup from "./ProfilePopup.svelte";

    type Menu = "proj" | "doc" | "dic" | "lang" | null;

    const { enabled, lang } : { enabled : Array<Menu>, lang: Locale } = $props();
</script>

<header class="rounded-xl shadow-xl p-2 m-2 flex bg-white dark:bg-gray-800 z-30 text-primary">
    <a href={localizeHref("/")} class="font-normal text-2xl flex items-center ">
        <!-- 로고는 장식이므로 alt="" 설정 -->
        <img src="/favicon.png" alt="" class="w-10" />
        <span class="h-min">Plate</span>
    </a>
    <nav class="flex gap-2">
        <MenuLink href="/home" enabled={enabled.includes("proj")}>{m["menu.proj"]()}</MenuLink>
        <MenuLink href="/locale" enabled={enabled.includes("lang")}>{m["menu.lang"]()}</MenuLink>
        <MenuLink href="/docs" enabled={enabled.includes("doc")}>{m["menu.doc"]()}</MenuLink>
        <MenuLink href="/glossary" enabled={enabled.includes("dic")}>{m["menu.glossary"]()}</MenuLink>        
    </nav>
    <!-- <ProfilePopup /> prop으로 할지 context로 할지 고려 -->
</header>