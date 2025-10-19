<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { applyAction, enhance } from "$app/forms";
  import { Ban, Check, Inbox, Trash } from "@lucide/svelte";
  import { Button } from "bits-ui";
  import { getContext } from "svelte";

  const { results, id } : { results: Results[], id: Number } = $props();
  let data = $state<Results[]>(results);
  let updating = $state(false);
  
  const userInfo : { data: UserInfo | undefined } = getContext("account");
  const dateTime = new Intl.DateTimeFormat(results.length > 0 ? results[0].lang_code.replace("_", "-") : "en-US",
    { dateStyle: "full", timeStyle: "medium" }
  )
</script>

<ul class="rounded-md">
  {#if !updating}
  {#each data as item}
  <li class={`rounded-md flex justify-between w-full p-1 border-b-gray-200 border-b-[0.5px] bg-secondary-back`}>
    <div class="flex gap-2 items-center">
      <div class={`rounded-full my-1 mx-2 p-0.5 min-w-2 min-h-2 text-center shrink-0 font-light text-sm ${
        item.approved === true ?
          `bg-lime-700` : ` bg-amber-400`
      }`}></div>
      <p class="flex flex-col">
        <span>{item.result}</span>
        <span class="font-light min-h-6">{item.nick} | {dateTime.format(Date.parse(item.last_updated))}</span>
      </p>
    </div>
    <div class="flex gap-2 items-center">
      {#if userInfo.data && userInfo.data.role !== "l10n_contributor" && !item.approved}
      <form method="POST" action="?/suggest_manage" onsubmit={() => {
        updating = true;
      }} use:enhance={() => {
        return async ({ result }) => {
          await applyAction(result);
          updating = false;
        }
      }} class="flex gap-2">
        <Button.Root type="submit" class="rounded-md p-2 hover:underline flex gap-2 text-lime-900">
          <Check />
          <span>{m["l10n.input_review_approve"]()}</span>
        </Button.Root>
        <!-- <Button.Root type="submit" class="rounded-md p-2 hover:underline flex gap-2 text-amber-700">
          <MessageCircleWarning />
          <span>{m["l10n.input_review_need_comment"]()}</span>
        </Button.Root> -->
        <Button.Root type="submit" class="rounded-md p-2 hover:underline flex gap-2 text-red-800">
          <Ban />
          <span>{m["l10n.input_review_deny"]()}</span>
        </Button.Root>
      </form>
      {/if}
      {#if 
        (userInfo.data && userInfo.data.id === item.author) ||
        (userInfo.data && userInfo.data.role !== "l10n_contributor")
      }
      <form method="POST" action="?/suggest_delete" use:enhance={() => {
        return async ({ result }) => {
          if (result.type === "success") {
            updating = true;
          }
          await applyAction(result);
        }
      }}>
        <input type="hidden" name="suggest_id" value={item.id} />
        <input type="hidden" name="suggest_author" value={item.author} />
        <input type="hidden" name="suggest_approved" value={item.approved} />
        <input type="hidden" name="origin_id" value={id} />
        <input type="hidden" name="user_id" value={userInfo.data.id} />
        <input type="hidden" name="user_role" value={userInfo.data.role} />
        <Button.Root type="submit" class="rounded-md p-2 hover:underline flex gap-2 text-red-900">
          <Trash />
          <span>{m["l10n.input_review_delete"]()}</span>
        </Button.Root>
      </form>
      {/if}
    </div>
  </li>
  {:else}
  <li class="text-center flex flex-col gap-2 items-center p-2">
    <Inbox />
    <p>{m["l10n.input_suggestions_empty"]()}</p>
  </li>
  {/each}
  {:else}
  <li class="text-center flex flex-col gap-2 items-center p-2">
    <Inbox />
    <p>{m["l10n.input_suggestions_empty"]()}</p>
  </li>
  {/if}
</ul>