<script lang="ts" setup name="receiptWarehouse">
import { ref, onMounted, reactive, h ,nextTick} from 'vue';
import { receiptAndWarehousingPage, receiptAndWarehousingUpdate, receiptAndWarehousingExport,getShipmentDetails,getAssociationList,confirmAssociation } from '/@/api/modular/main/receiptAndWarehousing.ts';
import { ElMessage, ElButton, ElTable, ElLink, ElText } from 'element-plus';
import other from '/@/utils/other.ts';
import moment from 'moment';
import { SysDictDataApi } from '/@/api-services/api';
import { useRouter } from 'vue-router';
import { Session } from '/@/utils/storage';
import { getAPI } from '/@/utils/axios-utils';
import newPoImportDialog from '/@/components/newPoImportDialog/index.vue';
import { useDebounce } from '/@/utils/debounce';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';
import openBatchDialog from './componet/openBatchDialog.vue';

const router = useRouter();
const singleTableRef = ref<InstanceType<typeof ElTable>>();
const tableData = ref<any>([]);
const destinationList = ref<any>([]);
const currentRowId = ref<any>(undefined);
const queryParams = reactive<any>({
	time: [],
});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const defaultValuesParams = ref<any>({
	state:'在途'
});

const baseUrl = import.meta.env.VITE_API_URL;
const importDialogRef = ref();
const url = ref('/api/receiptAndWarehousing/import');
const tableAddress = `${baseUrl}/upload/TableAddress/收货箱单号模板.xlsx`;

const visible = ref(false);
const visible1 = ref(false);
const title = ref('');
const title1 = ref('');
const fileName = ref<string>('');
const receiptId = ref('');
const openBatchId = ref('');
const openBatchDialogRef = ref();
const formList = ref<any>([
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
	},
	{
		label: 'ERPSKU',
		prop: 'erpsku',
	},
	{
		label: '箱号',
		prop: 'boxNo',
	},
	{
		label: '目的地',
		prop: 'destination',
		select: true,
		options: destinationList,
	},
	{
		label: '状态',
		prop: 'state',
		select: true,
		options: [
			{
				label: '集货',
				value: '集货',
			},
			{
				label: '在途',
				value: '在途',
			},
			{
				label: '部分入仓',
				value: '部分入仓',
			},
			{
				label: '已入仓',
				value: '已入仓',
			},
		],
	},
]);
const dataList = ref<any>([
	{
		label: '箱号',
		prop: 'documentNo',
		width: 150,
		render: ({ row }: { row: any }) => {
			if (row.status === '不确定') {
				return h(
					ElLink,
					{
						onClick: () => openBoxMatch(row.erpsku, row.id, fileName.value),
						style: { color: 'blue' },
					},
					'关联'
				);
			} else if (row.status === '预匹配') {
				return h('div', [
					h('div', [h(ElText, { type: 'danger' }, row.documentNo),]),
					h('div', [h(
						ElLink,
						{
							onClick: () => confirmReceipt(row.id, true),
							style: { marginLeft: '8px' },
						},
						'确定'
					),])
				]);
			} else {
				return h('span', row.documentNo);
			}
		},
	},
	{
		label: '收货箱号',
		prop: 'boxNo',
		width: 120,
	},
	{
		label: 'ERPSKU',
		prop: 'erpsku',
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
		width: 120,
	},
	{
		label: '装箱个数',
		prop: 'quantityInBoxes',
	},
	{
		label: '集货箱数',
		prop: 'packBoxesQuantity',
	},
	{
		label: '集货总数',
		prop: 'actualShipmentQuantity',
	},
	{
		label: '本次箱数',
		prop: 'thisBoxNumber',
	},
	{
		label: '本次数量',
		prop: 'thisQuantity',
	},
	{
		label: '已收箱数',
		prop: 'actualQuantityInBoxes',
	},
	{
		label: '已收数量',
		prop: 'actualBoxesQuantity',
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => openBoxMatch(row.erpsku, row.id, fileName.value),
					type: 'primary',
					disabled: row.status === '锁定',
				},
				'关联'
			);
		},
	},
]);
const dataList1 = ref<any>([
	{
		label: '制单时间',
		prop: 'productionTime',
		width: 130,
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
		width: 135,
		render: ({ row }: { row: any }) => {
			if (row.isHigh){
				return h('div', [
					h(ElText, { type: 'danger' }, row.inWareHouseNo),
				]);
			} else {
				return h('span', row.inWareHouseNo);
			}
		},
	},
	{
		label: 'ERPSKU',
		prop: 'erpsku',
		width: 125,
	},
	{
		label: '箱号',
		prop: 'boxNo',
		width: 120,
	},
	{
		label: '集货箱数',
		prop: 'packBoxesQuantity',
	},
	{
		label: '已收箱数',
		prop: 'actualQuantityInBoxes',
	},
	{
		label: '目的地',
		prop: 'destination',
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => confirmReceipt(row.id, row.correlationId),
					type: 'primary',
				},
				'确定关联'
			);
		},
	},
]);
const loading = ref(false);
const exportLoading = ref(false);
const selectedRowKeys = ref<any>([]);
const disabledList = ref<any>([]);

const area = ref('CN');
const TableData = ref<any>([
	{
		titleCN: '目的地',
		dataIndex: 'destination',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实际收货日期',
		dataIndex: 'actualDeliveryTime',
		width: 120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '货代入仓号',
		dataIndex: 'inWareHouseNo',
		width: 180,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货箱数',
		dataIndex: 'documentNumber',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货总数',
		dataIndex: 'documentTotalNumber',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '箱数',
		dataIndex: 'boxNumber',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '收货总数',
		dataIndex: 'takeOverTotal',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未匹配箱数',
		dataIndex: 'unmatchedBoxes',
		width: 120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作人',
		dataIndex: 'operator',
		width: 120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '备注',
		dataIndex: 'remarks',
		width: 310,
		checked: true,
		fixed: false,
	},
]);

// 查询
const handleQuery = async (): Promise<void> => {
	loading.value = true;
	queryParams.startActualDeliveryTime = queryParams.time?.length ? moment(queryParams.time[0]).format('YYYY-MM-DD') : '';
	queryParams.endActualDeliveryTime = queryParams.time?.length ? moment(queryParams.time[1]).format('YYYY-MM-DD') : '';
	await receiptAndWarehousingPage(Object.assign(queryParams, tableParams.value)).then((res) => {
		tableData.value = res.data.result.items;
		tableParams.value.total = res.data.result?.total;
		res.data.result?.items.map((item: { id: any }) => {
			disabledList.value.push(item.id);
		});
	});
	loading.value = false;
};

//重置
const resetfun = (): void => {
	Object.keys(queryParams).forEach((key: any) => {
		queryParams[key] = '';
	});
	handleQuery();
};

const importReceiptWarehouse = () => {
	importDialogRef.value.openDialog();
};

const handleRouter = (inWareHouseNo: string) => {
	Session.set('queryObj', { documentNo: inWareHouseNo, ifquery: false });
	router.push({ path: '/business/collection/packingInformation' });
};

// 打开收货明细
const openReceiptInfo = (id: any, name: string) => {
	fileName.value = name;
	receiptId.value = id;
	title.value = `收货明细（收货单号：${id} 文件名称：${name}）`;
	visible.value = true;
};
// 打开箱号匹配
const openBoxMatch = async (sku: string, id: any, name: string) => {
	openBatchId.value = id;
	defaultValuesParams.value.erpsku = sku;
	await nextTick();
	title1.value = `箱号匹配（SKU：${sku} 收货单号：${id} 文件名称：${name}）`;
	openBatchDialogRef.value.openDialog();
};
// 确定关联
const confirmReceipt = (id: any, correlationId: any) => {
	confirmAssociation({ id, correlationId }).then((res) => {
		ElMessage.success('操作成功!');
		handleQuery();
	});
};

onMounted(async () => {
	const res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('destination');
	destinationList.value = res.data.result;
	handleQuery();
});

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

// 获取keys
const currentChange = (currentRow: any) => {
	if (currentRow.id != undefined) {
		if (currentRow.id !== currentRowId.value) {
			selectedRowKeys.value = [currentRow.id];
			currentRowId.value = currentRow.id;
		} else {
			singleTableRef.value!.setCurrentRow({});
			currentRowId.value = undefined;
			selectedRowKeys.value = [];
		}
	}
};
const disabledfun = async (val: any): Promise<void> => {
	if (disabledList.value.some((item: any) => item === val.row.id)) {
		const index = disabledList.value.findIndex((item: any) => item === val.row.id);
		disabledList.value.splice(index, 1);
	} else {
		disabledList.value.push(val.row.id);
		var res = await receiptAndWarehousingUpdate(Object.assign({ id: val.row.id, remarks: val.row.remarks }));
		res.data?.type === 'success' ? ElMessage.success('修改成功!') : null;
	}
};
const disabledAuto = (scope: any): void => {
	return disabledList.value.some((item: any) => item === scope.row.id);
};

// 导出
const exportReceiptWarehouse = useDebounce((row?: any): void => {
	if (row?.id != undefined) {
		receiptAndWarehousingExport(Object.assign({ id: row.id })).then((res) => {
			other.downloadfile(res);
			ElMessage.success('导出成功!');
		});
	} else {
		exportLoading.value = true;
		receiptAndWarehousingExport(Object.assign({ id: currentRowId.value })).then((res) => {
			other.downloadfile(res);
			ElMessage.success('导出成功!');
			exportLoading.value = false;
		});
	}
}, 500);
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="目的地">
					<el-select v-model="queryParams.destination" clearable="" placeholder="请选择目的地" @change="handleQuery">
						<el-option v-for="item in destinationList" :label="item.value" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="箱单号">
					<el-input v-model="queryParams.boxNo" clearable="" placeholder="请输入箱单号" />
				</el-form-item>
				<el-form-item label="内部唯一识别码或内部品名">
					<el-input v-model="queryParams.SKUOrGoodsName" clearable="" placeholder="请输入内部唯一识别码或内部品名" />
				</el-form-item>
				<el-form-item label="收货日期">
					<el-date-picker v-model="queryParams.time" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search" @click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun()" style="width: 70px; margin-right: 2px"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv">
				<el-button type="primary" @click="importReceiptWarehouse()">导入收货箱单号</el-button>
				<el-button type="primary" :disabled="!selectedRowKeys?.length" :loading="exportLoading" @click="exportReceiptWarehouse()">导出普源云入库单</el-button>
			</div>
			<el-table :data="tableData" ref="singleTableRef" size="large" style="width: 100%" highlight-current-row @row-click="(row:any) => currentChange(row)" v-loading="loading" tooltip-effect="light">
				<el-table-column type="index" width="50" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex === 'remarks'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					>
						<template #default="scope">
							<el-input v-model="scope.row.remarks" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.titleCN === '未匹配箱数'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					>
						<template #default="scope">
							<el-link :style="{ color: scope.row.unmatchedBoxes === 0 ? 'blue' : 'red' }" @click="openReceiptInfo(scope.row.id, scope.row.fileName)">{{ scope.row.unmatchedBoxes }} </el-link>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex === 'inWareHouseNo'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					>
						<template #default="scope">
							<el-link style="color: red" @click="handleRouter(scope.row.inWareHouseNo)">{{ scope.row.inWareHouseNo }} </el-link>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					/>
				</template>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button type="primary" text @click="disabledfun(scope)">{{ disabledList.some((item: any) => item === scope.row.id) ? '编辑' : '保存' }}</el-button>
						<el-button type="primary" text @click="exportReceiptWarehouse(scope.row)">导出普源云入库单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
		<newPoImportDialog ref="importDialogRef" title="Import PO Shipment Confirmation" :ifExcelBol="true" :tableAddress="tableAddress" area="EN" :url="url" @reloadTable="handleQuery" />
		<el-dialog v-model="visible" :title="title" @close="visible = false" width="1000px" draggable>
			<infoDataDialog :id="receiptId" idName="id" :dataList="dataList" :ifClose="visible" :pointerface="getShipmentDetails" />
		</el-dialog>
		<openBatchDialog ref="openBatchDialogRef" :title="title1" idName="id" :id="openBatchId" :dataList="dataList1" :ifClose="visible1" :pointerface="getAssociationList" :formList="formList" :defaultValues="defaultValuesParams" />
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
