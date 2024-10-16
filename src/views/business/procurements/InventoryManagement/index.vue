<template>
	<div class="uAE_ProcurementDetails-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="">
					<el-input v-model="queryParams.ErpSKU" clearable="" placeholder="请输入SKU或Name" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div style="display: flex; justify-content: space-between">
				<div class="importDiv" style="width: 17%">
					<el-button @click="dialogFormVisible = true" type="primary"> 导入 </el-button>
					<el-dialog v-model="dialogFormVisible" title="导入" width="600px" center>
						<importDialog :type="importType" :text="importText" :formList="importFormList" :importsInterface="ImportInventoryManagement" @close="importClose" @importQuery="importQuery" />
					</el-dialog>

					<div class="flex flex-wrap items-center">
						<el-checkbox v-model="IsImage">导出图片</el-checkbox>&nbsp;
						<el-dropdown>
							<el-button type="primary" :loading="Exportloading"> 导出 </el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item :disabled="disabledSelected" @click="SelectedExport">导出选中</el-dropdown-item>
									<el-dropdown-item @click="AllExport">导出所有</el-dropdown-item>
									<el-dropdown-item @click="ExportPurchaseQuantity('UAE')">导出UAE采购数量</el-dropdown-item>
									<el-dropdown-item @click="ExportPurchaseQuantity('SA')">导出 SA 采购数量</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</div>
				<tabDragColum :data="TableData" :name="`InventoryManagementData`" :area="area" @handleData="handleData" @handleRemarkData="handleRemarkData" />
			</div>
			<el-table
				:data="tableData"
				size="lagre"
				style="width: 100%"
				v-loading="loading"
				tooltip-effect="light"
				@sort-change="sortfun"
				@selection-change="handleSelectionChange"
				:header-cell-style="customHeaderCellStyle"
				row-key="id"
				border=""
			>
				<el-table-column type="selection" width="55" class-name="custom-header" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.checked && item.dataIndex === 'images'"
						:prop="item.dataIndex"
						:fixed="item.fixed"
						width="80"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<div class="demo-image__preview">
								<el-image
									style="width: 60px; height: 60px"
									:src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpSKU + '.jpg'"
									:zoom-rate="1.2"
									:max-scale="7"
									:min-scale="0.2"
									:preview-src-list="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpSKU + '.jpg'"
									:initial-index="1"
									fit="cover"
								/>
							</div>
						</template>
					</el-table-column>

					<!-- <el-table-column prop="suggestedProcurementQuantity" label="建议采购数量" sortable align="center" width="135" /> -->
					<el-table-column
						v-else-if="item.checked && item.dataIndex === 'uaeSuggestedProcurementQuantity'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						sortable
						align="center"
						width="175"
						show-overflow-tooltip
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<div v-if="scope.row.uaeSuggestedProcurementQuantity > 0">
								{{ scope.row.uaeSuggestedProcurementQuantity }}
							</div>
							<div v-else></div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.checked && item.dataIndex === 'saSuggestedProcurementQuantity'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						sortable
						align="center"
						width="170"
						show-overflow-tooltip
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<div v-if="scope.row.saSuggestedProcurementQuantity > 0">
								{{ scope.row.saSuggestedProcurementQuantity }}
							</div>
							<div v-else></div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						sortable
						width="185"
						align="center"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<errorDialog ref="errorDialogRef" :title="errorDTitle" />
		</el-card>
	</div>
</template>
<script lang="ts" setup="" name="InventoryManagement">
import { ref } from 'vue';
import { service } from '/@/utils/request';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
//import { formatDate } from '/@/utils/formatTime';
import { InventoryManagementInfo, ImportInventoryManagement } from '/@/api/modular/main/uAE_ProcurementDetails.ts';
import other from '/@/utils/other.ts';
import { Right } from '@element-plus/icons-vue/dist/types';
import { QuestionFilled } from '@element-plus/icons-vue';
import errorDialog from './component/error_table.vue';
import axios from 'axios';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import importDialog from '/@/components/importDialog/index.vue';

const loading = ref(false);
const errorDialogRef = ref();
const errorDTitle = ref('');
const ImportsSalesloading = ref(false);
const Exportloading = ref(false);
const dialogFormVisible = ref(false);
const IsImage = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<inventoryParamsType>({});
const area = ref('CN');
const disabledSelected = ref(true);
const TableData = ref<any>([
	{
		titleCN: '图片',
		dataIndex: 'images',
		checked: true,
		fixed: false,
		remark: false,
	},
	{
		titleCN: 'ErpSKU',
		dataIndex: 'erpSKU',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'ItemName',
		dataIndex: 'itemName',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'Origin',
		dataIndex: 'origin',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE PO QTY',
		dataIndex: 'uaepoqty',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE NEW PO',
		dataIndex: 'newuaepoqty',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE DF QTY',
		dataIndex: 'uaedfqty',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA PO QTY',
		dataIndex: 'sapoqty',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA NEW PO',
		dataIndex: 'newsapoqty',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA DF QTY',
		dataIndex: 'sadfqty',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE-Order QTY',
		dataIndex: 'uaeOrderQTY',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA-Order QTY',
		dataIndex: 'saOrderQTY',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '订单数量汇总',
		dataIndex: 'orderQuantitySummary',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'ERP可用库存-UAE仓',
		dataIndex: 'erpAvailableStockUAE',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'ERP可用库存-SA仓',
		dataIndex: 'erpAvailableStockSA',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '已下单数量-UAE',
		dataIndex: 'uaeOrderedQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '已下单数量-SA',
		dataIndex: 'saOrderedQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '未订购数量-UAE',
		dataIndex: 'unorderedQuantityUAE',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '未订购数量-SA',
		dataIndex: 'unorderedQuantitySA',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '在途数量-UAE',
		dataIndex: 'uaeQuantityInTransit',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '在途数量-SA',
		dataIndex: 'saQuantityInTransit',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE缺货数量',
		dataIndex: 'uaeOutOfStockQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA缺货数量',
		dataIndex: 'saOutOfStockQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '缺货总数量',
		dataIndex: 'totalOutOfStockQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '近30天销量-UAE',
		dataIndex: 'shippedUnitsUAE',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '近30天销量-SA',
		dataIndex: 'shippedUnitsSA',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '近7天销量-UAE',
		dataIndex: 'shippedUnits7dayUAE',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '近7天销量-SA',
		dataIndex: 'shippedUnits7daySA',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE建议采购数量',
		dataIndex: 'uaeSuggestedProcurementQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA建议采购数量',
		dataIndex: 'saSuggestedProcurementQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE综合空运单价(AED)',
		dataIndex: 'emptyComprehensiveInitialUnitPriceUAE',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA综合空运单价(AED)',
		dataIndex: 'emptyComprehensiveInitialUnitPriceSA',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '上架日期',
		dataIndex: 'listingDateTime',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE缺货状态',
		dataIndex: 'uaeOutOfStockStatus',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA缺货状态',
		dataIndex: 'saOutOfStockStatus',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
]);

// 导入模块
const options = ref([
	{
		value: '全部(UAE、SA)',
		label: '全部(UAE、SA)',
	},
	{
		value: 'UAE',
		label: 'UAE',
	},
	{
		value: 'SA',
		label: 'SA',
	},
]);
const options2 = ref([
	{
		value: 'amazon-orders-Dropship',
		label: 'amazon-orders-Dropship',
		disabled: false,
	},
	{
		value: 'Inventory_Sourcing_Retail',
		label: 'Inventory_Sourcing_Retail',
		disabled: false,
	},
	// {
	// 	value: 'Sales',
	// 	label: 'Sales',
	// 	disabled: false,
	// },
	{
		value: '金蝶云采购申请单',
		label: '金蝶云采购申请单',
		disabled: false,
	},
]);
const Typevalue = ref<any>('UAE');
const Namevalue = ref<any>();
const tableParams = ref({
	pageNo: 1,
	pageSize: 100,
	total: 0,
	order: null,
	prop: null,
});
const importType = ref('inventoryManagement');
const importText = ref('选择站点、表格名，点击"确定"后，选择需要导入的文件，将导入该数据');
const importsOptionsItem = ref('');
const importsOptionsItem1 = ref('');
const importChange = (val) => {
	importsOptionsItem.value = val;
	if (val === '全部(UAE、SA)') {
		options2.value.map((item) => {
			if (item.label !== '金蝶云采购申请单') {
				item.disabled = true;
			} else {
				item.disabled = false;
			}
		});
	} else if (val === 'UAE') {
		options2.value.map((item) => {
			if (item.label === 'Sales' || item.label === '金蝶云采购申请单') {
				item.disabled = true;
			} else {
				item.disabled = false;
			}
		});
	} else {
		options2.value.map((item) => {
			if (item.label === '金蝶云采购申请单') {
				item.disabled = true;
			} else {
				item.disabled = false;
			}
		});
	}
};
const importChange1 = (val) => {
	importsOptionsItem1.value = val;
};
const importFormList = ref<any>([
	{
		label: '站点',
		prop: 'Site',
		type: 'select',
		select: 'value1',
		selectList: options.value,
		change: importChange,
	},
	{
		label: '表格名',
		prop: 'excelName',
		type: 'select',
		select: 'value2',
		selectList: options2.value,
		change: importChange1,
	},
]);
let selectedRows = ref<any>([]);

const importClose = (bol: boolean) => {
	dialogFormVisible.value = bol;
};
const importQuery = () => {
	handleQuery();
};
const handleData = (list: any) => {
	if (list?.length) {
		list.map((item, index) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].checked = item.checked;
				TableData.value[index].fixed = item.fixed;
			}
		});
	}
};
const handleRemarkData = (list: any) => {
	if (list?.length) {
		list.map((item, index) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].desc = item.desc;
				TableData.value[index].remark = item.remark;
			}
		});
	}
};
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
	var res = await InventoryManagementInfo(Object.assign(queryParams.value, tableParams.value));
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
	if (selectedRows.value.length > 0) {
		disabledSelected.value = false;
	} else {
		disabledSelected.value = true;
	}
}
function AllExport() {
	Exportloading.value = true;
	const formData = {
		type: 1,
		IsImage: IsImage.value,
	};
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/inventoryManagement/Export`, Object.assign(queryParams.value, tableParams.value, formData), {
			responseType: 'blob', // 将响应解析为二进制数据
		})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
			Exportloading.value = false;
		});
}

function SelectedExport() {
	Exportloading.value = true;
	const formData = {
		type: 0,
		ErpSkus: selectedRows.value,
		IsImage: IsImage.value,
	};
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/inventoryManagement/Export`, formData, {
			responseType: 'blob', // 将响应解析为二进制数据
		})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
			Exportloading.value = false;
		});
}
function ExportPurchaseQuantity(site) {
	Exportloading.value = true;
	const formData = {
		type: 1,
		IsImage: IsImage.value,
		Site: site,
	};
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/inventoryManagement/exportPurchaseQuantity`, Object.assign(queryParams.value, tableParams.value, formData), {
			responseType: 'blob', // 将响应解析为二进制数据
		})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
			Exportloading.value = false;
		});
}

const downloadfile = (res: any) => {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp("filename\\*=(UTF-8['']*[''])([^';]+)(?:.*)");
	//decodeURIComponent()
	var result = patt.exec(contentDisposition);
	var filename = result[2];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURIComponent(filename.replace(reg, '$1')); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
};
//排序
function sortfun(v: any) {
	tableParams.value.order = v.order;
	tableParams.value.prop = v.prop;
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

.example-showcase .el-dropdown + .el-dropdown {
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

:deep(.cell) {
	display: flex;
	align-items: center;
	justify-content: center;
	white-space: nowrap;
}

:deep(.el-textarea__inner) {
	box-shadow: initial;
	margin: 0;
	padding: 5px;
	height: 142px !important;
}
</style>
