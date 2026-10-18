import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FAF7F2",
          50: "#FFFCF8",
          100: "#FAF7F2",
          200: "#F1EAE3",
        },
        beige: {
          DEFAULT: "#E9DED2",
          100: "#F3EBE4",
          200: "#E9DED2",
          300: "#D8C7B9",
        },
        charcoal: {
          DEFAULT: "#292522",
          800: "#403B37",
          900: "#292522",
        },
        espresso: {
          DEFAULT: "#6F2338",
          700: "#842D47",
          800: "#6F2338",
          900: "#541A2B",
        },
        mutedGrey: "#77706A",
        taupe: {
          DEFAULT: "#D4C8BE",
          light: "#E5DCD4",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
