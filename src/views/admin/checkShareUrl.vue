<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="search-panel">
          <el-input clearable placeholder="请输入文件名搜索" v-model="fileNameFuzzy" @keyup.enter="search">
            <template #suffix>
              <i class="iconfont icon-search" @click="search"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="loadDataList"></div>
        <el-button type="danger" :style="{'margin-left':'10px'}" :disabled="selectFileIdList.length===0"
                   @click="delFileBatch">
          <span class="iconfont icon-del">
            批量删除
          </span>
        </el-button>
      </div>
      <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
    </div>
    <div class="file-list">
      <Table
          ref="dataTableRef"
          :columns="columns"
          :showPagination="true"
          :dataSource="tableData"
          :fetch="loadAllFileList"
          :initFetch="true"
          :options="tableOptions"
          @rowSelected="rowSelected"
      >
        <template #fileName="{index,row}">
          <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
            <template v-if="(row.fileType === 3 || row.fileType === 1) && row.status === 2">
              <Icon :cover="row.fileCover" :width="32"></Icon>
            </template>
            <template v-else>
              <Icon v-if="row.folderType === 0" :fileType="row.fileType"></Icon>
              <Icon v-if="row.folderType === 1" :fileType="0"></Icon>
            </template>
            <span class="file-name" v-if="!row.showEdit" :title="row.fileName">
              <span>{{ row.fileName }}</span>
              <span v-if="row.status === 0" class="transfer-status">转码中</span>
              <span v-if="row.status === 1" class="transfer-status transfer-fail">转码失败</span>
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
              <span :class="['iconfont icon-right1',row.fileNameReal?'':'not-allow']"
                    @click="saveNameEdit(index)"></span>
              <span class="iconfont icon-error" @click="cancelNameEdit(index)"></span>
            </div>
            <span class="op">
                <template v-if="row.showOp && row.fileId && row.status===2">
                  <span class="iconfont icon-download" v-if="row.folderType===0" @click="download(row)">下载</span>
                  <span class="iconfont icon-del" @click="delFile(row)">删除</span>
                </template>
              </span>
          </div>
        </template>
        <template #fileSize="{index,row}">
          <span v-if="row.fileSize">
            {{ proxy.Utils.size2Str(row.fileSize) }}
          </span>
        </template>
      </Table>
    </div>
    <Preview ref="previewRef"></Preview>
  </div>
</template>

<script setup>
import Preview from "@/components/Preview.vue";
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import Navigation from "@/components/Navigation.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const columns = [
  {
    label: '文件名',
    prop: 'fileName',
    scopedSlots: 'fileName'
  },
  {
    label: '发布人',
    prop: 'nickName',
    width: 250
  },
  {
    label: '修改时间',
    prop: 'lastUpdateTime',
    width: 200
  },
  {
    label: '大小',
    prop: 'fileSize',
    scopedSlots: 'fileSize',
    width: 200
  }
]

//搜索
const search = () => {
  showLoading.value = true
  loadDataList()
}

const tableData = ref({})
const tableOptions = ref({
  extHeight: 50,
  selectType: 'checkbox'
})


//多选
const selectFileIdList = ref([])
const rowSelected = (rows) => {
  selectFileIdList.value = []
  rows.forEach((item) => {
    selectFileIdList.value.push(item.userId + '_' + item.fileId)
  })
}

const fileNameFuzzy = ref()
const category = ref()
const showLoading = ref(true)
//获取文件
const loadAllFileList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    filePid: currentFolder.value.filePid
  }
  if (params.category !== 'all') {
    delete params.filePid
  }
  let result = await proxy.Request({
    url: proxy.Api.loadAllFileList,
    showLoading: showLoading.value,
    params: params
  })
  if (!result) {
    return;
  }
  tableData.value = {
    list: result.data,
    pageNo: result.pageNo,
    pageSize: result.pageSize,
    total: result.total
  }
}
loadAllFileList()

//预览
const navigationRef = ref()
const previewRef = ref()
const preview = (data) => {
  //目录
  if (data.folderType === 1) {
    navigationRef.value.openFolder(data)
    return
  }
  //文件
  if (data.status !== 2) {
    proxy.Message.warning('文件未完成转码，无法预览')
    return;
  }
  previewRef.value.showPreview(data, 1)
}


//目录
const currentFolder = ref({fileId: 0})
const navChange = (data) => {
  const {curFolder} = data
  currentFolder.value = curFolder
  showLoading.value = true
  loadDataList()
}


//展示按钮
const showOp = (row) => {
  tableData.value.list.forEach((element) => {
    element.showOp = false
  })
  row.showOp = true
}

const cancelShowOp = (row) => {
  row.showOp = false
}


//删除
const delFile = async (row) => {
  proxy.Confirm({
    message: "你确定要删除${row.fileName}吗?删除的文件可在10天内通过回收站还原",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delFile,
        params: {
          fileIdAndUserIds: selectFileIdList.value.join(',')
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
    },
  });
}

//批量删除
const delFileBatch = async () => {
  if (selectFileIdList.value.length === 0) {
    return
  }
  proxy.Confirm({
    message: "你确定要删除这些文件吗?删除的文件可在10天内通过回收站还原",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delFile,
        params: {
          fileIdAndUserIds: row.userId + '_' + row.fileId
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
    },
  });
}

//下载
const download = async (row) => {
  let result = await proxy.Request({
    url: proxy.Api.createDownloadUrl + '/' + row.userId + '/' + row.fileId,
  })
  if (!result) {
    return;
  }
  window.location.href = api.download + '/' + result.data
}
</script>

<style scoped lang="scss">
@use '@/assets/file.list.scss';

.search-panel {
  margin-left: 0 !important;
}

.file-list {
  margin-top: 10px;

  .file-item {
    .op {
      width: 120px;
    }
  }
}

</style>