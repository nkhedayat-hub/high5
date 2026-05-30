import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#2F2F2F",
        graphite: "#4A4A4A",
        cream: "#F7F1E8",
        mint: "#58C7B6",
        border: "#E5E7EB"
      },
      fontFamily: { sans: ["Vazirmatn", "IRANSans", "Tahoma", "sans-serif"] }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
