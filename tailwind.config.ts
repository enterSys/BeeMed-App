import type { Config } from 'tailwindcss'
import { heroui } from '@heroui/react'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Medical theme colors
        medical: {
          50: '#E8F5FF',
          100: '#D1EBFF',
          200: '#A3D7FF',
          300: '#6BBFFF',
          400: '#2EA1FF',
          500: '#0078D4',
          600: '#005FA3',
          700: '#004578',
          800: '#003153',
          900: '#001B33',
        },
        // Gamification colors
        xp: {
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          gold: '#FFD700',
          diamond: '#B9F2FF',
        },
        rarity: {
          common: '#9CA3AF',
          uncommon: '#22C55E',
          rare: '#3B82F6',
          epic: '#A855F7',
          legendary: '#F59E0B',
        },
      },
      keyframes: {
        'xp-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'level-up': {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'loot-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        'achievement-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'xp-pulse': 'xp-pulse 2s ease-in-out infinite',
        'level-up': 'level-up 0.6s ease-out',
        'loot-shake': 'loot-shake 0.5s ease-in-out',
        'achievement-bounce': 'achievement-bounce 0.5s ease-in-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-medical': 'linear-gradient(135deg, #0078D4 0%, #005FA3 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#0078D4',
              foreground: '#FFFFFF',
            },
            focus: '#0078D4',
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#2EA1FF',
              foreground: '#FFFFFF',
            },
            focus: '#2EA1FF',
          },
        },
      },
    }),
  ],
}

export default config