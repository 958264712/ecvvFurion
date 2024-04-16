<script lang="ts" setup name="messageConfig">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import editDialog from './component/editDialog.vue'
import { pageMessageConfig, deleteMessageConfig } from '/@/api/modular/main/messageConfig';


const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<messageParamsType>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editMessageConfigTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageMessageConfig(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddMessageConfig = () => {
  editMessageConfigTitle.value = '添加通知配置';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditMessageConfig = (row: any) => {
  editMessageConfigTitle.value = '编辑通知配置';
  editDialogRef.value.openDialog(row);
};

// 删除
const delMessageConfig = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteMessageConfig({ id: row.id });
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
  <div class="messageConfig-container">
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" icon="ele-Plus" @click="openAddMessageConfig"> 新增通知配置</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre"
        border="">
        <el-table-column prop="modularCode" label="通知模块代码" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="modularName" label="通知模块名称" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="matchingRules" label="匹配规则" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="receiverNames" label="接收人" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="notificationMethod" label="通知方式" align="center" sortable show-overflow-tooltip="">
          <template #default="scope">
            <el-text>{{ scope.row.notificationMethod.replaceAll('"', '') === '[dingding,email]' ? '钉钉提醒,电子邮件' :
              scope.row.notificationMethod.replaceAll('"', '') === '[DingDingText]' ? '钉钉纯文本消息' :
                scope.row.notificationMethod.replaceAll('"', '') === '[dingding]' ? '钉钉提醒' :
                  '手机短信'
            }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditMessageConfig(scope.row)"> 编辑
            </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delMessageConfig(scope.row)"> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editMessageConfigTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>




