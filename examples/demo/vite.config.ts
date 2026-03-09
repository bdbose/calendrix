import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point "calendrix" imports directly at lib source for live dev
      "calendrix/styles.css": fileURLToPath(new URL("../../src/styles.css", import.meta.url)),
      "calendrix": fileURLToPath(new URL("../../src/index.ts", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});


