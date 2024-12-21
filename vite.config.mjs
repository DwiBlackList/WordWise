import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    build: {
        outDir: 'public/build',
    },
    plugins: [
        laravel({
            input: [
                'resources/ts/App.ts', 
                'resources/css/app.css',
                // 'resources/css/editor.css',
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
