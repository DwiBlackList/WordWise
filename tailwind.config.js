import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import tailwindcssAnimate from "tailwindcss-animate";
import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.ts",
        "./resources/**/*.tsx",
    ],

    theme: {
        extend: {
            keyframes: {
                "infinite-scroll": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(calc(-50% - 1rem))" },
                },
                "infinite-scroll-partner": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(calc(-50% - 1rem))" },
                },
            },
            animation: {
                "infinite-scroll": "infinite-scroll 40s linear infinite",
                "infinite-scroll-partner":
                    "infinite-scroll-partner 25s linear infinite",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                gray: {
                    50: "#F9FAFB",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#BFC4CD",
                    400: "#9CA3AF",
                    500: "#6B7280",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                    900: "#111827",
                    950: "#030712",
                },
                violet: {
                    50: "#F1EEFF",
                    100: "#E6E1FF",
                    200: "#D2CBFF",
                    300: "#B7ACFF",
                    400: "#9C8CFF",
                    500: "#8470FF",
                    600: "#755FF8",
                    700: "#5D47DE",
                    800: "#4634B1",
                    900: "#2F227C",
                    950: "#1C1357",
                },
                sky: {
                    50: "#E3F3FF",
                    100: "#D1ECFF",
                    200: "#B6E1FF",
                    300: "#A0D7FF",
                    400: "#7BC8FF",
                    500: "#67BFFF",
                    600: "#56B1F3",
                    700: "#3193DA",
                    800: "#1C71AE",
                    900: "#124D79",
                    950: "#0B324F",
                },
                green: {
                    50: "#D2FFE2",
                    100: "#B1FDCD",
                    200: "#8BF0B0",
                    300: "#67E294",
                    400: "#4BD37D",
                    500: "#3EC972",
                    600: "#34BD68",
                    700: "#239F52",
                    800: "#15773A",
                    900: "#0F5429",
                    950: "#0A3F1E",
                    1000: "#2FEA9B",
                    1100: "#7FDD53",
                },
                red: {
                    50: "#FFE8E8",
                    100: "#FFD1D1",
                    200: "#FFB2B2",
                    300: "#FF9494",
                    400: "#FF7474",
                    500: "#FF5656",
                    600: "#FA4949",
                    700: "#E63939",
                    800: "#C52727",
                    900: "#941818",
                    950: "#600F0F",
                },
                yellow: {
                    50: "#FFF2C9",
                    100: "#FFE7A0",
                    200: "#FFE081",
                    300: "#FFD968",
                    400: "#F7CD4C",
                    500: "#F0BB33",
                    600: "#DFAD2B",
                    700: "#BC9021",
                    800: "#816316",
                    900: "#4F3D0E",
                    950: "#342809",
                },
                fontFamily: {
                    inter: ["Inter", "sans-serif"],
                },
                fontSize: {
                    xs: ["0.75rem", { lineHeight: "1.5" }],
                    sm: ["0.875rem", { lineHeight: "1.5715" }],
                    base: [
                        "1rem",
                        { lineHeight: "1.5", letterSpacing: "-0.01em" },
                    ],
                    lg: [
                        "1.125rem",
                        { lineHeight: "1.5", letterSpacing: "-0.01em" },
                    ],
                    xl: [
                        "1.25rem",
                        { lineHeight: "1.5", letterSpacing: "-0.01em" },
                    ],
                    "2xl": [
                        "1.5rem",
                        { lineHeight: "1.33", letterSpacing: "-0.01em" },
                    ],
                    "3xl": [
                        "1.88rem",
                        { lineHeight: "1.33", letterSpacing: "-0.01em" },
                    ],
                    "4xl": [
                        "2.25rem",
                        { lineHeight: "1.25", letterSpacing: "-0.02em" },
                    ],
                    "5xl": [
                        "3rem",
                        { lineHeight: "1.25", letterSpacing: "-0.02em" },
                    ],
                    "6xl": [
                        "3.75rem",
                        { lineHeight: "1.2", letterSpacing: "-0.02em" },
                    ],
                },
                screens: {
                    xs: "480px",
                },
                borderWidth: {
                    3: "3px",
                },
                minWidth: {
                    36: "9rem",
                    44: "11rem",
                    56: "14rem",
                    60: "15rem",
                    72: "18rem",
                    80: "20rem",
                },
                maxWidth: {
                    "8xl": "88rem",
                    "9xl": "96rem",
                },
                zIndex: {
                    60: "60",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
            backgroundImage: {
                "button-bg": "url('/public/buttonBg.svg')",
            },
        },
    },

    plugins: [forms, tailwindcssAnimate, flowbitePlugin],
};
