<template>
  <div class="window" v-if="show">
    <div class="window-mask" @click="close" v-if="show"></div>
    <div class="close" @click="close">
      <span class="iconfont icon-close2"></span>
    </div>
    <div class="window-content" :style="{top:'0px',width:windowContentWidth+'px', left:windowContentLeft+'px'}">
      <div class="title">{{ title }}</div>
      <div class="content-body" :style="{'align-items':'align'}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted, onUnmounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const props = defineProps({
  show: {
    type: Boolean
  },
  width: {
    type: Number,
    default: 1000
  },
  title: {
    type: String
  },
  align: {
    type: String,
    default: 'top'
  }
})

const windowWidth = ref(window.innerWidth)
const windowContentWidth = computed(() => {
  return props.width > windowWidth.value ? windowWidth.value : props.width
})

const windowContentLeft = computed(() => {
  let left = windowWidth.value - props.width
  return left < 0 ? 0 : left / 2
})

//调用父组件的方法
const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}

const resizeWindow = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', resizeWindow)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeWindow)
})
</script>

<style scoped lang="scss">
.window {
  .window-mask {
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh);
    z-index: 200;
    opacity: 0.5;
    background: #000;
    position: fixed;
  }

  .close {
    z-index: 202;
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: 30px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #606266;
    display: flex;
    justify-content: center;
    align-items: center;

    .iconfont {
      font-size: 20px;
      color: #fff;
      z-index: 100000;
    }
  }

  .window-content {
    top: 0;
    z-index: 201;
    position: absolute;
    background: #fff;

    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }

    .content-body {
      height: calc(100vh - 41px);
      display: flex;
      overflow: auto;
    }
  }
}
</style>