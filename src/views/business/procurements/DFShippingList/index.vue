<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.ASIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item label="ERP-SKU">
					<el-input v-model="queryParams.ErpSKU" clearable="" placeholder="请输入ErpSKU" />
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
			<div class="importDiv" style="width: 100%">
				<div style="float: left;">
					<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false"
						:auto-upload="false" name="file">
						<el-button :loading="ImportsSalesloading" type="primary">导入</el-button>
					</el-upload>
				</div>
				<div class="flex flex-wrap items-center" style="float: left;margin-left: 10px;">
					<el-checkbox v-model="IsImage">导出图片</el-checkbox>&nbsp;
					<el-dropdown>
						<el-button type="primary" :loading="Shippingloading">
							导出发货单
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="SelectedShippingExport">导出选中</el-dropdown-item>
								<el-dropdown-item @click="AllShippingExport">导出所有</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
				<div class="flex flex-wrap items-center" style="float: left;margin-left: 10px;">
					<el-dropdown>
						<el-button type="primary" :loading="DFDeliveryloading">
							导出出库单
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="SelectedDFDeliveryExport">导出选中</el-dropdown-item>
								<el-dropdown-item @click="AllDFDeliveryExport">导出所有</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
				&nbsp;&nbsp;
				<el-button @click="checkHistory" type="primary">
					查看导出历史记录
				</el-button>
				<el-dialog v-model="dialogFormVisible" title="历史记录" width="40%">
					<el-table :data="HistoryData" style="width: 100%">
						<el-table-column prop="name" label="名称" width="220" />
						<el-table-column prop="lastWriteTime" label="时间" width="180" />
						<el-table-column prop="fullName" label="">
							<template #default="scope">
								<el-button size="small" text type="primary" @click="ExportHistoryClick(scope)"> 导出
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-dialog>

			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				@sort-change="sortfun" @selection-change="handleSelectionChange" :header-cell-style="customHeaderCellStyle"
				:cell-style="customCellStyle" row-key="id" border="">
				<el-table-column type="selection" width="55" class-name="custom-header" />
				<el-table-column prop="images" label="图片" width="120" align="center" sortableshow-overflow-tooltip="">
					<template #default="scope">
						<el-image style="width: 60px; height: 60px"
							:src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpsku + '.jpg'"
							:zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
							:preview-src-list="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpsku + '.jpg'"
							:initial-index="1" fit="cover" />
					</template>
				</el-table-column>
				<el-table-column prop="orderID" label="Order ID" sortable width="160" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="asin" label="ASIN" sortable align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="erpsku" label="ERPSKU" sortable align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="itemQuantity" label="Item Quantity" sortable align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="trackingID" label="Tracking ID" sortable align="center"
					sortableshow-overflow-tooltip="">
					<template #default="scope">
						<!-- <div style="backgroundColor:red;height: 83px;" v-if="hasDuplicate(scope.row.trackingID)">
							{{ scope.row.trackingID }}
						</div>
						<span v-else>{{ scope.row.trackingID }}</span> -->
						<span>{{ scope.row.trackingID }}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editUAE_ProcurementDetailsTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>
<script lang="ts" setup="" name="DFShippingList">
import { ref } from 'vue';
import { service } from '/@/utils/request';
import axios from 'axios';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
//import { formatDate } from '/@/utils/formatTime';
import { DFShippingListInfo, ImportDFShippingList, GetHistoryList, ExportHistory } from '/@/api/modular/main/BasicDataManagement.ts';
const loading = ref(false);
const ImportsSalesloading = ref(false);
const Shippingloading = ref(false);
const DFDeliveryloading = ref(false);
const dialogFormVisible = ref(false);
const tableData = ref<any>([]);
const HistoryData = ref<any>([]);

const queryParams = ref<inventoryParamsType>({});
const IsImage = ref(false);
const tableParams = ref({
	pageNo: 1,
	pageSize: 100,
	total: 0,
	order: null,
	prop: null
});
let selectedRows = ref<any>([]);
function Imports(file: any) {
	ImportsSalesloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	ImportDFShippingList(formData).then((res: any) => {
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
	var res = await DFShippingListInfo(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}
function AllShippingExport() {
	Shippingloading.value = true;
	const formData = {
		type: 1,
		IsImage: IsImage.value
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFShippingList/exportDFShippingList`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
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
			Shippingloading.value = false;
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
			Shippingloading.value = false;
		});
}

function SelectedShippingExport() {
	Shippingloading.value = true;
	const formData = {
		type: 0,
		Id: selectedRows.value,
		IsImage: IsImage.value
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFShippingList/exportDFShippingList`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
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
			Shippingloading.value = false;
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
			Shippingloading.value = false;
		});
}
function AllDFDeliveryExport() {
	DFDeliveryloading.value = true;
	const formData = {
		type: 1
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFShippingList/exportDFDeliveryList`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
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
			DFDeliveryloading.value = false;
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
			DFDeliveryloading.value = false;
		});
}

function SelectedDFDeliveryExport() {
	DFDeliveryloading.value = true;
	const formData = {
		type: 0,
		Id: selectedRows.value
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFShippingList/exportDFDeliveryList`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
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
			DFDeliveryloading.value = false;
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
			DFDeliveryloading.value = false;
		});
}
const getHistory = async () => {
	var res = await GetHistoryList();
	HistoryData.value = res.data.result;
}
function checkHistory() {
	dialogFormVisible.value = true;
	getHistory();
}

function ExportHistoryClick(val?: any): void {
	const formData = {
		Name: val.row.name
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFShippingList/exportHistory`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		.then((data: any) => {
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
		});
}
const downloadfile = (res: any) => {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
	var result = patt.exec(contentDisposition);
	var filename = result[1];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURI(filename.replace(reg, '$1')); // 下载后文件名
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
		backgroundColor: '#e9e9e9', // 设置表头背景颜色为蓝色
	};
}
function customCellStyle({ row, column, rowIndex, columnIndex }) {
	console.log(rowIndex);
	if (columnIndex == 6) {
		if (hasDuplicate(row.trackingID) && row.trackingID !== null) {
			return { backgroundColor: '#DDDDDD' };
		}
	}
	// 返回一个包含自定义样式的对象
	return null;
}
function hasDuplicate(value) {
	return tableData.value.filter(item => item['trackingID'] === value).length > 1;
}
handleQuery();
</script>
<style lang="less" scoped>
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