<script lang="ts" setup name="amazonPriceRecordSA">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
// import editDialog from './component/editDialog.vue'
import { pageAmazonPriceRecordSA, deleteAmazonPriceRecordSA } from '/@/api/modular/main/amazonPagePriceRecord';

// const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<recoredParamsType>({});
const tableParams = ref({
  page: 1,
  pageSize: 50,
  total: 0,
});
// const editAmazonPriceRecordSATitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageAmazonPriceRecordSA(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 删除
const delAmazonPriceRecordSA = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteAmazonPriceRecordSA(row);
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
  <div class="amazonPriceRecordSA-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="ASIN">
          <el-input v-model="queryParams.asin" clearable="" placeholder="请输入ASIN" />

        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="queryParams.remark" clearable="" placeholder="请输入Remark" />

        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="queryParams.title" clearable="" placeholder="请输入Title" />

        </el-form-item>
        <el-form-item label="BuyBoxOwner">
          <el-input v-model="queryParams.buyBoxOwner" clearable="" placeholder="请输入BuyBoxOwner" />

        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询
            </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light"
        row-key="id" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="asin" label="ASIN" align="center" width="150" show-overflow-tooltip="" />
        <el-table-column prop="sku" label="Sku" align="center" width="150" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="Remark" align="center" width="150" show-overflow-tooltip="" />
        <el-table-column prop="title" label="Title" align="center" sortable width="150" show-overflow-tooltip="" />
        <el-table-column prop="isBuybox" label="IsBuybox" align="center" sortable width="150" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag v-if="scope.row.isBuybox"> 是 </el-tag>
            <el-tag type="danger" v-else=""> 否 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="buyBoxOwner" label="BuyBoxOwner" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="currency" label="Currency" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="buyboxPrice" label="BuyboxPrice" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="shippingValue" label="ShippingValue" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="shippingDesc" label="ShippingDesc" align="center" width="150" show-overflow-tooltip="" />
        <el-table-column prop="buyboxSum" label="BuyboxSum" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="salePrice" label="SalePrice" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="myShippingValue" label="MyShippingValue" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="myShippingDesc" label="MyShippingDesc" align="center" width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="myBuyboxSum" label="MyBuyboxSum" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="maxItemCost" label="MaxItemCost" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="minItemCost" label="MinItemCost" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="adjustedPercentage" label="AdjustedPercentage" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="adjustMoney" label="AdjustMoney" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="listPrice" label="ListPrice" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column prop="itemCost" label="ItemCost" align="center" sortable width="150"
          show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delAmazonPriceRecordSA(scope.row)">
              删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <!-- <editDialog ref="editDialogRef" :title="editAmazonPriceRecordSATitle" @reloadTable="handleQuery" /> -->
    </el-card>
  </div>
</template>
