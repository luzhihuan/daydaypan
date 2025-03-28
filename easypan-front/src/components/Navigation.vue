<template>
  <div class="top-navigation">
    <template v-if="folderList.length > 0">
      <span class="back link" @click="backParent">返回上一级</span>
      <el-divider direction="vertical"></el-divider>
    </template>
    <span v-if="folderList.length === 0" class="all-file">全部文件</span>
    <span
        v-if="folderList.length > 0"
        class="link"
        @click="setCurrentFolder(index)"
    >
      全部文件
    </span>
    <template v-for="(item, index) in folderList">
      <span class="iconfont icon-right"></span>
      <span
          class="link"
          v-if="index < folderList.length - 1"
          @click="setCurrentFolder(index)"
      >{{ item.fileName }}</span
      >
      <span v-if="index === folderList.length - 1" class="text">{{
          item.fileName
        }}</span>
    </template>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const userInfo = ref({});

const props = defineProps({
  watchPath: {
    type: Boolean,
    default: true,
  },
  shareId: {
    type: String,
  },
  adminShow: {
    type: Boolean,
    default: false,
  },
});

//目录集合
const folderList = ref([]);
//当前目录
const currentFolder = ref({fileId: "0"});

const init = () => {
  folderList.value = [];
  currentFolder.value = {fileId: "0"};
  doCallback();
};

const openFolder = (data) => {
  const {fileId, fileName} = data;
  const folder = {
    fileName: fileName,
    fileId: fileId,
  };
  folderList.value.push(folder);
  currentFolder.value = folder;
  setPath();
};
defineExpose({openFolder});

//返回上一级
const backParent = () => {
  let currentIndex = null;
  for (let i = 0; i < folderList.value.length; i++) {
    if (folderList.value[i].fileId === currentFolder.value.fileId) {
      currentIndex = i;
      break;
    }
  }
  setCurrentFolder(currentIndex - 1);
};

//点击导航 设置当前目录
const setCurrentFolder = (index) => {
  if (index === -1) {
    //返回全部
    currentFolder.value = {fileId: "0"};
    folderList.value = [];
  } else {
    currentFolder.value = folderList.value[index];
    folderList.value.splice(index + 1, folderList.value.length);
  }
  setPath();
};

const setPath = () => {
  if (!props.watchPath) {
    doCallback()
    return;
  }
  let pathArray = [];
  folderList.value.forEach(item => {
    pathArray.push(item.fileId);
  });
  router.push({
    path: route.path,
    //拼接路径
    query: pathArray.length === 0 ? "" : {path: pathArray.join("/")},
  });
};

//获取当前路径的目录
const getNavigationFolder = async (path) => {
  let url = proxy.Api.getFolderInfo;
  if (proxy.shareId) {
    url = proxy.Api.getFolderInfoShare;
  }
  if (proxy.adminShow) {
    url = proxy.Api.getFolderInfoAdmin;
  }
  let result = await proxy.Request({
    url: url,
    showLoading: false,
    params: {
      path: path,
      shareId: props.shareId,
    },
  });
  if (!result) {
    return;
  }
  folderList.value = result.data;
};

const emit = defineEmits(["navChange"]);
const doCallback = () => {
  emit("navChange", {
    categoryId: category.value,
    curFolder: currentFolder.value,
  });
};

const category = ref();
watch(
    () => route,
    (newVal, oldVal) => {
      if (!props.watchPath) {
        return;
      }
      if (newVal.path.indexOf("/main") === -1 &&
          newVal.path.indexOf('/settings/fileList') === -1 &&
          newVal.path.indexOf('/share') === -1
      ) {
        return;
      }
      const path = newVal.query.path;
      category.value = newVal.params.category;
      if (path === undefined) {
        init();
      } else {
        getNavigationFolder(path);
        let pathArray = path.split("/");
        currentFolder.value = {
          fileId: pathArray[pathArray.length - 1],
        };
        doCallback();
      }
    },
    {immediate: true, deep: true}
);
</script>

<style scoped lang="scss">
.top-navigation {
  font-size: 13px;
  display: flex;
  align-items: center;
  line-height: 40px;

  .all-file {
    font-weight: bold;
  }

  .link {
    color: #06a7ff;
    cursor: pointer;
  }

  .icon-right {
    color: #06a7ff;
    padding: 0 5px;
    font-size: 13px;
  }
}
</style>