<script lang="ts" setup name="inventory_data">
import { ref, onMounted, watch } from 'vue';
import { initialInventoryDataPage,getInitialInventoryData } from '/@/api/modular/main/financial.ts';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import importDialog from './component/importDialog.vue';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';

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
const puyuanyunId = ref<any>('')
const tableAddress = ref('');
const area = ref('CN');
const loading = ref(false);
const loading1 = ref(false);
const ifClose = ref(false);
const visible = ref(false)
const selectExport = ref([]);
const yearList = ref<any>([]);
const date = new Date();
const year = date.getFullYear();

for (let i = year ; i >= 2005; i--) {
	yearList.value.push({ label: `${i}`, value: `${i}` });
}
const TableData = ref<any>([
	{
		titleCN: '文件名',
		dataIndex: 'fileName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '批次',
		dataIndex: 'batchId',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '月份',
		dataIndex: 'time',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作人',
		dataIndex: 'creator',
		checked: true,
		fixed: false,
	},
]);
const formList = ref<formListType>([
	{
		label: '仓库名称',
		prop: 'warehouseName',
		select:true,
		options:[
			{value:'EG Warehouse X1',lable:'EG Warehouse X1'},
			{value:'埃及不良品仓',lable:'埃及不良品仓'},
			{value:'EG Warehouse',lable:'EG Warehouse'},
			{value:'沙特不良品仓',lable:'沙特不良品仓'},
			{value:'SA Warehouse X1',lable:'SA Warehouse X1'},
			{value:'SA Warehouse',lable:'SA Warehouse'},
			{value:'阿曼仓',lable:'阿曼仓'},
			{value:'UAE Store Warehouse',lable:'UAE Store Warehouse'},
			{value:'阿联酋不良品仓6Z2',lable:'阿联酋不良品仓6Z2'},
			{value:'UAE Warehouse No. 2',lable:'UAE Warehouse No. 2'},
			{value:'UAE Warehouse No. 6',lable:'UAE Warehouse No. 6'},
			{value:'深圳仓库',lable:'深圳仓库'},
			{value:'迪拜虚拟仓库',lable:'迪拜虚拟仓库'},
			{value:'默认仓库',lable:'默认仓库'},
		]
	},
	{
		label: '库存SKU',
		prop: 'erpSku'
	}
]);
const dataList = ref<any>([
	{
		label: '仓库名称',
		prop: 'warehouseName',
	},
	{
		label: '库存SKU',
		prop: 'erpSku',
	},
	{
		label: '商品名称',
		prop: 'goodsName',
	},
	{
		label: '商品成本价',
		prop: 'productInfoCostPrice',
	},
	{
		label: '期初数量',
		prop: 'initialQuantity',
	},
	{
		label: '期初金额',
		prop: 'initialAmount',
	},
	{
		label: '本期入库数量',
		prop: 'thisPeriodInventoryQuantity',
	},
	{
		label: '本期入库金额',
		prop: 'thisPeriodInventoryAmount',
	},
	{
		label: '本期出库数量',
		prop: 'outboundstringhisPeriodQuantity',
	},
	{
		label: '本期出库金额',
		prop: 'outboundstringhisPeriodAmount',
	},
	{
		label: '期末数量',
		prop: 'finalQuantity',
	},
	{
		label: '期末平均单价',
		prop: 'averageUnitPrice',
	},
	{
		label: '期末金额',
		prop: 'finalAmount',
	},
	{
		label: '转库存单价',
		prop: 'transferInventoryUnitPrice',
	},
	{
		label: '库存商品单价',
		prop: 'inventoryCommodityPrices',
	},
	{
		label: '备注',
		prop: 'remarks',
	}
]);
const openimportDialog = () => {
	loading1.value = true;
	url.value = (import.meta.env.VITE_API_URL as any) + `/api/initialInventoryData/import`;
	tableAddress.value = (import.meta.env.VITE_API_URL as any) + '/upload/TableAddress/期初库存数据.xlsx';
	importDialogRef.value.openDialog();
	loading1.value = false;
};
// 查询
const handleQuery = async (): void => {
	loading.value = true;
	await initialInventoryDataPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	loading.value = false;
};
const openEditUser = (row: any) => {
	visible.value = true
	puyuanyunId.value = row.batchId
};
const close = () => {
	ifClose.value = false
	visible.value = false
}
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
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="文件名">
					<el-input placeholder="请输入" v-model="queryParams.fileName" clearable />
				</el-form-item>
				<el-form-item label="年份">
					<el-select v-model="queryParams.time" clearable>
						<el-option v-for="(item, index) in yearList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button  type="primary" icon="ele-Search" @click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = { WarehouseName: '全部' };
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
					<el-button :loading="loading1" type="primary" @click="openimportDialog" v-auth="'inventory_data:import'">导入</el-button>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light">
				<el-table-column type="index" label="序号" width="75" align="center" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" show-overflow-tooltip="" />
				</template>
				<el-table-column label="操作" width="200" align="center" fixed="right" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="primary" @click="openEditUser(scope.row)" > 详情 </el-button>
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
			<importDialog ref="importDialogRef" :excelName="excelName" :tableAddress="tableAddress" :area="area" :url="url" @reloadTable="handleQuery" />
			<el-dialog v-model="visible" title="详情" @close="close" width="1000px">
				<infoDataDialog :id="puyuanyunId" idName="batchId"  :dataList="dataList"
					:ifClose="ifClose" :pointerface="getInitialInventoryData" :formList="formList" />
			</el-dialog>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
