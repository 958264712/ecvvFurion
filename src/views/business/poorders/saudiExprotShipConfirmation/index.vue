<script lang="ts" setup name="saudiExprotShipConfirmation">
import { ref } from 'vue';
import { exprotShipmentConfrmationPage, exprotShipmentConfrmationDeliveryList } from '/@/api/modular/main/aSINBasicData.ts';
import moment from 'moment';
import { Local } from '/@/utils/storage';
import { ElMessage } from 'element-plus';
import other from '/@/utils/other.ts';
import importDialog from '/@/components/newPoImportDialog/index.vue';

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

	var res = await exprotShipmentConfrmationPage(Object.assign(queryParams.value, tableParams.value, { site: 'SA' }));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
const importNewPoData = () => {
	url.value = `/api/newPoData/impoertPickingList/${Local.get('poReceiveId')}`;
	Local.set('connectionId', Local.get('poReceiveId'));
	importDialogRef.value.openDialog();
};
// 导出出货清单列表
const exportDeliverList = async (id = undefined) => {
	let idList = [];
	if (id !== undefined) {
		idList.push(id);
	} else {
		idList = selectedRowKeys.value;
	}
	await exprotShipmentConfrmationDeliveryList({ idList })
		.then((res) => {
			other.downloadfile(res);
			ElMessage.success('Export Successfully');
		})
		.catch((err) => {
			ElMessage.error('Export Failed');
		});
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
				<el-button type="primary" :disabled="!selectedRowKeys?.length" @click="exportDeliverList">Export Delivery List</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" label="序号" align="center" width="55" />
				<el-table-column prop="exportTask" label="Export Task" align="center" show-overflow-tooltip="" />
				<el-table-column prop="pos" label="POs" align="center" show-overflow-tooltip="" />
				<el-table-column prop="exprotTimeStart" label="Export Time" align="center" show-overflow-tooltip="" />
				<el-table-column prop="filePath" label="Export File" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<el-link type="success" :href="scope.row.filePath">{{ scope.row.fileName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="account" label="Account" align="center" show-overflow-tooltip="" />
				<el-table-column prop="name" label="Name" align="center" show-overflow-tooltip="" />
				<el-table-column label="Action" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<el-button type="primary" @click="exportDeliverList(scope.row.id)">Export Delivery List</el-button>
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
		<importDialog ref="importDialogRef" multiple title="Import PO Shipment Confirmation" :ifExcelBol="true" :tableAddress="tableAddress" area="EN" :url="url" @reloadTable="handleQuery" />
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
