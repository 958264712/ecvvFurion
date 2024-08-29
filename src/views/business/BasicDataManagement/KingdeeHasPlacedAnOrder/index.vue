<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="规格型号">
					<el-input v-model="queryParams.ErpSKU" clearable="" placeholder="请输入规格型号" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"
							> 查询 </el-button>
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
				<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false"
					name="file">
					<el-button :loading="ImportsSalesloading" type="primary">导入</el-button>
				</el-upload>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				@sort-change="sortfun" @selection-change="handleSelectionChange" :header-cell-style="customHeaderCellStyle"
				row-key="id" border="">
				<el-table-column type="selection" width="55" class-name="custom-header" />
				<el-table-column prop="productCode" label="商品编码" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="productName" label="商品名称" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="productType" label="商品类别" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="specificationAndModel" label="规格型号" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="brand" label="品牌" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="defaultSupplier" label="默认供应商" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="weight" label="重量单位" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="productlabel" label="商品标签" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="netWeight" label="净重" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="grossWeight" label="毛重" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="volumeUnit" label="体积单位" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="volume" label="体积" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="warehouseCode" label="仓库编码" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="warehouseName" label="仓库名称" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="warehouseClassification" label="仓库分类" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="code" label="编码" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="BarCode" label="条形码" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="finishedProductInventory" label="成品库存" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="orderedQuantity" label="已下单数量" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="basicUnit" label="基本单位" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="auxiliaryUnit" label="辅助单位" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="conversionFormula" label="换算公式" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="unitCost" label="单位成本" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="cost" label="成本" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="limitedTimeInventory" label="即时库存（辅助）" sortable width="190" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="availableStock" label="可用库存（辅助）" sortable width="190" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="limitedTimeInventoryLoosePackage" label="即时库存（整件散包）" sortable width="190"
					align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="availableStockLoosePackage" label="可用库存（整件散包）" sortable width="190" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="team" label="所属团队" sortable width="150" align="center"
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
<script lang="ts" setup="" name="KingdeeHasPlacedAnOrder">
import { ref } from 'vue';
import { service } from '/@/utils/request';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
//import { formatDate } from '/@/utils/formatTime';
import { KingdeeHasPlacedAnOrderInfo, ImportKingdeeHasPlacedAnOrder } from '/@/api/modular/main/BasicDataManagement.ts';
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
	ImportKingdeeHasPlacedAnOrder(formData).then((res: any) => {
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
	var res = await KingdeeHasPlacedAnOrderInfo(Object.assign(queryParams.value, tableParams.value));
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