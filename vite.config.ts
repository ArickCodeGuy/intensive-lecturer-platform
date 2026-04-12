import { defineConfig } from 'vite';

// base '/' для dev — иначе Vite на localhost часто отдаёт мусор/404.
// base './' только в build — для share-package (file:// и любой каталог).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  },
}));
