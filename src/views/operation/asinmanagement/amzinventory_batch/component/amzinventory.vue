<template>
	<div class="aMZInventory-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<!-- <el-form-item label="ProductTitle">
					<el-input v-model="queryParams.productTitle" clearable="" placeholder="请输入ProductTitle" />
				</el-form-item>
				<el-form-item label="Brand">
					<el-input v-model="queryParams.brand" clearable="" placeholder="请输入Brand" />
				</el-form-item>
				<el-form-item label="VendorConfirmationRate">
					<el-input v-model="queryParams.vendorConfirmationRate" clearable="" placeholder="请输入VendorConfirmationRate" />
				</el-form-item>
				<el-form-item label="OpenPurchaseOrderQuantity">
					<el-input v-model="queryParams.openPurchaseOrderQuantity" clearable="" placeholder="请输入OpenPurchaseOrderQuantity" />
				</el-form-item>
				<el-form-item label="ReceiveFillRate">
					<el-input v-model="queryParams.receiveFillRate" clearable="" placeholder="请输入ReceiveFillRate" />
				</el-form-item>
				<el-form-item label="OverallVendorLeadTime">
					<el-input v-model="queryParams.overallVendorLeadTime" clearable="" placeholder="请输入OverallVendorLeadTime" />
				</el-form-item>
				<el-form-item label="Aged90DaysSellableInventory">
					<el-input v-model="queryParams.aged90DaysSellableInventory" clearable="" placeholder="请输入Aged90DaysSellableInventory" />
				</el-form-item>
				<el-form-item label="Aged90DaysSellableUnits">
					<el-input v-model="queryParams.aged90DaysSellableUnits" clearable="" placeholder="请输入Aged90DaysSellableUnits" />
				</el-form-item>
				<el-form-item label="SellableOnHandInventory">
					<el-input v-model="queryParams.sellableOnHandInventory" clearable="" placeholder="请输入SellableOnHandInventory" />
				</el-form-item>
				<el-form-item label="SellableOnHandUnits">
					<el-input v-model="queryParams.sellableOnHandUnits" clearable="" placeholder="请输入SellableOnHandUnits" />
				</el-form-item>
				<el-form-item label="UnsellableOnHandInventory">
					<el-input v-model="queryParams.unsellableOnHandInventory" clearable="" placeholder="请输入UnsellableOnHandInventory" />
				</el-form-item>
				<el-form-item label="UnsellableOnHandUnits">
					<el-input v-model="queryParams.unsellableOnHandUnits" clearable="" placeholder="请输入UnsellableOnHandUnits" />
				</el-form-item> -->
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => (queryParams = { amzInventoryBatchId: props.id })"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
          <el-button type="primary" icon="ele-Plus" @click="openAddAMZInventory" v-auth="'aMZInventory:add'"> 新增 </el-button>

        </el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column align="center" type="index" label="序号" width="55" />
				<el-table-column align="center" prop="asin" label="ASIN" width="105" />
				<el-table-column align="center" prop="productTitle" label="ProductTitle" width="105" show-overflow-tooltip="" />
				<el-table-column align="center" prop="brand" label="Brand" />
				<el-table-column align="center" prop="vendorConfirmationRate" label="VendorConfirmationRate" width="150" />
				<el-table-column align="center" prop="openPurchaseOrderQuantity" label="OpenPurchaseOrderQuantity" width="130" />
				<el-table-column align="center" prop="receiveFillRate" label="ReceiveFillRate" width="135" />
				<el-table-column align="center" prop="overallVendorLeadTime" label="OverallVendorLeadTime" width="150" />
				<el-table-column align="center" prop="aged90DaysSellableInventory" label="Aged90DaysSellableInventory" width="130" />
				<el-table-column align="center" prop="aged90DaysSellableUnits" label="Aged90DaysSellableUnits" width="135" />
				<el-table-column align="center" prop="sellableOnHandInventory" label="SellableOnHandInventory" width="155" />
				<el-table-column align="center" prop="sellableOnHandUnits" label="SellableOnHandUnits" width="135" />
				<el-table-column align="center" prop="unsellableOnHandInventory" label="UnsellableOnHandInventory" width="120" />
				<el-table-column align="center" prop="unsellableOnHandUnits" label="UnsellableOnHandUnits" width="150" />
				<!-- <el-table-column label="操作" width="140" align="center" fixed="right" v-if="auth('aMZInventory:edit') || auth('aMZInventory:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditAMZInventory(scope.row)" v-auth="'aMZInventory:edit'"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delAMZInventory(scope.row)" v-auth="'aMZInventory:delete'"> 删除 </el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<editDialog ref="editDialogRef" :title="editAMZInventoryTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="amzinventory">
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

// import editDialog from '/@/views/main/aMZInventory/component/editDialog.vue';
import { pageAMZInventory, deleteAMZInventory } from '/@/api/operation/aMZInventory';

const props = defineProps(['id']);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ amzInventoryBatchId: props.id });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editAMZInventoryTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageAMZInventory(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddAMZInventory = () => {
	editAMZInventoryTitle.value = '添加AMZInventory';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditAMZInventory = (row: any) => {
	editAMZInventoryTitle.value = '编辑AMZInventory';
	editDialogRef.value.openDialog(row);
};

// 删除
const delAMZInventory = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteAMZInventory(row);
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
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

watch(
	() => props.id,
	(val) => {
		queryParams.value.amzInventoryBatchId = props.id;
		handleQuery();
	}
);

handleQuery();
</script>
