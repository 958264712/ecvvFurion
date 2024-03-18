<script lang="ts" setup>
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import editDialog from './component/editDialog.vue'
import { pageECVVHomeSubassemblyInfo, deleteECVVHomeSubassemblyInfo } from '/@/api/modular/main/eCVVHomeTaxonomicInfo';

const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<subParamsType>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editECVVHomeSubassemblyInfoTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageECVVHomeSubassemblyInfo(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddECVVHomeSubassemblyInfo = () => {
  editECVVHomeSubassemblyInfoTitle.value = '添加组件信息表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditECVVHomeSubassemblyInfo = (row: any) => {
  editECVVHomeSubassemblyInfoTitle.value = '编辑组件信息表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delECVVHomeSubassemblyInfo = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteECVVHomeSubassemblyInfo(row);
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
  <div class="eCVVHomeSubassemblyInfo-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="组件名称">
          <el-input v-model="queryParams.subName" clearable="" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="组件标题">
          <el-input v-model="queryParams.subTitle" clearable="" placeholder="请输入组件标题" />
        </el-form-item>
        <el-form-item label="组件规格">
          <el-input v-model="queryParams.subSpecification" clearable="" placeholder="请输入组件规格" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="queryParams.subRemark" clearable="" placeholder="请输入备注" />
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
        <el-button type="primary" icon="ele-Plus" @click="openAddECVVHomeSubassemblyInfo"> 新增组件信息表
        </el-button>
      </div>
      <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="subName" label="前端组件名称" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="subTitle" label="组件标题" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="subSpecification" label="组件规格" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="subRemark" label="备注" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="subEnable" label="是否启用" align="center" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag v-if="scope.row.subEnable"> True </el-tag>
            <el-tag type="danger" v-else=""> False </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary"
              @click="openEditECVVHomeSubassemblyInfo(scope.row)"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary"
              @click="delECVVHomeSubassemblyInfo(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editECVVHomeSubassemblyInfoTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>



