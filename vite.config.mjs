import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    build: {
        minify: false, // Nonaktifkan minifikasi untuk debugging
        terserOptions: {
            mangle: {
                properties: false, // Nonaktifkan mangling properti
            },
        },
        outDir: 'public/build',
    },
    plugins: [
        laravel({
            input: [
                'resources/ts/App.ts', 
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/editor.css',
                'resources/js/LDE/Main.js',
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/ts',
        },
    },
});
