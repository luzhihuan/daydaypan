<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="search-panel">
          <el-input
              clearable
              placeholder="请输入用户昵称或邮箱搜索"
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
          >
            <template #suffix>
              <i class="iconfont icon-search" @click="handleSearch"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="loadDataList"></div>
      </div>
    </div>
    <div class="file-list">
      <Table
          ref="dataTableRef"
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="true"
          :options="tableOptions"
          @rowSelected="rowSelected">
        <template #avatar="{index,row}">
          <div class="avatar">
            <!--            <Avatar :userId="userInfo.userId" :avatar="userInfo.avatar" :timestamp="timestamp" :width="46"></Avatar>-->
          </div>
        </template>
        <!-- 操作按钮 -->
        <template #action="{ row }">
          <el-button
              size="small"
              :type="row.status === 0 ? 'primary' : 'info'"
              :disabled="row.status !== 0"
              @click="handleAddFriend(row)"
          >
            {{ getButtonText(row.status) }}
          </el-button>
        </template>
      </Table>
    </div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="400px"
        :showCancel="false"
        @close="dialogConfig.show = false"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
          @submit.prevent>
        <el-form-item label="昵称">
          {{ formData.nickName }}
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

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const userInfo = ref({})

const searchKeyword = ref("")

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
    label: '邮箱',
    prop: 'email',
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
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
    keyword: searchKeyword.value,
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  }
  Object.assign(params, searchFormData.value)
  let result = await proxy.Request({
    url: proxy.Api.searchFriends,
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

// 状态显示配置
const statusConfig = {
  0: {text: "可添加", type: "success", btn: "添加好友"},
  1: {text: "已发送", type: "warning", btn: "已申请"},
  2: {text: "已好友", type: "info", btn: "已添加"}
};

// 修改按钮文本获取方式
const getButtonText = (status) => {
  return statusConfig[status]?.btn || "添加好友";
};

const currentUser = ref(null)


const handleAddFriend = async () => {
  if (!currentUser.value) return;

  const result = await proxy.Request({
    url: proxy.Api.sendFriendRequest,
    params: {
      targetUserId: currentUser.value.userId
    }
  });

  if (result) {
    proxy.Message.success("好友请求已发送");
    dialogConfig.value.show = false;
    loadDataList()
  }
};


const dialogConfig = ref({
  show: false,
  title: '确认添加好友',
  buttons: [
    {
      text: '确认',
      type: 'primary',
      click: (e) => handleAddFriend()
    }
  ]
});

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