<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="Please enter ASIN" />
				</el-form-item>
				<el-form-item label="StoreSKU">
					<el-input v-model="queryParams.storeSKU" clearable="" placeholder="Please enter StoreSKU" />
				</el-form-item>
				<el-form-item label="GoodsName">
					<el-input v-model="queryParams.goodsName" clearable="" placeholder="Please enter GoodsName" />
				</el-form-item>
				<el-form-item label="ERPSKU">
					<el-input v-model="queryParams.erpSku" clearable="" placeholder="Please enter ERPSKU" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> Search </el-button>
						<el-button icon="ele-Refresh" @click="() => {
							queryParams = {};
							handleQuery();
						}
							">
							Reset </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf">
				<el-button type="primary" icon="ele-Plus" @click="openAddASINBasicData"> Add </el-button>
				<!-- <el-upload style="margin-left: 20px; display: inline;" :on-change="ImportsCN" :multiple="false" action="#"
					:show-file-list="false" :auto-upload="false" name="file">
					<el-button :loading="loading3" type="primary">Import ASIN Listing Table CN</el-button>
				</el-upload> -->
				<el-upload style="margin-left: 20px; display: inline;" :on-change="ImportsUAE" :multiple="false" action="#"
					:show-file-list="false" :auto-upload="false" name="file">
					<el-button :loading="loading3" type="primary">Import ASIN Listing Table UAE</el-button>
				</el-upload>
				<div style="margin-left: 20px; display: inline;" class="flex flex-wrap items-center">
					<el-dropdown>
						<el-button type="primary" :loading="Exportloading">
							Export
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="SelectedExport">Export Selected</el-dropdown-item>
								<el-dropdown-item @click="AllExport">Export All</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>

				<div class="setting">
					<el-button v-if="IsEdit" type="primary" icon="ele-Document" :loading="loading"
						@click="update">SAVE</el-button>
				</div>
			</div>
			<el-table ref="scrollContainer" :data="tableData" size="lagre" style="width: 100%" v-loading="loading"
				tooltip-effect="light" @selection-change="handleSelectionChange" row-key="id" border="">
				<el-table-column type="selection" width="40" />
				<el-table-column prop="asin" label="ASIN" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsASIN }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.asin" clearable=""
								@keyup.enter.native="keyDown" @blur="validateASIN" />
							<div v-else>{{ scope.row.asin }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="storeSKU" label="StoreSKU" align="center" width="100" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsstoreSKU }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.storeSKU" clearable=""
								@keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.storeSKU }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="goodsName" label="GoodsName" align="center" width="110" show-overflow-tooltip="">
					<template #default="scope">
						<div>{{ scope.row.goodsName }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="erpSku" label="ErpSku" align="center" width="100" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IserpSku }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.erpSku" clearable=""
								@keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.erpSku }}</div>
						</div>

					</template>
				</el-table-column>
				<el-table-column prop="singleOrderQTY" label="SingleOrderQTY" align="center" width="135"
					show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsSingleOrderQTY }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.singleOrderQTY" clearable=""
								@keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.singleOrderQTY }}</div>
						</div>

					</template>
				</el-table-column>
				<el-table-column prop="specsUnit" label="SpecsUnit" align="center" width="100" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.specsUnit"
								clearable="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.specsUnit }}</div>
						</div>

					</template>
				</el-table-column>
				<el-table-column prop="brand" label="Brand" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.brand"
								clearable="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.brand }}</div>
						</div>

					</template>
				</el-table-column>
				<el-table-column prop="ean" label="EAN-13" align="center" width="100" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsEAN }" class="custom-input" v-if="scope.row.IsEdit"
								type="text" v-model="scope.row.ean" clearable="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.ean }}</div>
						</div>

					</template>
				</el-table-column>
				<el-table-column prop="list_Unlist" label="List/Unlist" align="center" width="100" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-select class="custom-input" :disabled="!scope.row.IsEdit" v-model="scope.row.list_Unlist"
								placeholder="请选择" clearable>
								<el-option label="List" value="List"></el-option>
								<el-option label="Unlist" value="Unlist"></el-option>
							</el-select>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remove_Reason" label="Complaint/Remove Reason" align="center" width="200"
					show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input class="custom-input" v-if="scope.row.IsEdit" type="text"
								v-model="scope.row.remove_Reason" clearable="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.remove_Reason }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="addASINAccount" label="Platform" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-select class="custom-input" :disabled="!scope.row.IsEdit" v-model="scope.row.addASINAccount"
								placeholder="Please select" clearable>
								<el-option label="UAE-SC " value="UAE-SC "></el-option>
								<el-option label="UAE-SHOWAY " value="UAE-SHOWAY "></el-option>
								<el-option label="SA-DDP AE" value="SA-DDP AE"></el-option>
							</el-select>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="Released Date" align="center" width="120"
					show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-date-picker v-if="scope.row.IsEdit" v-model="scope.row.createTime" type="date"
								placeholder="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.createTime }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="creator" label="Creator" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.creator"
								clearable="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.creator }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="Remark" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.remark"
								clearable="" @keyup.enter.native="keyDown" />
							<div v-else>{{ scope.row.remark }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="Operation" width="160" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button v-if="!IsEdit" icon="ele-DocumentCopy" size="small" text="" type="primary"
							@click="CopyAdd(scope.row)">COPE
						</el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary"
							@click="delASINBasicData(scope.row)"> DELETE </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>

<script lang="ts" setup name="ASINListingTableUAE">
import { ref } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import { SAINListingTablePage, Save, ImportCN, ImportUAE, Delete, Update } from '/@/api/modular/main/SAINListingTable.ts';
import axios from 'axios';
import router from '/@/router';
import other from '/@/utils/other.ts'
const Exportloading = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const loading3 = ref(false);
const tableData = ref<any>([]);
let selectedRows = ref<any>([]);
const addData = ref<any>([]);
let IsEdit = ref<any>(false);
const queryParams = ref<AsinParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editASINBasicDataTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await SAINListingTablePage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableData.value.forEach((element: any) => {
		tableData.value.IsEdit = false;
	});
	IsEdit.value = false;
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddASINBasicData = () => {
	router.push({ path: '/business/BasicDataManagement/ASINListingTableUAE/ASINListingTableUAEAdd' });
	// editASINBasicDataTitle.value = '添加ASIN上架表数据';
	// editDialogRef.value.openDialog({});
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

// 导入ASINListingTableCN
function ImportsCN(file: any) {
	loading3.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	ImportCN(formData).then((res: any) => {
		loading3.value = false;
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			handleQuery();
		} else {
			ElMessage.error(res.message); // + res.message
		}
	});
}
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}
// 导入ASINListingTableUAE
function ImportsUAE(file: any) {
	loading3.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	ImportUAE(formData).then((res: any) => {
		loading3.value = false;
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			handleQuery();
		} else {
			ElMessage.error(res.message); // + res.message
		}
	});
}
function AllExport() {
	Exportloading.value = true;
	const formData = {
		type: 1
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/aSINListingTable/export`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((data) => {
			other.downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: 'prompted',
					message: 'success',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: 'success',
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElNotification({
				title: 'prompted',
				message: 'Download error: Get file stream error',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: 'Export failed',
			});
			Exportloading.value = false;
		});
}

function SelectedExport() {
	Exportloading.value = true;
	const formData = {
		type: 0,
		Id: selectedRows.value,
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/aSINListingTable/export`, formData, {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((data) => {
			other.downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: 'prompted',
					message: 'success',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: 'success',
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElNotification({
				title: 'prompted',
				message: 'Download error: Get file stream error',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: 'Export failed',
			});
			Exportloading.value = false;
		});
}
const scrollContainer = ref();
function CopyAdd(row: any) {
	if (IsEdit.value) return;
	tableData.value.push({
		id: 0,
		asin: "",
		storeSKU: "",
		goodsName: row.goodsName,
		erpSku: row.erpSku,
		singleOrderQTY: "",
		specsUnit: row.specsUnit,
		brand: "",
		ean: "",
		addASINAccount: "",
		list_Unlist: row.list_Unlist,
		remove_Reason: "",
		createTime: "",
		creator: row.creator,
		IsEdit: true
	});
	IsEdit.value = true;
	setTimeout(() => {
		let table = scrollContainer.value.layout.table.refs;
		// 获取表格滚动元素
		let tableScrollEle = table.bodyWrapper.firstElementChild.firstElementChild;
		// 设置表格滚动的位置
		tableScrollEle.scrollTop = tableScrollEle.clientHeight;
	}, 100);

}
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
}

// 删除
const delASINBasicData = (row: any) => {
	ElMessageBox.confirm(`Are you sure you want to delete it?`, 'prompt', {
		confirmButtonText: 'YES',
		cancelButtonText: 'Cancel',
		type: 'warning',
	})
		.then(async () => {
			if (row.id === 0) {
				const selectedIndex = tableData.value.findIndex(item => item.id === row.id);
				tableData.value.splice(selectedIndex, 1);
				IsEdit.value = false;
			} else {
				await Delete(row);
				handleQuery();
			}
			ElMessage.success('Delete successful');
		})
		.catch(() => { });
};


const keyDown = (e: any) => {
	if (e.keyCode == 13 || e.keyCode == 100) {
		update();
	}
}
function update() {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (validateASIN() && validateStoreSKU() && validateSingleOrderQTY() && validateErpSku() && validateEan()) {
		if (objectWithIsEditTrue.id === 0) {
			addData.value = [];
			addData.value.push(objectWithIsEditTrue);
			Save(addData.value).then(res => {
				ElMessage.success('Added successfully');
				tableData.value.find((obj: any) => obj.IsEdit === true).IsEdit = false;
				IsEdit.value = false;
				handleQuery();
			})
		} else {
			Update(objectWithIsEditTrue).then(res => {
				ElMessage.success('Update successfully');
				tableData.value.find((obj: any) => obj.IsEdit === true).IsEdit = false;
				IsEdit.value = false;
			});
		}
	}
}
const validateASIN = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	const reg = /^[A-Za-z0-9]{10}$/;
	if (reg.test(objectWithIsEditTrue.asin)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = true;
		ElMessage.error('ASIN, please enter a 10 digit letter or number without spaces');
	}
	return false;
};
const validateStoreSKU = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.storeSKU != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsstoreSKU = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsstoreSKU = true;
		ElMessage.error('StoreSKU cannot be empty');
		return false;
	}
}
const validateSingleOrderQTY = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.singleOrderQTY != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = true;
		ElMessage.error('SingleOrderQTY cannot be empty');
		return false;
	}
}
const validateErpSku = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.erpSku != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = true;
		ElMessage.error('ErpSku cannot be empty');
		return false;
	}
}
const validateEan = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.ean != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsEAN = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsEAN = true;
		ElMessage.error('EAN-13 cannot be empty');
		return false;
	}
}
handleQuery();
</script>

<style lang="less" scoped>
.settingf {
	position: relative;

	.importDiv {
		position: absolute;
		left: 0;
	}

	.setting {
		display: inline;
		position: absolute;
		right: 30px;
	}

	.custom {
		position: relative;
	}
}

.custom-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
	}
}

.sku-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 1px #DE2910 inset;
	}
}

:deep(.el-tooltip) {
	padding: 0;
}
</style>