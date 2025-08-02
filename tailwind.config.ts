import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  //  darkMode:'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1f1f1f',
        primary: '#ffffff',
        highlight: {
          dark: '#FFFFFF',
          light: '#1f1f1f',
        },
        secondary: {
          dark: '#707070',
          light: '#e6e6e6',
        },
        action: '#3B82F6',
      },

      backgroundImage: {
        'png-pattern': "url('/empty-bg.jpg')",
      },
      transitionProperty: {
        width: 'width',
      },
// added for animation 
         animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
