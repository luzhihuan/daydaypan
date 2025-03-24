<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="search-panel">
          <el-input
              clearable
              placeholder="请输入用户ID搜索"
              v-model="searchUserId"
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
          :initFetch="true"
          :options="tableOptions"
          @rowSelected="rowSelected">
        <template #avatar="{index,row}">
          <div class="avatar">
            <Avatar :userId="tableData.list[0].userId" :avatar="userInfo.avatar" :timestamp="timestamp" :width="46"></Avatar>
          </div>
        </template>
        <!-- 最后登录时间 -->
        <template #lastLoginTime="{row}">
          {{ formatTime(row.lastLoginTime) }}
        </template>
        <!-- 操作按钮 -->
        <template #op="{row}">
          <span
              size="small"
              class="a-link"
              @click="handleAddFriend(row)"
          >
            {{ tableData.list[0].userId===userInfo.userId?'':'添加为好友' }}
          </span>
        </template>
      </Table>
    </div>
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
const userInfo = ref(
    proxy.VueCookies.get('userInfo')
)

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
    label: '最后登录时间',
    prop: 'lastUpdateTime',
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
    url: proxy.Api.searchUser,
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

const currentUser = ref(null)

// 显示添加对话框
const handleAddFriend = (row) => {
  currentUser.value = row;
  proxy.Confirm({
    message: `你确定要添加${row.nickName}为好友吗`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delOrAddUserContact,
        params: {
          contactId: currentUser.value.userId,
          opType:'添加',
        }
      });
      if (!result) {
        return;
      }
      proxy.Message.success("好友请求已发送");
      loadDataList()
    },
  });
};

// 时间格式化
const formatTime = (timestamp) => {
  if (!timestamp) return '-';
  return proxy.$dayjs(timestamp).format('YYYY-MM-DD HH:mm');
};


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