import * as path from "path";
import { defineConfig } from "vite";

/** */
export default defineConfig({
  resolve: {
    alias: {
      classes: path.resolve(__dirname, "classes"),
    },
  },
  build: {
    assetsDir: "homebase",
  },
});
