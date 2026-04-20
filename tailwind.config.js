/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable dark mode with class strategy
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#18181b', // Zinc 900
                    secondary: '#27272a', // Zinc 800
                    vibrant: '#3f3f46', // Zinc 700
                },
                architect: {
                    dark: '#09090b', // Zinc 950
                    card: '#18181b', // Zinc 900 
                    border: '#27272a', // Zinc 800
                    muted: '#a1a1aa', // Zinc 400
                },
                // Light mode semantic colors
                light: {
                    bg: '#ffffff',
                    card: '#f4f4f5', // Zinc 100
                    border: '#e4e4e7', // Zinc 200
                    muted: '#71717a', // Zinc 500
                    text: '#09090b', // Zinc 950
                },
                primary: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'text': 'shimmer 3s ease-in-out infinite',
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                shimmer: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                blob: {
                    '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                }
            }
        },
    },
    plugins: [],
}
