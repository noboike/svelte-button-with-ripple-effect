<script lang="ts">
  import Button from "@ui/Button.svelte";
  import ExtremeResponsive from "@ui/ExtremeResponsive.svelte";
</script>

<ExtremeResponsive>
  <div class="w-full h-full flex items-center justify-center">
    <div class="scale-150 flex items-center justify-center gap-5 flex">
      <Button>Button</Button>
      <Button class="w-24 h-24" />
    </div>
  </div>
</ExtremeResponsive>
