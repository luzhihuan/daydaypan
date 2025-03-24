<template>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="500px"
        :showCancel="false" @close="dialogConfig.show = false">
        <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
            <!--input输入-->
            <el-form-item label="好友昵称">
                {{ currentList.nickName }}
            </el-form-item>


            <!-- 文件名称输入 -->
            <el-form-item label="文件名称">
                <el-input clearable placeholder="请输入分享文件名称" v-model.trim="formData.fileName"></el-input>
            </el-form-item>


            <!-- 分享链接 -->
            <el-form-item label="分享链接">
                <div class="link-container">
                    <el-input v-model.trim="formData.fileName" placeholder="请输入分享链接和验证码">
                    </el-input>
                </div>
            </el-form-item>
        </el-form>
    </Dialog>
</template>
  
<script setup>
import Dialog from "@/components/Dialog.vue";
import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})


// 当前好友信息（通过props传入）
const props = defineProps({
    fileInfo: {
        type: Object
    }
})

const show = () => {
    dialogConfig.value.show = true
    nextTick(() => {
        formDataRef.value.resetFields()
        formData.value = {}
    })
}
defineExpose({ show })

const dialogConfig = ref({
    show: false,
    title: '分享文件给好友',
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
        url: proxy.Api.sendShareFile,
        params: {
            shareFileUrl:
      }
    })
    if (!result) {
        return
    }
    dialogConfig.value.show = false
    proxy.Message.success('密码修改成功')
}



</script>
  
<style scoped></style>