<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    import { m } from "$lib/paraglide/messages";
    import { Button, Label, Select } from "bits-ui";
    import { ArrowRight, BookType, Check, CheckCircle2, ChevronDown, ChevronUp, TriangleAlert } from "lucide-svelte";
    import type { PageProps } from "./$types";
    import { goto } from "$app/navigation";
    import { localizeHref } from "$lib/paraglide/runtime";

    let { data, form }: PageProps = $props();

    let avatarLocalUrl = $state("");
    let avatarLocalName = $state("");
    let avatarLocalSize = $state(0);
    let pref_lang = $state("");

    function changeAvatar (e: Event) {
      const target = e.currentTarget as HTMLInputElement;
      const files = target.files;

      if (target && files && files.length > 0) {
        const file = files.item(0);

        if (file) {
          avatarLocalUrl = URL.createObjectURL(file);
          avatarLocalName = file.name;
          avatarLocalSize = file.size;
        }
      }
    }

    function returnFileSize(size: number) {
      if (size < 1024) {
        return size + "bytes";
      } else if (size >= 1024 && size < 1048576) {
        return (size / 1024).toFixed(1) + "KB";
      } else if (size >= 1048576) {
        return (size / 1048576).toFixed(1) + "MB";
      }
    }

    if (form && form.success) {
      setTimeout(() => {
        goto(localizeHref("/"));
      }, 3000);
    }
</script>

<svelte:head>
  <title>{m["title.signup"]()} : Plate</title>
</svelte:head>

<h1 class="text-3xl mb-6 text-primary">{m["title.signup"]()}</h1>

<form method="POST" enctype="multipart/form-data" use:enhance={() => {
  return async ({ result, update }) => {
    await applyAction(result);
    update({ reset: false });
  }
}}>
  {#if form?.error}
  <section id="error-message" class="flex gap-2 border border-red-900 bg-red-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <TriangleAlert size={24} class="text-red-900" />
    <span class="text-red-900">{form.message}</span>
  </section>
  {:else if form?.success}
  <section id="require-resend" class="flex gap-2 border border-lime-900 bg-green-50 rounded-lg w-full md:max-w-80 p-2 items-center mb-2">
    <CheckCircle2 size={24} class="text-lime-900" />
    <p class="text-lime-900">
      {form.message}
    </p>
  </section>
  {/if}

  <Label.Root id="nickname-label" for="nickname" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
    {m["account.nick"]()}
  </Label.Root>
  <p id="nickname-desc" class="text-sm text-gray-500 mb-1">{m["account.nick_desc"]()}</p>
  <input
    id="nickname"
    type="text"
    class="rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
    name="nickname" required aria-describedby="nickname-desc"
  />
  <Label.Root id="avatar-label" for="avatar" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
    {m["account.avatar"]()}
  </Label.Root>
  <p id="avatar-desc" class="text-sm text-gray-500 mb-1">{m["account.avatar_desc"]()}</p>
  <input type="file" id="avatar" name="avatar" accept="image/*" onchange={(e) => {changeAvatar(e)}} class="border-dotted border-2 w-full md:max-w-80 border-primary rounded-lg p-2 cursor-pointer" />
  {#if avatarLocalUrl.length > 0}
  <section id="avatar-preview" class="flex gap-4 flex-wrap mt-1 rounded-lg bg-lime-50 w-full md:max-w-80 p-4">
    <img class="w-20 h-20 rounded-full" src={avatarLocalUrl} alt="Avatar Preview" />
    <p class="flex flex-col justify-center">
      <span>{m["account.avatar_size"]()} {returnFileSize(avatarLocalSize)}</span>
    </p>
  </section>
  {/if}

  <Label.Root id="pref_lang-label" for="pref_lang" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
    {m["account.pref_lang"]()}
  </Label.Root>
  <p id="pref_lang-desc" class="text-sm text-gray-500 mb-1">{m["account.pref_lang_desc"]()}</p>
  <Select.Root type="single" onValueChange={(v) => (pref_lang = v)}>
    <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="pref_lang" id="pref_lang" aria-describedby="pref_lang-desc" aria-label={m["account.pref_lang_select"]()}>
      <span class="inline-flex gap-2 items-center">
        <BookType size={20} class="text-gray-400" />
        {pref_lang ? data.lang_codes.find((lang) => lang.code === pref_lang)?.origin_name : m["account.pref_lang_select"]()}
      </span>
      <ChevronDown size={16} class="text-gray-500" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        class="focus-override border-muted bg-background shadow-sm outline-hidden z-50 h-max max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 bg-white"
        sideOffset={10}>
        <Select.ScrollUpButton class="flex w-full items-center justify-center">
          <ChevronUp size={16} class="text-gray-500" />
        </Select.ScrollUpButton>
        <Select.Viewport>
          {#each data.lang_codes as lang}
          <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={lang.code} label={lang.origin_name}>
            {#snippet children({ selected })}
              {lang.origin_name} ({lang.code})
              {#if selected}
                <div class="ml-auto">
                  <Check aria-label="check" />
                </div>
              {/if}
            {/snippet}
          </Select.Item>
          {/each}
        </Select.Viewport>
        <Select.ScrollDownButton class="flex w-full items-center justify-center">
          <ChevronDown size={16} class="text-gray-500" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>

  <input type="hidden" id="pref_lang_real" name="pref_lang_real" value={pref_lang} />

  <Button.Root type="submit" class="rounded-lg bg-lime-800 text-white shadow-sm text-base flex justify-center items-center p-2 my-2 w-full md:max-w-80 gap-1 cursor-pointer">
    <span>{m["account.signup_btn"]()}</span>
    <ArrowRight size={20} />
  </Button.Root>
</form>