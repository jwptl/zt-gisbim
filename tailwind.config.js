/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        function ({ addBase }) {
            addBase({
                ".el-button": {
                    "background-color": "var(--el-button-bg-color,var(--el-color-white))"
                }
            });
        }
    ],
}

