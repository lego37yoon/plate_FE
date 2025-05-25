<script lang="ts">
  import { m } from "$lib/paraglide/messages";
</script>

<svelte:head>
  <title>{m["title.home"]()} : Plate</title>
</svelte:head>

<h1 class="text-primary text-3xl">{m["home.title"]()}</h1>
<p>{m["home.description"]()}</p>

