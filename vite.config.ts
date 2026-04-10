import { defineConfig, type Plugin } from 'vite';

/**
 * Сборка открывается с диска (file://). У Vite по умолчанию:
 * — полифилл modulepreload дергает fetch(), с file:// это ломается;
 * — атрибут crossorigin у script/link мешает загрузке модулей с file://.
 */
function stripCrossoriginForFileOpen(): Plugin {
  return {
    name: 'strip-crossorigin-file',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html: string) {
        return html
          .replace(/\s+crossorigin(?:="[^"]*"|='[^']*'|)?/gi, '')
          .replace(/<script type="module"/g, '<script defer');
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [stripCrossoriginForFileOpen()],
  build: {
    target: 'es2018',
    cssCodeSplit: false,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/site.js',
        chunkFileNames: 'assets/site.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
