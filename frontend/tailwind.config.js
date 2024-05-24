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
        neonGreen: "#2ECC40",
        retroRed: "#7D0A0A",
        retroLightRed: "#BF3131",
        retroRedLight: "#D45456",
        coolBlue: "#376EA7",
        lightBlue: "#ADC7DF",
        retroblue: "#567bff",
        retrored: "#ff6f61",
        darkblue: "#001F3F",
        electricBlue: "#7FDBFF",
        brightRed: "#FF4136",
        retroAccent: "#ffcc00",
      },
      fontFamily: {
        retro: ['"Press Start 2P"', "system-ui"],
        metro: ['"VT323"', "system-ui"],
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
