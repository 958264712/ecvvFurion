<script lang="ts" setup name="dibaiExprotShipConfirmation">
import { ref, h, watch } from 'vue';
import {
	exprotShipmentConfrmationPage,
	exprotShipmentConfrmationDeliveryList,
	exprotShipmentConfrmationDeliveryListOld,
	getFileStream,
	getExportRecordPage,
} from '/@/api/modular/main/aSINBasicData.ts';
import moment from 'moment';
import { Local } from '/@/utils/storage';
import other from '/@/utils/other.ts';
import { ElMessage, ElLink } from 'element-plus';
import importDialog from '/@/components/newPoImportDialog/index.vue';
import newInfoDataDialog from '/@/components/newInfoDataDialog/index.vue';

const loading = ref(false);
const tableData = ref<any>([]);
const selectedRowKeys = ref<any>([]);
const queryParams = ref<any>({ orderDate: 'Export Time' });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

const baseUrl = import.meta.env.VITE_API_URL;
const importDialogRef = ref();
const url = ref('');
const tableAddress = `${baseUrl}/upload/TableAddress/PO订单批量确认发货数量模板.xlsx`;

const infoDataDialogRef = ref();
const defaultValuesParams = ref<any>({ site: 'UAE' });
const startTime = ref<any>(new Date());
const nowTime = ref<any>(new Date());
const timer = ref<ReturnType<typeof setTimeout>>();
const dataList = ref<any>([
	{
		label: '序号',
	},
	{
		label: '导出任务',
		prop: 'exportTaskName',
	},
	{
		label: '文件名',
		prop: 'fileName',
		width: 130,
	},
	{
		label: '导出时间',
		prop: 'exportDate',
	},
	{
		label: '导出文件',
		prop: 'filePath',
		width: 260,
		render: ({ row }: { row: any }) => {
			return h(
				ElLink,
				{
					type: 'success',
					href: row.filePath,
				},
				row.fileName
			);
		},
	},
	{
		label: '账号',
		prop: 'account',
	},
	{
		label: '姓名',
		prop: 'userName',
	},
]);

const orderDateOptionList = ref<any>([
	{
		label: 'Export Time',
		value: 'Export Time',
	},
	{
		label: 'Order Date',
		value: 'Order Date',
	},
]);

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	queryParams.value.exportStartTime = null;
	queryParams.value.exportEndTime = null;
	queryParams.value.orderDateStartTime = null;
	queryParams.value.orderDateEndTime = null;
	if (queryParams.value?.time !== undefined) {
		if (queryParams.value.orderDate === 'Export Time') {
			queryParams.value.exportStartTime = moment(queryParams.value?.time[0]).format('YYYY-MM-DD');
			queryParams.value.exportEndTime = moment(queryParams.value?.time[1]).format('YYYY-MM-DD');
		} else {
			queryParams.value.orderDateStartTime = moment(queryParams.value?.time[0]).format('YYYY-MM-DD');
			queryParams.value.orderDateEndTime = moment(queryParams.value?.time[1]).format('YYYY-MM-DD');
		}
	}

	var res = await exprotShipmentConfrmationPage(Object.assign(queryParams.value, tableParams.value, { site: 'UAE' }));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
const importNewPoData = () => {
	url.value = `/api/exprotShipmentConfrmation/multipleBatchImportsOfPickingOrders/${Local.get('poReceiveId')}`;
	Local.set('connectionId', Local.get('poReceiveId'));
	importDialogRef.value.openDialog();
};
// 导出出货清单列表
const exportDeliverList = async (id: number | undefined = undefined, time: string | undefined = undefined) => {
	let idList = [];
	if (id !== undefined) {
		idList.push(id);
	} else {
		// 多选情况下，检查所选数据的时间
		const selectedRows = tableData.value.filter((item: any) => selectedRowKeys.value.includes(item.id));
		const hasOldData = selectedRows.some((row: any) => moment(row.exprotTimeStart).isBefore('2024-12-03'));
		const hasNewData = selectedRows.some((row: any) => !moment(row.exprotTimeStart).isBefore('2024-12-03'));
		// 如果同时存在新旧数据，提示错误并返回
		if (hasOldData && hasNewData) {
			ElMessage.error('不能同时选择2024-12-03之前和之后的数据进行导出，无法同时导出新老2个版本的数据，请选择单个数据导出');
			return;
		} else if (hasNewData) {
			time = undefined;
		} else {
			time = '2024-11-28';
		}
		idList = selectedRowKeys.value;
	}
	const api = time && moment(time).isBefore('2024-12-03') ? exprotShipmentConfrmationDeliveryListOld : exprotShipmentConfrmationDeliveryList;
	await api({ idList })
		.then((res) => {
			other.downloadfile(res);
			ElMessage.success('Export Successfully');
		})
		.catch((err) => {
			ElMessage.error('Export Failed');
		});
};
const exportPoConfirmation = async (id = undefined, name: string) => {
	await getFileStream({ id })
		.then((res) => {
			other.downloadfile(res, name + '.xls');
			ElMessage.success('Export Successfully');
		})
		.catch((err) => {
			ElMessage.error('Export Failed');
		});
};
const exportHistory = () => {
	infoDataDialogRef.value.openDialog();
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
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selection.map((item: any) => {
		selectedRowKeys.value.push(item?.id);
	});
};
// 启动计时器
const startTimer = () => {
	if (timer.value) return; // 如果定时器已经启动，不再启动
	startTime.value = new Date();
	timer.value = setInterval(() => {
		// 获取操作是否成功，成功则刷新页面
		if (Local.get('resset') === 'true') {
			Local.set('resset', 'false');
			stopTimer();
			handleQuery();
		} else {
			nowTime.value = new Date();
			// 循环1分钟，没结果就直接刷新页面
			if (Math.abs(startTime.value - nowTime.value) > 60000) {
				// 设置刷新值为false
				Local.set('resset', 'false');
				stopTimer();
				handleQuery();
			}
		}
	}, 1000); // 1000毫秒后触发
};
// 停止计时器
const stopTimer = () => {
	if (timer.value) {
		clearInterval(timer.value);
		timer.value = undefined;
	}
};
handleQuery();
</script>
<template>
	<div class="poDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="PO">
					<el-input v-model="queryParams.po" clearable="" placeholder="Please enter PO" />
				</el-form-item>
				<el-form-item>
					<el-select v-model="queryParams.orderDate" style="width: 90px" placeholder="orderDate">
						<el-option v-for="i in orderDateOptionList" :value="i.value" :label="i.label" />
					</el-select>
					<el-date-picker v-model="queryParams.time" type="daterange" start-placeholder="Start date" end-placeholder="End date" format="YYYY-MM-DD" date-format="YYYY/MM/DD" style="width: 290px" />
				</el-form-item>
				<el-form-item label="Show All">
					<el-checkbox v-model="queryParams.isShowAll" />
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
			<div class="importDiv">
				<el-button type="primary" @click="importNewPoData">import Po List</el-button>
				<el-button type="primary" :disabled="!selectedRowKeys?.length" @click="exportDeliverList()">Export Delivery List</el-button>
				<el-button type="primary" @click="exportHistory">Export History</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" label="序号" align="center" width="55" />
				<el-table-column prop="exportTask" label="Export Task" align="center" show-overflow-tooltip="" />
				<el-table-column prop="pos" label="POs" align="center" show-overflow-tooltip="" />
				<el-table-column prop="numberOfOrders" label="下单数" align="center" show-overflow-tooltip="" />
				<el-table-column prop="acceptedQuantity" label="接单数" align="center" show-overflow-tooltip="" />
				<el-table-column prop="shipmentQuantity" label="发货数" align="center" show-overflow-tooltip="" />
				<el-table-column prop="quantityReceived" label="接收数" align="center" show-overflow-tooltip="" />
				<el-table-column prop="exprotTimeStart" label="Export Time" align="center" show-overflow-tooltip="" />
				<el-table-column prop="filePath" label="Export File" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<el-link type="success" :disabled="scope.row.isCreateFile === 2" @click="exportPoConfirmation(scope.row.id,scope.row.pos)">{{scope.row.isCreateFile === 2?"文件生成中": scope.row.pos + '.xls' }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="account" label="Account" align="center" show-overflow-tooltip="" />
				<el-table-column prop="name" label="Name" align="center" show-overflow-tooltip="" />
				<el-table-column label="Action" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<el-button type="primary" :disabled="scope.row.isCreateFile === 2" @click="exportDeliverList(scope.row.id,scope.row.exprotTimeStart)">Export Delivery List</el-button>
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
		</el-card>
		<importDialog
			ref="importDialogRef"
			multiple
			title="Import PO Shipment Confirmation"
			:ifExcelBol="true"
			:tableAddress="tableAddress"
			area="EN"
			:url="url"
			@reloadTable="handleQuery"
			@startTimer="startTimer"
		/>
		<newInfoDataDialog ref="infoDataDialogRef" title="Export History" :defaultValues="defaultValuesParams" :pointerface="getExportRecordPage" :dataList="dataList" />
	</div>
</template>
<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 100px;
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
}
</style>
