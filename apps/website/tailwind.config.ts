import type { Config } from "tailwindcss";
import tailwindPreset from "@111-network/ui/tailwind-preset";

const config: Config = {
  presets: [tailwindPreset],
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
