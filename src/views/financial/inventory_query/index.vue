<script lang="ts" setup name="inventory_query">
import { ref, onMounted, watch } from 'vue';
import { inventoryQueryPage, inventoryQueryExport } from '/@/api/modular/main/financial.ts';
import { QuestionFilled } from '@element-plus/icons-vue';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import moment from 'moment';
import other from '/@/utils/other.ts';
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref<any>({
	page: 1,
	pageSize: 50,
});
const cardLoading = ref(false);
const loading = ref(false);
const area = ref('CN');
const selectedRows = ref<any>([]);
const selectedRowKeys = ref<any>([]);
const deliveryNoteNotes = ref<any>([])
const warehouse = ref<any>([
	{ value: 'EG Warehouse X1', lable: 'EG Warehouse X1' },
	{ value: '埃及不良品仓', lable: '埃及不良品仓' },
	{ value: 'EG Warehouse', lable: 'EG Warehouse' },
	{ value: '沙特不良品仓', lable: '沙特不良品仓' },
	{ value: 'SA Warehouse X1', lable: 'SA Warehouse X1' },
	{ value: 'SA Warehouse', lable: 'SA Warehouse' },
	{ value: '阿曼仓', lable: '阿曼仓' },
	{ value: 'UAE Store Warehouse', lable: 'UAE Store Warehouse' },
	{ value: '阿联酋不良品仓6Z2', lable: '阿联酋不良品仓6Z2' },
	{ value: 'UAE Warehouse No. 2', lable: 'UAE Warehouse No. 2' },
	{ value: 'UAE Warehouse No. 6', lable: 'UAE Warehouse No. 6' },
	{ value: '深圳仓库', lable: '深圳仓库' },
	{ value: '迪拜虚拟仓库', lable: '迪拜虚拟仓库' },
	{ value: '默认仓库', lable: '默认仓库' },
]);
const TableData = ref<any>([
	{
		titleCN: '出入库时间',
		titleEN: '',
		dataIndex: 'entryAndExitTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单号',
		titleEN: '',
		dataIndex: 'documentNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '对应入库单号',
		titleEN: '',
		dataIndex: 'purchaseReceiptNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '单据备注',
		titleEN: '',
		dataIndex: 'documentRemarks',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期入库采购数量',
		titleEN: '',
		dataIndex: 'purchaseQuantityReceivedInThisPeriod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期入库其他数量',
		titleEN: '',
		dataIndex: 'otherQuantityReceivedInThisPeriod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期入库单价',
		titleEN: '',
		dataIndex: 'currentReceiptUnitPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期入库金额',
		titleEN: '',
		dataIndex: 'currentReceiptAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期出库销售数量',
		titleEN: '',
		dataIndex: 'currentOutboundSalesQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期出库其他数量',
		titleEN: '',
		dataIndex: 'otherQuantityOfOutboundGoodsInThisPeriod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期出库单价',
		titleEN: '',
		dataIndex: 'currentOutboundUnitPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期出库金额',
		titleEN: '',
		dataIndex: 'currentOutboundAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期末数量',
		titleEN: '',
		dataIndex: 'endOfPeriodQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期末平均价',
		titleEN: '',
		dataIndex: 'averagePriceAtTheEndOfThePeriod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期末金额',
		titleEN: '',
		dataIndex: 'endOfPeriodAmount',
		checked: true,
		fixed: false,
	},
]);

const handleData = (list: any) => {
	if (list?.length) {
		list.map((item: any, index: number) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].checked = item.checked;
				TableData.value[index].fixed = item.fixed;
			}
		});
	}
};
const handleRemarkData = (list: any) => {
	if (list?.length) {
		list.map((item: any, index: number) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].desc = item.desc;
				TableData.value[index].remark = item.remark;
			}
		});
	}
};

// 查询
const handleQuery = async (): Promise<void> => {
	loading.value = true;
	queryParams.value.startEntryAndExitTime = queryParams.value.OrderPlaceDates ? moment(queryParams.value.OrderPlaceDates[0]).format('YYYY-MM-DD') : undefined;
	queryParams.value.endEntryAndExitTime = queryParams.value.OrderPlaceDates ? moment(queryParams.value.OrderPlaceDates[1]).format('YYYY-MM-DD') : undefined;
	await inventoryQueryPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		tableData.value = res.data.result?.items ?? [];
		tableParams.value.total = res.data.result?.total;
	});
	loading.value = false;
};

onMounted(() => {
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
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	deliveryNoteNotes.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item.id);
		deliveryNoteNotes.value.push(item.documentRemarks);
	});
};
const SelectedExport = async () => {
	cardLoading.value = true;
	await inventoryQueryExport(Object.assign({ type: 1, ids: selectedRowKeys.value, deliveryNoteNotes: deliveryNoteNotes.value }, queryParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
	});
};
// 导出所有
const AllExport = async () => {
	cardLoading.value = true;
	await inventoryQueryExport(Object.assign({ type: 0 }, queryParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
	});
};
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="出入库时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="daterange" v-model="queryParams.OrderPlaceDates" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="所在仓库">
					<el-select clearable="" v-model="queryParams.warehouse">
						<el-option v-for="item in warehouse" :value="item.value" :label="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="库存SKU">
					<el-input placeholder="请输入" v-model="queryParams.erpSku" clearable />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery()"
							style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
								queryParams = {};
								handleQuery();
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
					<el-dropdown>
						<el-button type="primary" :loading="cardLoading"> 导出 </el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item style="height: 24px" :disabled="selectedRowKeys?.length <= 0"
									@click="SelectedExport">导出选中 </el-dropdown-item>
								<el-dropdown-item style="height: 24px" @click="AllExport">导出全部 </el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
				<tabDragColum :data="TableData" :tagInfo="true" :name="`inventory_query`" :area="area" @handleData="handleData"
					@handleRemarkData="handleRemarkData" />
			</div>
			<el-table :data="tableData" size="large" style="width: 100%"
				@selection-change="(selection: any) => selectChange(selection)" v-loading="loading"
				tooltip-effect="light">
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" label="序号" width="65" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex" show-overflow-tooltip
						:label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150">
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}

:deep(.el-textarea__inner) {
	box-shadow: initial;
	margin: 0;
	padding: 5px;
	height: 142px !important;
}
</style>
