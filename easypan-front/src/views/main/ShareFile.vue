<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="600px"
        :showCancel="showCancel"
        @close="dialogConfig.show = false"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="100px"
          @submit.prevent>
        <el-form-item label="文件">
          {{ formData.fileName }}
        </el-form-item>

        <!--      单选-->
        <template v-if="showType===0">
          <el-form-item label="有效期" prop="validType">
            <el-radio-group v-model="formData.validType">
              <el-radio :label="0">1天</el-radio>
              <el-radio :label="1">7天</el-radio>
              <el-radio :label="2">30天</el-radio>
              <el-radio :label="3">永久有效</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="提取码" prop="codeType">
            <el-radio-group v-model="formData.codeType">
              <el-radio :label="0">自定义</el-radio>
              <el-radio :label="1">系统生成</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="code" v-if="formData.codeType===0">
            <el-input
                clearable
                size="large"
                placeholder="请输入5位提取码"
                v-model.trim="formData.code"
                maxlength="5"
                :style="{width:'130px'}">
            </el-input>
          </el-form-item>
        </template>


        <template v-if="showType===1 &&isPublish===1">
          <el-form-item label="分享链接">
            {{ shareUrl }}{{ resultInfo.shareId }}
          </el-form-item>
          <el-form-item label="提取码">
            {{ resultInfo.code }}
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="copy">复制链接及提取码</el-button>
          </el-form-item>
        </template>
        <template v-if="showType===1 && isPublish===0">
          等待审核
        </template>
      </el-form>
    </Dialog>
  </div>

</template>

<script setup>
import Dialog from "@/components/Dialog.vue";
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import useClipboard from 'vue-clipboard3'

const {toClipboard} = useClipboard()

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

//分享链接
const shareUrl = ref(document.location.origin + '/share/')
//是否展示分享表单 0:分享表单   1:分享结果
const showType = ref(0)
const isPublish = ref(0)

const rules = {
  validType: [{required: true, message: '请选择有效期'}],
  codeType: [{required: true, message: '请选择提取码类型'}],
  code: [
    {required: true, message: '请输入提取码'},
    {validator: proxy.Verify.shareCode, message: '请输入提取码'},
    {min: 5, message: '提取码最小为5位'},
  ],
}

const dialogConfig = ref({
  show: false,
  title: '分享',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        share()
      }
    }
  ]
})


const resultInfo = ref({})
const showCancel = ref(true)

//开始分享
const share = async () => {
  if (Object.keys(resultInfo.value).length > 0) {
    dialogConfig.value.show = false
    return
  }
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: proxy.Api.shareFile,
      params: params
    })
    if (!result) {
      return;
    }
    resultInfo.value = result.data
    dialogConfig.value.buttons[0].text = '关闭'
    showCancel.value = false
    proxy.Message.success('分享成功！等待审核员通过！')
    dialogConfig.value.show = false
  })
}

//展示分享框
const show = (data) => {
  console.log(data)
  showType.value = data.showType
  isPublish.value = data.isPublish
  dialogConfig.value.show = true
  showCancel.value = true
  resultInfo.value = {}
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
  })
}
defineExpose({show})

//复制
const copy = async () => {
  await toClipboard(`链接:${shareUrl.value}${resultInfo.value.shareId}  提取码:${resultInfo.value.code}`)
  console.log(resultInfo.value.shareId)
  proxy.Message.success('复制成功111')
}
</script>

<style scoped lang="scss">

</style>