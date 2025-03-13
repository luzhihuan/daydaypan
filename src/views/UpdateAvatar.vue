<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="500px"
        :showCancel="false"
        @close="dialogConfig.show = false"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
          @submit.prevent
      >
        <el-form-item label="昵称">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="头像">
          <AvatarUpload v-model="formData.avatar"></AvatarUpload>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from "@/components/Dialog.vue";
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import AvatarUpload from "@/components/AvatarUpload.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const show = (data) => {
  formData.value = Object.assign({}, data)
  formData.value.avatar = {userId: data.userId}
  dialogConfig.value.show = true
}
defineExpose({show})


const dialogConfig = ref({
  show: false,
  title: "修改头像",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});


const emit = defineEmits()
const submitForm = async () => {
  if (!(formData.value.avatar instanceof File)) {
    dialogConfig.value.show = false
    return
  }

  let result = await proxy.Request({
    url: proxy.Api.updateUserAvatar,
    params: {
      avatar: formData.value.avatar
    }
  })

  if (!result) {
    return
  }
  dialogConfig.value.show = false
  const cookeUserInfo = proxy.VueCookies.get('userInfo')
  delete cookeUserInfo.avatar
  proxy.VueCookies.set('userInfo', cookeUserInfo, 0)
  emit('updateAvatar')
}
</script>

<style scoped>

</style>