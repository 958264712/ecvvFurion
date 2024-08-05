<script lang="ts" setup name="inventory_data">
import { ref, onMounted, watch } from 'vue';
import { initialInventoryDataPage } from '/@/api/modular/main/financial.ts';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import importDialog from './component/importDialog.vue';

const tableData: any[] = ref([]);
const queryParams = ref<any>({ WarehouseName: '全部' });
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const importDialogRef = ref();
const excelName = ref('期初库存数据');
const url = ref('');
const tableAddress = ref('');
const area = ref('CN');
const loading = ref(false);
const loading1 = ref(false);
const selectExport = ref([]);
const TableData = ref<any>([
	{
		titleCN: '仓库名称',
		dataIndex: 'warehouseName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存SKU',
		dataIndex: 'erpSku',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品名称',
		dataIndex: 'goodsName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品成本价',
		dataIndex: 'productInfoCostPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期初数量',
		dataIndex: 'initialQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期初金额',
		dataIndex: 'initialAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期入库数量',
		dataIndex: 'thisPeriodInventoryQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期入库金额',
		dataIndex: 'thisPeriodInventoryAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期出库数量',
		dataIndex: 'outboundstringhisPeriodQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本期出库金额',
		dataIndex: 'outboundstringhisPeriodAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期末数量',
		dataIndex: 'finalQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期末平均单价',
		dataIndex: 'transferInventoryUnitPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '期末金额',
		dataIndex: 'finalAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '转库存单价',
		dataIndex: 'finalQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存商品单价',
		dataIndex: 'inventoryCommodityPrices',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '备注',
		dataIndex: 'remarks',
		checked: true,
		fixed: false,
	},
]);

const openimportDialog = () => {
	loading1.value = true;
	url.value = (import.meta.env.VITE_API_URL as any) + `/api/initialInventoryData/import`;
	tableAddress.value = (import.meta.env.VITE_API_URL as any) + '/upload/TableAddress/期初库存数据.xlsx'
	importDialogRef.value.openDialog();
	loading1.value = false;
};
// 查询
const getAppPage = async (): void => {
	loading.value = true;
	if(queryParams.value.WarehouseName === '全部'){
		queryParams.value.WarehouseName = null
	}
	await initialInventoryDataPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	if(queryParams.value.WarehouseName === null){
		queryParams.value.WarehouseName = '全部'
	}
	loading.value = false;
};

onMounted(() => {
	getAppPage();
});

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	getAppPage();
};
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="仓库名称">
					<el-select v-model="queryParams.WarehouseName" clearable>
						<el-option value="全部" label="全部"></el-option>
						<el-option value="SA Warehouse" label="SA Warehouse"></el-option>
						<el-option value="UAE Store Warehouse" label="UAE Store Warehouse"></el-option>
						<el-option value="UAE Warehouse No. 2" label="UAE Warehouse No. 2"></el-option>
						<el-option value="UAE Warehouse No. 6" label="UAE Warehouse No. 6"></el-option>
						<el-option value="阿联酋不良品仓6Z2" label="阿联酋不良品仓6Z2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="库存SKU" >
					<el-input placeholder="请输入" v-model="queryParams.erpSku" clearable/>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input placeholder="请输入" v-model="queryParams.goodsName" clearable/>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search" @click="getAppPage()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {WarehouseName:'全部'};
									getAppPage();
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
					<el-button :loading="loading1" type="primary" @click="openimportDialog" v-auth="'inventory_data:import'">导入</el-button>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%"  v-loading="loading" tooltip-effect="light">
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" show-overflow-tooltip="" />
				</template>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<importDialog ref="importDialogRef" :excelName="excelName" :tableAddress="tableAddress" :area="area" :url="url" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
