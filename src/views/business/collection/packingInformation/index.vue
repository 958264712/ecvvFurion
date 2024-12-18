<script lang="ts" setup name="packingInformation">
import { ref, onMounted, reactive } from 'vue';
import { getShipmentDetails, ExportShipmentDetails } from '/@/api/modular/main/collections.ts';
import other from '/@/utils/other.ts';
import moment from 'moment';
import { Session } from '/@/utils/storage';
import { SysDictDataApi } from '/@/api-services/api';
import { getAPI } from '/@/utils/axios-utils';

const tagoptions = ref<any>([]);
const tableData = ref<any>([]);
const queryParams = reactive<any>({
	time: [],
	startTime_departureDate: '',
	endTime_departureDate: '',
});
const tableParams = ref<any>({
	page: 1,
	pageSize: 50,
	total: 0,
});
const cardLoading = ref(false);
const loading = ref(false);
const selectedRows = ref<any>([]);
const selectedRowKeys = ref<number[]>([]);
const area = ref('CN');
const TableData = ref<any>([
	{
		titleCN: '入仓号',
		dataIndex: 'inWareHouseNo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ECVV箱单号',
		dataIndex: 'boxNo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '内部唯一识别码',
		dataIndex: 'internalUniqueID',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货数量',
		dataIndex: 'actualShipmentQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货单位',
		dataIndex: 'unit',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '补充说明',
		dataIndex: 'unitInfo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '装箱个数',
		dataIndex: 'quantityInBoxes',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '装箱数',
		dataIndex: 'packBoxesQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实收箱数',
		dataIndex: 'actualBoxesQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实收数量',
		dataIndex: 'actualQuantityInBoxes',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总净重KG',
		dataIndex: 'totalNetWeightKG',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '整箱毛重KG',
		dataIndex: 'fclGrossWeightKG',
		checked: true,
		fixed: false,
	},
]);

// 查询
const getAppPage = async (): Promise<void> => {
	loading.value = true;
	var res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('warn_tag');
	tagoptions.value = res.data.result;
	queryParams.startTime_departureDate = queryParams.time?.length ? moment(queryParams.time[0]).format('YYYY-MM-DD') : '';
	queryParams.endTime_departureDate = queryParams.time?.length ? moment(queryParams.time[1]).format('YYYY-MM-DD') : '';
	if (Session.get('queryObj')?.ifquery === false) {
		queryParams.documentNo = Session.get('queryObj')?.documentNo ?? undefined;
		Session.set('queryObj', {});
	}
	await getShipmentDetails(Object.assign(queryParams, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableParams.value.total = res.data.result?.total;
		tableData.value.splice(0, tableData.value.length);
		res.data.result.items.forEach((element: any) => {
			if (element.warnTag != null && element.warnTag != '') {
				element.warnTag = element.warnTag.split(',');
			}
			tableData.value.push(element);
		});
	});
	loading.value = false;
};

//重置
const resetfun = (): void => {
	Object.keys(queryParams).forEach((key: any) => {
		queryParams[key] = '';
	});
	getAppPage();
};

onMounted(() => {
	getAppPage();
});

// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	getAppPage();
};

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	getAppPage();
};
//排序
const handleSort = (v: any): void => {
	tableParams.value.order = v.order;
	tableParams.value.field = v.prop;
	getAppPage();
};
// 获取keys
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item.id);
	});
};
// 导出选中
const SelectedExport = async (coltype: number): Promise<void> => {
	cardLoading.value = true;
	await ExportShipmentDetails(Object.assign({ type: 0, coltype: coltype, idList: selectedRowKeys.value, destination: queryParams.destination, documentNo: queryParams.documentNo })).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
		//selectedRowKeys.value = [];
		//selectedRows.value = [];
	});
};
// 导出所有
const AllExport = async (coltype: number): Promise<void> => {
	cardLoading.value = true;
	await ExportShipmentDetails(Object.assign({ type: 1, queryParams, coltype: coltype }, queryParams, tableParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
		selectedRows.value = [];
	});
};
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="货代入仓号">
					<el-input v-model="queryParams.documentNo" clearable="" placeholder="货代入仓号" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="getAppPage()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun()" style="width: 70px; margin-right: 2px"> 重置 </el-button>
						<div class="flex flex-wrap items-center">
							<el-dropdown>
								<el-button type="primary" :loading="cardLoading"> 导出 </el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item style="height: 24px" :disabled="selectedRowKeys?.length <= 0" @click="SelectedExport(1)">导出选中 </el-dropdown-item>
										<el-dropdown-item style="height: 24px" @click="AllExport(1)">导出全部 </el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-table :data="tableData" size="large" style="width: 100%" @selection-change="(selection: any) => selectChange(selection)" v-loading="loading" tooltip-effect="light" @sort-change="handleSort">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex === 'actualQuantityInBoxes'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						show-overflow-tooltip
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						min-width="150"
					>
						<template #default="scope">
							<el-progress
								:percentage="((scope.row.actualQuantityInBoxes ?? 0) / scope.row.actualShipmentQuantity) * 100"
								:format="()=>(`${scope.row.actualQuantityInBoxes ?? 0}/${scope.row.actualShipmentQuantity}`)"
								:text-inside="true"
								:stroke-width="24"
								:status="
									(scope.row.actualQuantityInBoxes ?? 0) / scope.row.actualShipmentQuantity > 1
										? 'exception'
										: (scope.row.actualQuantityInBoxes ?? 0) / scope.row.actualShipmentQuantity === 1
										? 'success'
										: 'warning'
								"
							/>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex" :fixed="item.fixed" :prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" />
				</template>
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
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
