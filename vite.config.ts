import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    //my added options
    outDir: "build",
    rollupOptions: {
      input: [ // list of input files
        resolve(__dirname, "index.html")
      ]
    }
  },
  //root: resolve(__dirname, "src") //Project root directory (defaults to cwd)
  base: './' //Base public path when served in development or production (Default: /)
});
