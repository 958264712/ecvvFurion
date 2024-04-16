<script lang="ts" setup name="eCVVHomeProductTypeInfo">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import editDialog from './component/editDialog.vue'
import { getProductListPage, deleteECVVHomeProductTypeInfo } from '/@/api/modular/main/eCVVHomeTaxonomicInfo';

const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<productParamsType>({});
const tableParams = ref({
  Page: 1,
  PageSize: 10,
  total: 0,
});
const editECVVHomeProductTypeInfoTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await getProductListPage(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddECVVHomeProductTypeInfo = () => {
  editECVVHomeProductTypeInfoTitle.value = '添加商品类目表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditECVVHomeProductTypeInfo = (row: any) => {
  editECVVHomeProductTypeInfoTitle.value = '编辑商品类目表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delECVVHomeProductTypeInfo = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteECVVHomeProductTypeInfo(row);
      handleQuery();
      ElMessage.success("删除成功");
    })
    .catch(() => { });
};

// 改变页面容量
const handleSizeChange = (val: number) => {
  tableParams.value.PageSize = val;
  handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
  tableParams.value.Page = val;
  handleQuery();
};


handleQuery();
</script>
<template>
  <div class="eCVVHomeProductTypeInfo-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="商品类目名称">
          <el-input v-model="queryParams.productName" clearable="" placeholder="请输入商品类目名称" />
        </el-form-item>
        <el-form-item label="商品类目标题">
          <el-input v-model="queryParams.productTitle" clearable="" placeholder="请输入商品类目标题" />
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
        <el-button type="primary" icon="ele-Plus" @click="openAddECVVHomeProductTypeInfo"> 新增商品类目表
        </el-button>
      </div>
      <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="productName" label="商品名称" align="center" show-overflow-tooltip="" />
        <el-table-column prop="tncName" label="类别名称" align="center" show-overflow-tooltip="" />
        <el-table-column prop="productSrc" label="商品图片地址" align="center" show-overflow-tooltip="">
          <template #default="scope">
            <el-image style="width: 40px; height: 50px" :src="scope.row.productSrc" />
          </template>
        </el-table-column>
        <el-table-column prop="productHref" label="商品类目超链接" align="center" show-overflow-tooltip="" />
        <el-table-column prop="productRemark" label="备注" align="center" show-overflow-tooltip="" />
        <el-table-column prop="productOrder" label="商品类目顺序" align="center" show-overflow-tooltip="" />
        <el-table-column prop="productEnable" label="是否启用" align="center" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag v-if="scope.row.productEnable"> True </el-tag>
            <el-tag type="danger" v-else=""> False </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productOrder" label="商品类目顺序" align="center" show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary"
              @click="openEditECVVHomeProductTypeInfo(scope.row)"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary"
              @click="delECVVHomeProductTypeInfo(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.Page" v-model:page-size="tableParams.PageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editECVVHomeProductTypeInfoTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>




