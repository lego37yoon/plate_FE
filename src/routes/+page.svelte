<script lang="ts">
    import { m } from "$lib/paraglide/messages";


</script>

<svelte:head>
  <title>Home : Plate</title>
</svelte:head>

<h1 class="text-primary text-4xl">{m.home_title()}</h1>
<p>{m.home_description()}</p>