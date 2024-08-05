<script lang="ts" setup name="purchase_receipt_form">
import { ref, onMounted, watch } from 'vue';
import { purchaseReceiptFormPage, purchaseReceiptFormImport } from '/@/api/modular/main/financial.ts';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import axios from 'axios';
const tableData: any[] = ref([]);
const queryParams = ref<any>({ CreatorTime: '' });
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const area = ref('CN');
const loading = ref(false);
const selectExport = ref([]);
const TableData = ref<any>([
	{
		titleCN: '入库单号',
		dataIndex: 'warehouseEntryNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库单状态',
		dataIndex: 'inventoryStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '制单日期',
		dataIndex: 'creatorTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '关联采购单',
		dataIndex: 'associatedPurchaseOrderNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库数量',
		dataIndex: 'inventoryQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '订单供应商',
		dataIndex: 'orderSupplier',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实际到货天数',
		dataIndex: 'actualDeliveryDays',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '制单人',
		dataIndex: 'singleMaker',
		checked: true,
		fixed: false,
	},

	{
		titleCN: '审核人',
		dataIndex: 'reviewer',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '审核时间',
		dataIndex: 'reviewTime',
		checked: true,
		fixed: false,
	},

	{
		titleCN: '财务审核人',
		dataIndex: 'financialAuditor',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '财务审核时间',
		dataIndex: 'financialAuditTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流单号',
		dataIndex: 'logisticsTrackingNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库单备注',
		dataIndex: 'remarksOnTheWarehouseReceipt',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '金额',
		dataIndex: 'amountOfMoney',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库仓库',
		dataIndex: 'storageWarehouse',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '已入库数量',
		dataIndex: 'quantityAlreadyInStock',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库质检员',
		dataIndex: 'warehouseQualityInspector',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购员',
		dataIndex: 'purchaser',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单合同',
		dataIndex: 'purchaseOrderContractNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '1688单号',
		dataIndex: 'trackingNumber1688',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购数量',
		dataIndex: 'purchaseQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '质检数量',
		dataIndex: 'qualityInspectionQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '不合格数量',
		dataIndex: 'unqualifiedQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本次入库数量',
		dataIndex: 'theQuantityOfGoodsReceivedThisTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未含税单价',
		dataIndex: 'unitPriceExcludingTax',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未含税金额',
		dataIndex: 'excludingTaxAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '含税单价',
		dataIndex: 'unitPriceIncludingTax',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '含税金额',
		dataIndex: 'taxInclusiveAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '税率（单位：%）',
		dataIndex: 'taxRate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '税额',
		dataIndex: 'taxAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库状态',
		dataIndex: 'storageStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '图片',
		dataIndex: 'image',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存SKU',
		dataIndex: 'inventorySKU',
		checked: true,
		fixed: false,
	},

	{
		titleCN: '商品名称',
		dataIndex: 'productName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品状态',
		dataIndex: 'productStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品备注',
		dataIndex: 'productRemarks',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '品牌',
		dataIndex: 'brand',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '规格',
		dataIndex: 'specifications',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '型号',
		dataIndex: 'model',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '材质',
		dataIndex: 'textureOfMaterial',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '业绩归属人',
		dataIndex: 'performanceOwner',
		checked: true,
		fixed: false,
	},

	{
		titleCN: '库位',
		dataIndex: 'warehouseLocation',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品供应商',
		dataIndex: 'productSupplier',
		checked: true,
		fixed: false,
	},
]);

// 查询
const getAppPage = async (): void => {
	loading.value = true;
	queryParams.value.StartCreatorTime = queryParams.value.CreatorTime ? queryParams.value.CreatorTime[0] : null;
	queryParams.value.EndCreatorTime = queryParams.value.CreatorTime ? queryParams.value.CreatorTime[1] : null;
	if (queryParams.value.StartCreatorTime) {
		const date1 = new Date(queryParams.value.StartCreatorTime);
		const year1 = date1.getFullYear();
		const month1 = date1.getMonth() + 1;
		const day1 = date1.getDate();
		queryParams.value.StartCreatorTime = year1 + '-' + month1 + '-' + day1;
	}
	if (queryParams.value.EndCreatorTime) {
		const date2 = new Date(queryParams.value.EndCreatorTime);
		const year2 = date2.getFullYear();
		const month2 = date2.getMonth() + 1;
		const day2 = date2.getDate();
		queryParams.value.EndCreatorTime = year2 + '-' + month2 + '-' + day2;
	}
	await purchaseReceiptFormPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	loading.value = false;
};
// 导入采购出库单
function Imports(file: any) {
	loading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/purchaseReceiptForm/import`, formData)
		.then((res) => {
			if (res.data.code == 200) {
				ElMessage.success('Import succeeded');
				getAppPage();
				loading.value = false;
			} else {
				ElMessage.error(res.message); // + res.message
				loading.value = false;
			}
		})
		.catch((res) => {
			loading.value = false;
		});
}
onMounted(() => {
	getAppPage();
});

// 获取keys
const selectChange = (selection: any) => {
	selectExport.value.splice(0, selectExport.value.length);
	selection.map((item: any) => {
		selectExport.value.push(item.id);
	});
};
// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	getAppPage();
};
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="制单时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange" v-model="queryParams.CreatorTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search" @click="getAppPage()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									getAppPage();
								}
							"
							style="width: 70px; margin-right: 2px"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf" style="margin-bottom: 5px; display: flex; justify-content: space-between">
				<div class="flex flex-wrap items-center">
					<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
						<el-button :loading="loading" type="primary">导入</el-button>
					</el-upload>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%" @selection-change="(selection: any) => selectChange(selection)" v-loading="loading" tooltip-effect="light">
				<!-- <el-table-column type="selection" width="55" /> -->
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex" show-overflow-tooltip :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" />
				</template>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
