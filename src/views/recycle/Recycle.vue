<template>
  <div class="top">

    <div class="top-op">
      <div class="btn">
      </div>
      <el-button type="danger" @click="delFileBatch">
        <span class="iconfont icon-del">彻底删除</span>
      </el-button>
      <el-button type="warning" @click="moveFolderBatch">
        <span class="iconfont icon-move">全部还原</span>
      </el-button>
      <div class="search-panel">
        <el-input clearable placeholder="请输入文件名搜索">
          <template #suffix>
            <i class="iconfont icon-search"></i>
          </template>
        </el-input>
      </div>
      <div class="iconfont icon-refresh"></div>
    </div>
  </div>
  <div class="file-list">
    <Table
        ref="dataTableRef"
        :columns="columns"
        :showPagination="true"
        :dataSource="tableData"
        :fetch="loadDataList"
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
                  <span class="iconfont icon-del">删除</span>
                  <span class="iconfont icon-move">还原</span>
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


const addFile = (fileData) => {
  emit('addFile', {file: fileData.file, filePid: currentFolder.value.fileId})
}
//当前目录
const currentFolder = ref({fileId: 0})

const columns = [
  {
    label: '文件名',
    prop: 'fileName',
    scopedSlots: 'fileName'
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

const tableData = ref({})
const tableOptions = ref({
  extHeight: 50,
  selectType: 'checkbox'
})
const fileNameFuzzy = ref()
const category = ref()

//获取文件
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    filePid: 0,
  }
  if (params.category !== 'all') {
    delete params.filePid
  }
  let result = await proxy.Request({
    url: proxy.Api.loadFileList,
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


//重命名
const editFileName = (index) => {
  //如果正在新建文件夹，点击重命名时，将新建文件夹删除
  if (tableData.value.list[0].fileId === '') {
    tableData.value.list.splice(0, 1)
    index = index - 1
  }
  tableData.value.list.forEach((element) => {
    element.showEdit = false
  })
  let currentData = tableData.value.list[index]
  currentData.showEdit = true

  //编辑文件
  if (currentData.folderType === 0) {
    currentData.fileNameReal = currentData.fileName.substring(0, currentData.fileName.indexOf('.'))
    currentData.fileSuffix = currentData.fileName.substring(currentData.fileName.indexOf('.'))
  } else {
    currentData.fileNameReal = currentData.fileName
    currentData.fileSuffix = ''
  }
  editing.value = true
  nextTick(() => {
    editNameRef.value.focus()
  })
}

//多选
const selectFileIdList = ref([])
const rowSelected = (rows) => {
  selectFileIdList.value = []
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId)
  })
}
</script>

<style scoped lang="scss">
@import "@/assets/file.list.scss";
</style>