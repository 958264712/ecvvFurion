<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="库存SKU">
					<el-input v-model="queryParams.InventorySKU" clearable="" placeholder="请输入库存SKU" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"
							v-auth="'uAE_ProcurementDetails:page'"> 查询 </el-button>
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div style="width: 10%">
				<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false"
					:auto-upload="false" name="file">
					<el-button :loading="ImportsSalesloading" type="primary">导入</el-button>
				</el-upload>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				@sort-change="sortfun" @selection-change="handleSelectionChange"
				:header-cell-style="customHeaderCellStyle" row-key="id" border="">
				<el-table-column type="selection" width="55" class-name="custom-header" />
				<el-table-column prop="images" label="图片" width="90" align="center" sortableshow-overflow-tooltip="">
					<template #default="scope">
						<el-image style="width: 60px; height: 60px" :src="scope.row.images" :zoom-rate="1.2"
							:max-scale="7" :min-scale="0.2" :preview-src-list="scope.row.images" :initial-index="1"
							fit="cover" />
					</template>
				</el-table-column>
				<el-table-column prop="inventorySKU" label="库存SKU" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="tradeName" label="商品名称" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="tradeType" label="商品类别" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="tradeState" label="商品状态" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="deliveryWarehouse" label="发货仓库" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="inventoryQuantity" label="库存数量" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="occupationQuantity" label="占用数量" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="number" label="可用数量" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="outOfStockOccupancy" label="缺货占用数" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="unconfirmedInventoryQuantity" label="已采购未确认入库数量" sortable width="190"
					align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="outOfStockAndPendingOrderQuantity" label="缺货及待派单数量" sortable width="180"
					align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="projectedAvailableBalance" label="预计可用库存" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="lastPurchasePrice" label="上次采购价" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="inventoryUnitPrice" label="库存单价" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="inventoryAmount" label="库存金额" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="minimumPurchasePrice" label="最低采购价格" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="productWeight" label="商品重量(g)" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="brand" label="品牌" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="specifications" label="规格" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="model" label="型号" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="materialQuality" label="材质" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="style1" label="款式1" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="style2" label="款式2" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="style3" label="款式3" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="warehouseLocation" label="库位" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editUAE_ProcurementDetailsTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>
<script lang="ts" setup="" name="InventoryQueryReport">
import { ref } from 'vue';
import { service } from '/@/utils/request';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import axios from 'axios';
//import { formatDate } from '/@/utils/formatTime';
import { InventorySummaryLedgerInfo, ImportInventorySummaryLedger } from '/@/api/modular/main/BasicDataManagement.ts';
const loading = ref(false);
const ImportsSalesloading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<inventoryParamsType>({});

const tableParams = ref({
	pageNo: 1,
	pageSize: 100,
	total: 0,
	Order: null,
	Field: null
});
let selectedRows = ref<any>([]);
function Imports(file: any) {
	ImportsSalesloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	axios.post(import.meta.env.VITE_API_URL as any + `/api/inventorySummaryLedger/import`, formData)
		//ImportInventorySummaryLedger(formData)
		.then((res: any) => {
			ImportsSalesloading.value = false;
			if (res.data.code == 200) {
				ElMessage.success('导入成功');
				handleQuery();
			} else {
				ImportsSalesloading.value = false;
				ElMessage.error('导入失败'); // + res.message
			}
		});
}

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.pageNo = val;
	handleQuery();
};

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await InventorySummaryLedgerInfo(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.erpSKU);
	});
}

//排序
function sortfun(v: any) {
	tableParams.value.Order = v.order;
	tableParams.value.Field = v.prop;
	handleQuery();
}
function customHeaderCellStyle({ column, $index }) {
	// 返回包含 CSS 样式的对象
	return {
		backgroundColor: '#e9e9e9	', // 设置表头背景颜色为蓝色
	};
}
handleQuery();
</script>
<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 500px;
}

.example-showcase .el-dropdown+.el-dropdown {
	margin-left: 15px;
}

.example-showcase .el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

.itemlabel {
	font-size: 16px;
	width: 20%;
	text-align: right;
}
</style>