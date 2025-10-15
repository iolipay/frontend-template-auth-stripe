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
        primary: '#003049',
        accent: '#4e35dc',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        wide: '2px',
      },
      boxShadow: {
        'button': '5px 5px 0px 0px #333333',
        'button-hover': '5px 5px 0px 0px #000000',
        'button-active': '3px 3px 0px 0px #333333',
      },
      borderRadius: {
        'xs': '1px',
        'sm': '9px',
        'md': '11px',
        'lg': '20px',
      },
    },
  },
  plugins: [],
};

export default config;
