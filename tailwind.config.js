/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // High-contrast dark palette
                primary: "#0ea5a4", // teal-500 (accented primary)
                secondary: "#0f172a", // slate-900 (dark surface)
                accent: "#f97316", // orange-500 (call-to-action)
                contrastBg: "#0b1220", // extra dark background
                contrastText: "#f8fafc" // near-white text for contrast
            }
        },
    },
    plugins: [],
}
