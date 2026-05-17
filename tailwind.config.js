/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:              '#09090b',
        'bg-alt':        '#111111',
        surface:         '#161618',
        'surface-hover': '#1c1c1e',
        accent:          '#22d3ee',
        text:            '#f0f0f0',
        'text-muted':    '#888888',
        'text-sub':      '#555555',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        site: '1100px',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease forwards',
      },
    },
  },
  plugins: [],
}
