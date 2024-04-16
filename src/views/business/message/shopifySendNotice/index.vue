<script lang="ts" setup name="shopifySendNotice">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import editDialog from './component/editDialog.vue'
import { pageShopifySendNotice, deleteShopifySendNotice } from '/@/api/modular/main/messageConfig';


const editDialogRef = ref();
const loading = ref(false);
const advanced = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<shopifyParamsType>({});
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
const editShopifySendNoticeTitle = ref("");


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageShopifySendNotice(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 打开新增页面
const openAddShopifySendNotice = () => {
  editShopifySendNoticeTitle.value = '添加消息通知表';
  editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditShopifySendNotice = (row: any) => {
  editShopifySendNoticeTitle.value = '编辑消息通知表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delShopifySendNotice = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteShopifySendNotice({ id: row.id });
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
  <div class="shopifySendNotice-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="标题">
          <el-input v-model="queryParams.title" clearable="" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="queryParams.content" clearable="" placeholder="请输入内容" />
        </el-form-item>
        <template v-if="advanced">
          <el-form-item label="预计发送时间">
            <el-date-picker placeholder="请选择预计发送时间" value-format="YYYY/MM/DD" type="daterange"
              v-model="queryParams.preSendingTimeRange" />
          </el-form-item>
          <el-form-item label="实际发送时间">
            <el-date-picker placeholder="请选择实际发送时间" value-format="YYYY/MM/DD" type="daterange"
              v-model="queryParams.actualSendingTimeRange" />
          </el-form-item>
          <el-form-item label="发送状态">
            <el-input-number v-model="queryParams.sendStatus" clearable="" placeholder="请输入发送状态" />
          </el-form-item>
          <el-form-item label="通知模块代码">
            <el-input v-model="queryParams.modularCode" clearable="" placeholder="请输入通知模块代码" />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询
            </el-button>
            <el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"> 重置 </el-button>
            <el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'" @click="() => advanced = !advanced">{{ advanced
              ? '收起' : '展开' }} </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 8px">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" icon="ele-Plus" @click="openAddShopifySendNotice"> 新增消息通知</el-button>
      </div>
      <el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="modularCode" label="通知模块" align="center" sortable show-overflow-tooltip="">
          <template #default="scope">
            <el-text v-if="scope.row.modularCode === 'ecvvcomm'">ECVV公共通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'ecvvpro'">ECVV橱窗位已用完通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'ecvvreg'">ECVV注册通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'SiteCheck'">站点监控通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'sku_price_null_count'">SKU空价格数量通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'product_launch'">产品发布通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'ae_order'">AE订单通知</el-text>
            <el-text v-else-if="scope.row.modularCode === 'Ecvv_InvoicingNotice'">ECVV开票通知</el-text>
            <el-text v-else>非AE订单通知</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="msgImgUrl" label="通知图片" align="center" show-overflow-tooltip="">
          <template #default="scope">
            <el-image style="width: 100px; height: 50px" :src="scope.row.msgImgUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="content" label="内容" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="msgLink" label="超链接" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="preSendingTime" label="预计发送时间" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="actualSendingTime" label="实际发送时间" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="sendStatus" label="发送状态" align="center" sortable show-overflow-tooltip="">
          <template #default="scope">
            <el-text v-if="scope.row.sendStatus === 1">
              发送成功
            </el-text>
            <el-text v-else-if="scope.row.sendStatus === 0">
              未发送
            </el-text>
            <el-text v-else>
              不成功
            </el-text>
          </template>
        </el-table-column>
        <el-table-column prop="errorMsg" label="错误信息" align="center" show-overflow-tooltip="">
          <template #default="scope">
            <el-text type="danger">
              {{ scope.row.errorMsg }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditShopifySendNotice(scope.row)">
              编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delShopifySendNotice(scope.row)"> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <editDialog ref="editDialogRef" :title="editShopifySendNoticeTitle" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>



