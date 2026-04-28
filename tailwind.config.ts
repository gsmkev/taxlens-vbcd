import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          primary: '#0F2B5B',
          'primary-light': '#1a3f7a',
          'primary-dark': '#0a1f42',
          accent: '#00C896',
          'accent-dark': '#009E78',
        },
        surface: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          secondary: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};

export default config;
