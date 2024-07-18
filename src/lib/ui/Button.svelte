<script lang="ts">
  import { onDestroy } from "svelte";
  export let disabled: boolean = false;
  let _class: string = "";
  export { _class as class };
  interface Ripple {
    id: number;
    x: number;
    y: number;
    scale: number;
    opacity: number;
    beginTime: number;
    duration: number;
    progress: number;
    beginTimeSet: boolean;
  }
  let ripples: Ripple[] = [];
  let idCount: number = 0;
  let req: number;

  function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  function interpolateArray(array: number[], progress: number): number {
    const length = array.length - 1;
    const scaledProgress = progress * length;
    const index = Math.floor(scaledProgress);
    const fraction = scaledProgress - index;

    if (index >= length) {
      return array[length];
    }

    const startValue = array[index];
    const endValue = array[index + 1];

    return startValue + (endValue - startValue) * fraction;
  }

  function loop() {
    ripples.forEach((ripple) => {
      if (!ripple.beginTimeSet) {
        ripple.beginTime = performance.now();
        ripple.beginTimeSet = true;
      }
      const currentTime = performance.now() - ripple.beginTime;
      const progress = currentTime / ripple.duration;
      ripple.progress = progress > 1 ? 1 : progress;
      ripple.scale = interpolateArray([0, 8], easeOutCubic(ripple.progress));
      ripple.opacity = interpolateArray(
        [0, 0.5, 0],
        easeOutCubic(ripple.progress)
      );
    });
    ripples = ripples.filter((item) => item.progress < 1);
    const allFinished =
      ripples.filter((item) => item.progress >= 1).length == ripples.length;
    if (ripples.length > 0 && !allFinished) {
      req = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(req);
      idCount = 0;
    }
  }
  let ref: HTMLButtonElement;
  function adjustRectSize(rect: HTMLButtonElement): number {
    const minDimension = Math.max(
      rect.getBoundingClientRect().width,
      rect.getBoundingClientRect().height
    );

    return minDimension * 4;
  }
  function handleClick(e: MouseEvent) {
    try {
      navigator.vibrate([10]);
    } catch (error) {
      console.error("vibration not supported!");
    }

    ripples = [
      ...ripples,
      {
        x: e.offsetX,
        y: e.offsetY,
        opacity: 0.5,
        scale: 1,
        beginTime: performance.now(),
        duration: 700,
        progress: 0,
        id: idCount,
        beginTimeSet: false,
      },
    ];
    idCount++;
    requestAnimationFrame(loop);
  }
  onDestroy(() => cancelAnimationFrame(req));
</script>

<button
  bind:this={ref}
  on:click
  {disabled}
  style={`filter: grayscale(${disabled ? 100 : 0}%);`}
  class={`p-3 rounded-lg bg-primary disabled:cursor-not-allowed text-white disabled:hover:bg-primary hover:bg-primary-dark border-1 border-primary-dark active:scale-95 disabled:active:scale-100 duration-300 relative select-none overflow-hidden ${_class}`}
>
  <slot></slot>
  {#each ripples as ripple (ripple.id)}
    {#if !disabled}
      <div
        style={`left: ${ripple.x}px; top: ${ripple.y}px; transform: translate(-50%, -50%); opacity: ${ripple.opacity}; width: ${adjustRectSize(ref) * ripple.progress}px; height: ${adjustRectSize(ref) * ripple.progress}px;`}
        class="absolute w-5 h-5 bg-primary-light opacity-100 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      ></div>
    {/if}
  {/each}
  <div
    class=" absolute left-0 top-0 w-full h-full"
    on:click={handleClick}
  ></div>
</button>
