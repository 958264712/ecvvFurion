<template>
	<div class="dFInventory-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="SKU">
          <el-input v-model="queryParams.sKU" clearable="" placeholder="请输入SKU"/>

        </el-form-item>
        <el-form-item label="UPC">
          <el-input v-model="queryParams.uPC" clearable="" placeholder="请输入UPC"/>

        </el-form-item> -->
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<!-- <el-form-item label="Title">
          <el-input v-model="queryParams.title" clearable="" placeholder="请输入Title"/>

        </el-form-item>
        <el-form-item label="Warehouse">
          <el-input v-model="queryParams.warehouse" clearable="" placeholder="请输入Warehouse"/>

        </el-form-item>
        <el-form-item label="WarehouseName">
          <el-input v-model="queryParams.warehouseName" clearable="" placeholder="请输入WarehouseName"/>

        </el-form-item>
        <el-form-item label="AvailableUnits">
          <el-input v-model="queryParams.availableUnits" clearable="" placeholder="请输入AvailableUnits"/>

        </el-form-item>
        <el-form-item label="Status">
          <el-input v-model="queryParams.status" clearable="" placeholder="请输入Status"/>

        </el-form-item> -->
				<el-form-item>
					<el-button-group>
						<!-- v-auth="'dFInventory:page'" -->
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = { dFInventoryBatchId: props.id };
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddDFInventory" v-auth="'dFInventory:add'"> 新增 </el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 420px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="sku" label="SKU" align="center" show-overflow-tooltip="" />
				<el-table-column prop="upc" label="UPC" align="center" show-overflow-tooltip="" />
				<el-table-column prop="asin" label="ASIN" align="center" show-overflow-tooltip="" />
				<el-table-column prop="title" label="Title" align="center" show-overflow-tooltip="" />
				<el-table-column prop="warehouse" label="Warehouse" align="center" show-overflow-tooltip="" />
				<el-table-column prop="warehouseName" label="Warehouse name" width="120" align="center" show-overflow-tooltip="" />
				<el-table-column prop="availableUnits" label="AvailableUnits" align="center" show-overflow-tooltip="" />
				<el-table-column prop="status" label="Status" align="center" show-overflow-tooltip="" />
				<!-- <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('dFInventory:edit') || auth('dFInventory:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditDFInventory(scope.row)" v-auth="'dFInventory:edit'"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delDFInventory(scope.row)" v-auth="'dFInventory:delete'"> 删除 </el-button>
					</template>
				</el-table-column> -->
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
			<editDialog ref="editDialogRef" :title="editDFInventoryTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="dFInventory">
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

// import editDialog from '/@/views/main/dFInventory/component/editDialog.vue';
import { pageDFInventory, deleteDFInventory } from '/@/api/operation/dFInventory';

const props = defineProps(['id']);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ dFInventoryBatchId: props.id });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editDFInventoryTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageDFInventory(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddDFInventory = () => {
	editDFInventoryTitle.value = '添加DFInventory';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditDFInventory = (row: any) => {
	editDFInventoryTitle.value = '编辑DFInventory';
	editDialogRef.value.openDialog(row);
};

// 删除
const delDFInventory = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteDFInventory(row);
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

watch(
	() => props.id,
	(val) => {
		queryParams.value = {};
		queryParams.value.dFInventoryBatchId = props.id;
		handleQuery();
	}
);

handleQuery();
</script>
