import * as path from "path";
import { defineConfig } from "vite";

export default {
  resolve: {
    alias: {
      classes: path.resolve(__dirname, "classes"),
      ship: path.resolve(__dirname, "ship.glb"),
    },
  },
};
