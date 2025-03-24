import {createApp} from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import '@/assets/base.scss'

import '@fortawesome/fontawesome-free/css/all.css'

import VueCookies from 'vue-cookies'


//引入代码高亮
import HljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/atom-one-light.css'
import 'highlight.js/lib/common'

//引入自定义组件
import Dialog from "@/components/Dialog.vue";
import Avatar from "@/components/Avatar.vue";
import Table from "@/components/Table.vue";
import Icon from "@/components/Icon.vue";
import NoData from "@/components/NoData.vue";
import Preview from "@/components/preview/Preview.vue";
import PreviewImage from "@/components/preview/PreviewImage.vue";
import Window from "@/components/Window.vue";


import Verify from "@/utils/Verify.js";
import Message from "@/utils/Message.js";
import Request from "@/utils/Request.js";
import Api from '@/utils/Api'
import Confirm from "@/utils/Confirm.js";
import Utils from "@/utils/Utils.js";


const app = createApp(App)
app.use(ElementPlus)
app.use(HljsVuePlugin)
app.component('Dialog', Dialog)
app.component('Avatar', Avatar)
app.component('Table', Table)
app.component('Icon', Icon)
app.component('NoData',NoData)
app.component('Preview',Preview)
app.component('PreviewImage',PreviewImage)
app.component('Window',Window)

app.use(router)
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Api = Api
app.config.globalProperties.Confirm = Confirm
app.config.globalProperties.Utils = Utils
app.config.globalProperties.globalInfo = {
    avatarUrl: '/account/getAvatar/',
    imageUrl: '/api/file/getImage/'
}
app.mount('#app')
