<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import {reactive} from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = zhCn
const config = reactive({
  max:1
})

</script>

<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped>
</style>
