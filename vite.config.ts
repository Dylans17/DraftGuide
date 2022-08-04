import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      //https://vite-plugin-pwa.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest
      includeAssets: ['source/assets/favicon.ico', 'source/assets/apple-touch-icon.png', 'source/assets/masked-icon.svg'],
      manifest: {
        name: 'Draft Guide',
        short_name: 'Draft',
        description: 'Draft Guide Web Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'source/assets/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'source/assets/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
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
  base: import.meta.env.VITE_ROUTER_BASE || "/", //Base public path when served in development or production (Default: /)
  css: {
    modules: {
      localsConvention: "camelCase"
    },
  },
});
