import { defineConfig } from "vite";
import storybookElm from "./vite-plugin-storybook-elm";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "/src/Stories/Basic.elm",
      preserveEntrySignatures: "strict",
    },
  },
  plugins: [storybookElm()],
});
