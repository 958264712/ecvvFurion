<script lang="ts" setup name="dibaiPoData">
import { ref, h } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { pagePoData, deletePoData, updateOrderDate, ImportPO, bulkImportOrderDate, multipleExportByTemplate, downLoadPOZip } from '/@/api/modular/main/aSINBasicData.ts';
import PoDataSource from './components/poDataSource.vue';
import { service } from '/@/utils/request';

const timer = ref<any>();
const startTime = ref(0); // 初始开始请求时间
const loading = ref(false);
const loading1 = ref(false);
const bulkImportOrderDateloading = ref(false);
const cardLoading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<PoParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const pos = ref('');
const visible = ref(false); //ASIN列表弹窗
const visible1 = ref(false); //编辑OrderDate弹窗
const orderDates = ref('');
function showModal(po: any) {
	pos.value = po;
	visible.value = true;
}
function showModal1(orderDate: any, po: any) {
	pos.value = po;
	orderDates.value = orderDate;
	visible1.value = true;
}
function close() {
	visible.value = false;
}
// 修改日期
function submit() {
	service({
		url: `/api/poData/updateOrderDate/${pos.value}/${encodeURIComponent(orderDates.value)}`,
		method: 'get',
	}).then((res) => {
		if (res.data.type === 'success') {
			ElMessage.success('Edit successfully');
			handleQuery();
		} else {
			ElMessage.error('Edit failed ' + res.message);
		}
		visible1.value = false;
	});
}
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pagePoData(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 删除
const delPoData = (row: any) => {
	ElMessageBox.confirm(`Are you sure you want to delete it?`, 'Prompt Message', {
		confirmButtonText: 'Confirm',
		cancelButtonText: 'Cancel',
		type: 'warning',
	})
		.then(async () => {
			await deletePoData(row);
			handleQuery();
			ElMessage.success('Successfully Delete');
		})
		.catch(() => {});
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};
// 导入
function ImportforPO(file: any, ifCover = false) {
	loading1.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('cover', ifCover === true ? 'true' : 'false');
	ImportPO(formData, ifCover === true ? 'true' : 'false')
		.then((res: any) => {
			loading1.value = false;
			if (res.data.type === 'success') {
				ElMessage.success('Import succeeded');
				handleQuery();
			} 
		})
		.catch((res) => {
			loading1.value = false;
			const result = res.toString().split('据')[2]
			ElMessageBox({
				message:h('p',{style:"overflow-wrap:break-word"},`${result} in the data has already been imported. If you needs to be imported again, the original ${result} will be overwritten: it is a duplicate PO number`),
				title:'Prompt Message',
				showCancelButton: true,
				cancelButtonText: 'Cancel',
				confirmButtonText: 'Confirm',
			})
				.then(async () => {
					await ImportforPO(file, true);
				})
				.catch(() => {
					// ElMessage.error(res.message); // + res.message
				});
		});
}
// 导入
function ImportsOrderDate(data: any) {
	bulkImportOrderDateloading.value = true;
	const formData = new FormData();
	formData.append('file', data.file);
	bulkImportOrderDate(formData).then((res: any) => {
		bulkImportOrderDateloading.value = false;
		if (res.data.type === 'success') {
			ElMessage.success('Import succeeded');
			handleQuery();
		} else {
			ElMessage.error(res.message); // + res.message
		}
	});
}
const selectedRows = ref([]);
const selectedRowKeys = ref([]);

// 开始准备轮询
const multipleExport = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('Please select at least one PO');
		return;
	}
	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.po);
	}
	cardLoading.value = true;
	multipleExportByTemplate({ poList: data, Site: 'UAE' }).then((res: any) => {
		if (res.data.code !== 200) {
			cardLoading.value = false;
			ElMessage.error(res.message);
			return;
		} else {
			ElMessage.success('Table generated, waiting for compression');
			startTime.value = new Date().getTime(); // 获取触发轮询时的时间
			inquireData(); // 调用轮询接口,开始进行轮询
		}
	});
};

const inquireData = () => {
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
		data.push(selectedRows.value[i]?.po);
	}
	downLoadPOZip({ poList: data, count: selectedRows.value.length })
		.then((res: any) => {
			if (res.data.result === '') {
				// 没成功,调用轮询
				reload();
			} else {
				ElMessage.success('Build succeeded');
				cardLoading.value = false;
				window.open(res.data.result, '_blank');
				handleQuery();
			}
		})
		.catch((err: any) => {
			// 请求错误,也继续轮询
			// reload()
			cardLoading.value = false;
			ElMessage.error('Download exception: please contact the technician');
		});
};

// const multipleExport = () => {
// 	if (selectedRows.value.length === 0) {
// 		ElMessage.warning('Please select at least one PO');
// 		return;
// 	}
// 	var data = [];
// 	for (let i = 0; i < selectedRows.value.length; i++) {
// 		data.push(selectedRows.value[i]?.po);
// 	}
// 	cardLoading.value = true;
// 	multipleExportByTemplate(data).then((res) => {
// 		if (res.data.type !== 'success') {
// 			cardLoading.value = false;
// 			ElMessage.error(res.message);
// 			return;
// 		}
// 		//下载po拣货单压缩包
// 		downLoadPOZip()
// 			.then((res) => {
// 				// this.downloadfile(res)
// 				ElMessage.success('Build succeeded');
// 				cardLoading.value = false;
// 				window.open(res.data.result, '_blank');
// 				handleQuery();
// 			})
// 			.catch((err) => {
// 				cardLoading.value = false;
// 				ElMessage.error('Download exception: please contact the technician');
// 			});
// 	});
// };
// 获取keys
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item?.id);
	});
};

handleQuery();
</script>
<template>
	<div class="poDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="PO">
					<el-input v-model="queryParams.po" clearable="" placeholder="Please enter PO" />
				</el-form-item>
				<el-form-item label="Vendor">
					<el-input v-model="queryParams.vendor" clearable="" placeholder="Please enter Vendor" />
				</el-form-item>
				<el-form-item label="ShipToLocation">
					<el-input v-model="queryParams.shipToLocation" clearable="" placeholder="Please enter ShipToLocation" />
				</el-form-item>
				<el-form-item label="WindowType">
					<el-input v-model="queryParams.windowType" clearable="" placeholder="Please enter WindowType" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> Search </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									handleQuery();
								}
							"
						>
							Reset
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv" style="width: 72%">
				<el-upload :on-change="ImportforPO" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
					<el-button :loading="loading1" type="primary">Batch import PO</el-button>
				</el-upload>
				<el-upload :on-change="ImportsOrderDate" :multiple="false" :show-file-list="false" name="file">
					<el-button type="primary" :loading="bulkImportOrderDateloading">Batch import OrderDate</el-button>
				</el-upload>
				<el-button @click="multipleExport" :loading="cardLoading">Generate PO picking lists in batches</el-button>
				<!-- <el-button type="danger" @click="notGenerateExport" :loading="notGenerateLoading"
            >生成未生成的PO拣货单</el-button
          > -->
				<el-link icon="ele-Download" href="https://sa1api.ecvv.com/ExcelTemplate/POtemplate.xlsx"> Download the PO import template</el-link>
				<el-link icon="ele-Download" href="https://sa1api.ecvv.com/ExcelTemplate/OrderDate.xlsx"> Download the OrderDate import template</el-link>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="po" label="PO" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="vendor" label="Vendor" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="shipToLocation" label="ShipToLocation" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="windowType" label="WindowType" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="isGenerate" label="IsGenerate" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.isGenerate"> Generated </el-tag>
						<el-tag type="danger" v-else=""> Not Generated </el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="windowStart" label="WindowStart" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="orderDate" label="OrderDate" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						{{ scope.row.orderDate ? decodeURIComponent(scope.row.orderDate) : '' }}
					</template>
				</el-table-column>
				<el-table-column label="Operation" width="350" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="showModal(scope.row.po)"> Details </el-button>
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="showModal1(scope.row.orderDate, scope.row.po)"> Edit OrderDate </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delPoData(scope.row)"> Delete </el-button>
					</template>
				</el-table-column>
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
			<el-dialog v-model="visible" title="Product List" @close="close" width="1000px">
				<PoDataSource :po="pos"></PoDataSource>
			</el-dialog>
			<el-dialog v-model="visible1" title="Edit OrderDate" width="400px">
				<el-input v-model="orderDates" placeholder="Please enter orderDate" />
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="visible1 = false">Cancel</el-button>
						<el-button type="primary" @click="submit"> Confirm </el-button>
					</span>
				</template>
			</el-dialog>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 500px;
}

.dialog-footer button:first-child {
	margin-right: 10px;
}

.el-link {
	margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
	vertical-align: text-bottom;
}

</style>
