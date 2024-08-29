<script lang="ts" setup name="poOrderFulfillment">
import { ref, watch, onMounted } from 'vue';
import editDialog from './components/index.vue';
import newDialog from './components/newPos.vue';
import other from '/@/utils/other.ts';
import moment from 'moment';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { poFulfillingPage, Import, getPoFulfillingOrdersList, getConfirmedNewPOsPage, exportPoFulfillingOrders, exportConfirmedNewPOs } from '/@/api/modular/main/poFulfillingOrdersData';
import InfoDataDialog from '/@/components/infoDataDialog/index.vue';

const timevalue1 = ref(undefined);
const timevalue2 = ref(undefined);
const router = useRouter();
const queryParams = ref<any>({ site: null });
const tableParams = ref<any>({ page: 1, pageSize: 20 });
const ruleForm = ref<any>({ site: null });
const tableData = ref<any>([]);
const defaultTime = ref<[Date, Date]>([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]);
const visible = ref(false); //列表弹窗
const visible1 = ref(false); //列表弹窗
const loading = ref(false);
const importloading = ref(false);
const Exportloading = ref(false);
const dialogFormVisible = ref(false);
const dialogFormVisible1 = ref(false);
const ifClose = ref(false);
const pointerface = ref<any>(null);
const orderFulfillmentId = ref<number>(0);
const ifdisabled = ref(true);
const sites = ref([
	{
		key: null,
		value: '全部',
	},
	{
		key: 'UAE',
		value: 'UAE',
	},
	{
		key: 'SA',
		value: 'SA',
	},
]);
const exportStatus = ref([
	{
		key: -1,
		value: '全部',
	},
	{
		key: 1,
		value: '未导出',
	},
	{
		key: 2,
		value: '已导出',
	},
]);
const options = ref([
	{
		value: 'UAE',
		label: 'UAE',
	},
	{
		value: 'SA',
		label: 'SA',
	},
]);
const handleQuery = async (): void => {
	loading.value = true;
	if (queryParams.value.site === '全部') {
		queryParams.value.site = null;
	}
	if (queryParams.value.exportStatus === '全部') {
		queryParams.value.exportStatus = -1;
	} else if (queryParams.value.exportStatus === '未导出') {
		queryParams.value.exportStatus = 1;
	} else if (queryParams.value.exportStatus === '已导出') {
		queryParams.value.exportStatus = 2;
	}
	queryParams.value.orderTimeStartTime = null;
	queryParams.value.orderTimeEndtTime = null;
	queryParams.value.exportStartTime = null;
	queryParams.value.exportEndTime = null;
	if (timevalue1.value !== undefined) {
		(queryParams.value.orderTimeStartTime = moment(timevalue1.value[0]).format('YYYY-MM-DD')), (queryParams.value.orderTimeEndtTime = moment(timevalue1.value[1]).format('YYYY-MM-DD'));
	}
	if (timevalue2.value !== undefined) {
		(queryParams.value.exportStartTime = moment(timevalue2.value[0]).format('YYYY-MM-DD')), (queryParams.value.exportEndTime = moment(timevalue2.value[1]).format('YYYY-MM-DD'));
	}

	var res = await poFulfillingPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	if (queryParams.value.site === null) {
		queryParams.value.site = '全部';
	}
	if (queryParams.value.exportStatus === -1) {
		queryParams.value.exportStatus = '全部';
	} else if (queryParams.value.exportStatus === 1) {
		queryParams.value.exportStatus = '未导出';
	} else if (queryParams.value.exportStatus === 2) {
		queryParams.value.exportStatus = '已导出';
	}
	loading.value = false;
};

// 未更新时跳转上传表格管理页面
const queryTableImport = () => {
	router.push('/business/tableImport');
};
// 已更新状态
const opendialog = () => {
	dialogFormVisible.value = true;
};
const opendialog1 = () => {
	dialogFormVisible1.value = true;
	dialogFormVisible.value = false;
	ruleForm.value.site = '';
};
// 导入
const Imports = (file: any) => {
	if (ruleForm.value.site == '') {
		ElMessage.warning('请选择站点');
		return;
	}
	importloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	Import(formData, ruleForm.value.site)
		.then((res: any) => {
			importloading.value = false;
			if (res.data.code == 200) {
				ElMessage.success('导入成功');
				dialogFormVisible1.value = false;
				handleQuery();
			} else {
				importloading.value = false;
				ElMessage.error(res.message); // + res.message
			}
		})
		.catch(() => {
			importloading.value = false;
			dialogFormVisible1.value = false;
		});
};
// 导出
const exportPo = async (id: any, type: any) => {
	Exportloading.value = true;
	if (type === 1) {
		await exportPoFulfillingOrders({ id }, id).then((res) => {
			other.downloadfile(res);
			ElMessage.success('导出成功');
		});
	} else {
		await exportConfirmedNewPOs({ id }, id).then((res) => {
			other.downloadfile(res);
			ElMessage.success('导出成功');
		});
	}
	handleQuery();
	Exportloading.value = false;
};
//打开详情弹窗
const showModal = (id: any) => {
	orderFulfillmentId.value = id;
	pointerface.value = getPoFulfillingOrdersList;
	visible.value = true;
	ifClose.value = true;
};
const showModal1 = (id: any) => {
	orderFulfillmentId.value = id;
	pointerface.value = getConfirmedNewPOsPage;
	visible1.value = true;
	ifClose.value = true;
};
//关闭弹窗
const close = () => {
	ifClose.value = false;
	visible.value = false;
};
const close1 = () => {
	ifClose.value = false;
	visible1.value = false;
};

const cancel = () => {
	dialogFormVisible1.value = false;
	ifdisabled.value = true;
};

// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	handleQuery();
};

// infoDataDialog 配套参数
const formList = ref<any>([
	{
		label: 'ASIN',
		prop: 'asin',
	},
]);
const dataList = ref<any>([
	{
		label: 'PO',
		prop: 'po',
	},
	{
		label: 'ASIN',
		prop: 'asin',
	},
	{
		label: 'Quantity Requested',
		prop: 'quantityRequested',
	},
	{
		label: 'ERP-SKU',
		prop: 'erpSku',
	},
	{
		label: '采购国',
		prop: 'purchasingCountry',
	},
	{
		label: '打包数量',
		prop: 'packagingQuantity',
	},
	{
		label: '发货数量',
		prop: 'shipmentQuantity',
	},
	{
		label: '库存数量',
		prop: 'inventoryQuantity',
	},
	{
		label: '最近一批在途数量',
		prop: 'latestQuantities',
	},
	{
		label: '预计到仓日期',
		prop: 'warehouseArrivalDate',
	},
	{
		label: '最迟履单日期',
		prop: 'latestDate',
	},
	{
		label: '可履单数量',
		prop: 'confirmQuantity',
	},
	{
		label: '提示约仓时间',
		prop: 'bookingTime',
	},
]);
const dataList1 = ref<any>([
	{
		label: 'Order/PO Number',
		prop: 'po',
	},
	{
		label: 'External ID',
		prop: 'externalID',
	},
	{
		label: 'Model Number',
		prop: 'modelNumber',
	},
	{
		label: 'ASIN',
		prop: 'asin',
	},
	{
		label: 'Merchant Sku',
		prop: 'merchantSku',
	},
	{
		label: 'Title',
		prop: 'title',
	},
	{
		label: 'List Price',
		prop: 'listPrice',
	},
	{
		label: 'Discount',
		prop: 'discount',
	},
	{
		label: 'Cost',
		prop: 'cost',
	},
	{
		label: 'Quantity Ordered',
		prop: 'quantityOrdered',
	},
	{
		label: 'Quantity Confirmed',
		prop: 'quantityConfirmed',
	},
	{
		label: 'Previously Confirmed Quantity',
		prop: 'previouslyConfirmedQuantity',
	},
	{
		label: 'Hand Off Start',
		prop: 'handOffStart',
	},
	{
		label: 'Hand Off End',
		prop: 'handOffEnd',
	},
	{
		label: 'Hand Off Type',
		prop: 'handOffType',
	},
	{
		label: 'Expected Hand Off Date',
		prop: 'expectedHandOffDate',
	},
	{
		label: 'Availability Status',
		prop: 'availabilityStatus',
	},
	// {
	// 	label:'Error From Previous Upload Attempt',
	// 	prop:'errorFromPreviousUploadAttempt'
	// },
	{
		label: 'Vendor Code',
		prop: 'vendorCode',
	},
	{
		label: 'Fulfillment Center',
		prop: 'fulfillmentCenter',
	},
	{
		label: 'Condition',
		prop: 'condition',
	},
	{
		label: 'Order Date',
		prop: 'orderDate',
	},
	{
		label: 'Is Back Order',
		prop: 'isBackOrder',
	},
	{
		label: 'Freight Terms',
		prop: 'freightTerms',
	},
	{
		label: 'Payment Method',
		prop: 'paymentMethod',
	},
	{
		label: 'Special Instructions',
		prop: 'specialInstructions',
	},
	{
		label: 'Comments',
		prop: 'comments',
	},
	{
		label: 'Legal Entity Id',
		prop: 'legalEntityId',
	},
	{
		label: 'Currency Code',
		prop: 'currencyCode',
	},
	{
		label: 'External Id Type',
		prop: 'externalIdType',
	},
	{
		label: 'Item Package Quantity',
		prop: 'itemPackageQuantity',
	},
	{
		label: 'Aggregate Quantity',
		prop: 'aggregateQuantity',
	},
	{
		label: 'Legal Entity Id',
		prop: 'legalEntityId',
	},
	{
		label: 'Merchant Customer ID',
		prop: 'merchantCustomerID',
	},
	{
		label: 'Merchant Sku ratio',
		prop: 'merchantSkuratio',
	},
]);
function changeSite() {
	ifdisabled.value = false;
}
function closed() {
	ifdisabled.value = true;
}
onMounted(() => {
	handleQuery();
	ifdisabled.value = true;
});
</script>
<template>
	<div class="stock_sku_operations">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="站点">
					<el-select clearable="" v-model="queryParams.site" placeholder="全部">
						<el-option v-for="(item, index) in sites" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="订单时间">
					<el-date-picker v-model="timevalue1" type="daterange" start-placeholder="Start date" end-placeholder="End date" :default-time="defaultTime" />
				</el-form-item>
				<el-form-item label="导入时间">
					<el-date-picker v-model="timevalue2" type="daterange" start-placeholder="Start date" end-placeholder="End date" :default-time="defaultTime" />
				</el-form-item>
				<el-form-item label="导出状态">
					<el-select clearable="" v-model="queryParams.exportStatus" placeholder="全部">
						<el-option v-for="(item, index) in exportStatus" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									timevalue1=undefined;
									timevalue2=undefined;
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf">
				<el-button type="primary" :loading="importloading" @click="opendialog"> 导入 </el-button>
				<el-dialog v-model="dialogFormVisible" title="提示" :width="600">
					<el-icon><ele-WarningFilled /></el-icon>业务集成系统内的今日库存数据是否已全部更新？
					<template #footer>
						<span class="dialog-footer">
							<el-button size="default" type="info" @click="queryTableImport">未更新</el-button>
							<el-button :loading="importloading" type="primary" size="default" @click="opendialog1">已更新</el-button>
						</span>
					</template>
				</el-dialog>
				<el-dialog v-model="dialogFormVisible1" title="PO订单数据导入" :width="600" @closed="closed">
					<el-form label-width="200" label-position="right" :model="ruleForm" size="default">
						<div style="width: 100%; height: 35px; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffe0">
							<el-text size="20">选择站点，点击"确定"后，选择需要导入的文件，将导入该数据</el-text>
						</div>
						<el-form-item
							label="站点"
							prop="site"
							:rules="[
								{
									required: true,
									message: '站点不能为空',
									trigger: 'blur',
								},
							]"
						>
							<el-select @change="changeSite" v-model="ruleForm.site" size="large">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="cancel" size="default" type="info">取消</el-button>
							<el-upload ref="uploadRef" v-bind:disabled="ifdisabled" :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
								<el-button :loading="importloading" type="primary" size="default">确定</el-button>
							</el-upload>
						</span>
					</template>
				</el-dialog>
			</div>
			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column prop="fileName" label="文件名" align="center" show-overflow-tooltip="" />
				<el-table-column prop="batchId" label="批次号" align="center" />
				<el-table-column prop="site" label="站点" align="center" />
				<el-table-column prop="createTime" label="导入时间 " align="center" />
				<el-table-column prop="orderTime" label="订单时间 " align="center" />
				<!-- <el-table-column prop="contractedWarehouseTime" label="约仓时间 " align="center" />
				<el-table-column prop="deliveryTime" label="送达时间 " align="center" /> -->
				<el-table-column prop="exportStatus" label="导出状态 " align="center">
					<template #default="scope">
						<el-text v-if="scope.row.exportStatus == 1" type="primary">未导出</el-text>
						<el-text v-else type="success">已导出</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="exportTime" label="导出时间 " align="center" />
				<el-table-column label="操作" width="140" align="center" fixed="right">
					<template #default="scope">
						<el-dropdown style="margin-right: 20px">
							<el-button size="small" text type="primary">详情</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="showModal(scope.row.id)">POs PANEL</el-dropdown-item>
									<el-dropdown-item @click="showModal1(scope.row.id)">Confirmed New POs</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-dropdown style="margin-right: 20px">
							<el-button size="small" text type="primary">导出</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="exportPo(scope.row.id, 1)">POs PANEL</el-dropdown-item>
									<el-dropdown-item @click="exportPo(scope.row.id, 2)">Confirmed New POs</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<el-dialog v-model="visible" title="POs PANEL详情" @close="close" width="1000px">
				<!-- <editDialog :id="orderFulfillmentId" /> -->
				<InfoDataDialog :id="orderFulfillmentId" idName="poFulfillingOrderBatchId" :dataList="dataList" :pointerface="pointerface" :formList="formList" :ifClose="ifClose" />
			</el-dialog>
			<el-dialog v-model="visible1" title="Confirmed New POs详情" @close="close1" width="1000px">
				<InfoDataDialog :id="orderFulfillmentId" idName="poFulfillingOrderBatchId" :dataList="dataList1" :pointerface="pointerface" :formList="formList" :ifClose="ifClose" />
			</el-dialog>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.settingf {
	margin-bottom: 10px;
}

:deep( .el-card) {
	.el-dialog__footer .dialog-footer {
		display: flex;
		justify-content: end;

		button {
			margin-right: 20px;
		}
	}
}
</style>
