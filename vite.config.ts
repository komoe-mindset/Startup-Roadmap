import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Relative asset URLs work on custom domains and GitHub project pages.
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

