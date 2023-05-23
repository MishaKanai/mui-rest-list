const path = require("path");

module.exports = {
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-knobs",
    "@storybook/addon-info",
    "@storybook/addon-a11y/register",
    "@react-theming/storybook-addon",
    {
      name: "@storybook/addon-docs",
      options: {
        configureJSX: true,
      },
    },
  ],
  stories: ["../src/stories/*.stories.tsx"],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: path.resolve(__dirname, "../src"),
      use: [
        require.resolve("ts-loader")
      ],
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};
