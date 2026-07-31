import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

// TanStack Start + React + Tailwind + path aliases
export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    viteReact(),
    tailwindcss(),
    viteTsConfigPaths(),
    netlify(),
  ],
  server: {
    port: 3000,
    host: "127.0.0.1",
  },
});
