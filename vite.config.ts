import { defineConfig } from "vite";

export default defineConfig({
  base: "/weblarek/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: "index.html",
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
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
