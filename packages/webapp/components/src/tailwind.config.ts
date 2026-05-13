/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
