import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  // Turn off the default Cloudflare setup so it doesn't clash with Netlify.
   nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // Pass standard Vite options inside the vite object property
  vite: {
    plugins: [netlify()],
    css: {
      transformer: "postcss",
    },
    resolve: {
      tsconfigPaths: true,
    },
  },
});