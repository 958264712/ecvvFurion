<script lang="ts" setup name="performance_rate">
import { ref, onMounted } from 'vue';
import { ratePage } from '/@/api/modular/main/performance.ts';
import { service } from '/@/utils/request';
import editDialog from './component/editDialog.vue'
import tabDragColum from '/@/components/tabDragColum/index.vue';
import { auth } from '/@/utils/authFunction';
import { getAPI } from '/@/utils/axios-utils';
import { SysAuthApi } from '/@/api-services/api';

const loading = ref(false);
const visible = ref(false);
const tableData = ref<any>([]);
const yearList = ref<any>([
	{ label: '全部', value: null },
	{ value: 2024, label: 2024 },
	{ value: 2023, label: 2023 },
	{ value: 2022, label: 2022 },
	{ value: 2021, label: 2021 },
	{ value: 2020, label: 2020 },
	{ value: 2019, label: 2019 },
	{ value: 2018, label: 2018 },
	{ value: 2017, label: 2017 },
	{ value: 2016, label: 2016 },
	{ value: 2015, label: 2015 },
	{ value: 2014, label: 2014 },
	{ value: 2013, label: 2013 },
	{ value: 2012, label: 2012 },
	{ value: 2011, label: 2011 },
	{ value: 2010, label: 2010 },
]);
const moneyList = ref<any>([
	{ label: '全部', value: null },
	{ label: 'AED', value: 'AED' },
	{ label: 'SAR', value: 'SAR' },
]);
const moneyList2 = ref<any>([
	{ label: 'AED', value: 'AED' },
	{ label: 'SAR', value: 'SAR' },
]);
const moneyList1 = ref<any>([
	{ value: 'RMB', label: 'RMB' },
]);
const queryParams = ref<any>({});
const editDialogRef = ref();
const editCollectionOrderInfoTitle = ref('');
const area = ref('CN');

const tableParams = ref({
	page: 1,
	pageSize: 20,
});


const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list;
	}
};
const TableData = ref<any>([
	{
		titleCN: '原币种',
		dataIndex: 'originalCurrency',
		titleEN: 'originalCurrency',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '兑换币种',
		dataIndex: 'exchangeCurrency',
		titleEN: 'exchangeCurrency',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '汇率',
		dataIndex: 'exchangeRate',
		titleEN: 'exchangeRate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '生效时间',
		dataIndex: 'takeEffectTime',
		titleEN: 'takeEffectTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作时间',
		dataIndex: 'operationTime',
		titleEN: 'operationTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作人',
		dataIndex: 'operator',
		titleEN: 'operator',
		checked: true,
		fixed: false,
	},
]);

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await ratePage(Object.assign(tableParams.value, queryParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

const openAddManagement = () => {
	editCollectionOrderInfoTitle.value = '新增业绩汇率';
	editDialogRef.value.openDialog({});
}
const openEdit = (row: any) => {
	editCollectionOrderInfoTitle.value = '编辑业绩汇率';
	editDialogRef.value.openDialog(row);
}

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


handleQuery();
</script>

<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="queryParams.year" clearable="" placeholder="请选择">
						<el-option v-for="(item, index) in yearList" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>

				<el-form-item label="原币种">
					<el-select v-model="queryParams.originalCurrency" clearable="" placeholder="请选择">
						<el-option v-for="(item, index) in moneyList" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
				queryParams = {};
				handleQuery();
			}
			">
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<div style="display: flex; justify-content: space-between">
				<div style="margin-bottom: 20px; display: flex; justify-content: space-between">
					<el-button type="primary" @click="openAddManagement">新增</el-button>
				</div>
				<tabDragColum :data="TableData" :name="`performance_rate`" :area="area" @handleData="handleData" />
			</div>

			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
				border="">
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column v-if="item.checked" :fixed="item.fixed" :width="item.width" :prop="item.dataIndex"
						show-overflow-tooltip :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" />
				</template>
				<el-table-column label="操作" align="center" fixed="right" width="180">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="openEdit(scope.row)"> 编辑 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
		<editDialog ref="editDialogRef" :moneyList="moneyList2" :moneyList1="moneyList1"
			:title="editCollectionOrderInfoTitle" @reloadTable="handleQuery()" />
	</div>
</template>

<style lang="less" scoped>
.select {
	width: 100px;

	:deep(.el-input) {
		width: 100%;
	}
}

.radio-group {
	height: 24px;
	margin: 0 10px;

	:deep(.el-radio-button__inner) {
		padding: 4px 13px;
	}
}

/deep/ .el-pagination {
	margin: 22px 0 -10px 0 !important;
}

/deep/ .cell {
	white-space: nowrap;
}

/deep/ .el-table td.el-table__cell div {
	overflow: hidden;
}
</style>
