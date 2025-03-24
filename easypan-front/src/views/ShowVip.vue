<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="580px"
        :showCancel="false"
        @close="dialogConfig.show = false"
    >
      <div class="dialog-content">
        <img
            class="square-image"
            src="@/assets/icon-image/weChat.jpg"
            alt="VIP特权说明"
        >
        <div class="tips-text">扫码添加微信开通VIP特权</div>
      </div>
    </Dialog>
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

const show = (data) => {
  formData.value = Object.assign({}, data)
  dialogConfig.value.show = true
}
defineExpose({show})

const dialogConfig = ref({
  show: false,
  title: "添加管理员成为VIP",
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
const submitForm = ()=>{
  proxy.Message.success('等待管理员审核')
  dialogConfig.value.show = false
}
</script>

<style scoped lang="scss">
.dialog-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .square-image {
    width: 500px;
    height: 500px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    object-fit: contain;
    background: #f5f7fa;
    padding: 10px;
    border: 1px solid #ebeef5;
  }

  .tips-text {
    color: #606266;
    font-size: 16px;
    margin-top: 20px;
    font-weight: 500;
  }
}

// 响应式调整
@media (max-width: 640px) {
  .dialog-content {
    padding: 15px;

    .square-image {
      width: 80vw;
      height: 80vw;
      max-width: 400px;
      max-height: 400px;
    }

    .tips-text {
      font-size: 14px;
    }
  }
}
</style>