<template>
	<div class="dFInventory_Batch-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="文件名">
					<el-input v-model="queryParams.fileName" clearable="" placeholder="请输入文件名" />
				</el-form-item>
				<el-form-item label="批次号">
					<el-input v-model="queryParams.batchId" clearable="" placeholder="请输入批次号" />
				</el-form-item>
				<el-form-item label="站点">
					<el-select clearable="" v-model="queryParams.site" placeholder="请选择站点">
						<el-option v-for="(item, index) in getsiteData" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'dFInventory_Batch:page'"> 查询 </el-button>
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
				<!-- <el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddDFInventory_Batch" v-auth="'dFInventory_Batch:add'"> 新增 </el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-form-item><el-button @click="opendialog" type="primary"> 导入 </el-button></el-form-item>
			<el-dialog v-model="dialogFormVisible" title="DFInventoryBatch导入" :width="600" center>
				<importDialog
					:type="importType"
					text="选择站点，点击'确定'后，选择需要导入的文件，将导入该数据"
					:formList="importFormList"
					:importsInterface="Import"
					@close="importClose"
					@importQuery="importQuery"
				/>
			</el-dialog>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="site" label="站点" align="center" />
				<el-table-column prop="fileName" label="文件名" align="center" width="175" show-overflow-tooltip="" />
				<el-table-column prop="batchId" label="批次号" align="center" />
				<el-table-column prop="createTime" label="导入时间 " align="center" />
				<el-table-column prop="creator" label="操作人 " align="center" />
				<el-table-column label="操作" width="140" align="center" fixed="right" v-if="auth('dFInventory_Batch:edit') || auth('dFInventory_Batch:delete')">
					<template #default="scope">
						<el-button icon="ele-Document" size="small" text="" type="primary" @click="showModal(scope.row.id)"> 详情 </el-button>
						<!-- <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditDFInventory_Batch(scope.row)" v-auth="'dFInventory_Batch:edit'"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delDFInventory_Batch(scope.row)" v-auth="'dFInventory_Batch:delete'"> 删除 </el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<editDialog ref="editDialogRef" :title="editDFInventory_BatchTitle" @reloadTable="handleQuery" />
		</el-card>
		<el-dialog v-model="visible" title="DFInventory List" @close="close" width="1000px">
			<InfoDataDialog :id="dFInventoryBatchId" idName="dFInventoryBatchId" :dataList="dataList" :ifClose="ifClose" :pointerface="pageDFInventory" :formList="formList" />
			<!-- <dFInventory :id="dFInventoryBatchId"></dFInventory> -->
		</el-dialog>
	</div>
</template>

<script lang="ts" setup="" name="dFInventory_Batch">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import editDialog from './component/editDialog.vue';
import dFInventory from './component/dFInventory.vue';
import { pageDFInventory } from '/@/api/operation/dFInventory';
import { pageDFInventory_Batch, deleteDFInventory_Batch, Import } from '/@/api/operation/dFInventory_Batch';
import { getDictDataList } from '/@/api/system/admin';
import InfoDataDialog from '/@/components/infoDataDialog/index.vue';
import importDialog from '/@/components/importDialog/index.vue';

const getsiteData = ref<any>([]);

const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editDFInventory_BatchTitle = ref('');
// infoDataDialog 配套参数
const formList = ref<any>([
	{
		label: 'ASIN',
		prop: 'aSIN',
	},
]);
const dataList = ref<any>([
	{
		label: 'SKU',
		prop: 'sku',
	},
	{
		label: 'UPC',
		prop: 'upc',
	},
	{
		label: 'ASIN',
		prop: 'asin',
	},
	{
		label: 'Title',
		prop: 'title',
	},
	{
		label: 'Warehouse',
		prop: 'warehouse',
	},
	{
		label: 'Warehouse name',
		prop: 'warehouseName',
	},
	{
		label: 'AvailableUnits',
		prop: 'availableUnits',
	},
	{
		label: 'Status',
		prop: 'status',
	},
]);
var dFInventoryBatchId = ref<number>(0);
const importloading = ref(false);
const dialogFormVisible = ref(false);
const visible = ref(false); //列表弹窗
const site = ref<any>(''); //站点
const options = ref([
	{
		value: 'UAE',
		label: 'UAE',
	},
	{
		value: 'SA',
		label: 'SA',
	},
]);
const opendialog = () => {
	dialogFormVisible.value = true;
	site.value = '';
};
const ifClose = ref(false);
//打开弹窗
function showModal(id: any) {
	dFInventoryBatchId = id;
	ifClose.value = true;
	visible.value = true;
}

//关闭弹窗
function close() {
	ifClose.value = false;
	visible.value = false;
}
const importType = ref('dFInventory_batch');
const importFormList = ref<any>([
	{
		label: '站点',
		prop: 'Site',
		type: 'select',
		select: 'Site',
		selectList: options.value,
	},
]);
const importClose = (bol: boolean) => {
	dialogFormVisible.value = bol;
};
const importQuery = () => {
	handleQuery();
};
// 导入
const Imports = (file: any) => {
	if (site.value == '') {
		ElMessage.warning('请选择站点');
		return;
	}
	importloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('site', site.value);
	Import(formData)
		.then((res: any) => {
			importloading.value = false;
			if (res.data.code == 200) {
				ElMessage.success('导入成功');
				dialogFormVisible.value = false;
				handleQuery();
			} else {
				importloading.value = false;
				ElMessage.error(res.message); // + res.message
			}
		})
		.catch(() => {
			importloading.value = false;
			dialogFormVisible.value = false;
		});
};

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageDFInventory_Batch(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
	getsiteData.value = await dictTypeDataList('zhandian');
};

// 打开新增页面
const openAddDFInventory_Batch = () => {
	editDFInventory_BatchTitle.value = '添加 DF Inventory导入数据';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditDFInventory_Batch = (row: any) => {
	editDFInventory_BatchTitle.value = '编辑 DF Inventory导入数据';
	editDialogRef.value.openDialog(row);
};

// 删除
const delDFInventory_Batch = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteDFInventory_Batch(row);
			handleQuery();
			ElMessage.success('删除成功');
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

const dictTypeDataList = async (val: any) => {
	let list = await getDictDataList(val);
	return list.data.result ?? [];
};
handleQuery();
</script>
