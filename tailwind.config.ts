const defaultTheme = require("tailwindcss/defaultTheme");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    // rest of the code
    extend: {
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
      maxHeight: {
        'screen-minus': 'calc(100vh - 17rem)',
      },
      minHeight: {
        'screen-minus': 'calc(100vh - 17rem)',
      },
      height: {
        'screen-minus': 'calc(100vh - 8rem)',
        'screen-minus-mobile': 'calc(100vh - 3rem)',
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "meteor-effect": "meteor 5s linear infinite",
      },
      colors: {
        primary: "#7A63EB",
        secondary: "#5C9BEB",
        primaryLight: "#B1A3F7",
        secondaryLight: "#8ABCEB",
        primaryDark: "#5C4DBD",
        secondaryDark: "#3A7ABD",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      }
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
