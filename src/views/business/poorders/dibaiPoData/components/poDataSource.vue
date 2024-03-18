<script lang="ts" setup>
import {ref,watch} from 'vue'
import { poDataSourcePage } from '/@/api/modular/main/aSINBasicData.ts';

const props = defineProps(['po'])

const queryParam = ref({asin:'',po:props.po})
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const tableData = ref([])
const loading = ref(false)
// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await poDataSourcePage(Object.assign(queryParam.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
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
watch(()=>props.po,
(val)=>{
  queryParam.value.po = props.po
  handleQuery()
})
  handleQuery()
</script>
<template>
  <div>
    <el-card >
      <div class="table-page-search-wrapper">
        <el-form layout="inline">
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="ASIN">
                <el-input v-model="queryParam.asin" allow-clear placeholder="Please enter ASIN" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <el-button type="primary" @click="handleQuery">Search</el-button>
                <el-button style="margin-left: 8px" @click="() => { queryParam = {asin:'',po:''}; handleQuery(); }">Reset</el-button>
              </span>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card :bordered="false">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre"
        border="">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="po" label="PO" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="vendor" label="Vendor" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="shipToLocation" label="ShipToLocation" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="asin" label="ASIN" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="externalID" label="ExternalID" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="externalIdType" label="ExternalIdType" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="modelNumber" label="ModelNumber" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="title" label="Title" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="availability" label="Availability" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="windowType" label="WindowType" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="windowStart" label="WindowStart" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="windowEnd" label="WindowEnd" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="expectedDate" label="ExpectedDate" width="150" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="quantityRequested" width="170" label="QuantityRequested" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="expectedQuantity" width="170" label="ExpectedQuantity" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="unitCost" width="150" label="UnitCost(AED)" align="center" sortable show-overflow-tooltip="" />
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100]" small="" background="" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
</style>
