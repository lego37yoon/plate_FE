<script lang="ts">
  import { m } from "$lib/paraglide/messages";
    import { localizeHref } from "$lib/paraglide/runtime";
    import { Button } from "bits-ui";
    import { Boxes, Code, LogIn } from "lucide-svelte";
</script>

<svelte:head>
  <title>{m["title.home"]()} : Plate</title>
</svelte:head>

<section class="md:p-6">
  <h1 class="text-primary text-3xl mb-2">{m["home.title"]()}</h1>
  <p class="mb-4">{m["home.description"]()}</p>

  <div id="button-set" class="flex gap-2">
    <Button.Root href={localizeHref("/account/login")} class="flex gap-2 text-white bg-lime-900 py-2 px-3 rounded-lg">
      <LogIn />
      {m["title.login"]()}
    </Button.Root>
    <Button.Root href={localizeHref("/account/login")} class="flex gap-2 text-white bg-lime-900 py-2 px-3 rounded-lg">
      <Boxes />
      {m["title.projects"]()}
    </Button.Root>
    <Button.Root href="https://github.com/lego37yoon/plate_FE" class="flex gap-2 border border-lime-900 py-2 px-3 rounded-lg">
      <Code />
      {m["projects.add_project_source"]()}
    </Button.Root>
  </div>
</section>