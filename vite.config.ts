import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@data": path.resolve(__dirname, "./src/lib/data"),
      "@ui": path.resolve(__dirname, "./src/lib/ui"),
    },
  },
  plugins: [svelte()],
});
