import type { Config } from "tailwindcss";

const config: Config = {
 
  darkMode:'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "primary-dark": "#1f1f1f",
      primary: "#ffffff",
      highlight: {
        dark: "#FFFFFF",
        light: "#1f1f1f",
      },
      secondary: {
        dark: "#707070",
        light: "#e6e6e6",
      },
      action: "#3B82F6",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
