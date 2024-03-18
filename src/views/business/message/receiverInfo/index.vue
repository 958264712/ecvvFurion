<script lang="ts" setup>
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from './component/editDialog.vue'
import { pageReceiverInfo, deleteReceiverInfo } from '/@/api/modular/main/messageConfig';


const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editReceiverInfoTitle = ref("");
const queryParams = ref<receiveParamsType>({});

// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageReceiverInfo(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddReceiverInfo = () => {
  editReceiverInfoTitle.value = '添加接收人信息';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditReceiverInfo = (row: any) => {
  editReceiverInfoTitle.value = '编辑接收人信息';
  editDialogRef.value.openDialog(row);
};

// 删除
const delReceiverInfo = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteReceiverInfo(row);
      handleQuery();
      ElMessage.success("删除成功");
    })
    .catch(() => { });
};

// 改变页面容量
const handleSizeChange = (val: number) => {
  tableParams.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
  tableParams.value.page = val;
  handleQuery();
};



handleQuery();
</script>
<template>
  <div class="receiverInfo-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="UserName">
          <el-input v-model="queryParams.userName" clearable="" placeholder="请输入UserName" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="queryParams.phone" clearable="" placeholder="请输入Phone" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="queryParams.email" clearable="" placeholder="请输入Email" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" icon="ele-Plus" @click="openAddReceiverInfo"> 新增接收人信息 </el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" size="lagre" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="userName" label="UserName" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="phone" label="Phone" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="dingDingID" label="DingDingID" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="email" label="Email" align="center" sortable show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditReceiverInfo(scope.row)"> 编辑
            </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delReceiverInfo(scope.row)"> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editReceiverInfoTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>




