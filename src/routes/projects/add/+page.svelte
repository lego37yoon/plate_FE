<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";
  import { Button, Label, Select } from "bits-ui";
  import { ArrowRight, BookType, Check, ChevronDown, ChevronRight, ChevronUp } from "lucide-svelte";
    import Input from "../../../components/Input.svelte";
    import FileSection from "../../../components/FileSection.svelte";

  let { data } = $props();
  let src_lang = $state<string|undefined>(undefined);
  let supported_lang = $state<string[]>([]);
  let manager = $state<number|undefined>(undefined);
  let fileList = $state<File[]>([]);
  let docsList = $state<File[]>([]);

  function supportedLangDisplay() {
    const selected : string[] = [];

    supported_lang.map((code) => {
      selected.push(
        data.lang_codes.find((lang) => lang.code === code)?.origin_name
      )
    });

    return selected.toString();
  }

  function changeFileList(e: Event, list: string) {
    const target = e.currentTarget as HTMLInputElement;
    const files = target.files;
    const newList: File[] = [];

    if (target && files) {
      for (let i = 0; i < files.length; i++) {
          newList.push(files.item(i) as File);
      }
    }

    if (list === "resource") {
      fileList = newList;
    } else {
      docsList = newList;
    }
  }
</script>

<svelte:head>
  <title>{m["projects.add_project_btn"]()} : Plate</title>
</svelte:head>

<h1 class="text-3xl text-primary">{m["projects.add_project_btn"]()}</h1>
<p class="text-primary flex gap-1 items-center mb-4">
  <a class="font-light" href={localizeHref("/home")}>Projects</a>
  <ChevronRight size={16} />
  <span class="font-semibold">{m["projects.add_project_btn"]()}</span>
</p>

<form method="POST" class="flex flex-wrap md:gap-2 lg:gap-6">
  <section id="base-info">
    <Label.Root for="name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">{m["projects.header_name"]()}</Label.Root>
    <Input id="name" name="name" required={true} />

    <Label.Root class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">{m["projects.add_project_initial_version"]()}</Label.Root>
    <Input id="version" name="version" required={true} />

    <Label.Root class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">{m["projects.add_project_desc_input"]()}</Label.Root>
    <textarea id="desc" name="desc" required class="rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"></textarea>

    <Label.Root id="src_lang-desc" for="src_lang" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
      {m["projects.add_project_src_lang"]()}
    </Label.Root>
    <p id="src_lang-desc" class="text-sm text-gray-500 mb-1 w-full md:max-w-80">
      {m["projects.add_project_change_src_lang"]()}
    </p>
    <Select.Root type="single" onValueChange={(v) => {
      src_lang = v;
      
      if (!supported_lang.includes(src_lang)) {
        supported_lang.push(src_lang);
      }
    }} bind:value={src_lang}>
      <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="src_lang" id="src_lang" aria-describedby="src_lang-desc" aria-label={m["projects.add_project_src_lang_select"]()}>
        <span class="inline-flex gap-2 items-center">
          <BookType size={20} class="text-gray-400" />
          {src_lang ? data.lang_codes.find((lang) => lang.code === src_lang)?.origin_name : m["projects.add_project_src_lang"]()}
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

    <Label.Root id="supported_lang-desc" for="supported_lang" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
      {m["projects.add_project_langs"]()}
    </Label.Root>
    <Select.Root type="multiple" onValueChange={(v) => {
      if (src_lang && !v.includes(src_lang)) {
        v.push(src_lang);
      }

      supported_lang = v;
    }} bind:value={supported_lang}>
      <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="supported_lang" id="supported_lang" aria-describedby="supported_lang-desc" aria-label={m["projects.add_project_langs_select"]()}>
        <span class="inline-flex gap-2 items-center grow-0 shrink min-w-0 w-full">
          <BookType size={20} class="text-gray-400 shrink-0" />
          <span class="overflow-ellipsis whitespace-nowrap overflow-hidden shrink text-start">
            {supported_lang.length > 0 ? supportedLangDisplay() : m["projects.add_project_langs"]()}
          </span>
        </span>
        <ChevronDown size={16} class="text-gray-500 shrink-0" />
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

    <Label.Root id="manager-desc" for="manager" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
      {m["projects.add_project_manager"]()}
    </Label.Root>
    <Select.Root type="single" onValueChange={(v) => {
      manager = Number(v);
    }}>
      <Select.Trigger class="rounded-lg border border-gray-500 bg-white inline-flex w-full md:max-w-80 select-none items-center transition-colors p-2 justify-between focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-offset-2" name="manager" id="manager" aria-describedby="manager-desc" aria-label={m["projects.add_project_manager_select"]()}>
        <span class="inline-flex gap-2 items-center">
          <BookType size={20} class="text-gray-400" />
          {manager ? data.users.find((user) => user.id = manager)?.nick : m["projects.add_project_manager"]()}
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
            {#each data.users as user}
            <Select.Item class="rounded-lg data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 hover:bg-gray-50" value={user.id} label={user.nick}>
              {#snippet children({ selected })}
                {#if user.avatar}
                <img class="h-10 w-10 rounded-full" alt="" src={user.avatar} />
                {:else}
                <div class="h-10 w-10 rounded-full border-2 border-primary"></div>
                {/if}
                <span class="text-base">{user.nick}</span>
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
  </section>
  <section id="additional-resources">
    <Label.Root id="resource-label" for="resource" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
      {m["projects.add_project_files"]()}
    </Label.Root>
    <input type="file" id="resource" name="resource" accept=".json" onchange={(e) => {changeFileList(e, "resource")}} class="border-dotted border-2 w-full md:max-w-80 border-primary rounded-lg p-2 cursor-pointer" multiple />
    {#if fileList.length > 0}
    <ul id="avatar-preview" >
      {#each fileList as file}
      <FileSection file={file} />
      {/each}
    </ul>
    {/if}
  </section>
  <section id="additional-documents">
    <Label.Root id="documents-label" for="documents" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block my-2">
      {m["projects.add_project_docs"]()}
    </Label.Root>
    <input type="file" id="documents" name="documents" accept=".md,.txt" onchange={(e) => {changeFileList(e, "document")}} class="border-dotted border-2 w-full md:max-w-80 border-primary rounded-lg p-2 cursor-pointer" multiple />
    {#if docsList.length > 0}
    <ul id="avatar-preview" >
      {#each docsList as file, idx}
      <FileSection file={file} idx={idx} type="doc"/>
      {/each}
    </ul>
    {/if}
  </section>
  <section id="project-button-set" class="mt-6">
    <Button.Root type="submit" class="rounded-lg bg-lime-800 text-white shadow-sm text-base flex justify-center items-center p-2 my-2 w-full md:max-w-80 gap-1 cursor-pointer">
    <span>{m["projects.add_project_register"]()}</span>
    <ArrowRight size={20} />
  </Button.Root>
  </section>
</form>
