<script lang="ts" setup="" name="sA_ProcurementDetails">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import editDialog from './component/editDialog.vue';
import { pageSA_ProcurementDetails, deleteUAE_ProcurementDetails, DataImport } from '/@/api/modular/main/uAE_ProcurementDetails.ts';

const editDialogRef = ref();
const loading = ref(false);
const loading1 = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<procurementsParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const editUAE_ProcurementDetailsTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageSA_ProcurementDetails(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 导入SA采购明细
function Imports(file: any) {
	loading1.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	DataImport(formData).then((res: any) => {
		loading1.value = false;
		if (res.data.code == 200) {
			ElMessage.success('导入成功');
			handleQuery();
		} else {
			loading.value = false;
			ElMessage.error('导入失败'); // + res.message
		}
	});
}

// 打开新增页面
const openAddUAE_ProcurementDetails = () => {
	editUAE_ProcurementDetailsTitle.value = '添加UAE采购明细表';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditUAE_ProcurementDetails = (row: any) => {
	editUAE_ProcurementDetailsTitle.value = '编辑UAE采购明细表';
	editDialogRef.value.openDialog(row);
};

// 删除
const delUAE_ProcurementDetails = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteUAE_ProcurementDetails(row);
			handleQuery();
			ElMessage.success('删除成功');
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
	<div class="uAE_ProcurementDetails-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="库存SKU">
					<el-input v-model="queryParams.inventorySKU" clearable="" placeholder="请输入库存SKU" />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="queryParams.productName" clearable="" placeholder="请输入商品名称" />
				</el-form-item>
				<el-form-item label="供应商货号">
					<el-input v-model="queryParams.supplierItemNumber" clearable="" placeholder="请输入供应商货号" />
				</el-form-item>
				<el-form-item label="入库单号">
					<el-input v-model="queryParams.warehouseEntryNumber" clearable="" placeholder="请输入入库单号" />
				</el-form-item>

				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"
							> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
							queryParams = {};
							handleQuery();
						}
							">
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv">
				<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false"
					name="file">
					<el-button :loading="loading1" type="primary">采购明细导入</el-button>
				</el-upload>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				row-key="id" border="">
				<el-table-column prop="inventorySKU" label="库存SKU" width="150" align="center" show-overflow-tooltip="" />
				<el-table-column prop="productName" label="商品名称" width="150" align="center" show-overflow-tooltip="" />
				<el-table-column prop="supplierItemNumber" label="供应商货号" width="150" align="center" />
				<el-table-column prop="preparationTime" label="制单时间" width="160" align="center" />
				<el-table-column prop="warehouseEntryNumber" label="入库单号" align="center" width="160" />
				<el-table-column prop="documentStatus" label="单据状态" align="center" width="90" />
				<el-table-column prop="purchaseQuantity" label="采购数量" align="center" width="90" />
				<el-table-column prop="receiptQuantity" label="入库数量" align="center" width="90" />
				<el-table-column prop="unitPrice" label="单价" align="center" width="90" />
				<el-table-column prop="money" label="金额" align="center" width="90" />
				<el-table-column prop="unqualifiedQuantity" label="不合格数量" width="100" align="center" />
				<el-table-column prop="associatedPurchaseOrderNumber" align="center" width="170" label="关联采购采购单号" />
				<el-table-column prop="creator" label="制单人" align="center" width="90" />
				<el-table-column prop="warehouseReviewer" label="仓库审核人" align="center" width="100" />
				<el-table-column prop="warehouseAuditTime" label="仓库审核时间" align="center" width="100"
					show-overflow-tooltip="" />
				<el-table-column prop="financialReviewer" label="财务审核人" align="center" width="100" />
				<el-table-column prop="productRemarks" label="商品备注" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="supplier" label="供应商" align="center" width="150" />
				<el-table-column prop="daysJudgmentValue" label="天数判定值" align="center" width="150" />
				<el-table-column prop="year" label="年份" align="center" width="150" />
				<el-table-column label="操作" width="140" align="center" fixed="right"
					v-if="auth('uAE_ProcurementDetails:edit') || auth('uAE_ProcurementDetails:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary"
							@click="openEditUAE_ProcurementDetails(scope.row)" v-auth="'uAE_ProcurementDetails:edit'"> 编辑
						</el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary"
							@click="delUAE_ProcurementDetails(scope.row)" v-auth="'uAE_ProcurementDetails:delete'"> 删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editUAE_ProcurementDetailsTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>
