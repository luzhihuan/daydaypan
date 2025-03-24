<template>
  <div class="top">
    <el-button type="success" :disabled="selectIdList.length===0" @click="revertBatch">
      <span class="iconfont icon-revert"></span>
      还原
    </el-button>
    <el-button type="danger" :disabled="selectIdList.length===0" @click="delBatch">
      <span class="iconfont icon-del"></span>
      批量删除
    </el-button>
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
      <template #fileName="{ index, row ,role}">
        <div
            class="file-item"
            @mouseenter="showOp(row)"
            @mouseleave="cancelShowOp(row)"
        >
          <template
              v-if="
                row.fileType === 3 || row.fileType === 1
              "
          >
            <Icon :cover="row.fileCover" :width="32"></Icon>
          </template>
          <template v-else>
            <Icon v-if="row.folderType === 0" :fileType="row.fileType"></Icon>
            <Icon v-if="row.folderType === 1" :fileType="0"></Icon>
          </template>
          <span class="file-name" :title="row.fileName">{{
              row.fileName
            }}</span>
          <span class="op">
              <template v-if="row.showOp">
                <span class="iconfont icon-cancel" @click="revert(row)"
                >还原</span
                >
                <span class="iconfont icon-cancel" @click="delFile(row)"
                >删除</span
                >
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
    label: '删除时间',
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

//获取文件
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    filePid: 0,
  }
  let result = await proxy.Request({
    url: proxy.Api.loadRecycleList,
    params
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


//多选
const selectIdList = ref([])
const rowSelected = (rows) => {
  selectIdList.value = []
  rows.forEach((item) => {
    selectIdList.value.push(item.fileId)
  })
}

//恢复
const revert = (row) => {
  proxy.Confirm({
    message: `你确定要还原${row.fileName}吗？`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.recoverFile,
        params: {
          fileIds: row.fileId
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
    },
  });
}

const revertBatch = (row) => {
  proxy.Confirm({
    message: "你确定要还原这些文件吗",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.recoverFile,
        params: {
          fileIds: selectIdList.value.join(',')
        }
      });
      if (!result) {
        return;
      }
      proxy.Message.success('还原成功')
      loadDataList()
    },
  });
}

//删除文件
const emit = defineEmits(['reload'])
const delFile = (row ) => {
  proxy.Confirm({
    message: `你确定要删除${row.fileName}吗？`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delFile,
        params: {
          fileIds: row.fileId
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
      emit('reload')
    },
  });
}

const delBatch = (row) => {
  proxy.Confirm({
    message: "你确定要删除这些文件吗",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delFile,
        params: {
          fileIds: selectIdList.value.join(',')
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
      emit('reload')
    },
  });
}
</script>

<style scoped lang="scss">
@use "@/assets/file.list.scss";

.file-list {
  margin-top: 10px;

  .file-name {
    .op {
      width: 120px;
    }
  }
}
</style>