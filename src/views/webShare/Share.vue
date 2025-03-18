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
              <span class="nick-name">{{shareInfo.nickName}}</span>
              <span class="share-time">分享于：{{shareInfo.shareTime}}</span>
            </div>
            <div class="file-name">分享文件：{{shareInfo.fileName}}</div>
          </div>
        </div>
        <div class="share-op-btn">
          <el-button type="primary" v-if="shareInfo.currentUser">取消分享</el-button>
          <el-button type="primary" v-else>保存到我的网盘</el-button>
        </div>
      </div>
    </template>
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
                  <span class="iconfont icon-share1" @click="share(row)">分享</span>
                  <span class="iconfont icon-download" v-if="row.folderType===0" @click="download(row)">下载</span>
                  <span class="iconfont icon-del">删除</span>
                  <span class="iconfont icon-edit" @click="editFileName(index)">重命名</span>
                  <span class="iconfont icon-move">移动</span>
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
  </div>
  
  
</template>

<script setup>



import { ref, reactive, getCurrentInstance, nextTick } from "vue"
import Avatar from "@/components/Avatar.vue";
const { proxy } = getCurrentInstance();

const shareInfo = ref({
  userId:"U58474128947",
  avatar:"",
  nickName:"test",
  shareTime:"20:00",
  fileName:"test"
})

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


</script>

<style lang="scss" scoped>
@use "@/assets/file.list";
.header{
  width: 100%;
  position: fixed;
  background-color: #0c95f7;
  height: 50px;
  .header-content{
    width: 70%;
    margin: 0 auto;
    color: #fff;
    line-height: 50px;
    .logo{
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon-pan{
        font-size: 40px;
      }
      .name{
        font-weight: bold;
        margin-left: 5px;
        font-size: 25px;
      }
    }
  }
}

.share-body{
  width: 70%;
  margin: 0 auto;
  padding-top: 50px;
  .loading{
    height: calc(100vh / 2);
    width: 100%;
  }
  .share-panel{
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    .share-user-info{
      flex: 1;
      display: flex;
      align-items: center;
      .avatar{
        margin-right: 5px;
      }
      .share-info{
        .user-info{
          display: flex;
          align-items: center;
          .nick-name{
            font-size: 15px;
          }
          .share-time{
            margin-left: 20px;
            font-size: 12px;
          }
        }
        .file-name{
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }
  }
}

.file-list{
  margin-top: 10px;
  .file-item{
    .op{
      width: 170px;
    }
  }
}

</style>