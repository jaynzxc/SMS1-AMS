module.exports = {
  content: [
    "./admin/**/*.html",
    "./teacher/**/*.html",
    "./student/**/*.html",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0030c2',
        'primary-light': '#e7edff',
        'primary-dark': '#002699',
        background: '#f8fafc',
        'card-bg': '#ffffff',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}