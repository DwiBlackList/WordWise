import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import path from "path";

export default defineConfig({
    build: {
        minify: false, // Nonaktifkan minifikasi untuk debugging
        terserOptions: {
            mangle: {
                properties: false, // Nonaktifkan mangling properti
            },
        },
        outDir: "public/build",
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    plugins: [
        laravel({
            input: [
                "resources/ts/App.ts",
                "resources/css/app.css",
                "resources/js/app.js",
                "resources/css/editor.css",
                "resources/js/LDE/Main.js",
                "resources/js/LandingPage.tsx",
                "resources/js/Dashboard.tsx",
                "resources/js/Login.tsx",
                "resources/js/LevelCRUD.tsx",
                "resources/js/LevelDetail.tsx",
                "resources/js/Table.tsx",
                "resources/js/UsersCRUD.tsx",
            ],
            refresh: true,
        }),
    ],
    server: {
        proxy: {
            "/api": "http://localhost:8000",
        },
    },
    resolve: {
        alias: {
            "@": "/resources/ts",
            "@tailwindConfig": path.resolve(__dirname, "tailwind.config.js"),
        },
    },
    optimizeDeps: {
        include: ["@tailwindConfig"],
    },
});
