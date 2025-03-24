<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="search-panel">
          <el-input clearable placeholder="请输入好友ID搜索" v-model="searchUserId" @keyup.enter="handleSearch">
            <template #suffix>
              <i class="iconfont icon-search" @click="handleSearch"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="loadDataList"></div>
      </div>
    </div>
    <div class="file-list">
      <Table ref="dataTableRef" :columns="columns" :dataSource="tableData" :fetch="loadDataList" :initFetch="true"
             :options="tableOptions" @rowSelected="rowSelected">
        <template #avatar="{ index, row }">
          <div class="avatar">
            <Avatar :userId="tableData.list[0].userId" :avatar="userInfo.avatar" :timestamp="timestamp"
                    :width="46"></Avatar>
          </div>
        </template>
        <!-- 操作按钮 -->
        <template #share="{ index, row }">
          <span class="a-link" @click="shareFile(row)">分享文件</span>
        </template>

        <template #op="{ index, row }">
          <span class="a-link" @click="delFriend(row)">删除好友</span>
        </template>
      </Table>
    </div>
    <!-- <ShareFile ref="shareFileRef"></ShareFile> -->
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="500px"
            :showCancel="false" @close="dialogConfig.show = false">
      <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
        <!--input输入-->
        <el-form-item label="好友昵称">
          {{ currentShareFriend?.nickName || '-' }}
        </el-form-item>


        <!-- 文件名称输入 -->
        <el-form-item label="文件名称">
          <el-input clearable placeholder="请输入分享文件名称" v-model="formData.fileName"></el-input>
        </el-form-item>


        <!-- 分享链接 -->
        <el-form-item label="分享链接">
          <div class="link-container">
            <el-input v-model="formData.fileName" placeholder="请输入分享链接和验证码">
            </el-input>
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import Table from "@/components/Table.vue";
import Avatar from "@/components/Avatar.vue";
import ShareFile from "@/views/main/ShareFile.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const searchUserId = ref("")

const columns = [
  {
    label: '头像',
    prop: 'avatar',
    scopedSlots: 'avatar'
  },
  {
    label: '昵称',
    prop: 'nickName',
  },
  {
    label: '分享',
    prop: 'share',
    scopedSlots: 'share',
  },
  {
    label: '操作',
    prop: 'op',
    scopedSlots: 'op',
  },
]

const searchFormData = ref({})
const tableData = ref({})
const tableOptions = ref({
  extHeight: 50,
})

//获取列表
const loadDataList = async () => {
  let params = {
    searchUserId: searchUserId.value,
  }
  Object.assign(params, searchFormData.value)
  let result = await proxy.Request({
    url: proxy.Api.getUserContact,
    params,
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
//搜索好友
const handleSearch = () => {
  loadDataList()
}

const delFriend = async (row) => {
  proxy.Confirm({
    message: `你确定要删除${row.nickName}吗?`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delOrAddUserContact,
        params: {
          nickName: row.nickName,
          opType: '删除',
          contactId: row.userId
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
    },
  });
};

const currentUser = ref(null)
const shareFileRef = ref()
const currentShareFriend = ref(null) // 当前分享的好友
const shareFile = (row) => {
  currentShareFriend.value = row
  dialogConfig.value.show = true
  formData.value = ''
}
const dialogConfig = ref({
  show: false,
  title: '分享文件给好友',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        submitForm()
      }
    }
  ]
})

const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
  })
  let result = await proxy.Request({
    url: proxy.Api.sendShareFile,
    params: {
      nickName: currentShareFriend.value.nickName,
      fileName: formData.value.fileName,
      fileUrl: formData.value.fileUrl
    }
  })
  if (!result) {
    return
  }
  dialogConfig.value.show = false
  proxy.Message.success('文件分享成功')
}

</script>

<style scoped lang="scss">
@use '@/assets/file.list.scss';

.top-panel {
  margin-top: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100px;
  }
}
</style>
