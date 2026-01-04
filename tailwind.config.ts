import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f1115',
          surface: '#151820',
        },
        text: {
          primary: '#f2f2f2',
          secondary: '#9aa0aa',
        },
        accent: '#6B8FA3',
        divider: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.02em',
        wider: '0.04em',
      },
    },
  },
  plugins: [],
}
export default config

