<script setup lang="ts">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import editDialog from './components/editDialog.vue'
import { pageOFSProductNameDetail, deleteOFSProductNameDetail } from '/@/api/modular/main/oFSProductNameDetail';
// import { Refresh, Setting, DCaret, Plus } from '@element-plus/icons-vue';

const queryParams = ref<paramsType>({})
const editDialogRef = ref();
const loading = ref(false);
const advanced = ref(false);

const tableData = ref<any>([]);
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editOFSProductNameDetailTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageOFSProductNameDetail(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddOFSProductNameDetail = () => {
  editOFSProductNameDetailTitle.value = '添加商品名称明细表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditOFSProductNameDetail = (row: any) => {
  editOFSProductNameDetailTitle.value = '编辑商品名称明细表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delOFSProductNameDetail = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteOFSProductNameDetail(row);
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
        <el-form-item label="商品名称">
          <el-input v-model="queryParams.productName" clearable="" placeholder="请输入商品名称" />

        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="queryParams.state" clearable="" placeholder="请输入状态" />

        </el-form-item>
        <template v-if="advanced">

          <el-form-item label="生产周期">
            <el-input-number v-model="queryParams.productionCycle" clearable="" placeholder="请输入生产周期" />

          </el-form-item>
          <el-form-item label="物流周期">
            <el-input-number v-model="queryParams.logisticsCycle" clearable="" placeholder="请输入物流周期" />

          </el-form-item>
          <el-form-item label="谈判周期">
            <el-input-number v-model="queryParams.negotiationCycle" clearable="" placeholder="请输入谈判周期" />

          </el-form-item>
          <el-form-item label="在迪拜库存">
            <el-input-number v-model="queryParams.inventoryDubai" clearable="" placeholder="请输入在迪拜库存" />

          </el-form-item>
          <el-form-item label="在国内库存">
            <el-input-number v-model="queryParams.inDomesticInventory" clearable="" placeholder="请输入在国内库存" />

          </el-form-item>
          <el-form-item label="在途库存">
            <el-input-number v-model="queryParams.inTransitInventory" clearable="" placeholder="请输入在途库存" />

          </el-form-item>
          <el-form-item label="在生产库存">
            <el-input-number v-model="queryParams.inProductionInventory" clearable="" placeholder="请输入在生产库存" />

          </el-form-item>
          <el-form-item label="在生产最近交货期">
            <el-date-picker placeholder="请选择在生产最近交货期" value-format="YYYY/MM/DD" type="daterange"
              v-model="queryParams.latestDeliveryDateRange" />

          </el-form-item>
          <el-form-item label="在生产最远交货期">
            <el-date-picker placeholder="请选择在生产最远交货期" value-format="YYYY/MM/DD" type="daterange"
              v-model="queryParams.farthestDeliveryDateRange" />

          </el-form-item>
          <el-form-item label="距离今天">
            <el-input v-model="queryParams.fromToday" clearable="" placeholder="请输入距离今天" />

          </el-form-item>
          <el-form-item label="近7天日均销量">
            <el-input v-model="queryParams.averageSales7Days" clearable="" placeholder="请输入近7天日均销量" />

          </el-form-item>
          <el-form-item label="近30天日均销量">
            <el-input v-model="queryParams.averageSales30Days" clearable="" placeholder="请输入近30天日均销量" />

          </el-form-item>
          <el-form-item label="在库可售天数">
            <el-input-number v-model="queryParams.numberOfDaysInWarehouse" clearable="" placeholder="请输入在库可售天数" />

          </el-form-item>
          <el-form-item label="综合可售天数">
            <el-input-number v-model="queryParams.comprehensiveNumberOfDays" clearable="" placeholder="请输入综合可售天数" />

          </el-form-item>
          <el-form-item label="采购返单结余周期">
            <el-input-number v-model="queryParams.purchaseReturnCycle" clearable="" placeholder="请输入采购返单结余周期" />

          </el-form-item>
          <el-form-item label="在迪拜库销售预警">
            <el-input v-model="queryParams.sellEarlyWarning" clearable="" placeholder="请输入在迪拜库销售预警" />

          </el-form-item>
          <el-form-item label="采购返单预警">
            <el-input v-model="queryParams.purchaseReturnWarning" clearable="" placeholder="请输入采购返单预警" />

          </el-form-item>
        </template>

        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
            <el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'"
              @click="() => advanced = !advanced">{{ advanced ? '收起' : '展开' }} </el-button>
          </el-button-group>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddOFSProductNameDetail"
            v-auth="'oFSProductNameDetail:add'"> 新增 </el-button>

        </el-form-item>

      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="large"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="productName" label="商品名称" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="state" label="状态" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="productionCycle" label="生产周期" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="logisticsCycle" label="物流周期" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="negotiationCycle" label="谈判周期" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="inventoryDubai" label="在迪拜库存" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="inDomesticInventory" label="在国内库存" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="inTransitInventory" label="在途库存" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="inProductionInventory" label="在生产库存" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="latestDeliveryDate" label="在生产最近交货期" width="170px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="farthestDeliveryDate" label="在生产最远交货期" width="170px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="fromToday" label="距离今天" width="150px" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="averageSales7Days" label="近7天日均销量" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="averageSales30Days" label="近30天日均销量" width="170px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="numberOfDaysInWarehouse" label="在库可售天数" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="comprehensiveNumberOfDays" label="综合可售天数" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="purchaseReturnCycle" label="采购返单结余周期" width="170px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="sellEarlyWarning" label="在迪拜库销售预警" width="170px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column prop="purchaseReturnWarning" label="采购返单预警" width="150px" align="center" sortable
          show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" sortable fixed="right" show-overflow-tooltip=""
          v-if="auth('oFSProductNameDetail:delete')">
          <template #default="scope">
            <!-- <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOFSProductNameDetail(scope.row)" v-auth="'oFSProductNameDetail:edit'"> 编辑 </el-button> -->
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOFSProductNameDetail(scope.row)"
              v-auth="'oFSProductNameDetail:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editOFSProductNameDetailTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>
<style lang="less" scoped>
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
