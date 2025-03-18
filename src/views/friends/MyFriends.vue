<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="search-panel">
          <el-input
              clearable
              placeholder="请输入好友昵称或邮箱搜索"
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
        <template #action="{index, row }">
          <span class="a-link" @click="delFriend(row)">删除好友</span>
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
    label: '分享',
    prop: 'share',
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
    url: proxy.Api.myFriends,
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
    message: "你确定要删除好友吗?'}",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.delFriend,
        params: {
          userId: row.userId,
          userName:row.userName
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
    },
  });
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