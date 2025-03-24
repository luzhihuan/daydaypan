<template>
  <div class="share">
    <div class="header">
      <div class="header-content">
        <div class="logo" @click="jump">
          <span class="iconfont icon-pan"></span>
          <span class="name">天天云盘</span>
        </div>
      </div>
    </div>
  </div>
  <div class="share-body">
    <template v-if="Object.keys(shareInfo).length === 0">
      <div class="loading" v-loading="Object.keys(shareInfo).length === 0"></div>
    </template>
    <template v-else>
      <div class="share-panel">
        <div class="share-user-info">
          <div class="avatar">
            <Avatar
                :userId="shareInfo.userId"
                :avatar="shareInfo.avatar"
                :width="50"
            ></Avatar>
          </div>
          <div class="share-info">
            <div class="user-info">
              <span class="nick-name">{{ shareInfo.nickName }}</span>
              <span class="share-time">分享于：{{ shareInfo.shareTime }}</span>
            </div>
            <div class="file-name">分享文件：{{ shareInfo.fileName }}</div>
          </div>
        </div>
        <div class="share-op-btn">
          <el-button type="primary" v-if="shareInfo.currentUser" @click="cancelShare">
            <span class="iconfont icon-cancel"></span>取消分享
          </el-button>
          <el-button type="primary" v-else @click="save2MyPan" :disabled="selectIdList.length===0">
            <span class="iconfont icon-import"></span>
            保存到我的网盘
          </el-button>
        </div>
      </div>
      <Navigation ref="navigationRef" @navChange="navChange" :shareId="shareId"></Navigation>
    </template>
    <div class="file-list">
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
        <template #fileName="{index,row}">
          <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
            <template v-if="(row.fileType === 3 || row.fileType === 1) && row.status === 2">
              <Icon :cover="row.fileCover" :width="32"></Icon>
            </template>
            <template v-else>
              <Icon v-if="row.folderType === 0" :fileType="row.fileType"></Icon>
              <Icon v-if="row.folderType === 1" :fileType="0"></Icon>
            </template>
            <span class="file-name" :title="row.fileName">
              <span @click="preview(row)">{{ row.fileName }}</span>
            </span>
            <!--            <div class="edit-panel" v-if="row.showEdit">-->
            <!--              <el-input-->
            <!--                  v-model.trim="row.fileNameReal"-->
            <!--                  ref="editNameRef"-->
            <!--                  :maxLength="190"-->
            <!--                  @keyup.enter="saveNameEdit(index)"-->
            <!--              >-->
            <!--                <template #suffix>{{ row.fileSuffix }}</template>-->
            <!--              </el-input>-->
            <!--              <span :class="['iconfont icon-right1',row.fileNameReal?'':'not-allow']"-->
            <!--                    @click="saveNameEdit(index)"></span>-->
            <!--              <span class="iconfont icon-error" @click="cancelNameEdit(index)"></span>-->
            <!--            </div>-->

            <span class="op">
                <template>
                  <span class="iconfont icon-download" v-if="row.folderType===0" @click="download(row)">下载</span>
                  <span class="iconfont icon-import" v-if="row.showOp&& !shareInfo.currentUser"
                        @click="save2MyPanSingle(row)">保存到我的网盘</span>
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
    <FolderSelect ref="folderSelectRef" @folderSelect="save2MyPanDone"></FolderSelect>
    <Preview ref="previewRef"></Preview>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick} from "vue"
import Avatar from "@/components/Avatar.vue";

const {proxy} = getCurrentInstance();
import {useRouter, useRoute} from "vue-router";
import Navigation from "@/components/Navigation.vue";
import FolderSelect from "@/components/FolderSelect.vue";
import Preview from "@/components/preview/Preview.vue";

const router = useRouter()
const route = useRoute()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})
const shareInfo = ref({})
const shareId = route.params.shareId

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
  extHeight: 80,
  selectType: 'checkbox'
})
const fileNameFuzzy = ref()
const category = ref()

//获取文件
const getShareInfo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getShareLoginInfo,
    showLoading: false,
    params: {
      shareId
    }
  })
  if (!result) {
    return;
  }
  if (result.data === null) {
    router.push(`/shareCheck/${shareId}`)
    return
  }
  shareInfo.value = result.data
}
getShareInfo()

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    shareId: shareId,
    filePid: currentFolder.value.fileId
  }
  let result = await proxy.Request({
    url: proxy.Api.loadShareFileList,
    params:params
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
const currentFolder = ref({fileId: '0'})

const navChange = (data) => {
  const {curFolder} = data
  currentFolder.value = curFolder
  loadDataList()
}

//预览
const navigationRef = ref()
const previewRef = ref()
const preview = (data) => {
  //目录
  if (data.folderType === 1) {
    navigationRef.value.openFolder(data)
    return
  }
  data.shareId = shareId
  previewRef.value.showPreview(data, 2)
}

//下载
const download = async (row) => {
  let result = await proxy.Request({
    url: proxy.Api.createShareDownloadUrl + '/' + shareId + '/' + row.fileId,
  })
  if (!result) {
    return;
  }
  window.location.href = proxy.Api.shareDownload + '/' + result.data
}

//保存到我的网盘
const folderSelectRef = ref()
const save2MyPanFileIdArray = []
const save2MyPan = () => {
  if (selectIdList.value.length === 0) {
    return
  }
  if (!proxy.VueCookies.get('userInfo')) {
    router.push('/login?redirectUrl=' + route.path)
    return;
  }
  save2MyPanFileIdArray.value = selectIdList.value
  folderSelectRef.value.showFolderDialog()
}

const save2MyPanSingle = (row) => {
  if (!proxy.VueCookies.get('userInfo')) {
    router.push('/login?redirectUrl=' + route.path)
    return;
  }
  save2MyPanFileIdArray.value = [row.fileId]
  folderSelectRef.value.showFolderDialog()
}
const save2MyPanDone = async (folderId) => {
  let result = await proxy.Request({
    url: proxy.Api.saveShare,
    params: {
      shareId: shareId,
      shareFileIds: save2MyPanFileIdArray.value.join(','),
      myFolderId: folderId
    }
  })
  if (!result) {
    return;
  }
  loadDataList()
  proxy.Message.success('保存成功')
  folderSelectRef.value.close()
}

//取消分享
const cancelShare = () => {
  proxy.Confirm({
    message: "你确定要取消分享吗？",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.cancelShareShare,
        params: {
          shareId: shareId
        }
      });
      if (!result) {
        return;
      }
      proxy.Message.success('取消分享成功')
      router.push('/')
    },
  });
}

const jump = ()=>{
  router.push('/')
}
</script>

<style lang="scss" scoped>
@use "@/assets/file.list.scss";

.header {
  width: 100%;
  position: fixed;
  background-color: #0c95f7;
  height: 50px;

  .header-content {
    width: 70%;
    margin: 0 auto;
    color: #fff;
    line-height: 50px;

    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;

      .icon-pan {
        font-size: 40px;
      }

      .name {
        font-weight: bold;
        margin-left: 5px;
        font-size: 25px;
      }
    }
  }
}

.share-body {
  width: 70%;
  margin: 0 auto;
  padding-top: 50px;

  .loading {
    height: calc(100vh / 2);
    width: 100%;
  }

  .share-panel {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;

    .share-user-info {
      flex: 1;
      display: flex;
      align-items: center;

      .avatar {
        margin-right: 5px;
      }

      .share-info {
        .user-info {
          display: flex;
          align-items: center;

          .nick-name {
            font-size: 15px;
          }

          .share-time {
            margin-left: 20px;
            font-size: 12px;
          }
        }

        .file-name {
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }
  }
}

.file-list {
  margin-top: 10px;

  .file-item {
    .op {
      width: 170px;
    }
  }
}

</style>