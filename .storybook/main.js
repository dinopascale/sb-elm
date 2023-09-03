import StorybookElm from "../vite-plugin-storybook-elm";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ["../src/Stories/**/*.elm"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/html-vite",
  },
  features: {
    // fundamental to avoid all problems with indexers
    storyStoreV7: false,
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config) {
    config.plugins.push(StorybookElm());
    return config;
  },
};
export default config;
