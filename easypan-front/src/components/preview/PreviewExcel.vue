<template>
  <div class="table-info" v-html="excelContent"></div>
</template>

<script setup>
import {ref, getCurrentInstance, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import * as XLSX from 'xlsx'

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

const excelContent = ref()
const initExcel = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: 'arraybuffer',
  })
  if (!result) {
    return;
  }
  let workbook = XLSX.read(new Uint8Array(result), {type: 'array'})
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  excelContent.value = XLSX.utils.sheet_to_html(worksheet)
}

onMounted(() => {
  initExcel()
})
</script>

<style scoped lang="scss">
.table-info {
  width: 100%;
  padding: 10px;

  :deep table {
    width: 100%;
    border-collapse: collapse;

    td {
      border: 1px solid #ddd;
      border-collapse: collapse;
      padding: 5px;
      height: 30px;
      min-width: 50px;
    }
  }
}
</style>