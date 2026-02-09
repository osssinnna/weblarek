import { defineConfig } from "vite";

export default defineConfig({
  base: "/weblarek/",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ["./src/scss"],
      },
    },
  },
});
