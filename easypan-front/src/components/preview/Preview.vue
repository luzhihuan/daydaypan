<template>
  <div>
    <PreviewImage
        ref="imageViewerRef"
        :imageList="[imageUrl]"
        v-if="fileInfo.fileCategory===3">
    </PreviewImage>

    <Window
        :show="windowShow"
        @close="closeWindow"
        :width="fileInfo.fileCategory===1?1500:900"
        :title="fileInfo.fileName"
        :align="fileInfo.fileCategory===1?'center':'top' "
        v-else
    >
      <PreviewVideo :url="url" v-if="fileInfo.fileCategory===1"></PreviewVideo>
      <PreviewDoc :url="url" v-if="fileInfo.fileType===5"></PreviewDoc>
      <PreviewExcel :url="url" v-if="fileInfo.fileType===6"></PreviewExcel>
      <PreviewPdf :url="url" v-if="fileInfo.fileType===4"></PreviewPdf>
      <PreviewTxt :url="url" v-if="fileInfo.fileType===7 ||fileInfo.fileType===8"></PreviewTxt>
      <PreviewMusic :url="url" :fileName="fileInfo.fileName" v-if="fileInfo.fileCategory===2"></PreviewMusic>
      <PreviewDownload :createDownloadUrl="createDownloadUrl"
                       :downloadUrl='downloadUrl'
                       :fileInfo="fileInfo"
                       v-if="fileInfo.fileCategory===5&&fileInfo.fileType!==8"></PreviewDownload>
    </Window>

  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted, computed, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import PreviewImage from "@/components/preview/PreviewImage.vue";
import PreviewVideo from "@/components/preview/PreviewVideo.vue";
import PreviewDoc from "@/components/preview/PreviewDoc.vue";
import PreviewExcel from "@/components/preview/PreviewExcel.vue";
import PreviewPdf from "@/components/preview/PreviewPdf.vue";
import PreviewTxt from "@/components/preview/PreviewTxt.vue";
import PreviewMusic from "@/components/preview/PreviewMusic.vue";
import PreviewDownload from "@/components/preview/PreviewDownload.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref(
    proxy.VueCookies.get('userInfo')
)

const url = ref(null)
const createDownloadUrl = ref(null)
const downloadUrl = ref(null
)
const imageViewerRef = ref()
const player = ref()
const imageUrl = computed(() => {
  //将图片路径中的'_.'替换成'.'
  return proxy.globalInfo.imageUrl + fileInfo.value.fileCover.replaceAll('_.', '.')
})
const FILE_URL_MAP = {
  0: {
    fileUrl: 'file/getFile',
    videoUrl: 'file/ts/getVideoInfo',
    createDownloadUrl: '/file/createDownloadUrl',
    downloadUrl: 'api/file/download'
  },
  1: {
    fileUrl: 'admin/getFile',
    videoUrl: 'admin/ts/getVideoInfo',
    createDownloadUrl: '/admin/createDownloadUrl',
    downloadUrl: 'api/admin/download'
  },
  2: {
    fileUrl: 'showShare/getFile',
    videoUrl: 'showShare/ts/getVideoInfo',
    createDownloadUrl: 'showShare/createDownloadUrl',
    downloadUrl: 'api/showShare/download'
  },
}

const windowShow = ref(false)
const closeWindow = () => {
  windowShow.value = false
}
const fileInfo = ref({})
const showPreview = (data, showPart) => {
  fileInfo.value = data
  if (data.fileCategory === 3) {
    nextTick(() => {
      imageViewerRef.value.show(0)
    })
  } else {
    windowShow.value = true
    let _url = FILE_URL_MAP[showPart].fileUrl
    let _createDownloadUrl = FILE_URL_MAP[showPart].createDownloadUrl
    let _downloadUrl = FILE_URL_MAP[showPart].downloadUrl
    if (data.fileCategory === 1) {
      _url = FILE_URL_MAP[showPart].videoUrl
    }
    if (showPart === 0) {
      _url = `${FILE_URL_MAP[showPart].videoUrl}/${userInfo.value.userId}/${data.fileId}`
      _createDownloadUrl = `${FILE_URL_MAP[showPart].createDownloadUrl}/${data.fileId}`
    } else if (showPart === 1) {
      _url = _url + '/' + data.userId + '/' + data.fileId
      _createDownloadUrl = _createDownloadUrl + '/' + data.userId + '/' + data.fileId
    } else if (showPart === 2) {
      _url = _url + '/' + data.shareId + '/' + data.fileId
      _createDownloadUrl = _createDownloadUrl + '/' + data.shareId + '/' + data.fileId
    }
    url.value = _url
    createDownloadUrl.value = _createDownloadUrl
    downloadUrl.value = _downloadUrl
  }
}
defineExpose({showPreview})

</script>

<style scoped lang="scss">

</style>