<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  let scaleRatio: number = 1;
  let scaleRatio_r: number = 1;
  let minWidth = 428;
  function calculate() {
    scaleRatio = window.innerWidth / minWidth;
    scaleRatio = scaleRatio > 1 ? 1 : scaleRatio;
    scaleRatio_r = minWidth / window.innerWidth;
  }
  const observer = new ResizeObserver(() => {
    calculate();
  });

  onMount(() => {
    observer.observe(document.documentElement);
  });

  onDestroy(() => observer.disconnect());
</script>

<div
  style={` transform:translate(-50%, -50%)  scale(${scaleRatio}); width: ${100 * (scaleRatio < 1 ? minWidth / innerWidth : 1)}%; height: ${100 * (scaleRatio < 1 ? minWidth / innerWidth : 1)}%;`}
  class=" absolute left-1/2 top-1/2 h-full overflow-hidden"
>
  <slot></slot>
</div>
