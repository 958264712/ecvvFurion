<template>
	<div class="aMZInventory-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = { poFulfillingOrderBatchId: props.id };
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column align="center" prop="po" label="PO" width="105" />
				<el-table-column align="center" prop="asin" label="ASIN" width="105" />
				<el-table-column align="center" prop="quantityRequested" label="Quantity Requested" width="105" show-overflow-tooltip="" />
				<el-table-column align="center" prop="erpSku" label="ERP-SKU" />
				<el-table-column align="center" prop="purchasingCountry" label="采购国" width="150" />
				<el-table-column align="center" prop="packagingQuantity" label="打包数量" width="130" />
				<el-table-column align="center" prop="shipmentQuantity" label="发货数量" width="135" />
				<el-table-column align="center" prop="inventoryQuantity" label="库存数量" width="150" />
				<el-table-column align="center" prop="latestQuantities" label="最近一批在途数量" width="130" />
				<el-table-column align="center" prop="warehouseArrivalDate" label="预计到仓日期" width="135" />
				<el-table-column align="center" prop="latestDate" label="最迟履单日期" width="155" />
				<!-- <el-table-column align="center" prop="confirmQuantity" label="可履单数量" width="135" />
				<el-table-column align="center" prop="bookingTime" label="提示约仓时间" width="120" /> -->
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
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="amzinventory">
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getPoFulfillingOrdersList } from '/@/api/modular/main/poFulfillingOrdersData';

const props = defineProps(['id']);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ poFulfillingOrderBatchId: props.id });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editAMZInventoryTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await getPoFulfillingOrdersList(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
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
		queryParams.value.poFulfillingOrderBatchId = props.id;
		handleQuery();
	}
);

handleQuery();
</script>
