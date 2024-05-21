<script lang="ts" setup name="DFOutboundOrder">
import { ref, onMounted, watch } from 'vue';
import { dFOutboundOrderpage, dFOutboundOrderexport } from '/@/api/modular/main/financial.ts';
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
const selectExport = ref([]);
const area = ref('CN');
const TableData = ref<any>([
	{
		titleCN: 'Order ID',
		dataIndex: 'orderID',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '站点',
		dataIndex: 'site',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Order Place Date',
		dataIndex: 'orderPlaceDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Required Ship Date',
		dataIndex: 'requiredShipDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ASIN',
		dataIndex: 'asin',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ERP-SKU',
		dataIndex: 'erpSku',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '出库数量',
		dataIndex: 'shipmentQTY',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品备注',
		dataIndex: 'trackingID',
		checked: true,
		fixed: false,
	},
]);

// 查询
const getAppPage = async (): void => {
	loading.value = true;
	queryParams.value.StartOrderPlaceDate = queryParams.value.OrderPlaceDates ? queryParams.value.OrderPlaceDates[0] : null;
	queryParams.value.EndOrderPlaceDate = queryParams.value.OrderPlaceDates ? queryParams.value.OrderPlaceDates[1] : null;
	queryParams.value.StartRequiredShipDate = queryParams.value.RequiredShipDates ? queryParams.value.RequiredShipDates[0] : null;
	queryParams.value.EndRequiredShipDate = queryParams.value.RequiredShipDates ? queryParams.value.RequiredShipDates[1] : null;
	if (queryParams.value.StartOrderPlaceDate) {
		const date1 = new Date(queryParams.value.StartOrderPlaceDate);
		const year1 = date1.getFullYear();
		const month1 = date1.getMonth() + 1;
		const day1 = date1.getDate();
		queryParams.value.StartOrderPlaceDate = year1 + '-' + month1 + '-' + day1;
	}
	if (queryParams.value.EndOrderPlaceDate) {
		const date2 = new Date(queryParams.value.EndOrderPlaceDate);
		const year2 = date2.getFullYear();
		const month2 = date2.getMonth() + 1;
		const day2 = date2.getDate();
		queryParams.value.EndOrderPlaceDate = year2 + '-' + month2 + '-' + day2;
	}
	if (queryParams.value.StartRequiredShipDate) {
		const date3 = new Date(queryParams.value.StartRequiredShipDate);
		const year3 = date3.getFullYear();
		const month3 = date3.getMonth() + 1;
		const day3 = date3.getDate();
		queryParams.value.StartRequiredShipDate = year3 + '-' + month3 + '-' + day3;
	}
	if (queryParams.value.EndRequiredShipDate) {
		const date4 = new Date(queryParams.value.EndRequiredShipDate);
		const year4 = date4.getFullYear();
		const month4 = date4.getMonth() + 1;
		const day4 = date4.getDate();
		queryParams.value.EndRequiredShipDate = year4 + '-' + month4 + '-' + day4;
	}
	await dFOutboundOrderpage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
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
	getAppPage();
});

// 获取keys
const selectChange = (selection: any) => {
	selectExport.value.splice(0, selectExport.value.length);
	selection.map((item: any) => {
		selectExport.value.push(item.id);
	});
};
// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	getAppPage();
};
// 导出选中
const SelectedExport = async (coltype) => {
	cardLoading.value = true;
	await dFOutboundOrderexport(Object.assign({ type: 1, Ids: selectExport.value }, queryParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
	});
};
// 导出所有
const AllExport = async (coltype) => {
	cardLoading.value = true;
	await dFOutboundOrderexport(Object.assign({ type: 0 }, queryParams.value)).then((res) => {
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
				<el-form-item label="站点">
					<el-select clearable="" @change="getAppPage()" v-model="queryParams.Site">
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Order Place Date">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="daterange" v-model="queryParams.OrderPlaceDates" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="Required Ship Date">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="daterange" v-model="queryParams.RequiredShipDates" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search"
							@click="getAppPage()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
			queryParams = {};
			getAppPage();
		}" style="width: 70px; margin-right: 2px"> 重置
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
								<el-dropdown-item style="height: 24px" @click="SelectedExport(1)">导出选中
								</el-dropdown-item>
								<el-dropdown-item style="height: 24px" @click="AllExport(1)">导出全部
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%"
				@selection-change="(selection: any) => selectChange(selection)" v-loading="loading"
				tooltip-effect="light">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" />
				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
