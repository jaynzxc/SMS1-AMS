// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./src/**/*.js"
    ],
    theme: {
        extend: {
            width: {
                '4.5': '1.125rem', // 18px
            },
            height: {
                '4.5': '1.125rem', // 18px
            },
            minWidth: {
                '18px': '18px',
            },
            minHeight: {
                '18px': '18px',
            },
            // Additional custom colors (optional)
            colors: {
                'orange-50': '#fff7ed',
                'orange-100': '#ffedd5',
                'orange-200': '#fed7aa',
                'orange-300': '#fdba74',
                'orange-400': '#fb923c',
                'orange-500': '#f97316',
                'orange-600': '#ea580c',
                'orange-700': '#c2410c',
                'orange-800': '#9a3412',
                'orange-900': '#7c2d12',
            }
        },
    },
    plugins: [],
}