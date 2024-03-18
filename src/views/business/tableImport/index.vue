<template>
	<div class="tableImport-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="表格名称">
					<el-input v-model="queryParams.tableName" clearable="" placeholder="请输入表格名称" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'tableImport:page'"> 查询
						</el-button>
						<el-button icon="ele-Refresh" @click="() => (queryParams = {})"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddTableImport" v-auth="'tableImport:add'"> 新增
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
				border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="tableName" label="表格名称" align="center" />
				<el-table-column prop="tableAddress" label="表格模板" align="center">
					<template #default="scope">
						<div v-if="scope.row.tableAddress != null && scope.row.tableAddress != ''">
							<el-link type="success" :href="scope.row.tableAddress">点击下载</el-link>
						</div>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="tableDescriptionAddress" label="表格模板说明" align="center">
					<template #default="scope">
						<div v-if="scope.row.tableDescriptionAddress != null && scope.row.tableDescriptionAddress != ''">
							<el-link type="success" :href="scope.row.tableDescriptionAddress">点击下载</el-link>
						</div>
					</template>
				</el-table-column> -->
				<el-table-column prop="templateUpdateTime" label="模板更新时间" align="center" />
				<el-table-column prop="tableImportLastTime" label="表格上次导入时间" align="center" />
				<el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
					v-if="auth('tableImport:edit') || auth('tableImport:delete')">
					<template #default="scope">
						<el-button icon="ele-Upload" size="small" text="" type="primary"
							@click="clickselecturl(scope.row)" > 导入 </el-button>
						<el-button icon="ele-Edit" size="small" text="" type="primary"
							@click="openEditTableImport(scope.row)" v-auth="'tableImport:edit'"> 编辑 </el-button>
						<!-- <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delTableImport(scope.row)"
							v-auth="'tableImport:delete'"> 删除 </el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editTableImportTitle" @reloadTable="handleQuery" />
			<importDialog ref="importDialogRef" :excelName="excelName" :tableAddress="tableAddress" :url="url" @reloadTable="handleQuery"/>
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="tableImport">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

import editDialog from '/@/views//business/tableImport/component/editDialog.vue';
import importDialog from '/@/views//business/tableImport/component/importDialog.vue';
import { pageTableImport, deleteTableImport } from '/@/api/main/tableImport';
const editDialogRef = ref();
const importDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const editTableImportTitle = ref('');
const excelName = ref('');
const url = ref('');
const tableAddress = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageTableImport(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};


// 打开新增页面
const openAddTableImport = () => {
	editTableImportTitle.value = '添加上传表格管理';
	editDialogRef.value.openDialog({});
};
// 打开编辑页面
const openEditTableImport = (row: any) => {
	editTableImportTitle.value = '编辑上传表格管理';
	editDialogRef.value.openDialog(row);
};

// 删除
const delTableImport = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteTableImport(row);
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

//导入方法枚举
enum ImportMethod {
	CN_OperationalProductAttributes = '/api/CN_OperationalProductAttributes/import', //cn运营产品属性
	KingdeeHasPlacedAnOrder = '/api/kingdeeHasPlacedAnOrder/import', //金蝶已下单
	DFPickingList = '/api/dFPickingList/import/UAE', //dFPickingList
	DFShippingList = '/api/dFShippingList/import', //dFShippingList
	InventorySummaryLedger = '/api/inventorySummaryLedger/import', //ERP库存查询
	Asin = '/api/aSINBasicData/import', //ASIN
	PoOrder = '/api/poData/import', //po order
	PoOrderDate = '/api/poData/bulkImportOrderDate', //PoOrderDate
	ProcurementDetails = '/api/procurementDetails/import', //ProcurementDetails
	AmazonProductPricebase = '/api/amazonProductPricebase/import', //AmazonProductPricebase
	AmazonProPricebaseSA = '/api/amazonProPricebaseSA/import', //AmazonProPricebaseSA
	inventoryManagement = '/api/inventoryManagement/Imports/金蝶云采购申请单/UAE',//金蝶云采购申请单
}

//根据id判断url
const switchImportMethod = (id: any) => {
	switch (id) {
		case 15397351899461:
			return ImportMethod.AmazonProPricebaseSA;
		case 15396347276101:
			return ImportMethod.CN_OperationalProductAttributes;
		case 15396342074309:
			return ImportMethod.KingdeeHasPlacedAnOrder;
		case 15396338198213:
			return ImportMethod.InventorySummaryLedger;
		case 15396306677829:
			return ImportMethod.Asin;
		case 15396273346885:
			return ImportMethod.ProcurementDetails;
		case 15396258301509:
			return ImportMethod.PoOrderDate;
		case 15396243312837:
			return ImportMethod.PoOrder;
		case 15396230192325:
			return ImportMethod.DFPickingList;
		case 15396205502533:
			return ImportMethod.DFShippingList;
		case 15396189812421:
			return ImportMethod.AmazonProductPricebase;
		case 16313837384517:
			return ImportMethod.inventoryManagement;

		default:
			return '';
	}
};

//url赋值
const clickselecturl = (row: any) => {
	url.value = switchImportMethod(row.id);
	excelName.value = row.tableName
	tableAddress.value = row.tableAddress
	importDialogRef.value.openDialog();
};



handleQuery();
</script>
