<script lang="ts" setup name="POOutboundOrder">
import { ref, onMounted, watch } from 'vue';
import { pOOutboundOrderPage, pOOutboundOrderExport,pOOutboundOrderSynchronous } from '/@/api/modular/main/financial.ts';
import { ElMessage } from 'element-plus';
import moment from 'moment';
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
const synchronousLoading = ref(false);
const selectedRows = ref([]);
const selectExport = ref([]);
const area = ref('CN');
const TableData = ref<any>([
	{
		titleCN: 'PO',
		dataIndex: 'po',
		width:120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Vendor',
		dataIndex: 'vendor',
		width:100,
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
		titleCN: 'ASIN',
		dataIndex: 'asin',
		width:130,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ERP-SKU',
		dataIndex: 'erpSku',
		width:140,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Status',
		dataIndex: 'status',
		width:100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Ordered On',
		dataIndex: 'orderedOn',
		width:130,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Cancellation status',
		dataIndex: 'cancellationStatus',
		width:155,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Cancellation date',
		dataIndex: 'cancellationDate',
		width:145,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'External ID',
		dataIndex: 'externalID',
		width:110,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'External Id Type',
		dataIndex: 'externalIdType',
		width:135,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Model Number',
		dataIndex: 'modelNumber',
		width:125,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Title',
		dataIndex: 'title',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Window Type',
		dataIndex: 'windowType',
		width:120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Expected Date',
		dataIndex: 'expectedDate',
		width:125,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Quantity Requested',
		dataIndex: 'quantityRequested',
		width:160,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Accepted Quantity',
		dataIndex: 'acceptedQuantity',
		width:155,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Quantity received',
		dataIndex: 'quantityReceived',
		width:155,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Quantity Outstanding',
		dataIndex: 'quantityOutstanding',
		width:165,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Unit Cost',
		dataIndex: 'unitCost',
		width:110,
		checked: true,
		fixed: false,
	},

	{
		titleCN: '货币单位',
		dataIndex: 'monetaryUnit',
		width:110,
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Total Cost',
		dataIndex: 'totalCost',
		width:110,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '货币单位',
		dataIndex: 'totalUnit',
		width:110,
		checked: true,
		fixed: false,
	},

]);

// 查询
const handleQuery = async (): void => {
	loading.value = true;
	queryParams.value.startOrderedOn = queryParams.value.orderOnDates ? moment(queryParams.value.orderOnDates[0]).format('YYYY-MM-DD') : undefined;
	queryParams.value.endOrderedOn = queryParams.value.orderOnDates ? moment(queryParams.value.orderOnDates[1]).format('YYYY-MM-DD') : undefined;
	
	await pOOutboundOrderPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		tableData.value = res.data.result.items;
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
// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	handleQuery();
};
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
	handleQuery();
};
// 导出选中
const SelectedExport = async (coltype) => {
	cardLoading.value = true;
	await pOOutboundOrderExport(Object.assign({ type: 1, Ids: selectExport.value }, queryParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
	});
};
// 导出所有
const AllExport = async (coltype) => {
	cardLoading.value = true;
	await pOOutboundOrderExport(Object.assign({ type: 0 }, queryParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
		selectedRows.value = [];
	});
};
// 同步 获取到系统最近1月的数据，并提示：同步成功
const Synchronization = async () => {
	synchronousLoading.value = true
	await pOOutboundOrderSynchronous().then(res=>{
		if(res.status===200){
			ElMessage.success('同步成功')
			synchronousLoading.value = false
			handleQuery()
		}
	})
}

</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="PO">
					<el-input v-model="queryParams.po" clearable="" placeholder="请输入PO" />
				</el-form-item>
				<el-form-item label="站点">
					<el-select clearable=""  v-model="queryParams.site" placeholder="全部">
						<el-option label="全部" value="" ></el-option>
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.asin" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item label="ERP-SKU">
					<el-input v-model="queryParams.erpSku" clearable="" placeholder="请输入ERP-SKU" />
				</el-form-item>
				<el-form-item label="Status">
					<el-select clearable=""  v-model="queryParams.status" placeholder="ALL">
						<el-option value="" label="ALL"></el-option>
						<el-option value="CLOSED" label="CLOSED"></el-option>
						<el-option value="OPEN" label="OPEN"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Ordered On">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="daterange" v-model="queryParams.orderOnDates" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button  type="primary" icon="ele-Search"
							@click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => { queryParams = {}; handleQuery(); }"
							style="width: 70px; margin-right: 2px"> 
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
								<el-dropdown-item style="height: 24px" :disabled="selectExport?.length <= 0" @click="SelectedExport(1)">导出选中
								</el-dropdown-item>
								<el-dropdown-item style="height: 24px" @click="AllExport(1)">导出全部
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-button @click="Synchronization" :loading="synchronousLoading" style="margin-left:10px">同步</el-button>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%"
				@selection-change="(selection: any) => selectChange(selection)" v-loading="loading"
				tooltip-effect="light">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN" align="center" show-overflow-tooltip :width="item.width" />
				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
