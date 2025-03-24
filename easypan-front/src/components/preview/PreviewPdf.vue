<template>
  <div class="pdf">
    <vue-pdf-embed ref="pdfRef" :source='state.url' class="vue-pdf-embed" width="850"
                   :page="state.pageNum"></vue-pdf-embed>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import VuePdfEmbed from 'vue-pdf-embed'

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

const state = ref({
  url: '',
  pageNum: 0,
  numPages: 0
})

const pdfRef = ref()
const initPdf = async () => {
  state.value.url = '/api' + props.url
}

onMounted(() => {
  initPdf()
})
</script>

<style scoped lang="scss">
.pdf {
  width: 100%;
}
</style>