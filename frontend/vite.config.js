import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// 🔥 Compression Plugins
import viteCompression from 'vite-plugin-compression'
import compression2 from 'vite-plugin-compression2'

// 🔹 Image Optimization
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react() ,
    tailwindcss(),
   // 🔹 Gzip or Brotli compression
   viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),

    // 🔹 Additional compression support
    compression2({
      brotli: true,
      gzip: true,
      threshold: 1024,
    }),

     // 🖼️ Image optimizer (LCP-heavy assets)
     viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 70 },
      pngquant: { quality: [0.6, 0.8], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
    }),

  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
