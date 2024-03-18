<script setup lang="ts">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from './components/editDialog.vue'
import { pageOFSPurchaseOrder, deleteOFSPurchaseOrder } from '/@/api/modular/main/oFSPurchaseOrder';

const queryParams = ref<orderParamsType>({})
const editDialogRef = ref();
const loading = ref(false);
const advanced = ref(false);
const tableData = ref<any>([]);
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

const editOFSPurchaseOrderTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageOFSPurchaseOrder(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddOFSPurchaseOrder = () => {
  editOFSPurchaseOrderTitle.value = '添加采购订单';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditOFSPurchaseOrder = (row: any) => {
  editOFSPurchaseOrderTitle.value = '编辑采购订单';
  editDialogRef.value.openDialog(row);
};

// 删除
const delOFSPurchaseOrder = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteOFSPurchaseOrder(row);
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
  <div>
    <!-- <el-card>
      <div class="settingf">
        <div class="setting">
          <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom-end">
            <el-button type="primary" :icon="Refresh" />
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="密度" placement="bottom-end">
            <el-button type="primary" :icon="DCaret" />
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="列设置" placement="bottom-end">
            <el-button type="primary" :icon="Setting" />
          </el-tooltip>
        </div>
      </div>
    </el-card> -->
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="下单日期">
          <el-input v-model="queryParams.dateOfOrderIssued" clearable="" placeholder="请输入下单日期" />

        </el-form-item>
        <el-form-item label="交货日期">
          <el-input v-model="queryParams.dateOfDelivery" clearable="" placeholder="请输入交货日期" />

        </el-form-item>
        <template v-if="advanced">
          <el-form-item label="供应商">
            <el-input v-model="queryParams.supplier" clearable="" placeholder="请输入供应商" />

          </el-form-item>
          <el-form-item label="采购员">
            <el-input v-model="queryParams.buyer" clearable="" placeholder="请输入采购员" />

          </el-form-item>
          <el-form-item label="审核状态">
            <el-input v-model="queryParams.auditStatus" clearable="" placeholder="请输入审核状态" />

          </el-form-item>
          <el-form-item label="执行状态">
            <el-input v-model="queryParams.executionStatus" clearable="" placeholder="请输入执行状态" />

          </el-form-item>
          <el-form-item label="关闭状态">
            <el-input v-model="queryParams.offStatus" clearable="" placeholder="请输入关闭状态" />

          </el-form-item>
          <el-form-item label="付款状态">
            <el-input v-model="queryParams.paymentStatus" clearable="" placeholder="请输入付款状态" />

          </el-form-item>
          <el-form-item label="成交金额">
            <el-input v-model="queryParams.transactionAmount" clearable="" placeholder="请输入成交金额" />

          </el-form-item>
          <el-form-item label="已付款金额">
            <el-input v-model="queryParams.amountPaid" clearable="" placeholder="请输入已付款金额" />

          </el-form-item>
          <el-form-item label="本次订金">
            <el-input v-model="queryParams.thisDeposit" clearable="" placeholder="请输入本次订金" />

          </el-form-item>
          <el-form-item label="累计预付">
            <el-input v-model="queryParams.cumulativePrepayment" clearable="" placeholder="请输入累计预付" />

          </el-form-item>
          <el-form-item label="仓位">
            <el-input v-model="queryParams.warehousePosition" clearable="" placeholder="请输入仓位" />

          </el-form-item>
          <el-form-item label="行执行状态">
            <el-input v-model="queryParams.lineExecutionStatus" clearable="" placeholder="请输入行执行状态" />

          </el-form-item>
          <el-form-item label="行入库状态">
            <el-input v-model="queryParams.lineStorageStatus" clearable="" placeholder="请输入行入库状态" />

          </el-form-item>
          <el-form-item label="行关闭状态">
            <el-input v-model="queryParams.rowClosedStatus" clearable="" placeholder="请输入行关闭状态" />

          </el-form-item>
          <el-form-item label="商品图片">
            <el-input v-model="queryParams.commodityPicture" clearable="" placeholder="请输入商品图片" />

          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="queryParams.commodityCode" clearable="" placeholder="请输入商品编码" />

          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="queryParams.productName" clearable="" placeholder="请输入商品名称" />

          </el-form-item>
          <el-form-item label="仓库">
            <el-input v-model="queryParams.warehouse" clearable="" placeholder="请输入仓库" />

          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="queryParams.unit" clearable="" placeholder="请输入单位" />

          </el-form-item>
          <el-form-item label="数量">
            <el-input-number v-model="queryParams.quantity" clearable="" placeholder="请输入数量" />

          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="queryParams.unitPrice" clearable="" placeholder="请输入单价" />

          </el-form-item>
          <el-form-item label="含税单价">
            <el-input v-model="queryParams.unitPriceIncludingTax" clearable="" placeholder="请输入含税单价" />

          </el-form-item>
          <el-form-item label="税额">
            <el-input v-model="queryParams.taxAmount" clearable="" placeholder="请输入税额" />

          </el-form-item>
          <el-form-item label="价税合计">
            <el-input v-model="queryParams.totalPriceAndTax" clearable="" placeholder="请输入价税合计" />

          </el-form-item>
          <el-form-item label="预计采购费用明细">
            <el-input v-model="queryParams.detailsOfEstimatedPurchaseCosts" clearable="" placeholder="请输入预计采购费用明细" />

          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="queryParams.specifications" clearable="" placeholder="请输入规格" />

          </el-form-item>
          <el-form-item label="规格2">
            <el-input v-model="queryParams.specification2" clearable="" placeholder="请输入规格2" />

          </el-form-item>
        </template>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询
            </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
            <el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'"
              @click="() => advanced = !advanced">{{ advanced ? '收起' : '展开' }} </el-button>
          </el-button-group>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddOFSPurchaseOrder" v-auth="'oFSPurchaseOrder:add'"> 新增
          </el-button>

        </el-form-item>

      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" sortable />
        <el-table-column prop="dateOfOrderIssued" label="下单日期" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="dateOfDelivery" label="交货日期" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="supplier" label="供应商" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="buyer" label="采购员" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="auditStatus" label="审核状态" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="executionStatus" label="执行状态" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="offStatus" label="关闭状态" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="paymentStatus" label="付款状态" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="transactionAmount" label="成交金额" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="amountPaid" label="已付款金额" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="thisDeposit" label="本次订金" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="cumulativePrepayment" label="累计预付" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="warehousePosition" label="仓位" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="lineExecutionStatus" label="行执行状态" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="lineStorageStatus" label="行入库状态" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="rowClosedStatus" label="行关闭状态" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="commodityPicture" label="商品图片" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="commodityCode" label="商品编码" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="productName" label="商品名称" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="warehouse" label="仓库" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="unit" label="单位" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="quantity" label="数量" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="unitPrice" label="单价" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="unitPriceIncludingTax" label="含税单价" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="taxAmount" label="税额" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="totalPriceAndTax" label="价税合计" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="detailsOfEstimatedPurchaseCosts" label="预计采购费用明细" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="specifications" label="规格" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="specification2" label="规格2" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" sortable fixed="right" show-overflow-tooltip=""
          v-if="auth('oFSPurchaseOrder:delete')">
          <template #default="scope">
            <!-- <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOFSPurchaseOrder(scope.row)"
              v-auth="'oFSPurchaseOrder:edit'"> 编辑 </el-button> -->
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOFSPurchaseOrder(scope.row)"
              v-auth="'oFSPurchaseOrder:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editOFSPurchaseOrderTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<style lang="less">
.table-operator {
  margin-bottom: 18px;
}

.settingf {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
}

.help {
  display: flex;
  justify-content: space-around;
  align-items: center;

}

.demo-pagination-block {
  margin-bottom: 36px;
}

button {
  margin-right: 8px;
}</style>
