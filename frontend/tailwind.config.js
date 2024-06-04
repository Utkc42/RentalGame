// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        retroblue: "#567bff",
        retrored: "#ff6f61",
        darkblue: "#001F3F",
        electricBlue: "#7FDBFF",
        brightRed: "#FF4136",
        retroAccent: "#ffcc00",
        lightGray: "#D3D3D3",
        darkGray: "#243B52",
      },
      fontFamily: {
        retro: ['"Press Start 2P"', "system-ui"],
        metro: ['"VT323"', "system-ui"],
        honk: ['"Honk"', "system-ui"],
        Acme: ['"Acme"', "system-ui"],
        Archivo: ['"Archivo Black"', "system-ui"],
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(-25%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
      },
    },
  },
  plugins: [],
};
