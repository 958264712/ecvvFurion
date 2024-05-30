<script lang="ts" setup name="stockSkuOperations">
import { ref, watch, onMounted } from 'vue';
import editDialog from './batchModify/index.vue';
import other from '/@/utils/other.ts';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Session } from '/@/utils/storage';
import { SKUOperationPage, SKUOperationUpdate, SKUOperationExport } from '/@/api/modular/main/sotckSkuOperations';
import tabDragColum from '/@/components/tabDragColum/index.vue';

const router = useRouter();
const queryParams = ref<any>({});
const tableParams = ref<any>({ PageNo: 1, PageSize: 20 });
const tableData = ref<any>([]);
const selectedRows = ref<any>([]);
const selectedRowKeys = ref<any>([]);
const disabledList = ref<any>([]);
const editDialogRef = ref();
const editCostpeice_BatchTitle = ref('批量修改');
const activeName = ref('ALL');
const loading = ref(false);
const Exportloading = ref<any>(false);
const area = ref('CN');
const month = new Date().getMonth() + 1;
let month1, month2, month3, month4, month5;

switch (month) {
	case 1:
		month1 = 12;
		month2 = 11;
		month3 = 10;
		month4 = 9;
		month5 = 8;
		break;
	case 2:
		month1 = 1;
		month2 = 12;
		month3 = 11;
		month4 = 10;
		month5 = 9;
		break;
	case 3:
		month1 = 2;
		month2 = 1;
		month3 = 12;
		month4 = 11;
		month5 = 10;
		break;
	case 4:
		month1 = 3;
		month2 = 2;
		month3 = 1;
		month4 = 12;
		month5 = 11;
		break;
	case 5:
		month1 = 4;
		month2 = 3;
		month3 = 2;
		month4 = 1;
		month5 = 12;
		break;
	default:
		month1 = month - 1;
		month2 = month - 2;
		month3 = month - 3;
		month4 = month - 4;
		month5 = month - 5;
		break;
}
const TableData = ref<any>([
	{
		titleCN: '图片',
		titleEN: 'IMAGE',
		dataIndex: 'site',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存SKU',
		titleEN: 'ERP SKU',
		dataIndex: 'inventorySKU',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存品名',
		titleEN: 'ERP NAME',
		dataIndex: 'inventoryProductName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '销售属性',
		titleEN: 'Sales Attributes',
		dataIndex: '销售属性',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '产品CAT',
		titleEN: 'Category',
		dataIndex: 'productCAT',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购国',
		titleEN: 'Sourcing From',
		dataIndex: 'purchasingCountry',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '产品是否淘汰',
		titleEN: 'Item Status',
		dataIndex: 'itemStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '有效ASIN数',
		titleEN: 'Total Available ASINS',
		dataIndex: 'listCount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存',
		titleEN: 'ERP Inventory',
		dataIndex: 'inventoryQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '在途数量',
		titleEN: 'In Transit QTY',
		dataIndex: 'inTransitQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存周转状态',
		titleEN: 'Stock Turnover',
		dataIndex: 'stockTurnover',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '周转天数',
		titleEN: 'Turnover Time',
		dataIndex: 'turnoverTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '上周7日销量',
		titleEN: 'Last 7 Days Sales',
		dataIndex: 'lastShippedUnits',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '本周7日销量',
		titleEN: '7 Days Sales',
		dataIndex: 'thisShippedUnits',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '周销量趋势',
		titleEN: 'Trend',
		dataIndex: 'weekTrend',
		checked: true,
		fixed: false,
	},
	{
		titleCN: month + '月AMZ销量',
		titleEN: month + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P0',
		checked: true,
		fixed: false,
	},
	{
		titleCN: month1 + '月AMZ销量',
		titleEN: month1 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P1',
		checked: true,
		fixed: false,
	},
	{
		titleCN: month2 + '月AMZ销量',
		titleEN: month2 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P2',
		checked: true,
		fixed: false,
	},
	{
		titleCN: month3 + '月AMZ销量',
		titleEN: month3 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P3',
		checked: true,
		fixed: false,
	},
	{
		titleCN: month4 + '月AMZ销量',
		titleEN: month4 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P4',
		checked: true,
		fixed: false,
	},
	{
		titleCN: month5 + '月AMZ销量',
		titleEN: month5 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P5',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '首次上架时间',
		titleEN: 'First listing time',
		dataIndex: 'createTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '累计采购数量',
		titleEN: 'Accumulated procurement quantity',
		dataIndex: 'totalQuantityShipped',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'UAE月入库数量',
		titleEN: 'UAE monthly inventory quantity',
		dataIndex: 'uaeCurrentInventoryQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'SA月入库数量',
		titleEN: 'SA monthly inventory quantity',
		dataIndex: 'saCurrentInventoryQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'UAE月出库数量',
		titleEN: 'UAE monthly outbound quantity',
		dataIndex: 'uaeCurrentOutboundQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'SA月出库数量',
		titleEN: 'SA monthly outbound quantity',
		dataIndex: 'saCurrentOutboundQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '现负责人',
		titleEN: 'Creator',
		dataIndex: 'creator',
		checked: true,
		fixed: false,
	},
]);

const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list;
	}
};
const buyer = ref([
	{
		key: 0,
		value: '全部',
	},
	{
		key: 1,
		value: 'UAE',
	},
	{
		key: 2,
		value: 'SA',
	},
	{
		key: 3,
		value: 'CN',
	},
]);
const ifoutProduct = ref([
	{
		key: 1,
		value: 'Obsolete',
	},
	{
		key: 2,
		value: 'Normal',
	},
]);
const stockStatus = ref([
	{
		key: 1,
		value: 'Poor Sale',
	},
	{
		key: 2,
		value: 'Exess Inventtory',
	},
	{
		key: 3,
		value: 'Normal',
	},
]);
const weekSales = ref([
	{
		key: 1,
		value: 'No Change',
	},
	{
		key: 2,
		value: 'Up',
	},
	{
		key: 3,
		value: 'Down',
	},
]);
const monthSales = ref([
	{
		key: 1,
		value: 'No Change',
	},
	{
		key: 2,
		value: 'Up',
	},
	{
		key: 3,
		value: 'Down',
	},
]);
const tabsList = ref([
	{
		label: '全部',
		name: 'ALL',
	},
	{
		label: 'UAE',
		name: 'UAE',
	},
	{
		label: 'SA',
		name: 'SA',
	},
]);
const area1 = ref('中文表头');
const changeArea = (val) => {
	area.value = val;
	if (area.value === 'CN') {
		area1.value = '中文表头';
	} else {
		area1.value = 'English header';
	}
};
const handleQuery = async (): void => {
	loading.value = true;
	queryParams.value.Site = activeName.value;
	if (activeName.value === 'ALL') {
		queryParams.value.Site = null;
	}
	var res = await SKUOperationPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	tableParams.value.PageNo = res.data.result?.page;
	tableParams.value.PageSize = res.data.result?.pageSize;
	res.data.result?.items.map((item) => {
		disabledList.value.push(item.id);
	});
	loading.value = false;
};
// 切换站点
const handleClick = (tab, event): void => {
	activeName.value = tab.props.name;
};

// 获取keys
const selectChange = (selection: any): void => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item.id);
	});
};
// 导出选中
const SelectedExport = async (): void => {
	Exportloading.value = true;
	await SKUOperationExport(Object.assign({ type: 1, area: area.value, ids: selectedRowKeys.value, isImages: false, site: activeName.value === 'ALL' ? null : activeName.value })).then((res) => {
		other.downloadfile(res);
		selectedRowKeys.value = [];
		selectedRows.value = [];
		Exportloading.value = false;
	});
};
// 导出所有
const AllExport = async (): void => {
	if (activeName.value === 'ALL') {
		queryParams.value.Site = null;
	}
	Exportloading.value = true;
	await SKUOperationExport(Object.assign({ type: 0, isImages: false, area: area.value, site: queryParams.value.Site })).then((res) => {
		other.downloadfile(res);
		selectedRows.value = [];
		Exportloading.value = false;
	});
};

// 打开编辑页面
const batchModify = (): void => {
	editDialogRef.value.idList = selectedRowKeys.value;
	editDialogRef.value.openDialog();
};
// 修改与批量修改
const disabledfun = async (val: any): void => {
	if (disabledList.value.some((item) => item === val.row.id)) {
		const index = disabledList.value.findIndex((item) => item === val.row.id);
		disabledList.value.splice(index, 1);
	} else {
		disabledList.value.push(val.row.id);
		var res = await SKUOperationUpdate(Object.assign({ id: val.row.id, itemStatus: val.row.itemStatus }));
		res.data.result?.type === 'success' ? ElMessage.success('Save Successfully!') : null;
	}
};
const disabledAuto = (scope: any): void => {
	return disabledList.value.some((item) => item === scope.row.id);
};
// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.PageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.PageNo = val;
	handleQuery();
};
const idList = () => {
	handleQuery();
};
// 跳转到asin管理页面并查询
const handleRouter = (storeSku: string, site: string) => {
	if (site !== 'ALL') {
		Session.set('queryObj', { country: site, erpAndGoodsName: storeSku, ifquery: false });
		router.push({ path: '/operation/asin/asindata' });
	}
};

// 站点改变调用接口
watch(
	() => activeName.value,
	() => {
		handleQuery();
	}
);
onMounted(() => {
	handleQuery();
});
</script>
<template>
	<div class="stock_sku_operations">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="品号/库存SKU">
					<el-input v-model="queryParams.ErpSku" clearable="" placeholder="请输入品号/库存SKU" />
				</el-form-item>
				<el-form-item label="采购国">
					<el-select clearable="" v-model="queryParams.PurchasingCountry" placeholder="全部">
						<el-option v-for="(item, index) in buyer" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="产品是否淘汰">
					<el-select clearable="" v-model="queryParams.ItemStatus" placeholder="请选择">
						<el-option v-for="(item, index) in ifoutProduct" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="库存周转状态">
					<el-select clearable="" v-model="queryParams.StockTurnover" placeholder="请选择">
						<el-option v-for="(item, index) in stockStatus" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="周销量趋势">
					<el-select clearable="" v-model="queryParams.WeekTrend" placeholder="请选择">
						<el-option v-for="(item, index) in weekSales" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="月销量趋势">
					<el-select clearable="" v-model="queryParams.MonthTrend" placeholder="请选择">
						<el-option v-for="(item, index) in monthSales" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="负责人">
					<el-input v-model="queryParams.creator" clearable="" placeholder="请输入负责人" />
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px" :body-style="{ padding: '10px 20px' }">
			<div class="settingf" style="margin-bottom: 5px; display: flex; justify-content: space-between">
				<div>
					<el-button type="primary" @click="batchModify()" style="margin-right: 20px"
						:disabled="!selectedRowKeys?.length"> 批量修改 </el-button>
					<el-dropdown style="margin-right: 20px">
						<el-button type="primary" :loading="Exportloading"> 导出 </el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="AllExport()">导出所有</el-dropdown-item>
								<el-dropdown-item @click="SelectedExport()"
									:disabled="!selectedRowKeys?.length">导出选中</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-radio-group v-model="area1" style="margin-left: 20px">
						<el-radio-button label="中文表头" value="中文表头" @change="changeArea('CN')" />
						<el-radio-button label="English header" value="English header" @change="changeArea('EN')" />
					</el-radio-group>
				</div>
				<tabDragColum :data="TableData" :name="`stockSkuOperationsData`" :area="area"
					@handleData="handleData" />
			</div>
			<el-tabs v-model="activeName" type="card" style="height: 85%" @tab-click="handleClick">
				<el-tab-pane :label="item.label" :name="item.name" style="height: 100%" v-for="item in tabsList">
					<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light"
						row-key="id" @selection-change="(selection: any) => selectChange(selection)">
						<el-table-column type="selection" width="55" />
						<el-table-column type="index" :label="area == 'CN' ? '序号' : 'NO.'" width="55" align="center" />
						<template v-for="(item, index) in TableData" :key="index">
							<el-table-column v-if="item.checked && item.dataIndex === 'site'" :prop="item.dataIndex"
								:fixed="item.fixed" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center">
								<template #default="scope">
									<img
										:src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.inventorySKU + '.jpg'" />
								</template>
							</el-table-column>
							<el-table-column v-else-if="item.checked && item.dataIndex === 'itemStatus'"
								:fixed="item.fixed" :prop="item.dataIndex"
								:label="area == 'CN' ? item.titleCN : item.titleEN" width="100" align="center">
								<template #default="scope">
									<el-select clearable="" v-model="scope.row.itemStatus" placeholder="请选择"
										:disabled="disabledAuto(scope)">
										<el-option v-for="(item, index) in ifoutProduct" :key="index"
											:value="item.value" :label="item.label" />
									</el-select>
								</template>
							</el-table-column>
							<el-table-column v-else-if="item.checked && item.dataIndex === 'listCount'"
								:fixed="item.fixed" :prop="item.dataIndex"
								:label="area == 'CN' ? item.titleCN : item.titleEN" align="center">
								<template #default="scope">
									<span style="color: red"
										@click="handleRouter(scope.row.inventorySKU, activeName)">{{ scope.row.listCount }}
									</span>
								</template>
							</el-table-column>
							<el-table-column v-else-if="item.checked" :fixed="item.fixed" :prop="item.dataIndex"
								:label="area == 'CN' ? item.titleCN : item.titleEN" width="120" align="center" />
						</template>
						<el-table-column label="操作" width="140" align="center" fixed="right">
							<template #default="scope">
								<el-button size="small" text type="primary"
									@click="disabledfun(scope)">{{ disabledList.some((item) => item === scope.row.id) ? '编辑' : '保存' }}</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
			<el-pagination v-model:currentPage="tableParams.PageNo" v-model:page-size="tableParams.PageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editCostpeice_BatchTitle" @reloadTable="handleQuery"
				@idList="idList" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.settingf {
	margin-bottom: 10px;
}

/deep/ .el-tabs--card {
	.el-tabs__header {
		margin: 0;
	}

	.el-tabs__content {
		height: 90%;
	}

	// .el-table__body-wrapper{
	//     overflow:auto;
	// }
}
</style>
