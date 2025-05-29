const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    // ggf. weitere Addons hier eintragen
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
};
