<template>
	<div class="sevenDaysSales_Batch-container">
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
				<el-form-item label="查询开始时间">
					<el-input v-model="queryParams.queryStartTime" clearable="" placeholder="请输入查询开始时间" />
				</el-form-item>
				<el-form-item label="查询结束时间">
					<el-input v-model="queryParams.queryEndTime" clearable="" placeholder="请输入查询结束时间" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'sevenDaysSales_Batch:page'"> 查询 </el-button>
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
					<el-button type="primary" icon="ele-Plus" @click="openAddSevenDaysSales_Batch" v-auth="'sevenDaysSales_Batch:add'"> 新增 </el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-form-item><el-button @click="opendialog" type="primary"> 导入 </el-button></el-form-item>
			<el-dialog v-model="dialogFormVisible" title="表格导入" :width="400">
				<span class="itemlabel">站点：</span>
				<el-select v-model="site" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
				<template #footer>
					<span class="dialog-footer">
						<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
							<el-button :loading="importloading" type="primary" size="default">导入数据</el-button>
						</el-upload>
					</span>
				</template>
			</el-dialog>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="site" label="站点" align="center" />
				<el-table-column prop="fileName" label="文件名" align="center" show-overflow-tooltip="" width="175" />
				<el-table-column prop="batchId" label="批次号" align="center" />
				<el-table-column prop="queryStartTime" label="查询开始时间" align="center" />
				<el-table-column prop="queryEndTime" label="查询结束时间 " align="center" />
				<el-table-column prop="createTime" label="导入时间 " align="center" />
				<el-table-column prop="creator" label="操作人 " align="center" />
				<el-table-column label="操作" width="140" align="center" fixed="right" v-if="auth('sevenDaysSales_Batch:edit') || auth('sevenDaysSales_Batch:delete')">
					<template #default="scope">
						<el-button icon="ele-Document" size="small" text="" type="primary" @click="showModal(scope.row.id)"> 详情 </el-button>
						<!-- <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSevenDaysSales_Batch(scope.row)" v-auth="'sevenDaysSales_Batch:edit'"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSevenDaysSales_Batch(scope.row)" v-auth="'sevenDaysSales_Batch:delete'"> 删除 </el-button> -->
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
			<editDialog ref="editDialogRef" :title="editSevenDaysSales_BatchTitle" @reloadTable="handleQuery" />
		</el-card>
		<el-dialog v-model="visible" title="SevenDaysSales List" @close="close" width="1000px">
			<!-- <sevenDaysSales :id="sevenDaysSalesId"></sevenDaysSales> -->
			<InfoDataDialog :id="sevenDaysSalesId" idName="sevenDaysSalesBatchId" :dataList="dataList"  :interface="pageSevenDaysSales" :formList="formList" />
		</el-dialog>
	</div>
</template>

<script lang="ts" setup="" name="sevenDaysSales_Batch">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import sevenDaysSales from './component/sevenDaysSales.vue';
//import { formatDate } from '/@/utils/formatTime';
// /@/views/OperationManagement/asinmanagement/sevenDaysSales_Batch
import editDialog from './component/editDialog.vue';
import { pageSevenDaysSales_Batch, deleteSevenDaysSales_Batch, Import } from '/@/api/operation/sevenDaysSales_Batch';
import { pageSevenDaysSales } from '/@/api/operation/sevenDaysSales';
import { getDictDataList } from '/@/api/system/admin';
import InfoDataDialog from '/@/components/infoDataDialog/index.vue'

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
const editSevenDaysSales_BatchTitle = ref('');
// infoDataDialog 配套参数
const formList = ref<any>([
	{
		label:'ASIN',
		prop:'aSIN'
	}
])
const dataList = ref<any>([
	{
		label:'ASIN',
		prop:'asin'
	},
	{
		label:'ProductTitle',
		prop:'productTitle'
	},
	{
		label:'Brand',
		prop:'brand'
	},
	{
		label:'ShippedRevenue',
		prop:'shippedRevenue'
	},
	{
		label:'ShippedCOGS',
		prop:'shippedCOGS'
	},
	{
		label:'ShippedUnits',
		prop:'shippedUnits'
	},
	{
		label:'CustomerReturns',
		prop:'customerReturns'
	},
	
])
//开始
var sevenDaysSalesId = ref<number>(0);
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
//打开弹窗
function showModal(id: any) {
	sevenDaysSalesId = id;
	visible.value = true;
}

//关闭弹窗
function close() {
	visible.value = false;
}

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

// 结束

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageSevenDaysSales_Batch(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
	getsiteData.value = await dictTypeDataList('zhandian');
};

// 打开新增页面
const openAddSevenDaysSales_Batch = () => {
	editSevenDaysSales_BatchTitle.value = '添加 7 Days Sales';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSevenDaysSales_Batch = (row: any) => {
	editSevenDaysSales_BatchTitle.value = '编辑 7 Days Sales';
	editDialogRef.value.openDialog(row);
};

// 删除
const delSevenDaysSales_Batch = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteSevenDaysSales_Batch(row);
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
