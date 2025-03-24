<template>
  <div>
    <div class="top">
      <el-button
          type="primary"
          @click="cancelShareBatch"
          :disabled="selectIdList.length === 0"
      >
        <span class="iconfont icon-cancel">取消分享</span>
      </el-button>
      <el-button
          type="success"
          @click="checkShareBatch"
          :disabled="selectIdList.length === 0"
      >
        <span class="iconfont icon-import">审核通过</span>
      </el-button>
    </div>
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
        <template #fileName="{ index, row ,role}">
          <div
              class="file-item"
              @mouseenter="showOp(row)"
              @mouseleave="cancelShowOp(row)"
          >
            <template
                v-if="
                row.fileType === 3 || row.fileType === 1
              "
            >
              <Icon :cover="row.fileCover" :width="32"></Icon>
            </template>
            <template v-else>
              <Icon v-if="row.folderType === '0'" :fileType="row.fileType"></Icon>
              <Icon v-if="row.folderType === '1'" :fileType="0"></Icon>
            </template>
            <span class="file-name" :title="row.fileName">{{
                row.fileName
              }}</span>
            <span class="op">
              <template v-if="row.showOp">
                <span class="iconfont icon-cancel" @click="cancelShare(row)"
                >取消分享</span
                >
                <span class="iconfont icon-link" @click="check(row)"
                >查看分享</span
                >
                <!--                <span v-if="userInfo.role === 3||userInfo.role === 4" class="iconfont icon-import"-->
                <!--                      @click="checkShare(row)"-->
                <!--                >审核通过</span-->
                <!--                >-->
              </template>
            </span>
          </div>
        </template>
        <template #expireTime="{index,row}">
          {{ row.validType === 3 ? '永久' : row.expireTime }}
        </template>
      </Table>
    </div>
    <ShareFile ref="shareRef"></ShareFile>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import Table from "@/components/Table.vue";
import Icon from "@/components/Icon.vue";
import useClipboard from "vue-clipboard3";
import message from "@/utils/Message";
import ShareFile from "@/views/main/ShareFile.vue";

const {toClipboard} = useClipboard();

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const userInfo = ref(proxy.VueCookies.get('userInfo'));
console.log(userInfo.value.role)

const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",

  },
  {
    label: "分享时间",
    prop: "shareTime",
    width: 200
  },
  {
    label: "失效时间",
    prop: "expireTime",
    scopedSlots: "expireTime",
    width: 200
  },
  {
    label: "浏览次数",
    prop: "showCount",
    width: 200
  },
];

const tableData = ref([]);
const tableOptions = {
  extHeight: 20,
  selectType: "checkbox",
};

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  if (params.category !== "all") {
    delete params.filePid;
  }
  let result = await proxy.Request({
    url: proxy.Api.loadShareList,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = {
    list: result.data,
    pageNo: result.pageNo,
    pageSize: result.pageSize,
    total: result.total,
  };
};

const selectIdList = ref([]);
const rowSelected = (rows) => {
  selectIdList.value = [];
  rows.forEach((item) => {
    selectIdList.value.push(item.fileId);
  });
};

const showOp = (row) => {
  tableData.value.list.forEach((item) => {
    item.showOp = false;
  });
  row.showOp = true;
};

//取消分享
const cancelShareIdList = ref([]);
const cancelShareBatch = () => {
  if (selectIdList.value.length === 0) {
    return;
  }
  cancelShareIdList.value = selectIdList.value;
  cancelShareDone();
};
const cancelShareDone = () => {
  proxy.Confirm({
    message: `你确定要取消分享吗?`,
    okfun: async () => {
      let result = await proxy.Request({
        url: proxy.Api.cancelShare,
        params: {
          shareIds: cancelShareIdList.value.join(","),
        },
      });
      if (!result) {
        return;
      }
      proxy.Message.success("取消分享成功");
      loadDataList();
    },
  });
};

const cancelShowOp = (row) => {
  row.showOp = false;
};

const cancelShare = (row) => {
  cancelShareIdList.value = [row.shareId];
  cancelShareDone();
};


//审核通过
const checkShare = async (row) => {
  let result = await proxy.Request({
    url: proxy.Api.checkShare,
    params: {
      shareIds: cancelShareIdList.value.join(","),
    }
  })
  if (!result) {
    return;
  }
  loadDataList()
}

const checkShareBatch = () => {
  if (selectIdList.value.length === 0) {
    return;
  }
  cancelShareIdList.value = selectIdList.value;
  checkShare();
}


const shareUrl = ref(document.location.origin + "/share/");
//查看
const shareRef = ref();
const showType = ref(0)
const isPublish = ref(0)
//分享
const check = (row) => {
  shareRef.value.show({
    showType: 1,
    isPublish: 0
  });
  console.log(showType.value)
};
</script>

<style scoped lang="scss">
@use "@/assets/file.list.scss";

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