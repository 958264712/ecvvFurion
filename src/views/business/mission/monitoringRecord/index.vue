<script lang="ts" setup>
import { ref } from "vue";
import { pageMonitoringRecord, ListMonitoringRecord } from '/@/api/modular/main/missionControl';


const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const list = ref<any>([])
const name = ref<string>('')

// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageMonitoringRecord(Object.assign(queryParams.value, tableParams.value));
  var res1 = await ListMonitoringRecord()
  tableData.value = res.data.result?.items ?? [];
  list.value = res1.data.result ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
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
  <div class="monitoringRecord-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="任务名称">
          <el-select v-model="queryParams.missionId">
            <el-option v-for="item in list" :value="item.value" :label="item.label"></el-option>
          </el-select>
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
      <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="missionName" label="任务名称" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="requestTime" label="请求时间" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="requestResult" label="请求结果" align="center" show-overflow-tooltip="" />
        <el-table-column prop="responseResult" label="响应消息" align="center" show-overflow-tooltip="" />
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
    </el-card>
  </div>
</template>



