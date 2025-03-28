import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },server:{
    //修改端口，增加代理
    port:7071,
    hmr:true,
    proxy:{
      "/api":{
        target:"http://10.202.14.239:7070",
        changeOrigin:true,
        pathRewrite:{
          "^api":"/api"
        }
      }
    }
  }
})
