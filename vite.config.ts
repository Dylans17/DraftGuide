import { loadEnv, defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { join, resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default ({ mode }: {mode: string}) => {
  process.env = {...loadEnv(mode, process.cwd()), ...process.env};
  let base = process.env.VITE_ROUTER_BASE || "/";
  return defineConfig({
    plugins: [
      solidPlugin(),
      VitePWA({
        //https://vite-plugin-pwa.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest
        includeAssets: ["/assets/favicon.ico", "/assets/apple-touch-icon.png", "/assets/masked-icon.svg"],
        manifest: {
          name: "Draft Guide",
          short_name: "Draft",
          description: "Draft Guide Web Application",
          theme_color: "#ffffff",
          icons: [
            {
              src: join(base, "/assets/android-chrome-192x192.png"),
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: join(base, "/assets/android-chrome-512x512.png"),
              sizes: "512x512",
              type: "image/png"
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        }
      })
    ],
    define: {

    },
    server: {
      port: 3000,
    },
    build: {
      target: "esnext",
      outDir: "build",
      rollupOptions: {
        input: [ // list of input files
          resolve(__dirname, "index.html")
        ]
      }
    },
    //root: resolve(__dirname, "src") //Project root directory (defaults to cwd)
    base, //Base public path when served in development or production (Default: /)
    css: {
      modules: {
        localsConvention: "camelCase"
      },
    },
  });
};