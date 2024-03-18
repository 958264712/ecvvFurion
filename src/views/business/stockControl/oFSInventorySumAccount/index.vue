
<script lang="ts" setup >
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import editDialog from './component/editDialog.vue'
import { pageOFSInventorySumAccount, deleteOFSInventorySumAccount } from '/@/api/modular/main/oFSInventorySumAccount';


const editDialogRef = ref();
const loading = ref(false);
const advanced = ref(false);
const tableData = ref<any>([]);
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editOFSInventorySumAccountTitle = ref("");
const queryParams = ref<sumAccountParamsType>({});


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageOFSInventorySumAccount(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddOFSInventorySumAccount = () => {
  editOFSInventorySumAccountTitle.value = '添加库存汇总账';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditOFSInventorySumAccount = (row: any) => {
  editOFSInventorySumAccountTitle.value = '编辑库存汇总账';
  editDialogRef.value.openDialog(row);
};

// 删除
const delOFSInventorySumAccount = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteOFSInventorySumAccount(row);
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
  <div class="oFSInventorySumAccount-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="仓库名称">
          <el-input v-model="queryParams.warehouseName" clearable="" placeholder="请输入仓库名称" />

        </el-form-item>
        <el-form-item label="库存SKU">
          <el-input v-model="queryParams.inventorySku" clearable="" placeholder="请输入库存SKU" />

        </el-form-item>
        <template v-if="advanced">
          <el-form-item label="商品名称">
            <el-input v-model="queryParams.productName" clearable="" placeholder="请输入商品名称" />

          </el-form-item>
          <el-form-item label="款式1">
            <el-input v-model="queryParams.style1" clearable="" placeholder="请输入款式1" />

          </el-form-item>
          <el-form-item label="款式2">
            <el-input v-model="queryParams.style2" clearable="" placeholder="请输入款式2" />

          </el-form-item>
          <el-form-item label="款式3">
            <el-input v-model="queryParams.style3" clearable="" placeholder="请输入款式3" />

          </el-form-item>
          <el-form-item label="采购员">
            <el-input v-model="queryParams.buyer" clearable="" placeholder="请输入采购员" />

          </el-form-item>
          <el-form-item label="商品信息成本价">
            <el-input v-model="queryParams.commodityInformationCostPrice" clearable="" placeholder="请输入商品信息成本价" />

          </el-form-item>
          <el-form-item label="数量-期初">
            <el-input v-model="queryParams.num1" clearable="" placeholder="请输入数量-期初" />

          </el-form-item>
          <el-form-item label="金额-期初">
            <el-input v-model="queryParams.amount1" clearable="" placeholder="请输入金额-期初" />

          </el-form-item>
          <el-form-item label="数量-本期入库">
            <el-input v-model="queryParams.num2" clearable="" placeholder="请输入数量-本期入库" />

          </el-form-item>
          <el-form-item label="金额-本期入库">
            <el-input v-model="queryParams.amount2" clearable="" placeholder="请输入金额-本期入库" />

          </el-form-item>
          <el-form-item label="数量-本期出库">
            <el-input v-model="queryParams.num3" clearable="" placeholder="请输入数量-本期出库" />

          </el-form-item>
          <el-form-item label="金额-本期出库">
            <el-input v-model="queryParams.amount3" clearable="" placeholder="请输入金额-本期出库" />

          </el-form-item>
          <el-form-item label="数量-期末">
            <el-input v-model="queryParams.num4" clearable="" placeholder="请输入数量-期末" />

          </el-form-item>
          <el-form-item label="平均单价-期末">
            <el-input v-model="queryParams.averageUnitPrice" clearable="" placeholder="请输入平均单价-期末" />

          </el-form-item>
          <el-form-item label="金额-期末">
            <el-input v-model="queryParams.amount4" clearable="" placeholder="请输入金额-期末" />

          </el-form-item>
          <el-form-item label="周期">
            <el-input-number v-model="queryParams.days" clearable="" placeholder="请输入周期" />

          </el-form-item>
        </template>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'oFSInventorySumAccount:page'"> 查询
            </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
            <el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'"
              @click="() => advanced = !advanced">{{ advanced ? '收起' : '展开' }} </el-button>
          </el-button-group>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddOFSInventorySumAccount"
            v-auth="'oFSInventorySumAccount:add'"> 新增 </el-button>

        </el-form-item>

      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px;height: 700px; width: 1600px;">
      <el-table class="show_table" :data="tableData" size="large" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" sortable />
        <el-table-column prop="warehouseName" label="仓库名称" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="inventorySku" label="库存SKU" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="productName" label="商品名称" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="style1" label="款式1" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="style2" label="款式2" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="style3" label="款式3" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="buyer" label="采购员" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="commodityInformationCostPrice" label="商品信息成本价" align="center" width="150" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="num1" label="数量-期初" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="amount1" label="金额-期初" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="num2" label="数量-本期入库" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="amount2" label="金额-本期入库" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="num3" label="数量-本期出库" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="amount3" label="金额-本期出库" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="num4" label="数量-期末" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="averageUnitPrice" label="平均单价-期末" align="center" width="150" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="amount4" label="金额-期末" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column prop="days" label="周期" align="center" width="150" sortable show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" sortable fixed="right" show-overflow-tooltip=""
          v-if="auth('oFSInventorySumAccount:delete')">
          <template #default="scope">
            <!-- <el-button icon="ele-Edit" size="small" text="" type="primary"
              @click="openEditOFSInventorySumAccount(scope.row)" v-auth="'oFSInventorySumAccount:edit'"> 编辑 </el-button> -->
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOFSInventorySumAccount(scope.row)"
              v-auth="'oFSInventorySumAccount:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editOFSInventorySumAccountTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<style lang="less" scoped>
// .show_table{
//   /deep/.el-table__body{
//     width: 1600px !important;
//   }
// }</style>


