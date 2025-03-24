<template>
  <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfig.show = false"
  >
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <!--input输入-->
      <el-form-item label="密码" prop="password">
        <el-input
            type="password"
            clearable
            placeholder="请输入新密码"
            v-model.trim="formData.password"
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input
            type="password"
            clearable
            placeholder="请再次输入新密码"
            v-model.trim="formData.rePassword"
            show-password
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import Dialog from "@/components/Dialog.vue";
import {ref, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const checkRePassword = (rules, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error(rules.message))
  } else {
    callback()
  }
}
const rules = {
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: proxy.Verify.password, message: '密码需包含字母和数字，8~18位（允许特殊字符）', trigger: 'blur'}
  ],
  rePassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: checkRePassword, message: '两次输入的密码不一致', trigger: 'blur'}
  ],
}


const show = () => {
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = {}
  })
}
defineExpose({show})

const dialogConfig = ref({
  show: false,
  title: '修改密码',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        submitForm()
      }
    }
  ]
})

const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
  })
  let result = await proxy.Request({
    url: proxy.Api.updatePassword,
    params: {
      password: formData.value.password,
    }
  })
  if (!result) {
    return
  }
  dialogConfig.value.show = false
  proxy.Message.success('密码修改成功')
}



</script>

<style scoped>

</style>