<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="btn">
          <el-upload
              :show-file-list="false"
              :with-credentials="true"
              :multiple="true"
              :http-request="addFile"
              :accept="fileAccept"
          >
            <el-button type="primary">
              <span class="iconfont icon-upload">上传</span>
            </el-button>
          </el-upload>
        </div>
        <el-button type="success">
          <span class="iconfont icon-folder-add" @click="newFolder"
          >新建文件夹</span
          >
        </el-button>
        <el-button
            type="danger"
            :disabled="selectFileIdList.length === 0"
            @click="delFileBatch"
        >
          <span class="iconfont icon-del">批量删除</span>
        </el-button>
        <el-button
            type="warning"
            :disabled="selectFileIdList.length === 0"
            @click="moveFolderBatch"
        >
          <span class="iconfont icon-move">批量移动</span>
        </el-button>
        <div class="search-panel">
          <el-input clearable placeholder="请输入文件名搜索" v-model="fileNameFuzzy" @keyup.enter="search">
            <template #suffix>
              <i class="iconfont icon-search" @click="search"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="search"></div>
      </div>
      <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
    </div>
    <div class="file-list" v-if="tableData.list && tableData.list.length > 0">
      <Table
          ref="dataTableRef"
          :columns="columns"
          :showPagination="true"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="false"
          :options="tableOptions"
          @rowSelected="rowSelected"
      >
        <template #fileName="{ index, row }">
          <div
              class="file-item"
              @mouseenter="showOp(row)"
              @mouseleave="cancelShowOp(row)"
          >
            <template
                v-if="
                (row.fileType === 3 || row.fileType === 1) && row.status === 2
              "
            >
              <Icon :cover="row.fileCover" :width="32"></Icon>
            </template>
            <template v-else>
              <Icon v-if="row.folderType === 0" :fileType="row.fileType"></Icon>
              <Icon v-if="row.folderType === 1" :fileType="0"></Icon>
            </template>
            <span class="file-name" v-if="!row.showEdit" :title="row.fileName">
              <span @click="preview(row)">{{ row.fileName }}</span>
              <span v-if="row.status === 0" class="transfer-status"
              >转码中</span
              >
              <span
                  v-if="row.status === 1"
                  class="transfer-status transfer-fail"
              >转码失败</span
              >
            </span>
            <div class="edit-panel" v-if="row.showEdit">
              <el-input
                  v-model.trim="row.fileNameReal"
                  ref="editNameRef"
                  :maxLength="190"
                  @keyup.enter="saveNameEdit(index)"
              >
                <template #suffix>{{ row.fileSuffix }}</template>
              </el-input>
              <span
                  :class="[
                  'iconfont icon-right1',
                  row.fileNameReal ? '' : 'not-allow',
                ]"
                  @click="saveNameEdit(index)"
              ></span>
              <span
                  class="iconfont icon-error"
                  @click="cancelNameEdit(index)"
              ></span>
            </div>
            <span class="op">
              <template v-if="row.showOp && row.fileId && row.status === 2">
                <span class="iconfont icon-share1" @click="share(row)"
                >分享</span
                >
                <span
                    class="iconfont icon-download"
                    v-if="row.folderType === 0"
                    @click="download(row)"
                >下载</span
                >
                <span class="iconfont icon-del" @click="delFile(row)"
                >删除</span
                >
                <span class="iconfont icon-edit" @click="editFileName(index)"
                >重命名</span
                >
                <span class="iconfont icon-move" @click="moveFolder(row)">移动</span>
              </template>
            </span>
          </div>
        </template>
        <template #fileSize="{ index, row }">
          <span v-if="row.fileSize">
            {{ proxy.Utils.size2Str(row.fileSize) }}
          </span>
        </template>
      </Table>
    </div>
    <div class="no-data" v-else>
      <div class="no-data-inner">
        <Icon iconName="no_data" :width="120" fit="fill"></Icon>
        <div class="tips">当前目录为空，上次你的第一个文件吧</div>
        <div class="op-list">
          <el-upload
              :show-file-list="false"
              :with-credentials="true"
              :multiple="true"
              :http-request="addFile"
              :accept="fileAccept"
          >
            <div class="op-item">
              <Icon iconName="file" :width="60"></Icon>
              <div>上传文件</div>
            </div>
          </el-upload>
          <div class="op-item" v-if="category==='all'" @click="newFolder">
            <Icon iconName="folder" :width="60"></Icon>
            <div>新建目录</div>
          </div>
        </div>
      </div>
    </div>
    <ShareFile ref="shareRef"></ShareFile>
    <FolderSelect
        ref="folderSelectRef"
        @folderSelect="moveFolderDone"
    ></FolderSelect>
    <Preview ref="previewRef"></Preview>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {all} from "axios";
import ShareFile from "@/views/main/ShareFile.vue";
import FolderSelect from "@/components/FolderSelect.vue";
import Navigation from "@/components/Navigation.vue";
import CategoryInfo from "@/js/categoryInfo.js";
import Preview from "@/components/preview/Preview.vue";

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const userInfo = ref({});

const emit = defineEmits(["addFile"]);
//上传
const addFile = (fileData) => {
  emit("addFile", {file: fileData.file, filePid: currentFolder.value.fileId});
};

//添加文件回调
const reload = () => {
  showLoading.value = false
  loadDataList()
}
defineExpose({
  reload
})


const fileAccept = computed(() => {
  const categoryItem = CategoryInfo[category.value]
  return categoryItem ? categoryItem.accept : '*'
})

//当前目录
const currentFolder = ref({fileId: "0"});

const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
  },
  {
    label: "修改时间",
    prop: "lastUpdateTime",
    width: 200,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 200,
  },
];
//搜索
const search = () => {
  showLoading.value = true
  loadDataList()
  fileNameFuzzy.value = ''
}
const tableData = ref({});
const tableOptions = ref({
  extHeight: 50,
  selectType: "checkbox",
});
const fileNameFuzzy = ref();
const category = ref();
const showLoading = ref(true);
//获取文件
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    filePid: currentFolder.value.fileId,
    category: category.value,
  };
  if (params.category !== "all") {
    delete params.filePid;
  }
  let result = await proxy.Request({
    url: proxy.Api.loadFileList,
    showLoading: showLoading.value,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = {
    list: result.data,
    pageNo: result.pageNo,
    pageSize: result.pageSize,
    total: result.total,
  };
};

//展示按钮
const showOp = (row) => {
  tableData.value.list.forEach((element) => {
    element.showOp = false;
  });
  row.showOp = true;
};

const cancelShowOp = (row) => {
  row.showOp = false;
};

//新建文件夹
const editing = ref(false);
const editNameRef = ref();
const newFolder = () => {
  if (editing.value) {
    return;
  }
  tableData.value.list.forEach((element) => {
    element.showEdit = false;
  });
  editing.value = true;
  tableData.value.list.unshift({
    showEdit: true,
    fileType: 0,
    fileId: "",
    filePid: currentFolder.value.fileId,
  });
  nextTick(() => {
    editNameRef.value.focus();
  });
};

//取消新建文件夹
const cancelNameEdit = (index) => {
  const fileData = tableData.value.list[index];
  if (fileData.fileId) {
    fileData.showEdit = false;
  } else {
    tableData.value.list.splice(index, 1);
  }
  editing.value = false;
};

//保存新建文件夹
const saveNameEdit = async (index) => {
  const {fileId, filePid, fileNameReal} = tableData.value.list[index];
  if (fileNameReal === "" || fileNameReal.indexOf("/") !== -1) {
    proxy.Message.error("文件名不能位空，也不能含有/");
    return;
  }
  let url = proxy.Api.rename;
  if (fileId === "") {
    url = proxy.Api.newFolder;
  }
  let result = await proxy.Request({
    url: url,
    params: {
      fileId: fileId,
      filePid: filePid,
      fileName: fileNameReal,
    },
  });
  if (!result) {
    return;
  }
  tableData.value.list[index] = result.data;
  editing.value = false;
};

//重命名
const editFileName = (index) => {
  //如果正在新建文件夹，点击重命名时，将新建文件夹删除
  if (tableData.value.list[0].fileId === "") {
    tableData.value.list.splice(0, 1);
    index = index - 1;
  }
  tableData.value.list.forEach((element) => {
    element.showEdit = false;
  });
  let currentData = tableData.value.list[index];
  currentData.showEdit = true;

  //编辑文件
  if (currentData.folderType === 0) {
    currentData.fileNameReal = currentData.fileName.substring(
        0,
        currentData.fileName.indexOf(".")
    );
    currentData.fileSuffix = currentData.fileName.substring(
        currentData.fileName.indexOf(".")
    );
  } else {
    currentData.fileNameReal = currentData.fileName;
    currentData.fileSuffix = "";
  }
  editing.value = true;
  nextTick(() => {
    editNameRef.value.focus();
  });
};

//多选
const selectFileIdList = ref([]);
const rowSelected = (rows) => {
  selectFileIdList.value = [];
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId);
  });
};

//删除
const delFile = async (row) => {
  proxy.Confirm({
    message: `你确定要删除${row.fileName}吗?删除的文件可在10天内通过回收站还原`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.remove2Rec,
        params: {
          fileIds: row.fileId,
        },
      });
      if (!result) {
        return;
      }
      loadDataList();
    },
  });
};

//批量删除
const delFileBatch = () => {
  if (selectFileIdList.value.length === 0) {
    return;
  }
  proxy.Confirm({
    message: `你确定要删除这些文件吗?删除的文件可在10天内通过回收站还原`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.remove2Rec,
        params: {
          fileIds: selectFileIdList.value.join(","),
        },
      });
      if (!result) {
        return;
      }
      loadDataList();
    },
  });
};

const api = {
  //创建下载链接
  createDownloadUrl: "/file/createDownloadUrl",
  //下载
  download: "/api/file/download",
}

//下载文件
const download = async (row) => {
  debugger
  let result = await proxy.Request({
    url: api.createDownloadUrl + "/" + row.fileId,
  });
  if (!result) {
    return;
  }
  window.location.href = api.download + "/" + result.data;
};
const showType = ref(0)
const shareRef = ref();
//分享
const share = (row) => {
  shareRef.value.show(row);
};

//批量移动
const folderSelectRef = ref();
const currentMoveFile = ref({});

//单个移动
const moveFolder = (data) => {
  currentMoveFile.value = data;
  folderSelectRef.value.showFolderDialog(currentFolder.value.fileId);
};
const moveFolderBatch = () => {
  currentMoveFile.value = {};
  folderSelectRef.value.showFolderDialog(currentFolder.value.fileId);
};

//确定选择目录
const moveFolderDone = async (folderId) => {
  if (currentFolder.value.fileId === folderId) {
    proxy.Message.warning("文件正在当前目录，无需移动");
    return;
  }
  let fileIdsArray = [];
  if (currentMoveFile.value.fileId) {
    fileIdsArray.push(currentMoveFile.value.fileId);
  } else {
    fileIdsArray = fileIdsArray.concat(selectFileIdList.value);
  }
  let result = await proxy.Request({
    url: proxy.Api.changeFileFolder,
    params: {
      fileIds: fileIdsArray.join(","),
      filePid: folderId,
    },
  });
  if (!result) {
    return;
  }
  folderSelectRef.value.close();
  loadDataList();
};

const navigationRef = ref();
const previewRef = ref()
//预览
const preview = (data) => {
  //目录
  if (data.folderType === 1) {
    navigationRef.value.openFolder(data);
    return
  }
  //文件
  if (data.status !== 2) {
    proxy.Message.warning('文件正在转码中，无法浏览')
    return;
  }
  previewRef.value.showPreview(data, 0)
};

const navChange = (data) => {
  const {categoryId, curFolder} = data;
  currentFolder.value = curFolder;
  category.value = categoryId;
  loadDataList();
};
</script>

<style scoped>
@import "@/assets/file.list.scss";
</style>