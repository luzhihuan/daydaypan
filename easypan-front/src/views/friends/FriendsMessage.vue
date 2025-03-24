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
              <Avatar :userId="tableData.list[0].userId" :avatar="userInfo.avatar" :timestamp="timestamp"
                      :width="46"></Avatar>
            </div>
          </template>
          <!-- 操作按钮 -->
          <template #op="{row}">
            <span
                size="small"
                class="a-link"
                @click="copy(row)"
            >
              复制
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
  import useClipboard from "vue-clipboard3";
  const {toClipboard} = useClipboard();
  
  const router = useRouter()
  const route = useRoute()
  const {proxy} = getCurrentInstance()
  const formData = ref({})
  const formDataRef = ref()
  const userInfo = ref(
      proxy.VueCookies.get('userInfo')
  )
  
  
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
      label: '好友消息',
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
  
  
  const currentUser = ref(null)
  const copy = async(row)=>{
    const copyContent = `${row.applyInfo}`
    await navigator.clipboard.writeText(copyContent)
    // 显示成功提示
    proxy.Message.success('好友信息已复制到剪贴板')
  }
  
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