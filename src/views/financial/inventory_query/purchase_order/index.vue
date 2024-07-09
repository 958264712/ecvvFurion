<script lang="ts" setup name="purchase_order">
import { ref, onMounted, watch } from 'vue';
import { pYYPurchaseOrderPage, pYYPurchaseOrderupdate, importPurchaseUnitPrice } from '/@/api/modular/main/financial.ts';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import importDialog from '/@/components/importDialog/index.vue';
import axios from 'axios';
const tableData: any[] = ref([]);
const queryParams = ref<any>({ CreatorTime: '' });
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const dialogFormVisible = ref(false);
const area = ref('CN');
const IsEdit = ref<any>(false);
const loading = ref(false);
const loading2 = ref(false);
const visibleTextarea1 = ref(false);
const selectExport = ref([]);
const erpAndGoodsName = ref('');
const TableData = ref<any>([
	{
		titleCN: '采购单号',
		dataIndex: 'purchaseOrderNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购仓库',
		dataIndex: 'purchaseWarehouse',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购SKU个数',
		dataIndex: 'purchaseSKUQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购总数量',
		dataIndex: 'purchaseTotalQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购总金额',
		dataIndex: 'purchaseTotalAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流费用',
		dataIndex: 'logisticsCost',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未到货总数量',
		dataIndex: 'totalQuantityNotYetArrived',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未到货总金额',
		dataIndex: 'totalAmountNotYetArrived',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '已到货总金额',
		dataIndex: 'totalAmountAlreadyArrived',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单供应商',
		dataIndex: 'purchaseOrderSupplier',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '预计到货日期',
		dataIndex: 'estimatedArrivalDate',
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
		titleCN: '制单人',
		dataIndex: 'creator',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '制单时间',
		dataIndex: 'creationTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购审核人',
		dataIndex: 'purchaseReviewer',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购审核时间',
		dataIndex: 'purchaseReviewTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '账单日期',
		dataIndex: 'billingDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '平台供应商ID',
		dataIndex: 'platformSupplierID',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '平台订单号',
		dataIndex: 'platformOrderNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '平台订单状态',
		dataIndex: 'platformPrderStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流方式',
		dataIndex: 'logisticsMethod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流单号',
		dataIndex: 'logisticsNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '付款方式',
		dataIndex: 'paymentMethod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实付款',
		dataIndex: 'disbursements',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '差额(总金额-实付款)',
		dataIndex: 'difference',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '预付款',
		dataIndex: 'prepaymentContractNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '合同号',
		dataIndex: 'contractNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购备注',
		dataIndex: 'procurementRemarks',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '付款状态',
		dataIndex: 'paymentStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单状态',
		dataIndex: 'purchaseOrderStatus',
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
		dataIndex: 'erpSku',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品名称',
		dataIndex: 'goodsName',
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
		titleCN: '采购单价',
		dataIndex: 'purchaseUnitPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购金额',
		dataIndex: 'purchaseAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未到货数量',
		dataIndex: 'undeliveredQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '已到货数量',
		dataIndex: 'receivedQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品备注',
		dataIndex: 'productRemark',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '5天销量',
		dataIndex: 'sales5Day',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '15天销量',
		dataIndex: 'sales15Day',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '30天销量',
		dataIndex: 'sales30Day',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '可用数量',
		dataIndex: 'availableQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存上限',
		dataIndex: 'inventoryCeiling',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '单位',
		dataIndex: 'unit',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库位',
		dataIndex: 'storageLocation',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '款式1',
		dataIndex: 'style1',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '款式2',
		dataIndex: 'style2',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '款式3',
		dataIndex: 'style3',
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
		dataIndex: 'modelNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '材质',
		dataIndex: 'materialQuality',
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
		titleCN: '商品供应商',
		dataIndex: 'commoditySupplier',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流分摊前单价',
		dataIndex: 'unitPriceBeforLogisticsAllocation',
		checked: true,
		fixed: false,
	},
]);
const importType = ref('purchase_order');
const importText = ref('选择日期，点击"确定"后，选择需要导入的文件，将导入该数据');
const importFormList = ref<any>([
	{
		label: '日期',
		prop: 'Time',
		type: 'datePicker',
		dateType: 'month',
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
	if (queryParams.value.erpSkuList?.length > 0) {
		// queryParams.value.erpTextArea = '';
		queryParams.value.erpAndGoodsName = '';
	} else {
		queryParams.value.erpAndGoodsName = erpAndGoodsName.value;
		queryParams.value.erpSkuList = null;
	}
	await pYYPurchaseOrderPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	loading.value = false;
	IsEdit.value = false;
};
// 导入采购单
function ImportPurchaseOrder(file: any) {
	loading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	axios.post((import.meta.env.VITE_API_URL as any) + `/api/pYYPurchaseOrder/importPurchaseOrder`, formData).then((res) => {
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			getAppPage();
			loading.value = false;
		} else {
			ElMessage.error(res.message); // + res.message
			loading.value = false;
		}
	});
}
// 导入采购单价
function ImportPurchaseUnitPrice(file: any) {
	loading2.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	axios.post((import.meta.env.VITE_API_URL as any) + `/api/pYYPurchaseOrder/importPurchaseUnitPrice`, formData).then((res) => {
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			getAppPage();
			loading2.value = false;
		} else {
			ElMessage.error(res.message); // + res.message
			loading2.value = false;
		}
	});
}
const update = async (row: any) => {
	await pYYPurchaseOrderupdate(row);
	ElMessage.success('update succeeded');
	IsEdit.value = false;
	row.IsEdit = false;
};
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
};
const importClose = (bol: boolean) => {
	dialogFormVisible.value = bol;
};
const clearErp = () => {
	erpAndGoodsName.value = '';
	queryParams.value.erpTextArea = '';
	queryParams.value.erpSkuList = null;
};
const handleConfirm = () => {
	let str_array = [];
	str_array = queryParams.value.erpTextArea?.split(/[(\r\n)\r\n]+/);
	let arr = str_array?.map((item, index) => {
		if (item === '') {
			str_array.splice(index, 1);
		} else {
			return item.trim();
		}
	});
	queryParams.value.erpSkuList = arr;
	erpAndGoodsName.value = arr + '';
	visibleTextarea1.value = false;
};
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
watch(
	() => queryParams.value.erpTextArea,
	() => {
		let str_array = queryParams.value.erpTextArea?.split(/[(\r\n)\r\n]+/);
		let arr = str_array?.map((item, index) => {
			if (item === '') {
				str_array.splice(index, 1);
			} else {
				return item.trim();
			}
		});
		if (arr?.length > 0) {
			if (arr[0] !== undefined) {
				queryParams.value.erpSkuList = arr;
			} else {
				queryParams.value.erpSkuList = null;
			}
		}
	}
);
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="库存SKU">
					<el-popover :visible="visibleTextarea1" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input v-model="queryParams.erpTextArea" style="width: 215px"
								:autosize="{ minRows: 1, maxRows: 200 }" type="textarea"
								placeholder="可输入多个SKU精确查询，每行一个，最多支持200个" />
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.erpSkuList?.length ?? 0 }}/200</span>
							<el-button type="info" @click="() => {
			queryParams.erpTextArea = '';
			erpAndGoodsName = '';
		}
			">重置</el-button>
							<el-button type="primary" @click="handleConfirm()">确定</el-button>
						</div>
						<template #reference>
							<el-input v-model="erpAndGoodsName" clearable="" placeholder="请输入,点击展开可输多个"
								@clear="clearErp">
								<template #suffix>
									<el-icon class="el-input__icon">
										<ArrowDownBold @click="visibleTextarea1 = !visibleTextarea1"
											v-if="!visibleTextarea1" />
										<ArrowUpBold @click="visibleTextarea1 = !visibleTextarea1" v-else />
									</el-icon>
								</template>
							</el-input>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item label="制单时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="daterange" v-model="queryParams.CreatorTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search"
							@click="getAppPage()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
			queryParams.erpTextArea = '';
			erpAndGoodsName = '';
			queryParams = {};
			getAppPage();
		}
			" style="width: 70px; margin-right: 2px">
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf" style="margin-bottom: 5px; display: flex; justify-content: space-between">
				<div class="flex flex-wrap items-center">
					<el-upload :on-change="ImportPurchaseOrder" :multiple="false" action="#" :show-file-list="false"
						:auto-upload="false" name="file">
						<el-button :loading="loading" type="primary">导入采购订单</el-button>
					</el-upload>
					<el-button style="margin-left: 10px" @click="dialogFormVisible = true" type="primary"> 导入采购单价
					</el-button>
					<el-dialog v-model="dialogFormVisible" title="普源采购单价数据导入" width="600px" center>
						<importDialog :type="importType" :text="importText" :formList="importFormList"
							:importsInterface="importPurchaseUnitPrice" @close="importClose"
							@importQuery="getAppPage" />
					</el-dialog>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%"
				@selection-change="(selection: any) => selectChange(selection)" v-loading="loading"
				tooltip-effect="light">
				<el-table-column width="85" align="center" fixed="left" show-overflow-tooltip="">
					<template #header>
						<el-button style="background-color: transparent; border: none; color: #df1515"
							icon="ele-Setting"></el-button>
					</template>
					<template #default="scope">
						<el-button v-if="scope.row.IsEdit" icon="ele-Document" size="small" text="" type="primary"
							@click="update(scope.row)"></el-button>
						<el-button v-if="!scope.row.IsEdit" icon="ele-Edit" size="small" text="" type="primary"
							@click="openEdit(scope.row)"></el-button>
					</template>
				</el-table-column>
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column v-if="item.dataIndex == 'purchaseUnitPrice'" :fixed="item.fixed"
						:prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center"
						min-width="150" show-overflow-tooltip="">
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.purchaseUnitPrice"
									clearable="" />
								<div v-else>{{ scope.row.purchaseUnitPrice }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else :fixed="item.fixed" :prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150"
						show-overflow-tooltip="" />
				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}

:deep(.el-dialog__title) {
	color: white;
}

/deep/ .el-textarea__inner {
	box-shadow: initial;
	padding: 0;
	margin: 4px 0 4px 3px;
	height: 142px !important;
}
</style>
