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
        flamira: {
          50: '#FDF8F5',
          100: '#FBEFEA',
          200: '#F6DDD2',
          300: '#ECC3B1',
          400: '#DC9B7E',
          500: '#C45A2C', // Signature terracotta
          600: '#B24B20',
          700: '#943B17',
          800: '#793216',
          900: '#642C16',
        },
        cream: {
          50: '#FDFAF7',
          100: '#FAF6F0',
          200: '#F5EFE6',
          300: '#ECE3D5',
          400: '#DFD2C0',
          500: '#CFBDA8',
        },
        espresso: {
          800: '#2C1D16',
          900: '#1F140E',
          950: '#140C08',
        },
        gold: {
          50: '#FDFBF4',
          100: '#FCF6E4',
          200: '#F7E7B8',
          300: '#EFD482',
          400: '#E4BD4C',
          500: '#D5A425',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 29, 22, 0.05)',
        'warm': '0 10px 30px -4px rgba(196, 90, 44, 0.08)',
        'hover': '0 14px 34px -4px rgba(44, 29, 22, 0.10)',
      }
    },
  },
  plugins: [],
};
export default config;
