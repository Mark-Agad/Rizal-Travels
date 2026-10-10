import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // Pass standard Vite options inside the vite object property
  vite: {
    css: {
      transformer: "postcss",
    },
    resolve: {
      tsconfigPaths: true,
    },
  },
});