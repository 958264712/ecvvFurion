<script setup lang="ts">
import { ref } from "vue";
// import { Refresh, Setting, DCaret } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import editDialog from './components/editDialog.vue'
import { pageOFSInventoryQuery, deleteOFSInventoryQuery } from '/@/api/modular/main/oFSInventoryQuery';
const queryParams = ref<queryParamsType>({})

const advanced = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);

const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editOFSInventoryQueryTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageOFSInventoryQuery(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddOFSInventoryQuery = () => {
  editOFSInventoryQueryTitle.value = '添加库存查询';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditOFSInventoryQuery = (row: any) => {
  editOFSInventoryQueryTitle.value = '编辑库存查询';
  editDialogRef.value.openDialog(row);
};

// 删除
const delOFSInventoryQuery = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteOFSInventoryQuery(row);
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
    <el-card>
      <div class="table-page-search-wrapper">
        <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
          <el-form :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item label="商品编码">
              <el-input v-model="queryParams.commodityCode" clearable="" placeholder="请输入商品编码" />

            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="queryParams.productName" clearable="" placeholder="请输入商品名称" />

            </el-form-item>
            <template v-if="advanced">
              <el-form-item label="成品库存">
                <el-input-number v-model="queryParams.finishedProductInventory" clearable="" placeholder="请输入成品库存" />

              </el-form-item>
              <el-form-item label="已下单数量">
                <el-input-number v-model="queryParams.quantityOfOrdersPlaced" clearable="" placeholder="请输入已下单数量" />

              </el-form-item>
              <el-form-item label="商品类别">
                <el-input v-model="queryParams.commodityCategory" clearable="" placeholder="请输入商品类别" />

              </el-form-item>
              <el-form-item label="仓库名称">
                <el-input v-model="queryParams.warehouseName" clearable="" placeholder="请输入仓库名称" />

              </el-form-item>
              <el-form-item label="规格型号">
                <el-input v-model="queryParams.specificationAndModel" clearable="" placeholder="请输入规格型号" />

              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="queryParams.brand" clearable="" placeholder="请输入品牌" />

              </el-form-item>
              <el-form-item label="Sku编码">
                <el-input v-model="queryParams.sKUCoding" clearable="" placeholder="请输入Sku编码" />

              </el-form-item>
              <el-form-item label="默认供应商">
                <el-input v-model="queryParams.defaultSupplier" clearable="" placeholder="请输入默认供应商" />

              </el-form-item>
              <el-form-item label="基本单位">
                <el-input v-model="queryParams.basicUnit" clearable="" placeholder="请输入基本单位" />

              </el-form-item>
              <el-form-item label="成本">
                <el-input v-model="queryParams.cost" clearable="" placeholder="请输入成本" />

              </el-form-item>
              <el-form-item label="所属团队">
                <el-input v-model="queryParams.belongToTheTeam" clearable="" placeholder="请输入所属团队" />

              </el-form-item>
            </template>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
                <el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'" @click="() => advanced = !advanced">{{
                  advanced ? '收起' : '展开' }} </el-button>
              </el-button-group>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="ele-Plus" @click="openAddOFSInventoryQuery"
                v-auth="'oFSInventoryQuery:add'"> 新增 </el-button>

            </el-form-item>

          </el-form>
        </el-card>
        <el-card class="full-table" shadow="hover" style="margin-top: 8px">
          <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light"
            row-key="id" border="">
            <el-table-column type="index" label="序号" width="80" align="center" sortable />
            <el-table-column prop="commodityCode" label="商品编码" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="productName" label="商品名称" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="finishedProductInventory" label="成品库存" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="quantityOfOrdersPlaced" label="已下单数量" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="commodityCategory" label="商品类别" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="warehouseName" label="仓库名称" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="specificationAndModel" label="规格型号" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="brand" label="品牌" width="130" align="center" sortable show-overflow-tooltip="" />
            <el-table-column prop="sKUCoding" label="Sku编码" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="defaultSupplier" label="默认供应商" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column prop="basicUnit" label="基本单位" width="130" align="center" sortable show-overflow-tooltip="" />
            <el-table-column prop="cost" label="成本" width="130" align="center" sortable show-overflow-tooltip="" />
            <el-table-column prop="belongToTheTeam" label="所属团队" width="130" align="center" sortable
              show-overflow-tooltip="" />
            <el-table-column label="操作" width="140" align="center" sortable sortablefixed="right" show-overflow-tooltip=""
              v-if="auth('oFSInventoryQuery:delete')">
              <template #default="scope">
                <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delOFSInventoryQuery(scope.row)"
                  v-auth="'oFSInventoryQuery:delete'"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
            :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
            @size-change="handleSizeChange" @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper" />
          <editDialog ref="editDialogRef" :title="editOFSInventoryQueryTitle" @reloadTable="handleQuery" />
        </el-card>
      </div>
    </el-card>

  </div>
</template>

<style lang="less" scoped>
.table-operator {
  margin-bottom: 18px;
}

.demo-pagination-block {
  margin-bottom: 36px;
}

button {
  margin-right: 8px;
}</style>
