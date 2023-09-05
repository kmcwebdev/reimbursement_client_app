export const base = {
  black: "#111622",
  navy: "#001738",
  neutral: {
    50: "#FFFFFF",
    100: "#F9FAFB",
    200: "#F1F2F4",
    300: "#EBECEF",
    400: "#DDE0E4",
    500: "#CACED3",
    600: "#ABB1BA",
    700: "#87909B",
    800: "#616A75",
    900: "#1F2124",
  },
  green: {
    50: "#F0FDF8",
    100: "#E0F8EE",
    200: "#C0F2DD",
    300: "#A1EDD0",
    400: "#50DCA9",
    500: "#23C48C",
    600: "#16A679",
    700: "#007A5C",
    800: "#125443",
    900: "#0C3B2F",
  },

  yellow: {
    50: "#FEF8EC",
    100: "#FCF0D4",
    200: "#FAE5b2",
    300: "#F8D990",
    400: "#F5C452",
    500: "#F2B322",
    600: "#D89B0D",
    700: "#B77E0B",
    800: "#875C08",
    900: "#4D2E05",
  },
  blue: {
    50: "#F0F5FD",
    100: "#E8F0FD",
    200: "#BBD4F7",
    300: "#93BAF1",
    400: "#6699A1",
    500: "#3E7DD5",
    600: "#2463BC",
    700: "#144995",
    800: "#0E356C",
    900: "#10294C",
  },
  red: {
    50: "#FEF3F1",
    100: "#FDE2DD",
    200: "#FBC5BC",
    300: "#F79482",
    400: "#F56B52",
    500: "#F24122",
    600: "#C5280C",
    700: "#9F200A",
    800: "#731807",
    900: "#430E04",
  },
  orange: {
    50: "#FFF9EC",
    100: "#FFF2D3",
    200: "#FFE0A5",
    300: "#FFC96D",
    400: "#FFA632",
    500: "#FF8B0A",
    600: "#FF7200",
    700: "#CC5202",
    800: "#A1400B",
    900: "#82360C",
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
      animation: {
        progress: "progress 1s infinite linear",
      },
      keyframes: {
        progress: {
          "0%": { transform: " translateX(0) scaleX(0)" },
          "40%": { transform: "translateX(0) scaleX(0.4)" },
          "100%": { transform: "translateX(100%) scaleX(0.5)" },
        },
      },
      transformOrigin: {
        "left-right": "0% 50%",
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
