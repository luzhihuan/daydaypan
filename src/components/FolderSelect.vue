<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="600px"
        :showCancel="false"
        @close="dialogConfig.show = false"
    >
      <div class="navigation-panel">
        <Navigation ref="navigationRef" @navChange="navChange" :watchPath="false"></Navigation>
      </div>
      <div class="folder-list" v-if="folderList.length>0">
        <div class="folder-item" v-for="item in folderList" @click="selectFolder(item)">
          <!--          文件夹-->
          <Icon :fileType="0"></Icon>
          <span class="file-name">{{ item.fileName }}</span>
        </div>
      </div>
      <div v-else class="tips">
        移动<span>{{ currentFolder.fileName }}</span>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import Icon from "@/components/Icon.vue";
import Navigation from "@/components/Navigation.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})


//当前目录
const currentFolder = ref({})


//弹窗
const dialogConfig = ref({
  show: false,
  title: '移动到',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        folderSelect()
      },
    }
  ]
})


//父级Id
const filePid = ref('0')

const currentFileIds = ref({})

const folderList = ref([])

//目录
const loadAllFolder = async () => {
  let result = await proxy.Request({
    url: proxy.Api.loadAllFolder,
    params: {
      filePid: filePid.value,
      currentFileIds: currentFileIds.value
    }
  })
  if (!result) {
    return;
  }
  folderList.value = result.data
}


const close = () => {
  dialogConfig.value.show = false
}

//展示目录对话框
const showFolderDialog = (currentFolder) => {
  dialogConfig.value.show = true
  currentFileIds.value = currentFolder
  loadAllFolder()
}
defineExpose({
  showFolderDialog,
  close
})


const navigationRef = ref()
//选择目录
const selectFolder = (data) => {
  navigationRef.value.openFolder(data)
}

//调用父级方法
const emit = defineEmits(['folderSelect'])
//确定选择目录
const folderSelect = () => {
  emit('folderSelect', filePid.value)
}

//导航改变回调
const navChange = (data) => {
  const {curFolder} = data
  currentFolder.value = curFolder
  filePid.value = curFolder.fileId
  loadAllFolder()
}
</script>

<style scoped lang="scss">
.navigation-panel {
  padding-left: 10px;
  background: #f1f1f1;
}

.folder-list {
  .folder-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;

    .file-name {
      display: inline-block;
      margin-left: 10px;
    }

    &:hover {
      background: #f8f8f8;
    }
  }

  max-height: calc(100vh - 200px);
  min-height: 200px;
}

.tips {
  text-align: center;
  line-height: 200px;

  span {
    color: #06a7ff;
  }
}
</style>