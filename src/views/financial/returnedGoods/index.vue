<script lang="ts" setup name="returned_goods">
import { ref, onMounted, watch } from 'vue';
import { returnedGoods, exportReturnedGoods } from '/@/api/modular/main/financial.ts';
import other from '/@/utils/other.ts';
const tableData: any[] = ref([]);
const queryParams = ref<any>({ Site: '', StartTime: '', EnbTime: '' });
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const cardLoading = ref(false);
const loading = ref(false);
const selectedRows = ref([]);
const selectedRowKeys = ref([]);
const selectedRowsites = ref([]);
const selectedRowtimes = ref([]);
const selectExport = ref([]);
const area = ref('CN');
const TableData = ref<any>([
	{
		titleCN: 'ASIN',
		dataIndex: 'asin',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ErpSku',
		dataIndex: 'erpSku',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '数量',
		dataIndex: 'customerReturns',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '销售平台',
		dataIndex: 'site',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '退款时间',
		dataIndex: 'returnTime',
		checked: true,
		fixed: false,
	},
]);

// 查询
const handleQuery = async (): void => {
	loading.value = true;
	queryParams.value.StartTime = queryParams.value.returnTime ? queryParams.value.returnTime[0] : null;
	queryParams.value.EnbTime = queryParams.value.returnTime ? queryParams.value.returnTime[1] : null;

	if (queryParams.value.StartTime) {
		const date1 = new Date(queryParams.value.StartTime);
		const year1 = date1.getFullYear();
		const month1 = date1.getMonth() + 1;
		const day1 = date1.getDate();
		queryParams.value.StartTime = year1 + '-' + month1 + '-' + day1;
	}
	if (queryParams.value.EnbTime) {
		const date2 = new Date(queryParams.value.EnbTime);
		const year2 = date2.getFullYear();
		const month2 = date2.getMonth() + 1;
		const day2 = date2.getDate();
		queryParams.value.EnbTime = year2 + '-' + month2 + '-' + day2;
	}
	await returnedGoods(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	loading.value = false;
};

onMounted(() => {
	handleQuery();
});

// 获取keys
const selectChange = (selection: any) => {
	selectExport.value.splice(0, selectExport.value.length);
	selection.map((item: any) => {
		selectExport.value.push({
			ArrASIN: item.asin,
			rowSite: item.site,
			rowTime: item.returnTime,
		});
	});
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
// 导出选中
const SelectedExport = async (coltype) => {
	cardLoading.value = true;
	await exportReturnedGoods(Object.assign({ type: 1, selectExports: selectExport.value }, queryParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
	});
};
// 导出所有
const AllExport = async (coltype) => {
	cardLoading.value = true;
	await exportReturnedGoods(Object.assign({ type: 0 }, queryParams.value)).then((res) => {
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
				<el-form-item label="销售平台">
					<el-select clearable="" @change="handleQuery()" v-model="queryParams.Site">
						<el-option value="UAE-SC" label="UAE-SC"></el-option>
						<el-option value="UAE-SHOWAY" label="UAE-SHOWAY"></el-option>
						<el-option value="SA-DDP AE" label="SA-DDP AE"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="退款时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange" v-model="queryParams.returnTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.ASIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item label="ErpSku">
					<el-input v-model="queryParams.ErpSku" clearable="" placeholder="请输入ErpSku" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									handleQuery();
								}
							"
							style="width: 70px; margin-right: 2px"
						>
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
								<el-dropdown-item :disabled="selectExport?.length <= 0" style="height: 24px" @click="SelectedExport(1)">导出选中 </el-dropdown-item>
								<el-dropdown-item style="height: 24px" @click="AllExport(1)">导出全部 </el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%" @selection-change="(selection: any) => selectChange(selection)" v-loading="loading" tooltip-effect="light">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" />
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
