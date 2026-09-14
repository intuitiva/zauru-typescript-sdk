/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "stories/**/*.stories.{js,jsx,ts,tsx}",
  port: 61000,
  viteConfig: ".ladle/vite.config.ts",
  addons: {
    a11y: { enabled: true },
  },
};
