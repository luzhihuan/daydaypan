<template>
  <div>
    <div class="top">
      <el-button type="primary" @click="cancelShareBatch">
        <span class="iconfont icon-cancel">取消分享</span>
      </el-button>
    </div>
    <div class="file-list">
      <Table
          ref="dataTableRef"
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="true"
          :options="tableOptions"
          @rowSelected="rowSelected"
      >
        <template #fileName="{index,row}">
          <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
            <template v-if="(row.fileType===3||row.fileType===1)&&row.status!==0">
              <Icon :cover="row.fileCover"></Icon>
            </template>
            <template v-else>
              <Icon v-if="row.folderType === 0" :fileType="row.fileType"></Icon>
              <Icon v-if="row.folderType === 1" :fileType="0"></Icon>
            </template>
            <span class="file-name" :title="row.fileName">{{ row.fileName }}</span>
            <span class="op">
              <template v-if="row.showOp">
                <span class="iconfont icon-link" @click="copy(row)">复制链接</span>
                <span class="iconfont icon-cancel" @click="cancelShow(row)">取消分享</span>
              </template>
            </span>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import Table from "@/components/Table.vue";
import Icon from "@/components/Icon.vue";
import useClipboard from 'vue-clipboard3'

const {toClipboard} = useClipboard()

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
    label: '分享时间',
    prop: 'shareTime',
    width: 200
  },
  {
    label: '失效时间',
    prop: 'expireTime',
    scopedSlots: 'expireTime',
    width: 200
  },
  {
    label: '浏览次数',
    prop: 'showCount',
    width: 200
  },
]

const tableData = ref([])
const tableOptions = {
  extHeight: 20,
  selectType: 'checkbox'
}


const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
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

const selectIdList = ref([])
const rowSelected = (rows) => {
  selectFileIdList.value = []
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId)
  })
}

const showOp = (row) => {
  tableData.value.list.forEach((item) => {
    item.showOp = false
  })
  row.showOp = true
}


//取消分享
const cancelShareList = ref([])
const cancelShareBatch = () => {
  if (selectIdList.value.length === 0) {
    return
  }
  cancelShareList.value = selectIdList.value
  cancelShareDown()
}
const cancelShareDown = () => {
  proxy.Confirm(`你确定要取消分享吗?`, async () => {
    let result = await proxy.Request({
      url: proxy.Api.cancelShare,
      params:{
        shareIds:cancelSha
      }

  })
    if (!result) {
      return;
    }
  })
}
const cancelShowOp = (row) => {
  row.showOp = false
}

const shareUrl = ref(document.location.origin + '/share/')
//复制链接
const copy = async (data) => {
  await toClipboard(`链接:${shareUrl.value}${data.shareId}  提取码:${data.code}`)
  proxy.Message.success('复制成功')
}

</script>

<style scoped lang="scss">
@import "@/assets/file.list.scss";

.file-list {
  margin-top: 10px;

  .file-item {
    .file-name {
      span {
        &:hover {
          color: #494944;
        }
      }
    }

    .op {
      width: 170px;
    }
  }
}
</style>