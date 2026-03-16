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
        purple: {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
        },
        indigo: {
          DEFAULT: "#4f46e5",
        },
        bg: "#09090b",
        surface: "#18181b",
        surface2: "#27272a",
        border: "#3f3f46",
        text: "#fafafa",
        muted: "#a1a1aa",
      },
      borderRadius: {
        DEFAULT: "16px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-purple":
          "linear-gradient(135deg, #7c3aed, #4f46e5)",
        "gradient-text":
          "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
