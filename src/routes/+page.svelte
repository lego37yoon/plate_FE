<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { getLocale } from "$lib/paraglide/runtime";
</script>

<svelte:head>
  <title>Home : Plate</title>
</svelte:head>

<h1 class="text-primary text-4xl">{m["home.title"]()}</h1>
<p>{m["home.description"]()}</p>

