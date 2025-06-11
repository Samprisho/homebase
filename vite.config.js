import { defineConfig } from "vite";
import path from "path";

console.log("Hello");

export default {
  resolve: {
    alias: {
      classes: path.resolve(__dirname, "classes"),
    },
  },
};
