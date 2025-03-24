<template>
  <div class="doc-content" ref="docRef"></div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import * as docx from 'docx-preview'

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const props = defineProps({
  url: {
    type: String
  }
})

const docRef = ref()
const initDoc = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: 'blob',
  })
  if (!result) {
    return;
  }
  docx.renderAsync(result, docRef.value)
}

onMounted(()=>{
  initDoc()
})
</script>

<style scoped lang="scss">
.doc-content {
  margin: 0 auto;

  :deep .docx-wrapper {
    background: #fff;
    padding: 10px 0;
  }

  :deep .docx-wrapper > section.docx {
    margin-bottom: 0;
  }
}
</style>