<template>
  <div class="image-viewer"></div>
  <el-image-viewer
      :initial-index="previewImageIndex"
      hide-on-click-modal
      :url-list="imageList"
      @close="closeImgViewer"
      v-if="previewImageIndex!==null">
  </el-image-viewer>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const previewImageIndex = ref(null)
const props = defineProps({
  imageList: {
    type: Array
  }
})

const show = (index) => {
  previewImageIndex.value = index
}
defineExpose({show})

const closeImgViewer = () => {
  previewImageIndex.value = null
}

</script>

<style scoped lang="scss">
.image-viewer {
  .el-image-viewer_mask {
    opacity: 0.7;
  }
}
</style>