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
						<el-button icon="ele-Refresh" @click="() =>  {queryParams = { poFulfillingOrderBatchId: props.id };handleQuery()}"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column align="center" prop="po" label="Order/PO Number" width="105"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="externalID" label="External ID" width="105"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="modelNumber" label="Model Number" width="105" show-overflow-tooltip="" />
				<el-table-column align="center" prop="asin" label="ASIN"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="merchantSku" label="Merchant Sku"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="title" label="Title" width="150" show-overflow-tooltip=""/>
				<el-table-column align="center" prop="listPrice" label="List Price" width="150" show-overflow-tooltip=""/>
				<el-table-column align="center" prop="discount" label="Discount" width="150" show-overflow-tooltip=""/>
				<el-table-column align="center" prop="cost" label="Cost" width="130" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="quantityOrdered" label="Quantity Ordered" width="135" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="previouslyConfirmedQuantity" label="Previously Confirmed Quantity" width="135" show-overflow-tooltip=""  />
				<!-- <el-table-column align="center" prop="quantityConfirmed" label="Quantity Confirmed" width="150" show-overflow-tooltip=""  /> -->
				<el-table-column align="center" prop="handOffStart" label="Hand Off Start" width="130" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="handOffEnd" label="Hand Off End" width="135" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="handOffType" label="Hand Off Type" width="155" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="expectedHandOffDate" label="Expected Hand Off Date" width="135" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="availabilityStatus" label="Availability Status" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="errorFromPreviousUploadAttempt" label="Error From Previous Upload Attempt" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="vendorCode" label="Vendor Code" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="fulfillmentCenter" label="Fulfillment Center" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="condition" label="Condition" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="orderDate" label="Order Date" width="120"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="isBackOrder" label="Is Back Order" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="freightTerms" label="Freight Terms" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="paymentMethod" label="Payment Method" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="specialInstructions" label="Special Instructions" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="comments" label="Comments" width="120"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="legalEntityId" label="Legal Entity Id" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="currencyCode" label="Currency Code" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="externalIdType" label="External Id Type" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="itemPackageQuantity" label="Item Package Quantity" width="120"  show-overflow-tooltip="" />
				<el-table-column align="center" prop="aggregateQuantity" label="Aggregate Quantity" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="merchantCustomerID" label="Merchant Customer ID" width="120" show-overflow-tooltip=""  />
				<el-table-column align="center" prop="merchantSkuratio" label="Merchant Sku ratio" width="120" show-overflow-tooltip=""  />
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
import {  getConfirmedNewPOsPage } from '/@/api/modular/main/poFulfillingOrdersData';


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
	var res = await getConfirmedNewPOsPage(Object.assign(queryParams.value, tableParams.value));
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
