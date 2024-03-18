<script lang="ts" setup>
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from './component/editDialog.vue'
import { pageMissionControl, deleteMissionControl } from '/@/api/modular/main/missionControl';


const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<missionParamsType>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editMissionControlTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageMissionControl(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddMissionControl = () => {
  editMissionControlTitle.value = '添加任务监控表';
  editDialogRef.value.openDialog({});
};
const requestWay = ref('')
// 打开编辑页面
const openEditMissionControl = (row: any) => {
  editMissionControlTitle.value = '编辑任务监控表';

  editDialogRef.value.openDialog(row);
};

// 删除
const delMissionControl = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteMissionControl(row);
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
  <div class="missionControl-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="任务名称">
          <el-input v-model="queryParams.missionName" clearable="" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="Url地址">
          <el-input v-model="queryParams.requestUrl" clearable="" placeholder="请输入Url地址" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input-number v-model="queryParams.requestWay" clearable="" placeholder="请输入请求方式" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询
            </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery() }"> 重置 </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" icon="ele-Plus" @click="openAddMissionControl"> 新增任务列表
        </el-button>
      </div>
      <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="missionName" label="任务名称" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="requestUrl" label="Url地址" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="requestWay" label="请求方式" align="center" sortable show-overflow-tooltip="">
          <template #default=scope>
            {{ scope.row.requestWay === 1 ? 'Get' : 'Post' }}
          </template>
        </el-table-column>
        <el-table-column prop="requestParam" label="请求参数" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="requestFrequency" label="请求频率(分钟)" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="lastRequestTime" label="最后请求时间" align="center" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditMissionControl(scope.row)"> 编辑
            </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delMissionControl(scope.row)"> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editMissionControlTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>




