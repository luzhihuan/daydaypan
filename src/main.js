import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import '@/assets/base.scss'

import VueCookies from 'vue-cookies'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
