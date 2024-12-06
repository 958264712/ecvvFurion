<script lang="ts" setup name="new_saudiPoData">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
	newSaudiPage,
	newUpdate,
	getConfirmedNewPOsPage,
	newMultipleExportByTemplate,
	newMultipleExportByTemplateListBin,
	getNewPoDataExportHistory,
	newDownLoadPOZip,
	exportNewPoData,
	exportNewPoDataShipments
} from '/@/api/modular/main/aSINBasicData.ts';
import { service } from '/@/utils/request';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';
import importDialog from '/@/components/newImportDialog/index.vue';
import exportDialog from '/@/components/newPoImportDialog/index.vue';
import other from '/@/utils/other.ts';
import moment from 'moment';

interface PoParamsType {
  orderDate?: string;
  type?: string;
  state?: string;
  type1?: string;
  po?: string;
  vendor?: string;
  shipToLocation?: string;
  invoicedStatus?: number;
  time?: any;
  checkbox?: boolean;
  orderDateStartTime?: string;
  orderDateEndTime?: string;
  contractedWarehouseTimeStartTime?: string;
  contractedWarehouseTimeEndTime?: string;
  latestDateStartTime?: string;
  latestDateEndTime?: string;
  windowStart?: string;
  windowEnd?: string;
  bookTimeStart?: string;
  bookTimeEnd?: string;
  actualDateStart?: string;
  actualDateEnd?: string;
  descStr?: string;
  field?: string;
}
interface PoRowType {
  id?: number;
  po?: string; 
}

const timer = ref<any>();
const startTime = ref(0); // 初始开始请求时间
const loading = ref(false);
const ifClose = ref(false);
const ifClose1 = ref(false);
const cardLoading = ref(false);
const tableData = ref<any>([]);

const baseUrl = import.meta.env.VITE_API_URL
const importDialogRef = ref();
const exportDialogRef = ref();
const url = ref('/api/newPoData/upLoadNewPoData');
const exportUrl = ref('/api/newPoData/upLoadNewPoDataDownBarCode');
const tableAddress = `${baseUrl}/upload/TableAddress/PO履单系统批量上传模版.xlsx`;
const exportTableAddress = `https://sa1api.ecvv.com/upload/TableAddress/条码批量.xlsx`;

const queryParams = ref<PoParamsType>({
	orderDate: 'CreationDate',
	type: 'Vendor',
	state: '全部',
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
const isImportNewPoData = ref(false);
const remarkDisabled = ref(true);
const showId = ref<number>(0);
const remark = ref('');
const exportAsinBarCode = ref('');
const disabledList = ref<any>([]);
const selectedRows = ref<PoRowType[]>([]);
const selectedRowKeys = ref<number[]>([]);
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
		label: '导出文件',
		prop: 'downloadPath',
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
		width: 130,
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
		titleCN: 'Creation Date',
		titleEN: 'Creation Date',
		dataIndex: 'creationDate',
	},
	{
		titleCN: 'OrderDate',
		titleEN: 'OrderDate',
		dataIndex: 'orderDate',
	},
	{
		titleCN: 'Remind Booking Date',
		titleEN: 'RWAppointmentDate',
		dataIndex: 'rwAppointmentDate',
	},
	{
		titleCN: 'Status',
		titleEN: 'state',
		dataIndex: 'state',
	},
	{
		titleCN: 'Actual Booking Date',
		titleEN: 'contractedWarehouseTime',
		dataIndex: 'contractedWarehouseTime',
	},
	{
		titleCN: 'Fulfillment Deadline',
		titleEN: 'latestDate',
		dataIndex: 'latestDate',
	},
	{
		titleCN: 'Actual Fulfillment Date',
		titleEN: 'actualDate',
		dataIndex: 'actualDate',
	},
	{
		titleCN: 'Invoiced Status',
		titleEN: 'Invoiced Status',
		dataIndex: 'invoicedStatus',
	},
	{
		titleCN: 'Export Status By PO Xlsx',
		titleEN: 'Export Status By PO Xlsx',
		dataIndex: 'exportStatusByXlsx',
	},
	{
		titleCN: 'Export Status By BarCode Docx',
		titleEN: 'Export Status By BarCode Docx',
		dataIndex: 'exportStatusByDocx',
	},
	{
		titleCN: 'ASIN Count',
		titleEN: 'ASIN Count',
		dataIndex: 'asinCount',
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
		label: 'ShipToLocation',
		value: 'ShipToLocation',
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
		label: 'Creation Date',
		value: 'Creation Date',
	},
	{
		label: 'orderDate',
		value: 'orderDate',
	},
	{
		label: 'Remind Booking Date',
		value: 'Remind Booking Date',
	},
	{
		label: 'Actual Booking Date',
		value: 'Actual Booking Date',
	},
	{
		label: 'Fulfillment Deadline',
		value: 'Fulfillment Deadline',
	},
	{
		label: 'Actual Fulfillment Date',
		value: 'Actual Fulfillment Date',
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
		label: 'ERPQTY',
		prop: 'inventoryQuantity',
	},
	{
		label: 'Storage Bin',
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
	{
		label: 'Export Status By BarCode Docx',
		prop: 'exportHistoryDocx',
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
	handleQuery();
};

const switchOrder = (key:string) => {
	switch (key) {
		case 'orderDate':
			queryParams.value.orderDateStartTime = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : undefined;
			queryParams.value.orderDateEndTime = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : undefined;
			break;
		case 'Actual Booking Date':
			queryParams.value.contractedWarehouseTimeStartTime = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : undefined;
			queryParams.value.contractedWarehouseTimeEndTime = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : undefined;
			break;
		case 'Fulfillment Deadline':
			queryParams.value.latestDateStartTime = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : undefined;
			queryParams.value.latestDateEndTime = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : undefined;
			break;
		case 'Creation Date':
			queryParams.value.windowStart = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : undefined;
			queryParams.value.windowEnd = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : undefined;
			break;
		case 'Remind Booking Date':
			queryParams.value.bookTimeStart = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : undefined;
			queryParams.value.bookTimeEnd = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : undefined;
			break;
		case 'Actual Fulfillment Date':
			queryParams.value.actualDateStart = queryParams.value.time?.length ? moment(queryParams.value.time[0]).format() : undefined;
			queryParams.value.actualDateEnd = queryParams.value.time?.length ? moment(queryParams.value.time[1]).format() : undefined;
			break;
	}
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
	tableData.value = [];
	if (queryParams.value.type === 'Vendor') {
		queryParams.value.vendor = queryParams.value.type1;
		queryParams.value.shipToLocation = undefined;
	} else if (queryParams.value.type === 'ShipToLocation') {
		queryParams.value.shipToLocation = queryParams.value.type1;
		queryParams.value.vendor = undefined;
	}
	if (queryParams.value.state === '全部') {
		queryParams.value.state = undefined;
	}
	if (queryParams.value.orderDate !== undefined) {
		queryParams.value.windowStart =
			queryParams.value.windowEnd =
			queryParams.value.bookTimeStart =
			queryParams.value.bookTimeEnd =
			queryParams.value.actualDateStart =
			queryParams.value.actualDateEnd =
			queryParams.value.contractedWarehouseTimeStartTime =
			queryParams.value.contractedWarehouseTimeEndTime =
			queryParams.value.orderDateStartTime =
			queryParams.value.orderDateEndTime =
				undefined;
		switchOrder(queryParams.value.orderDate);
	}
	var res = await newSaudiPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	res.data.result?.items.map((item:any) => {
		disabledList.value.push(item.id);
	});
	loading.value = false;
};
// 修改状态等内容
const openEdit = async (id: any, row:any): Promise<void> => {
	if (disabledList.value.some((item:any) => item === id)) {
		const index = disabledList.value.findIndex((item:any) => item === id);
		disabledList.value.splice(index, 1);
	} else {
		if (id > 0) {
			let obj:any = {};
			if (row.invoicedStatus >= 0) {
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
			obj.id = row.id;
			newUpdate(Object.assign(obj))
				.then((res) => {
					if (res.data.type === 'success') {
						ElMessage.success('Edit successfully');
						disabledList.value.push(id);
						// handleQuery();
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
	return disabledList.value.some((item:any) => item === scope.row.id);
};
// 排序
const sortChange = (data: { column: any; prop: string; order: any }) => {
	queryParams.value.descStr = data.order;
	queryParams.value.field = data.prop;
	handleQuery();
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
const multipleExport = (interfaces: any, type: string) => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('Please select at least one PO');
		return;
	}
	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.id);
	}
	cardLoading.value = true;
	interfaces(Object.assign({ poList: data, Site: 'SA' }, queryParams.value)).then((res: any) => {
		if (res.data.code !== 200) {
			cardLoading.value = false;
			ElMessage.error(res.message);
			return;
		} else {
			ElMessage.success('Table generated, waiting for compression');
			startTime.value = new Date().getTime(); // 获取触发轮询时的时间
			if (type === 'listBin') {
				inquireData(false, res.data.result); // 调用轮询接口,开始进行轮询
			} else {
				inquireData(true); // 调用轮询接口,开始进行轮询
			}
		}
	}).catch((err:any) => {
		cardLoading.value = false;
		ElMessage.error(err);
	});
};

const inquireData = (bol: boolean, fileName = '') => {
	const reload = () => {
		clearTimeout(timer.value); // 清除定时器
		// 超过3分钟则停止轮询
		if (new Date().getTime() - startTime.value > 3 * 60 * 1000) {
			clearTimeout(timer.value);
			return;
		}
		// 3s一次, 轮询中
		timer.value = setTimeout(() => {
			inquireData(bol, fileName); // 调用轮询
		}, 3000);
	};
	if (!bol) {
		service({
			url: `/api/newPoData/downPoFile/${fileName}`,
			method: 'post',
		}).then((res: any) => {
			if (res.data.result === '') {
				// 没成功,调用轮询
				reload();
			} else {
				window.open(res.data.result, '_blank');
				cardLoading.value = false;
				isImportNewPoData.value = false;
				exportAsinBarCode.value = '';
				ElMessage.success('Build succeeded');
				handleQuery();
			}
		});
	} else {
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
	}
};
// 导出po列表
const poListExport = async () => {
	cardLoading.value = true;
	await exportNewPoData({ poIdList: selectedRowKeys.value })
		.then((res) => {
			cardLoading.value = false;
			other.downloadfile(res);
			ElMessage.success('Export Success!');
		})
		.catch((err) => {
			cardLoading.value = false;
			ElMessage.error(err);
		});
};
const poListShipmentExport = async () => {
	cardLoading.value = true;
	await exportNewPoDataShipments({ poIdList: selectedRowKeys.value })
		.then((res:any) => {
			cardLoading.value = false;
			other.downloadfile(res);
			ElMessage.success('Export Success!');
		})
		.catch((err:any) => {
			cardLoading.value = false;
			ElMessage.error(err);
		});
}
// 导入newpodata改变数据状态
const importNewPoData = () => {
	importDialogRef.value.openDialog();
};
const exportNewPoDataBtn = () => {
	exportUrl.value = '/api/newPoData/upLoadNewPoDataDownBarCode/' + (queryParams.value.checkbox ? true :false)
	exportDialogRef.value.openDialog();
}
const returnHref = (str:string) => {
	startTime.value = new Date().getTime(); // 获取触发轮询时的时间
	inquireData(false, str);
}

// 获取keys
const selectChange = (selection: PoRowType[]) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: PoRowType) => {
		 if (item.id !== undefined) {
        	selectedRowKeys.value.push(item.id);
		}
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
				<el-form-item label="Status">
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
									queryParams = {
										orderDate: 'Creation Date',
										type: 'Vendor',
										state: '全部',
									};
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
			<div style="display: flex">
				<el-dropdown style="margin-right: 10px">
					<el-button type="primary" :loading="cardLoading">Export</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="multipleExport(newMultipleExportByTemplate, 'poList')">Export PO</el-dropdown-item>
							<el-dropdown-item @click="multipleExport(newMultipleExportByTemplateListBin, 'listBin')">PO Picking List-Bin</el-dropdown-item>
							<el-dropdown-item @click="showModal2"> Export History </el-dropdown-item>
							<el-dropdown-item @click="poListExport" :disabled="selectedRowKeys?.length <= 0"> PO List </el-dropdown-item>
							<el-dropdown-item @click="poListShipmentExport" :disabled="selectedRowKeys?.length <= 0">PO List 约仓(Shipments)</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<el-button type="primary" @click="importNewPoData" >import NewPodata</el-button>
				<el-button type="primary" @click="exportNewPoDataBtn" >Export Asin BarCode</el-button>
				<el-checkbox value="Made in China" label="Made in China" v-model="queryParams.checkbox" style="margin-left: 10px" />
			</div>
			<el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loading"
				tooltip-effect="light"
				row-key="id"
				@sort-change="(data:any) => sortChange(data)"
				size="lagre"
				border=""
				@selection-change="(selection: any) => selectChange(selection)"
			>
				<el-table-column type="selection" width="55" />
				<template v-for="item in tabelList">
					<el-table-column v-if="item.dataIndex === 'shipToLocation'" width="135px" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row.shipToLocation.substring(0, 4) }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'state'" sortable :prop="item.dataIndex" width="100" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							<el-select v-model="scope.row.state" :disabled="disabledAuto(scope)">
								<el-option v-for="i in optionList" :value="i.value" :label="i.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'contractedWarehouseTime'" sortable :prop="item.dataIndex" :label="item.titleCN" align="center" width="190">
						<template #default="scope">
							<el-date-picker  v-model="scope.row.contractedWarehouseTime" style="width: 126px;" format="MM/DD/YYYY HH:mm" type="datetime" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'actualDate'" :prop="item.dataIndex" sortable :label="item.titleCN" align="center" width="190">
						<template #default="scope">
							<el-date-picker v-model="scope.row.actualDate" style="width: 96px" format="YYYY-MM-DD" type="date" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'invoicedStatus'" :prop="item.dataIndex" sortable :label="item.titleCN" align="center" width="145" show-overflow-tooltip="">
						<template #default="scope">
							<el-select v-model="scope.row.invoicedStatus" :disabled="disabledAuto(scope)">
								<el-option v-for="i in statusOptionList" :value="i.value" :label="i.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'orderDate'" width="150" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" sortable />
					<el-table-column v-else-if="item.dataIndex === 'creationDate'" width="150px" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" sortable />
					<el-table-column v-else-if="item.dataIndex === 'rwAppointmentDate'" width="190" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" sortable />
					<el-table-column v-else-if="item.dataIndex === 'latestDate'" width="180" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" sortable />
					<el-table-column v-else-if="item.dataIndex === 'exportStatusByXlsx'" width="200" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row.exportStatusByXlsx === 0 ? 'NO' : 'YES' }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'exportStatusByDocx'" width="230" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row.exportStatusByDocx === 0 ? 'NO' : scope.row.exportStatusByDocx === 1 ? 'YES' : 'Partial Export' }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'asinCount'" width="100" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" />
					<el-table-column v-else-if="item.dataIndex" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" :width="item.width" />
				</template>
				<el-table-column label="Operation" width="250" align="center" fixed="right" show-overflow-tooltip="">
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
			<el-dialog v-model="visible2" title="Export History" @close="close2" width="1000px">
				<infoDataDialog :id="111" idName="dibaiPoDataDataId" :dataList="dataList" :ifClose="ifClose" :pointerface="getNewPoDataExportHistory" :formList="formList" />
			</el-dialog>
			<el-dialog v-model="visible" title="Confirmed New POs Info" @close="close1" width="1000px">
				<infoDataDialog :id="showId" idName="id" :dataList="dataList1" :pointerface="getConfirmedNewPOsPage" :formList="formList1" site="SA" :ifClose="ifClose1" :exportBarCode="true" />
			</el-dialog>
			<importDialog
				ref="importDialogRef"
				title="PO Pick List lmport"
				excelName="PO Pick List "
				:ifExcelBol="true"
				:tableAddress="tableAddress"
				area="EN"
				:url="url"
				@reloadTable="handleQuery"
			/>
			<exportDialog ref="exportDialogRef" :inquireData="true"  title="Import PO Export ASIN BarCode" :ifExcelBol="true" :tableAddress="exportTableAddress" area="EN" :url="exportUrl" @reloadTable="handleQuery" @returnHref="returnHref"/>
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

:deep(.el-select) {
	.el-input {
		width: 100%;
	}
	.el-input.is-disabled .el-input__wrapper {
    background-color: transparent !important;
    // 如果需要保持文字可见度
    .el-input__inner {
      -webkit-text-fill-color: inherit;
      color: inherit;
    }
  }
}
// 添加以下样式来处理日期选择器的禁用状态
:deep(.el-date-editor.is-disabled) {
  .el-input__wrapper {
    background-color: transparent !important;
    .el-input__inner {
      -webkit-text-fill-color: inherit;
      color: inherit;
    }
  }
}
</style>
