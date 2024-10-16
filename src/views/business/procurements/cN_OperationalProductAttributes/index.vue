<script lang="ts" setup="" name="cN_OperationalProductAttributes">
import { ref } from 'vue';
import axios from 'axios';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import editDialog from './component/editDialog.vue';
import {
	pageCN_OperationalProductAttributes,
	deleteCN_OperationalProductAttributes,
	Import,
	addCN_OperationalProductAttributes,
	updateCN_OperationalProductAttributes,
} from '/@/api/modular/main/uAE_ProcurementDetails.ts';

const editDialogRef = ref();
const loading = ref(false);
const Exportloading = ref(false);
const tableData = ref<any>([]);
let IsEdit = ref<any>(false);
const queryParams = ref<operationalParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const editCN_OperationalProductAttributesTitle = ref('');
let selectedRows = ref<any>([]);
const AddRow = () => {
	if (!IsEdit.value) {
		tableData.value.unshift({
			id: null,
			IsEdit: true,
		});
		IsEdit.value = true;
	}
};
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
};
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageCN_OperationalProductAttributes(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	IsEdit.value = false;
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开编辑页面
const openEditCN_OperationalProductAttributes = (row: any) => {
	editCN_OperationalProductAttributesTitle.value = '编辑CN运营产品属性表';
	editDialogRef.value.openDialog(row);
};

// 删除
const delCN_OperationalProductAttributes = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			if (row.id != null) {
				await deleteCN_OperationalProductAttributes(row);
				tableData.value = tableData.value.filter((i) => i !== row);
				ElMessage.success('删除成功');
			} else {
				tableData.value = tableData.value.filter((i) => i !== row);
				IsEdit.value = false;
			}
		})
		.catch(() => { });
};
const validateinventorySKU = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.inventorySKU != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsinventorySKU = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsinventorySKU = true;
		ElMessage.error('库存SKU不能为空');
		return false;
	}
};
const validateinventoryProductName = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.inventoryProductName != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsinventoryProductName = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsinventoryProductName = true;
		ElMessage.error('库存品名不能为空');
		return false;
	}
};
const validatesalesAttributes = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.salesAttributes != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IssalesAttributes = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IssalesAttributes = true;
		ElMessage.error('销售属性不能为空');
		return false;
	}
};
const validateproductCAT = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.productCAT != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsproductCAT = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsproductCAT = true;
		ElMessage.error('产品CAT不能为空');
		return false;
	}
};
const validatepurchasingCountry = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.purchasingCountry != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IspurchasingCountry = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IspurchasingCountry = true;
		ElMessage.error('采购国不能为空');
		return false;
	}
};
const validatespecsUnit = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.specsUnit != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsspecsUnit = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsspecsUnit = true;
		ElMessage.error('SpecsUnit不能为空');
		return false;
	}
};
function Check() {
	var b1 = false;
	if (validateinventorySKU()) {
		b1 = true;
	}
	var b2 = false;
	if (validateinventoryProductName()) {
		b2 = true;
	}
	var b3 = false;
	if (validatesalesAttributes()) {
		b3 = true;
	}
	var b4 = false;
	if (validateproductCAT()) {
		b4 = true;
	}
	var b5 = false;
	if (validatepurchasingCountry()) {
		b5 = true;
	}
	var b6 = false;
	if (validatespecsUnit()) {
		b6 = true;
	}
	if (b1 && b2 && b3 && b4 && b5 && b6) {
		return true;
	}
	return false;
}
const SAVE = (row: any) => {
	if (Check()) {
		if (row.id == null) {
			//添加操作
			addCN_OperationalProductAttributes(row).then((res) => {
				ElMessage.success('添加成功');
				handleQuery();
			});
		} else {
			//修改操作
			updateCN_OperationalProductAttributes(row).then((res) => {
				ElMessage.success('修改成功');
				handleQuery();
			});
		}
	}
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
// 导入模块
function Imports(file: any) {
	loading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	Import(formData).then((res: any) => {
		loading.value = false;
		if (res.data.code == 200) {
			ElMessage.success('导入成功');
			handleQuery();
		} else {
			loading.value = false;
			ElMessage.error('导入失败'); // + res.message
		}
	})
		.catch(arr => {
			loading.value = false;
		});
}
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.inventorySKU);
	});
}
function AllExport() {
	Exportloading.value = true;
	const formData = {
		type: 1,
	};
	axios.post(import.meta.env.VITE_API_URL as any + `/api/cN_OperationalProductAttributes/export`, Object.assign(queryParams.value, tableParams.value, formData), {
		responseType: 'blob' // 将响应解析为二进制数据
	})
		// service({
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
		ErpSku: selectedRows.value,
	};
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/cN_OperationalProductAttributes/export`, formData, {
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
handleQuery();
</script>
<template>
	<div class="cN_OperationalProductAttributes-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="序号">
					<el-input v-model="queryParams.number" clearable="" placeholder="请输入序号" />
				</el-form-item>
				<el-form-item label="库存SKU">
					<el-input v-model="queryParams.inventorySKU" clearable="" placeholder="请输入库存SKU" />
				</el-form-item>
				<el-form-item label="库存品名">
					<el-input v-model="queryParams.inventoryProductName" clearable="" placeholder="请输入库存品名" />
				</el-form-item>
				<el-form-item label="销售属性">
					<el-input v-model="queryParams.salesAttributes" clearable="" placeholder="请输入销售属性" />
				</el-form-item>
				<el-form-item label="产品CAT">
					<el-input v-model="queryParams.productCAT" clearable="" placeholder="请输入产品CAT" />
				</el-form-item>
				<el-form-item label="采购国">
					<el-input v-model="queryParams.purchasingCountry" clearable="" placeholder="请输入采购国" />
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div>
				<el-upload style="float: left" :on-change="Imports" :multiple="false" action="#" :show-file-list="false"
					:auto-upload="false" name="file">
					<el-button :loading="loading" type="primary">导入</el-button>
				</el-upload>
				<div class="flex flex-wrap items-center" style="float: left; margin-left: 10px">
					<el-dropdown>
						<el-button type="primary" :loading="Exportloading"> 导出 </el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item :disabled="selectedRows?.length <= 0"
									@click="SelectedExport">导出选中</el-dropdown-item>
								<el-dropdown-item @click="AllExport">导出所有</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				@selection-change="handleSelectionChange" row-key="id" border="">
				<el-table-column width="140" align="center" fixed="left" show-overflow-tooltip="">
					<template #header>
						<el-button style="background-color: transparent; border: none; color: #df1515"
							icon="ele-Setting"></el-button>
					</template>
					<template #default="scope">
						<el-tooltip class="box-item" effect="dark" content="新增" placement="bottom">
							<el-button icon="ele-CirclePlus" size="small" text="" type="primary"
								@click="AddRow()"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="保存" placement="bottom">
							<el-button v-if="scope.row.IsEdit" icon="ele-Document" size="small" text="" type="primary"
								@click="SAVE(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="编辑" placement="bottom">
							<el-button v-if="!scope.row.IsEdit" icon="ele-Edit" size="small" text="" type="primary"
								@click="openEdit(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="删除" placement="bottom">
							<el-button icon="ele-Delete" size="small" text="" type="primary"
								@click="delCN_OperationalProductAttributes(scope.row)"> </el-button>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column type="selection" width="55" class-name="custom-header" />
				<el-table-column prop="inventorySKU" label="库存SKU" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsinventorySKU }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.inventorySKU" clearable="" />
							<div v-else>{{ scope.row.inventorySKU }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="inventoryProductName" label="库存品名" align="center" sortable
					show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsinventoryProductName }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.inventoryProductName"
								clearable="" />
							<div v-else>{{ scope.row.inventoryProductName }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="salesAttributes" label="销售属性" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IssalesAttributes }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.salesAttributes" clearable="" />
							<div v-else>{{ scope.row.salesAttributes }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="productCAT" label="产品CAT" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsproductCAT }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.productCAT" clearable="" />
							<div v-else>{{ scope.row.productCAT }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="purchasingCountry" label="采购国" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IspurchasingCountry }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.purchasingCountry"
								clearable="" />
							<div v-else>{{ scope.row.purchasingCountry }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="specsUnit" label="SpecsUnit" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-input :class="{ 'sku-input': scope.row.IsspecsUnit }" class="custom-input"
								v-if="scope.row.IsEdit" type="text" v-model="scope.row.specsUnit" clearable="" />
							<div v-else>{{ scope.row.specsUnit }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="listingDateTime" label="上架日期" align="center" sortable show-overflow-tooltip="">
					<template #default="scope">
						<div @dblclick="openEdit(scope.row)">
							<el-date-picker type="datetime" :class="{ 'sku-input': scope.row.IslistingDateTime }"
								class="custom-input" v-if="scope.row.IsEdit" v-model="scope.row.listingDateTime"
								clearable="" />
							<div v-else>{{ scope.row.listingDateTime }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="140" align="center" sortable fixed="right" show-overflow-tooltip=""
					v-if="auth('cN_OperationalProductAttributes:edit') || auth('cN_OperationalProductAttributes:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary"
							@click="openEditCN_OperationalProductAttributes(scope.row)"
							v-auth="'cN_OperationalProductAttributes:edit'">
							编辑
						</el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary"
							@click="delCN_OperationalProductAttributes(scope.row)"
							v-auth="'cN_OperationalProductAttributes:delete'"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editCN_OperationalProductAttributesTitle"
				@reloadTable="handleQuery" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.sku-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 1px #de2910 inset;
	}
}
</style>
