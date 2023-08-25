export const base = {
  black: "#111622",
  navy: "#001738",
  primary: {
    default: "#FF7200",
    hover: "#CC5202",
    pressed: "#A1400B",
    subtle: "#FFF9EC",
    inactive: "#FFE0A5"
  },
  success: {
    default: "#16A679",
    hover: "#007A5C",
    pressed: "#3A424A",
    subtle: "#E6F9EF",
  },
  informative: {
    default: "#2463BC",
    hover: "#144995",
    pressed: "#0E356C",
    subtle: "#F0F5FD",
  },
  danger: {
    default: "#C5280C",
    hover: "#9F200A",
    pressed: "#731807",
    subtle: "#FEF3F1",
  },
  neutral: {
    default: "#87909B",
    hover: "#F9FAFB",
    pressed: "#616A75",
    subtle: "#CACED3",
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
        karla: "var(--font-karla)",
        barlow: "var(--font-barlow)",
        barlowCondensed: "var(--font-barlow-condensed)",
      },
      fontSize: {
        sm: ["12px", , "16px"],
        base: ["14px", , "26px"],
        md: ["16px", , "24px"],
        lg: ["20px", , "24px"],
        xl: ["24px", "32px"],
        "2xl": ["32px", , "40px"],
        "3xl": ["38px", , "48px"],
        "4xl": ["48px", , "56px"],
      },
      colors: {
        ...base,
      },
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
