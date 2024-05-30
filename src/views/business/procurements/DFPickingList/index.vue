<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="ERP-SKU">
					<el-input v-model="queryParams.ErpSKU" clearable="" placeholder="请输入SKU" />
				</el-form-item> -->
				<!-- <el-form-item label="拣货单文件名">
					<el-input v-model="queryParams.FileName" clearable="" placeholder="请输入导入文件名" />
				</el-form-item>
				<el-form-item label="批次号">
					<el-input v-model="queryParams.BatchId" clearable="" placeholder="请输入批次号" />
				</el-form-item> -->
				<el-form-item label="站点">
					<el-select :disabled="disabledSite" @change="handleQuery()" v-model="queryParams.Site">
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="拣货单导入时间">
					<el-date-picker style="width: 250px;" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange"
						v-model="queryParams.pickingImportTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="拣货单导出状态">
					<el-select @change="handleQuery()" v-model="queryParams.pickingStatus">
						<el-option value="未导出" label="未导出"></el-option>
						<el-option value="已导出" label="已导出"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="拣货单导出时间">
					<el-date-picker style="width: 250px;" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange"
						v-model="queryParams.pickingExportTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="发货单导出状态">
					<el-select @change="handleQuery()" v-model="queryParams.sendOutGoodsStatus">
						<el-option value="未导出" label="未导出"></el-option>
						<el-option value="已导出" label="已导出"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发货单导出时间">
					<el-date-picker style="width: 250px;" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange"
						v-model="queryParams.SendOutGoodsExportTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="出库单导出状态">
					<el-select @change="handleQuery()" v-model="queryParams.outboundStatus">
						<el-option value="未导出" label="未导出"></el-option>
						<el-option value="已导出" label="已导出"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="出库单导出时间">
					<el-date-picker style="width: 250px;" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange"
						v-model="queryParams.outboundExportTime" format="YYYY-MM-DD" />
				</el-form-item> -->
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"
							v-auth="'uAE_ProcurementDetails:page'"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {

			QueryRole();
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
					<!-- <el-button @click="dialogFormVisible = true" type="primary">
						导入
					</el-button>
					<el-dialog v-model="dialogFormVisible" title="表格导入" width="40%">
						<el-form :label-position="right" style="max-width: 460px">
							<el-form-item>
								<span class="itemlabel">站点：</span>
								<el-select v-model="Country" size="large">
									<el-option v-for="item in options" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-upload style="position: relative;left: 260px;" :on-change="Imports" :multiple="false"
									action="#" :show-file-list="false" :auto-upload="false" name="file">
									<el-button style="width: 65px;height: 32px;" :loading="ImportsSalesloading"
										type="primary">导入</el-button>
								</el-upload>
							</el-form-item>
						</el-form>
					</el-dialog> -->
				</div>
				<!-- <div class="flex flex-wrap items-center" style="float: left;margin-left: 10px;">
					<el-checkbox v-model="IsImage">导出图片</el-checkbox>&nbsp;
					<el-button type="primary" @click="SelectedExport" :loading="Exportloading">
						导出
					</el-button>
			</div> -->
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				:header-cell-style="customHeaderCellStyle" @sort-change="sortfun"
				@selection-change="handleSelectionChange" :cell-style="customCellStyle" row-key="id" border="">
				<el-table-column type="selection" width="55" class-name="custom-header" show-overflow-tooltip="" />
				<el-table-column prop="fileName" label="拣货单文件名" align="center" sortable show-overflow-tooltip=""
					width="200" />
				<el-table-column prop="batchId" label="批次号" align="center" width="95" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="site" label="站点" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="pickingImportTime" label="拣货单导入时间" align="center" sortable width="148"
					show-overflow-tooltip="" />
				<el-table-column prop="pickingStatus" label="拣货单导出状态" align="center" width="148" sortable
					show-overflow-tooltip="" />

				<el-table-column prop="pickingExportTime" label="拣货单导出时间" align="center" width="148" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="sendOutGoodsImportTime" label="发货单导入时间" align="center" width="148" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="sendOutGoodsStatus" label="发货单导出状态" align="center" width="148" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="sendOutGoodsExportTime" label="发货单导出时间" align="center" width="148" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="outboundStatus" label="出库单导出状态" align="center" width="148" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="outboundExportTime" label="出库单导出时间" align="center" width="148" sortable
					show-overflow-tooltip="" />
				<el-table-column label="操作" width="210" align="center" fixed="right">
					<template #default="scope">
						<el-button size="small" text="" type="primary" @click="openDetails(scope.row)">
							拣货单详情
						</el-button>
						<!-- <el-button size="small" text="" type="primary" @click="openShippingListDetails(scope.row)">
							发货单详情
						</el-button> -->
						<el-dropdown style="margin-left: 5px;">
							<el-button size="small" text="" type="primary">
								导出拣货单
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="ExportDFPickingtNo(scope.row)">导出（无图片）</el-dropdown-item>
									<el-dropdown-item @click="ExportDFPickingYes(scope.row)">导出（带图片）</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-dropdown trigger="click">
							<el-button icon="ele-MoreFilled" size="small" text type="primary" style="padding-left: 12px"
								@click="OpendropdownClick(scope.row.batchId)" />
							<template #dropdown>
								<el-dropdown-menu>
									<!-- <el-dropdown-item>
										<el-dropdown placement='left-start'>
											<span style="font-size: 12px;" class="el-dropdown-link">
												导出拣货单
											</span>
											<template #dropdown>
												<el-dropdown-menu>
													<el-dropdown-item
														@click="ExportDFPickingtNo(scope.row)">导出（无图片）</el-dropdown-item>
													<el-dropdown-item
														@click="ExportDFPickingYes(scope.row)">导出（带图片）</el-dropdown-item>
												</el-dropdown-menu>
											</template>
</el-dropdown>
</el-dropdown-item> -->
									<el-upload @click="batchId = scope.row.batchId" style="display: block;"
										:on-change="ImportDFShippingLists" :multiple="false" action="#"
										:show-file-list="false" :auto-upload="false" name="file">
										<span style="margin-left: 12px;">Import Label Printed</span>
									</el-upload>
									<el-dropdown-item @click="openShippingListDetails(scope.row)"> Shipping List Detail
									</el-dropdown-item>
									<el-dropdown-item>
										<el-dropdown placement='left-start' :disabled="disableditem">
											<span style="font-size: 12px;" class=" el-dropdown-link">
												Export Shipping List
											</span>
											<template #dropdown>
												<el-dropdown-menu>
													<el-dropdown-item
														@click="exportDFShippingListNo(scope.row)">Export(no
														images)</el-dropdown-item>
													<el-dropdown-item
														@click="exportDFShippingListYes(scope.row)">Export(with
														images)</el-dropdown-item>
												</el-dropdown-menu>
											</template>
										</el-dropdown>
									</el-dropdown-item>
									<el-dropdown-item :disabled="disableditem" @click="DFDeliveryExport(scope.row)">
										Export
										Delivery List
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="DetailsTitle" @reloadTable="handleQuery()" />
			<ShippingListDetails ref="ShippingListDetailsRef" :title="DetailsTitle" @reloadTable="handleQuery()" />
		</el-card>
	</div>
</template>
<script lang="ts" setup="" name="DFPickingList">
import { ref } from 'vue';
import { service } from '/@/utils/request';
import axios from 'axios';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
//import { formatDate } from '/@/utils/formatTime';
import { BatchDFPicking, ImportDFPickingList, downLoadPOZip, Delete, GetUserRole, ImportDFShippingList } from '/@/api/modular/main/BasicDataManagement.ts';
import editDialog from './component/details.vue';
import ShippingListDetails from './component/ShippingListDetails.vue';
const editDialogRef = ref();
const batchId = ref<any>();
const ShippingListDetailsRef = ref();
const loading = ref(false);
const ImportsSalesloading = ref(false);
const Exportloading = ref(false);
const dialogFormVisible = ref(false);
const DetailsTitle = ref('');
const disabledSite = ref(false);
const disableditem = ref<any>(true);
const tableData = ref<any>([]);
const queryParams = ref<any>({ Site: 'UAE' });
const IsImage = ref(false);
const startTime = ref(0);
const timer = ref<any>();
const Country = ref<any>('UAE')
const options = [
	{
		value: 'UAE',
		label: 'UAE',
	},
	{
		value: 'SA',
		label: 'SA',
	},
];


const tableParams = ref({
	pageNo: 1,
	pageSize: 20,
	total: 0,
	order: null,
	prop: null
});
let selectedRows = ref<any>([]);
function Imports(file: any) {
	ImportsSalesloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	// if (disabledSite.value) {
	// 	formData.append('Country', queryParams.value.Site);
	// } else {
	// 	formData.append('Country', Country.value);
	// }
	formData.append('Country', queryParams.value.Site);
	ImportDFPickingList(formData).then((res: any) => {
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
function OpendropdownClick(batchId) {
	
	axios.get(import.meta.env.VITE_API_URL as any + '/api/dFShippingList/isTrackingID/' + batchId)
		.then(res => {
			disableditem.value = res.data.result;
		})
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
const deletes = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			if (row.id != 0) {
				await Delete(row);
				handleQuery();
			}
			ElMessage.success('删除成功');
		})
		.catch(() => { });
}
const QueryRole = async () => {
	GetUserRole()
		.then(res => {
			tableData.value = res.data.result?.items ?? [];
			if (res.data.result != null) {
				queryParams.value = { Site: res.data.result };
				disabledSite.value = true;
			} else {
				queryParams.value = { Site: 'UAE' };
				disabledSite.value = false;
			}
			handleQuery();
		});

}
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	queryParams.value.StartPickingImportTime = queryParams.value.pickingImportTime ? queryParams.value.pickingImportTime[0] : null;
	queryParams.value.EndPickingImportTime = queryParams.value.pickingImportTime ? queryParams.value.pickingImportTime[1] : null;
	queryParams.value.StartPickingExportTime = queryParams.value.pickingExportTime ? queryParams.value.pickingExportTime[0] : null;
	queryParams.value.EndPickingExportTime = queryParams.value.pickingExportTime ? queryParams.value.pickingExportTime[1] : null;
	queryParams.value.StartSendOutGoodsExportTime = queryParams.value.SendOutGoodsExportTime ? queryParams.value.SendOutGoodsExportTime[0] : null;
	queryParams.value.EndSendOutGoodsExportTime = queryParams.value.SendOutGoodsExportTime ? queryParams.value.SendOutGoodsExportTime[1] : null;
	queryParams.value.StartOutboundExportTime = queryParams.value.outboundExportTime ? queryParams.value.outboundExportTime[0] : null;
	queryParams.value.EndOutboundExportTime = queryParams.value.outboundExportTime ? queryParams.value.outboundExportTime[1] : null;
	var res = await BatchDFPicking(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push({
			batchId: element.batchId,
			site: element.site
		});
	});
}
//导入发货单
const ImportDFShippingLists = async (file: any) => {
	ElMessage.success('正在导入发货单，请不要重复点击');
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('BatchId', batchId.value);
	ImportDFShippingList(formData).then((res: any) => {
		ImportsSalesloading.value = false;
		if (res.data.code == 200) {
			ElMessage.success('导入发货单成功');
			handleQuery();
			OpendropdownClick(batchId.value);
		} else {
			ImportsSalesloading.value = false;
			ElMessage.error('导入发货单失败'); // + res.message
		}
	});
}
function exportDFShippingListYes(row: any) {
	const formData = {
		type: 1,
		batchId: row.batchId,
		site: row.site
	};
	exportDFShippingList(formData);
}
function exportDFShippingListNo(row: any) {
	const formData = {
		type: 0,
		batchId: row.batchId,
		site: row.site
	};
	exportDFShippingList(formData);
}
//导出发货单
const exportDFShippingList = async (formData: any) => {
	ElMessage.success('正在生成表格，请不要重复点击');
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFShippingList/exportDFShippingList`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		.then(async (data) => {
			const dtrue = await downloadfile(data);
			if (data.statusText == 'OK' && dtrue) {
				ElNotification({
					title: '系统提示',
					message: '导出发货单成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出发货单成功',
				});
				handleQuery();
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
//导出出库单
const DFDeliveryExport = async (row: any) => {
	ElMessage.success('正在生成表格，请不要重复点击');
	const formData = {
		batchId: row.batchId,
		site: row.site
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
		.then(async (data) => {
			const btrue = await downloadfile(data);
			if (data.statusText == 'OK' && btrue) {
				ElNotification({
					title: '系统提示',
					message: '导出出库单成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出出库单成功',
				});
				handleQuery();
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
		})
}
function ExportDFPickingYes(row: any) {
	const formData = {
		type: 1,
		batchId: row.batchId,
		Site: row.site
	};
	ExportDFPicking(formData);
}
function ExportDFPickingtNo(row: any) {
	const formData = {
		type: 0,
		batchId: row.batchId,
		Site: row.site
	};
	ExportDFPicking(formData);
}
//导出拣货单
function ExportDFPicking(formData: any) {
	ElMessage.success('正在生成表格，请不要重复点击');
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFPickingList/exportDFPicking`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出拣货单成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出拣货单成功',
				});
				handleQuery();
			}
		})
}
function SelectedExport() {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('Please select at least one batch');
		return;
	}
	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.batchId);
	}
	Exportloading.value = true;
	const formData = {
		type: 0,
		IsImage: IsImage.value,
		Rows: selectedRows.value,
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/dFPickingList/export`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((res: any) => {
			if (res.status !== 200) {
				Exportloading.value = false;
				ElMessage.error(res.message);
				return;
			} else {
				ElMessage.success('Table generated, waiting for compression');
				startTime.value = new Date().getTime(); // 获取触发轮询时的时间
				inquireData(); // 调用轮询接口,开始进行轮询
			}
		})
		.catch(err => {
			console.log(err);
		})
}
const inquireData = async () => {
	const reload = () => {
		clearTimeout(timer.value); // 清除定时器
		// 超过30分钟则停止轮询
		if (new Date().getTime() - startTime.value > 30 * 60 * 1000) {
			clearTimeout(timer.value);
			return;
		}
		// 3s一次, 轮询中
		timer.value = setTimeout(() => {
			inquireData(); // 调用轮询
		}, 3000);
	};

	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {

		data.push(selectedRows.value[i]?.batchId);
	}
	downLoadPOZip({ poList: data, count: selectedRows.value.length })
		.then((res: any) => {
			if (res.data.result === '') {
				// 没成功,调用轮询
				reload();
			} else {
				ElMessage.success('Build succeeded');
				Exportloading.value = false;
				window.open(res.data.result, '_blank');
				handleQuery();
			}
		})
		.catch((err: any) => {
			// 请求错误,也继续轮询
			// reload()
			Exportloading.value = false;
			ElMessage.error('Download exception: please contact the technician');
		});
};

const downloadfile = async (res: any) => {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
	var result = patt.exec(contentDisposition);
	if (result == null) {
		// 将 Blob 数据转换为文本
		const text = await res.data.text();
		// 将文本解析为 JSON 对象
		const jsonData = JSON.parse(text);
		if (jsonData.result) {
			ElNotification({
				title: '系统提示',
				message: jsonData.result,
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: jsonData.result,
			});
		}
		return false;
	}
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
	return true;
};
//排序
function sortfun(v: any) {
	tableParams.value.order = v.order;
	tableParams.value.prop = v.prop;
	handleQuery();
}
//打开拣货单详情页
function openDetails(row: any) {
	DetailsTitle.value = 'DF Picking List表';
	editDialogRef.value.openDialog(row);
}
//打开拣货单详情页
function openShippingListDetails(row: any) {
	DetailsTitle.value = 'DF Shipping List表';
	ShippingListDetailsRef.value.openDialog(row);
}
//底色
function customCellStyle({ row, column, rowIndex, columnIndex }) {
	if (row.exportStatus == '已导出') {
		return { backgroundColor: '#DDDDDD' };
	}
	// 返回一个包含自定义样式的对象
	return null;
}
function customHeaderCellStyle({ column, $index }) {
	// 返回包含 CSS 样式的对象
	return {
		backgroundColor: '#e9e9e9	', // 设置表头背景颜色为蓝色
	};
}

//QueryRole();
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