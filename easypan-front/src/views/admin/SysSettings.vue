<template>
  <div>
    <div class="sys-setting-panel">
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="150px"
          @submit.prevent>
        <el-form-item label="注册邮件标题" prop="registerEmailTitle">
          <el-input
              clearable
              placeholder="请输入注册邮件验证码邮件标题"
              v-model.trim="formData.registerEmailTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="注册邮件内容" prop="registerEmailContent">
          <el-input
              clearable
              placeholder="请输入注册邮件验证码邮件内容"
              v-model.trim="formData.registerEmailContent">
          </el-input>
        </el-form-item>
        <el-form-item label="初始空间大小" prop="userInitUseSpace">
          <el-input
              clearable
              placeholder="初始化空间大小"
              v-model.trim="formData.userInitUseSpace">
            <template #suffix>MB</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings">发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
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

const rules = {
  registerEmailTitle: [{required: true, message: '请输入注册邮件验证码邮件标题'}],
  registerEmailContent: [{required: true, message: '请输入注册邮件验证码邮件内容'}],
  userInitUseSpace: [
    {required: true, message: '请输入初始化空间大小'},
    {validator: proxy.Verify.number, message: '空间大小只能是数字'}]
}

const getSysSettings = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getSysSettings,
  })
  if (!result) {
    return;
  }
  formData.value = result.data
}
getSysSettings()

const saveSettings = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: proxy.Api.saveSysSetting,
      params:params
    })
    if (!result) {
      return;
    }
    proxy.Message.success('保存成功')
  })
}
</script>

<style scoped lang="scss">
.sys-setting-panel {
  margin-top: 20px;
  width: 600px;
}
</style>