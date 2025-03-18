<template>
  <div>
    <PreviewImage ref="imageViewerRef" :imageList="[imageUrl]" v-if="fileInfo.fileCategory===3"></PreviewImage>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import PreviewImage from "@/components/preview/PreviewImage.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const imageViewerRef = ref()
const imageUrl = computed(() => {
  //将图片路径中的'_.'替换成'.'
  return proxy.globalInfo.imageUrl + fileInfo.value.fileCover.replaceAll('_.','.')
})
const FILE_URL_MAP = {
  0: {
    fileUrl: '/file/getFile',
    videoUrl: '/file/ts/getVideoInfo',
    createDownloadUrl: '/file/createDownloadUrl',
    download: '/api/file/download'
  },
  1: {
    fileUrl: '/admin/getFile',
    videoUrl: '/admin/ts/getVideoInfo',
    createDownloadUrl: '/admin/createDownloadUrl',
    download: '/api/admin/download'
  },
  2: {
    fileUrl: '/showShare/getFile',
    videoUrl: '/showShare/ts/getVideoInfo',
    createDownloadUrl: '/showShare/createDownloadUrl',
    download: '/api/showShare/download'
  },
}
const fileInfo = ref({})
const showPreview = (data, showPart) => {
  fileInfo.value = data
  if (data.fileCategory === 3) {
    nextTick(() => {
      imageViewerRef.value.show(0)
    })
  }
}
defineExpose({showPreview})
</script>

<style scoped lang="scss">

</style>