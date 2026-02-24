/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Tier colors - optimized for both light and dark mode
        tier: {
          's-plus': 'rgb(22, 163, 74)',    // green-600 - darker, readable in light mode
          's': 'rgb(34, 197, 94)',          // green-500
          'a-plus': 'rgb(132, 204, 22)',    // lime-500
          'a': 'rgb(202, 138, 4)',          // yellow-600
          'a-minus': 'rgb(234, 88, 12)',    // orange-600
          'b-plus': 'rgb(239, 68, 68)',     // red-500
          'b': 'rgb(220, 38, 38)',          // red-600
          'b-minus': 'rgb(185, 28, 28)',    // red-700
          'c-plus': 'rgb(153, 27, 27)',     // red-800
          'c': 'rgb(127, 29, 29)',          // red-900
          'd': 'rgb(69, 26, 26)',           // red-950
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
