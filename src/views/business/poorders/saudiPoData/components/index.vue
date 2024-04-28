<script lang="ts" setup name="new_saudiPoData">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { newSaudiPage, newUpdate, getConfirmedNewPOsPage, newMultipleExportByTemplate, getNewPoDataExportHistory, newDownLoadPOZip } from '/@/api/modular/main/aSINBasicData.ts';
import PoDataSource from './poDataSource.vue';
import { service } from '/@/utils/request';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';
import moment from 'moment';
const timer = ref<any>();
const startTime = ref(0); // 初始开始请求时间
const loading = ref(false);
const loading1 = ref(false);
const ifClose = ref(false);
const ifClose1 = ref(false);
const cardLoading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<PoParamsType>({
	// orderdate:'orderDate',
	// type: 'Vendor',
});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const pos = ref('');
const visible = ref(false); //ASIN列表弹窗
const visible1 = ref(false); //编辑OrderDate弹窗
const visible2 = ref(false); //导出历史记录弹窗
const remarkDisabled = ref(true);
const costpriceBatchId = ref<number>(0);
const showId = ref<number>(0);
const remark = ref('');
const disabledList = ref<any>([]);
const selectedRows = ref([]);
const selectedRowKeys = ref([]);
const formList = ref<any>([]);
const formList1 = ref<any>([
	{
		label: 'ASIN',
		prop: 'asin',
	},
]);
const dataList = ref<any>([
	{
		label: '导出任务',
		prop: 'exportTask',
	},
	{
		label: 'PO',
		prop: 'po',
	},
	{
		label: '导出时间',
		prop: 'exportTime',
	},
	{
		label: '账号',
		prop: 'account',
	},
	{
		label: '姓名',
		prop: 'name',
	},
]);
const tabelList = ref<any>([
	{
		titleCN: 'PO',
		titleEN: 'PO',
		dataIndex: 'po',
	},
	{
		titleCN: 'Vendor',
		titleEN: 'Vendor',
		dataIndex: 'vendor',
	},
	{
		titleCN: 'ShipToLocation',
		titleEN: 'ShipToLocation',
		dataIndex: 'shipToLocation',
	},
	{
		titleCN: 'OrderDate',
		titleEN: 'OrderDate',
		dataIndex: 'orderDate',
	},
	{
		titleCN: '状态',
		titleEN: 'state',
		dataIndex: 'state',
	},
	{
		titleCN: '约仓日期',
		titleEN: 'contractedWarehouseTime',
		dataIndex: 'contractedWarehouseTime',
	},
	{
		titleCN: '最迟履单日期',
		titleEN: 'latestDate',
		dataIndex: 'latestDate',
	},
	{
		titleCN: '实际履单日期',
		titleEN: 'actualDate',
		dataIndex: 'actualDate',
	},
	{
		titleCN: 'Invoiced Status',
		titleEN: 'Invoiced Status',
		dataIndex: 'invoicedStatus',
	},
]);
const optionList = ref<any>([
	{
		label: '待约仓',
		value: 0,
	},
	{
		label: '已约仓',
		value: 1,
	},
	{
		label: '已送达',
		value: 2,
	},
	{
		label: '取消',
		value: 3,
	},
]);
const statusOptionList = ref<any>([
	{
		label: 'YES',
		value: 1,
	},
	{
		label: 'NO',
		value: 2,
	},
]);
const vendorOptionList = ref<any>([
	{
		label: 'Vendor',
		value: 'Vendor',
	},
	{
		label: 'Location',
		value: 'Location',
	},
]);
const storeOptionList = ref<any>([
	{
		label: '全部',
		value: null,
	},
	{
		label: '待约仓',
		value: 0,
	},
	{
		label: '已约仓',
		value: 1,
	},
	{
		label: '已送达',
		value: 2,
	},
	{
		label: '取消',
		value: 3,
	},
]);
const orderDateOptionList = ref<any>([
	{
		label: 'orderDate',
		value: 'orderDate',
	},
	{
		label: '约仓时间',
		value: '约仓时间',
	},
	{
		label: '最迟履单时间',
		value: '最迟履单时间',
	},
]);
const invoicedStatusOptionList = ref<any>([
	{
		label: 'ALL',
		value: null,
	},
	{
		label: 'YES',
		value: 1,
	},
	{
		label: 'NO',
		value: 2,
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
//打开弹窗
const showModal = (id: any) => {
	showId.value = id;
	ifClose1.value = true;
	visible.value = true;
};
const showModal1 = (val: any, id: any) => {
	pos.value = id;
	remark.value = val;
	visible1.value = true;
};
const showModal2 = () => {
	// costpriceBatchId = id;
	ifClose.value = true;
	visible2.value = true;
};

//关闭弹窗
const close2 = () => {
	visible2.value = false;
	ifClose.value = false;
};
const close1 = () => {
	visible1.value = false;
	ifClose1.value = false;
};
const close = () => {
	visible.value = false;
};

// 修改remark
const submit = () => {
	newUpdate({
		id: pos.value,
		remark: remark.value,
	}).then((res) => {
		if (res.data.type === 'success') {
			ElMessage.success('Edit successfully');
			handleQuery();
		} else {
			ElMessage.error('Edit failed ' + res.message);
		}
		remarkDisabled.value = true;
		visible1.value = false;
	});
};
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	if (queryParams.value.type === 'Vendor') {
		queryParams.value.vendor = queryParams.value.type1;
		queryParams.value.shipToLocation = null;
		queryParams.value.type1 = null;
	} else if (queryParams.value.type === 'Location') {
		queryParams.value.shipToLocation = queryParams.value.type1;
		queryParams.value.vendor = null;
		queryParams.value.type1 = null;
	}
	if (queryParams.value.orderDate === 'orderDate') {
		queryParams.value.orderDateStartTime = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : null;
		queryParams.value.orderDateEndTime = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : null;
		queryParams.value.contractedWarehouseTimeEndTime = null;
		queryParams.value.contractedWarehouseTimeStartTime = null;
		queryParams.value.latestDateStartTime = null;
		queryParams.value.latestDateEndTime = null;
	} else if (queryParams.value.orderDate === '约仓时间') {
		queryParams.value.contractedWarehouseTimeStartTime = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : null;
		queryParams.value.contractedWarehouseTimeEndTime = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : null;
		queryParams.value.orderDateStartTime = null;
		queryParams.value.orderDateEndTime = null;
		queryParams.value.latestDateStartTime = null;
		queryParams.value.latestDateEndTime = null;
	} else if (queryParams.value.orderDate === '最迟履单时间') {
		queryParams.value.latestDateStartTime = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : null;
		queryParams.value.latestDateEndTime = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : null;
		queryParams.value.contractedWarehouseTimeEndTime = null;
		queryParams.value.contractedWarehouseTimeStartTime = null;
		queryParams.value.orderDateStartTime = null;
		queryParams.value.orderDateEndTime = null;
	}
	var res = await newSaudiPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	res.data.result?.items.map((item) => {
		disabledList.value.push(item.id);
	});
	loading.value = false;
};
// 修改状态等内容
const openEdit = async (id: any, row): void => {
	if (disabledList.value.some((item) => item === id)) {
		const index = disabledList.value.findIndex((item) => item === id);
		disabledList.value.splice(index, 1);
	} else {
		if (id > 0) {
			let obj = {};
			if (row.invoicedStatus>=0) {
				obj.invoicedStatus = row.invoicedStatus;
			}
			if (row.contractedWarehouseTime) {
				obj.contractedWarehouseTime = moment(row.contractedWarehouseTime).format();
			}
			if (row.actualDate) {
				obj.actualDate = moment(row.actualDate).format();
			}
			if (row.state >= 0) {
				obj.state = row.state;
			}
			obj.id = row.id
			newUpdate(Object.assign(obj))
				.then((res) => {
					if (res.data.type === 'success') {
						ElMessage.success('Edit successfully');
						disabledList.value.push(id);
						handleQuery();
					} else {
						ElMessage.error('Edit failed ' + res.message);
					}
				})
				.catch(() => {
					disabledList.value.push(id);
				});
		} else {
			ElMessage.error('This id is null');
		}
	}
};
const disabledAuto = (scope: any): void => {
	return disabledList.value.some((item) => item === scope.row.id);
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
// 开始准备轮询
const multipleExport = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('Please select at least one PO');
		return;
	}
	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.id);
	}
	cardLoading.value = true;
	newMultipleExportByTemplate(data).then((res: any) => {
		if (res.data.code !== 200) {
			cardLoading.value = false;
			ElMessage.error(res.message);
			return;
		} else {
			ElMessage.success('Table generated, waiting for compression');
			startTime.value = new Date().getTime(); // 获取触发轮询时的时间
			inquireData(); // 调用轮询接口,开始进行轮询
		}
	});
};

const inquireData = () => {
	const reload = () => {
		clearTimeout(timer.value); // 清除定时器
		// 超过3分钟则停止轮询
		if (new Date().getTime() - startTime.value > 3 * 60 * 1000) {
			clearTimeout(timer.value);
			return;
		}
		// 3s一次, 轮询中
		timer.value = setTimeout(() => {
			inquireData(); // 调用轮询
		}, 3000);
	};
	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.po);
	}
	newDownLoadPOZip({ poList: data, count: selectedRows.value.length })
		.then((res: any) => {
			if (res.data.result === '') {
				// 没成功,调用轮询
				reload();
			} else {
				ElMessage.success('Build succeeded');
				cardLoading.value = false;
				window.open(res.data.result, '_blank');
				handleQuery();
			}
		})
		.catch((err: any) => {
			// 请求错误,也继续轮询
			// reload()
			cardLoading.value = false;
			ElMessage.error('Download exception: please contact the technician');
		});
};

// 获取keys
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item?.id);
	});
};

handleQuery();
</script>
<template>
	<div class="poDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="PO">
					<el-input v-model="queryParams.po" clearable="" placeholder="请输入PO" />
				</el-form-item>
				<el-form-item>
					<el-select v-model="queryParams.type" style="width: 90px" placeholder="vendor">
						<el-option v-for="i in vendorOptionList" :value="i.value" :label="i.label" />
					</el-select>
					<el-input v-model="queryParams.type1" style="width: 150px" clearable="" placeholder="Please enter" />
				</el-form-item>
				<el-form-item>
					<el-select v-model="queryParams.orderDate" style="width: 90px" placeholder="orderDate">
						<el-option v-for="i in orderDateOptionList" :value="i.value" :label="i.label" />
					</el-select>
					<el-date-picker v-model="queryParams.time" type="daterange" start-placeholder="Start date" end-placeholder="End date" format="YYYY-MM-DD" date-format="YYYY/MM/DD" style="width: 290px" />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryParams.state" placeholder="全部">
						<el-option v-for="i in storeOptionList" :value="i.value" :label="i.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="Invoiced Status">
					<el-select v-model="queryParams.invoicedStatus" placeholder="ALL">
						<el-option v-for="i in invoicedStatusOptionList" :value="i.value" :label="i.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> Search </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									handleQuery();
								}
							"
						>
							Reset
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-dropdown>
				<el-button type="primary">Export</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="multipleExport">Export PO </el-dropdown-item>
						<!-- <el-dropdown-item> PO Panel </el-dropdown-item> -->
						<el-dropdown-item @click="showModal2"> Export History </el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="55" />
				<template v-for="item in tabelList">
					<el-table-column v-if="item.dataIndex === 'shipToLocation'" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row.shipToLocation.substring(0, 4) }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'state'" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							<el-select v-model="scope.row.state" :disabled="disabledAuto(scope)">
								<el-option v-for="i in optionList" :value="i.value" :label="i.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'contractedWarehouseTime'" :prop="item.dataIndex" :label="item.titleCN" align="center" width="125px">
						<template #default="scope">
							<el-date-picker v-model="scope.row.contractedWarehouseTime" style="width: 96px" format="YYYY-MM-DD" type="date" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'actualDate'" :prop="item.dataIndex" :label="item.titleCN" align="center" width="125px">
						<template #default="scope">
							<el-date-picker v-model="scope.row.actualDate" style="width: 96px" format="YYYY-MM-DD" type="date" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'invoicedStatus'" :prop="item.dataIndex" :label="item.titleCN" align="center" width="122px" show-overflow-tooltip="">
						<template #default="scope">
							<el-select v-model="scope.row.invoicedStatus" :disabled="disabledAuto(scope)">
								<el-option v-for="i in statusOptionList" :value="i.value" :label="i.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'orderDate'" width="150px" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" />
					<el-table-column v-else-if="item.dataIndex" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" />
				</template>

				<el-table-column label="Operation" width="350" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button size="small" @click="openEdit(scope.row.id, scope.row)"> Edits </el-button>
						<el-button size="small" @click="showModal(scope.row.id)"> Details </el-button>
						<el-button type="info" size="small" @click="showModal1(scope.row.remark, scope.row.id)"> Remark </el-button>
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
			<!-- <el-dialog v-model="visible" title="Product List" @close="close" width="1000px">
				<PoDataSource :po="pos"></PoDataSource>
			</el-dialog> -->
			<el-dialog v-model="visible1" title="Remark" width="400px">
				<el-input v-model="remark" placeholder="Please enter orderDate" :disabled="remarkDisabled" style="height: 30px" />
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="visible1 = false">Cancel</el-button>
						<el-button type="primary" @click="remarkDisabled = false" v-if="remarkDisabled"> Edit </el-button>
						<el-button type="primary" @click="submit" v-else> Confirm </el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog v-model="visible2" title="导出历史记录" @close="close2" width="1000px">
				<infoDataDialog :id="111" idName="dibaiPoDataDataId" :dataList="dataList" :ifClose="ifClose" :pointerface="getNewPoDataExportHistory" :formList="formList" />
			</el-dialog>
			<el-dialog v-model="visible" title="Confirmed New POs详情" @close="close1" width="1000px">
				<infoDataDialog :id="showId" idName="id" :dataList="dataList1" :pointerface="getConfirmedNewPOsPage" :formList="formList1" :ifClose="ifClose1" />
			</el-dialog>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 500px;
}

.dialog-footer button:first-child {
	margin-right: 10px;
}

.el-link {
	margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
	vertical-align: text-bottom;
}
/deep/ .el-select {
	.el-input {
		width: 100%;
	}
}
</style>
