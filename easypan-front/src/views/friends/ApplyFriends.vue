<template>
  <div>
    <div class="file-list">
      <Table
          ref="dataTableRef"
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="true"
          :options="tableOptions"
      >
        <template #avatar="{index,row}">
          <div class="avatar">
            <Avatar :userId="row.applyUserId" :avatar="userInfo.avatar" :timestamp="timestamp"
                    :width="46"></Avatar>
          </div>
        </template>
        <!-- 操作按钮 -->
        <template #op="{row}">
          <span
              size="small"
              class="a-link"
              @click="agreeAddFriend(row)"
          >
            同意
          </span>
          <span
              size="small"
              class="a-link"
              @click="rejectAddFriend(row)"
          >
            拒绝
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
console.log(userInfo)

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
    label: '申请信息',
    prop: 'applyInfo',
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

const searchUserId = ref("")
//获取列表
const loadDataList = async () => {
  let params = {
    searchUserId: searchUserId.value,
  }
  Object.assign(params, searchFormData.value)
  let result = await proxy.Request({
    url: proxy.Api.getApplyList,
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


const currentUser = ref(null)

// 显示添加对话框
const agreeAddFriend = (row) => {
  currentUser.value = row;
  proxy.Confirm({
    message: `同意添加${row.nickName}为好友`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.agreeOrReject,
        params: {
          applyId: row.applyId,
          opType: '同意',
          applyUserId: row.applyUserId
        }
      });
      if (!result) {
        return;
      }
      proxy.Message.success("已同意添加为好友");
      loadDataList()
    },
  });
};

const rejectAddFriend = (row) => {
  currentUser.value = row;
  proxy.Confirm({
    message: `拒绝添加${row.nickName}为好友`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.agreeOrReject,
        params: {
          applyId: row.applyId,
          opType: '拒绝',
          applyUserId: row.applyUserId
        }
      });
      if (!result) {
        return;
      }
      proxy.Message.success("已拒绝添加为好友");
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