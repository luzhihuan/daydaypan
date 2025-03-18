<template>
  <div>
    <div class="top-panel">
      <el-form
          :model="searchFormData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
          @submit.prevent>
        <el-row>
          <el-col :span="4">
            <el-form-item label="用户昵称">
              <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchFormData.nickNameFuzzy"
                  @keyup="loadDataList">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-select clearable placeholder="请选择状态" v-model="searchFormData.status">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{'padding-left':'10px'}">
            <el-button type="primary" @click="loadDataList">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
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
        <template #space="{index,row}">
          {{ proxy.Utils.size2Str(row.useSpace) }}/{{ proxy.Utils.size2Str(row.totalSpace) }}
        </template>
        <template #status="{index,row}">
          <span v-if="row.status === 1" style="color:#529b2e">启用</span>
          <span v-if="row.status === 0" style="color:#f56c62">禁用</span>
        </template>

        <template #op="{index,row}">
          <span class="a-link" @click="updateSpace(row)">分配空间</span>
          <el-divider direction="vertical"></el-divider>
          <span class="a-link" @click="updateUserStatus(row)">
            {{ row.status === 0 ? '启用' : '禁用' }}
          </span>
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
        <el-form-item label="空间大小" prop="changeSpace">
          <!--        input输入-->
          <el-input
              clearable
              placeholder="请输入空间大小"
              v-model.trim="formData.changeSpace">
            <template #suffix>MB</template>
          </el-input>
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
    label: '空间使用',
    prop: 'space',
    scopedSlots: 'space',
  },
  {
    label: '加入时间',
    prop: 'joinTime',
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
  },
  {
    label: '状态',
    prop: 'status',
    scopedSlots: 'status',
    width: 80
  },
  {
    label: '操作',
    prop: 'op',
    scopedSlots: 'op',
    width: 150
  },
]

const searchFormData = ref({})
const tableData = ref({})
const tableOptions = ref({
  extHeight: 50,
})

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  }
  Object.assign(params, searchFormData.value)
  let result = await proxy.Request({
    url: proxy.Api.loadUserList,
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

//修改状态
const updateUserStatus = (row) => {
  proxy.Confirm({
    message: "你确定要${row.status===0?'启用':'禁用'}",
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadUserList,
        params: {
          userId: row.userId,
          status: row.status === 0 ? 1 : 0
        }
      });
      if (!result) {
        return;
      }
      loadDataList()
    },
  });
}

const dialogConfig = ref({
  show: false,
  title: '修改空间大小',
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

const rules = {
  changeSpace: [{required: true, message: '请输入空间大小'}]
}

const updateSpace = (row) => {
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
  })
}

const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: proxy.Api.updateUserSpace,
      params
    })
    if (!result) {
      return;
    }
    dialogConfig.value.show = false
    proxy.Message.success('操作成功')
    loadDataList()
  })
}
</script>

<style scoped lang="scss">
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