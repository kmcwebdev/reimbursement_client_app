

export const base = {
  primary: {
    normal: "#FF7200",
    hover: "#F2730D",
    active: "#FF6A00",
    selected: "#F2730D",
    subtle: {
      normal: "#FFF1E6",
      hover: "#FFE9D6",
      active: "#FFDDC2",
      selected: "#FFE9D6",
    },
  },
  neutral: {
    normal: '#4A545E',
    hover: "#3A424A",
    active: "#272E35",
    selected: "#3A424A",
    subtle: {
      normal: "#F0F3F5",
      hover: "#E9ECEF",
      active: "#CFD6DD",
      selected: "#E9ECEF",
    },
  },
  positive: {
    normal: "#1D7C4D",
    hover: "#196742",
    active: "#0E4E30",
    selected: "#3A424A",
    subtle: {
      normal: "#E6F9EF",
      hover: "#D8F8E7",
      active: "#C2EBD5",
      selected: "#D8F8E7",
    },
  },
  danger: {
    normal: "#C53434",
    hover: "#952D2D",
    active: "#6F2020",
    selected: "#952D2D",
    subtle: {
      normal: "#FFEBEB",
      hover: "#FEE6E6",
      active: "#FCCFCF",
      selected: "#FEE6E6",
    },
  },
  informative: {
    normal: "#3062D4",
    hover: "#1E50C0",
    active: "#1E50C0",
    selected: "#1E50C0",
    subtle: {
      normal: "#EDF2FF",
      hover: "#E5EEFF",
      active: "#CDDDFF",
      selected: "#E5EEFF",
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: ["var(--font-karla)"],
        barlow: ["var(--font-barlow)"],
        barlowCondensed: ["var(--font-barlow-condensed)"],
      },
      colors: {
        ...base
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    function ({
      addVariant,
    }: {
      addVariant: (c1: string, c2: string) => void;
    }) {
      addVariant("children", "& > *");
    },
  ],
};
