/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                wall: {
                    "0%": {
                        transform: "scale(0.7)",
                        opacity: "0"
                    },
                    "100%": {
                        transform: "scale(1)",
                        opacity: "1"
                    },
                }
            },
            animation: {
                'wall': 'wall 0.3s ease',
            },
        },
    },
    plugins: [],
}