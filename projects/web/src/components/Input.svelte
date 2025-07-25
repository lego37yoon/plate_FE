<script lang="ts">
  let { id, name, type, required, inputmode, ariaDescribedby, onchange } : {
    id?: string,
    name: string,
    type?: "text" | "email" | "password" | "number",
    required?: boolean,
    inputmode?: "numeric",
    ariaDescribedby?: string,
    onchange?: Function,
  } = $props();

</script>

<input
    {id}
    {type}
    class="rounded-lg bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-primary focus:border-primary focus:ring-offset-background focus:outline-hidden inline-flex w-full md:max-w-80 items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
    {name} {required} aria-describedby={ariaDescribedby}
/>
