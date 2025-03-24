<template>
  <div class="code">
    <div class="top-op">
      <div class="encode-select">
        <el-select clearable placeholder="请选择编码" v-model="encode" @change="changeEncode">
          <el-option :value="utf8" label="utf8编码"></el-option>
          <el-option :value="gbk" label="gbk编码"></el-option>
        </el-select>
        <div class="tips">乱码了？切换编码</div>
      </div>
      <div class="copy-btn">
        <el-button type="primary" @click="copy">复制</el-button>
      </div>
    </div>
    <highlightjs autodetect :code="txtContent"></highlightjs>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import useClipboard from "vue-clipboard3";

const {toClipboard} = useClipboard()

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

const txtContent = ref('')
const codeRef = ref()
const blobResult = ref()
const encode = ref('utf8')
const readTxt = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: 'blob'
  })
  if (!result) {
    return;
  }
  blobResult.value = result
  showTxt()
}
const changeEncode = (e) => {
  encode.value = e
  showTxt()
}
const showTxt = () => {
  const reader = new FileReader()
  reader.onload = () => {
    txtContent.value = reader.result
  }
  reader.readAsText(blobResult.value, encode.value)
}

onMounted(() => {
  readTxt()
})

const copy = async () => {
  await toClipboard(txtContent.value)
  proxy.Message.success('复制成功')
}
</script>

<style scoped lang="scss">
.code {
  width: 100%;

  .top-op {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .encode-select {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 5px 10px;

    .tips {
      margin-left: 10px;
      color: #828282;
    }
  }

  .copy-btn {
    margin-right: 10px;
  }

  pre {
    margin: 0;
  }
}
</style>