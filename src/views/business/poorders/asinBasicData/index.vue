<script lang="ts" setup name="asinBasicData">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import editDialog from './component/editDialog.vue';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { pageASINBasicData, Import, ExportASIN, deleteASINBasicData, addASINBasicData, updateASINBasicData, batchDeleteASINBasicData } from '/@/api/modular/main/aSINBasicData.ts';
import other from '/@/utils/other.ts';
const displayDel = ref(true);
const editDialogRef = ref();
const loading = ref(false);
const loading1 = ref(false);
const loading3 = ref(false);
let IsEdit = ref<any>(false);
let selectedRows = ref<any>([]);
const tableData = ref<any>([]);
const area = ref<any>('UAE');
const queryParams = ref<AsinParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
	Site: area.value,
});
const TableData = ref<any>([
	{
		titleCN: 'ASIN',
		dataIndex: 'asin',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'StoreSKU',
		dataIndex: 'storeSKU',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'ERP-SKU',
		dataIndex: 'erpSku',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'GoodsName',
		dataIndex: 'goodsName',
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
		titleCN: 'Single Order QTY',
		dataIndex: 'unit',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'Specs Unit',
		dataIndex: 'specsUnit',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'Creator',
		dataIndex: 'creator',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
]);
const editASINBasicDataTitle = ref('');
const switchLanguage = () => {
	queryParams.value = {};
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

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	tableParams.value.Site = area.value;
	var res = await pageASINBasicData(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	IsEdit.value = false;
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
	if (selectedRows.value.length > 0) {
		displayDel.value = false;
	} else {
		displayDel.value = true;
	}
}
//批量删除
function BatchDelete() {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await batchDeleteASINBasicData(selectedRows.value);
			ElMessage.success('删除成功');
			handleQuery();
		})
		.catch(() => {});
}
// 打开新增页面
const openAddASINBasicData = () => {
	editASINBasicDataTitle.value = '添加ASIN基础数据';
	editDialogRef.value.openDialog({});
};
const AddRow = () => {
	if (!IsEdit.value) {
		tableData.value.unshift({
			id: null,
			asin: '',
			storeSKU: '',
			goodsName: '',
			origin: '',
			specsUnit: '',
			unit: '',
			erpSku: '',
			IsEdit: true,
		});
		IsEdit.value = true;
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

// 导入ASIN
function Imports(file: any) {
	loading3.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('Site', area.value);
	Import(formData).then((res: any) => {
		loading3.value = false;
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			handleQuery();
		} else {
			ElMessage.error(res.message); // + res.message
		}
	});
}
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
};
// 导出ASIN
function Export() {
	loading1.value = true;
	ExportASIN(Object.assign(queryParams.value, tableParams.value, { site: area.value })).then((res: any) => {
		loading1.value = false;
		other.downloadfile(res);
		handleQuery();
	});
}

// 打开编辑页面
const openEditASINBasicData = (row: any) => {
	editASINBasicDataTitle.value = '编辑ASIN基础数据';
	editDialogRef.value.openDialog(row);
};

// 打开新增页面
const openaddASINBasicData = () => {
	editASINBasicDataTitle.value = '新增ASIN基础数据';
	editDialogRef.value.openDialog({});
};

// 删除
const delASINBasicData = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			if (row.id != null) {
				await deleteASINBasicData(row);
				tableData.value = tableData.value.filter((i) => i !== row);
				ElMessage.success('删除成功');
			} else {
				tableData.value = tableData.value.filter((i) => i !== row);
				IsEdit.value = false;
			}
		})
		.catch(() => {});
};
const validateASIN = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	const reg = /^[A-Za-z0-9]{10}$/;
	if (reg.test(objectWithIsEditTrue.asin)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = true;
		ElMessage.error('ASIN请输入10位数的字母或者数字，并且不包含空格');
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
		ElMessage.error('storeSKU不能为空');
		return false;
	}
};
const validateSingleOrderQTY = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.unit != '' && !isNaN(objectWithIsEditTrue.unit)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = false;
		return true;
	} else if (isNaN(objectWithIsEditTrue.unit)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = true;
		ElMessage.error('singleOrderQTY只能输入数字');
		return false;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = true;
		ElMessage.error('singleOrderQTY不能为空');
		return false;
	}
};
const validateErpSku = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.erpSku != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = true;
		ElMessage.error('erpSku不能为空');
		return false;
	}
};
function Check() {
	var b1 = false;
	if (validateASIN()) {
		b1 = true;
	}
	var b2 = false;
	if (validateStoreSKU()) {
		b2 = true;
	}
	var b3 = false;
	if (validateSingleOrderQTY()) {
		b3 = true;
	}
	var b4 = false;
	if (validateErpSku()) {
		b4 = true;
	}
	if (b1 && b2 && b3 && b4) {
		return true;
	}
	return false;
}
const SAVE = (row: any) => {
	if (Check()) {
		row.site = area.value;
		if (row.id == null) {
			//添加操作
			addASINBasicData(row).then((res) => {
				ElMessage.success('添加成功');
				handleQuery();
			});
		} else {
			//修改操作
			updateASINBasicData(row).then((res) => {
				ElMessage.success('修改成功');
				handleQuery();
			});
		}
	}
};

handleQuery();
</script>
<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item label="StoreSKU">
					<el-input v-model="queryParams.storeSKU" clearable="" placeholder="请输入StoreSKU" />
				</el-form-item>
				<el-form-item label="ERP-SKU">
					<el-input v-model="queryParams.erpSku" clearable="" placeholder="请输入ERP-SKU" />
				</el-form-item>
				<el-form-item label="GoodsName">
					<el-input v-model="queryParams.goodsName" clearable="" placeholder="请输入GoodsName" />
				</el-form-item>
				<el-form-item label="Origin">
					<el-input v-model="queryParams.origin" clearable="" placeholder="请输入Origin" />
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
				<div class="importDiv">
					<!-- <el-button type="primary" icon="ele-Plus" @click="openAddASINBasicData"> 新增 </el-button> -->
					<!-- <el-button type="primary" icon="ele-Plus" @click="openaddASINBasicData()" v-auth="'sysMenu:add'"> 新增 </el-button> -->
					<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
						<el-button :loading="loading3" type="primary">ASIN基础数据导入</el-button>
					</el-upload>
					<el-button @click="Export" :loading="loading1" type="primary">导出全部ASIN</el-button>
					<el-button @click="BatchDelete" :disabled="displayDel" :loading="loading1" type="primary">批量删除</el-button>
					<el-link href="https://sa1api.ecvv.com/ExcelTemplate/ASIN.xlsx"> 下载ASIN上传模板</el-link>
				</div>
				<tabDragColum :data="TableData" :name="`asinBasicData`" area="CN" @handleData="handleData" @handleRemarkData="handleRemarkData" />
			</div>
			<div style="margin-top: 5px; display: flex; justify-content: space-between">
				<el-button-group>
					<el-button
						style="width: 80px; height: 27px"
						:class="{ buttonBackground: area == 'UAE' }"
						@click="
							area = 'UAE';
							switchLanguage();
						"
						>UAE</el-button
					>
					<el-button
						style="width: 80px; height: 27px"
						:class="{ buttonBackground: area == 'SA' }"
						@click="
							area = 'SA';
							switchLanguage();
						"
						>SA</el-button
					>
				</el-button-group>
			</div>
			<el-table :data="tableData" @selection-change="handleSelectionChange" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column width="140" align="center" fixed="left" show-overflow-tooltip="">
					<template #header>
						<el-button style="background-color: transparent; border: none; color: #df1515" icon="ele-Setting"></el-button>
					</template>
					<template #default="scope">
						<el-tooltip class="box-item" effect="dark" content="新增" placement="bottom">
							<el-button icon="ele-CirclePlus" size="small" text="" type="primary" @click="AddRow()"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="保存" placement="bottom">
							<el-button v-if="scope.row.IsEdit" icon="ele-Document" size="small" text="" type="primary" @click="SAVE(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="编辑" placement="bottom">
							<el-button v-if="!scope.row.IsEdit" icon="ele-Edit" size="small" text="" type="primary" @click="openEdit(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="删除" placement="bottom">
							<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delASINBasicData(scope.row)"> </el-button>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column type="selection" width="40" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column v-if="item.dataIndex == 'asin' && item.checked" :fixed="item.fixed" :prop="item.dataIndex" :label="item.titleCN" align="center"  show-overflow-tooltip>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ item.titleCN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ item.titleCN }}</div>
						</template>
						<template #default="scope">
							<div @dblclick="openEdit(scope.row)">
								<el-input :class="{ 'sku-input': scope.row.IsASIN }" class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.asin" clearable="" />
								<div v-else>{{ scope.row.asin }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex == 'storeSKU' && item.checked" :fixed="item.fixed" :prop="item.dataIndex" :label="item.titleCN" align="center"  show-overflow-tooltip>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ item.titleCN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ item.titleCN }}</div>
						</template>
						<template #default="scope">
							<div @dblclick="openEdit(scope.row)">
								<el-input :class="{ 'sku-input': scope.row.IsstoreSKU }" class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.storeSKU" clearable="" />
								<div v-else>{{ scope.row.storeSKU }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex == 'erpSku' && item.checked" :fixed="item.fixed" :prop="item.dataIndex" :label="item.titleCN" align="center"  show-overflow-tooltip>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ item.titleCN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ item.titleCN }}</div>
						</template>
						<template #default="scope">
							<div @dblclick="openEdit(scope.row)">
								<el-input :class="{ 'sku-input': scope.row.IserpSku }" class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.erpSku" clearable="" />
								<div v-else>{{ scope.row.erpSku }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex == 'unit' && item.checked" :fixed="item.fixed" :prop="item.dataIndex" :label="item.titleCN" align="center"  show-overflow-tooltip>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ item.titleCN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ item.titleCN }}</div>
						</template>
						<template #default="scope">
							<div @dblclick="openEdit(scope.row)">
								<el-input :class="{ 'sku-input': scope.row.IsSingleOrderQTY }" class="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.unit" clearable="" />
								<div v-else>{{ scope.row.unit }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex  && item.checked" :fixed="item.fixed" :prop="item.dataIndex" :label="item.titleCN" align="center" width="150" show-overflow-tooltip>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ item.titleCN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ item.titleCN }}</div>
						</template>
					</el-table-column>
				</template>
				<!-- <el-table-column prop="costPrice" label="LowestPrice" align="center" show-overflow-tooltip="" /> -->
				<!-- <el-table-column prop="saudiBottomPrice_R96EP" align="center" label="SaudiBottomPrice_R96EP" width="190" show-overflow-tooltip="" />
				<el-table-column prop="saudiBottomPrice_63FV3" align="center" label="SaudiBottomPrice_63FV3" width="190" show-overflow-tooltip="" />
				<el-table-column prop="saudiBottomPrice_YZ6VH" align="center" label="SaudiBottomPrice_YZ6VH" width="190" show-overflow-tooltip="" /> -->
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
			<editDialog ref="editDialogRef" :title="editASINBasicDataTitle" @reloadTable="handleQuery()" />
		</el-card>
	</div>
</template>

<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 450px;
}

.sku-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 1px #de2910 inset;
	}
}

.buttonBackground {
	background-color: #e76957;
	box-shadow: 0 0 0 1px #e76957 inset;
	color: white;
}
:deep(.el-textarea__inner) {
	box-shadow: initial;
	padding: 5px;
	margin: 0;
	height: 142px !important;
}
</style>
