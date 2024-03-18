<template>
	<div class="sevenDaysSales-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<!-- <el-form-item label="ProductTitle">
          <el-input v-model="queryParams.productTitle" clearable="" placeholder="请输入ProductTitle"/>

        </el-form-item>
        <el-form-item label="Brand">
          <el-input v-model="queryParams.brand" clearable="" placeholder="请输入Brand"/>

        </el-form-item>
        <el-form-item label="ShippedRevenue">
          <el-input v-model="queryParams.shippedRevenue" clearable="" placeholder="请输入ShippedRevenue"/>

        </el-form-item>
        <el-form-item label="ShippedCOGS">
          <el-input v-model="queryParams.shippedCOGS" clearable="" placeholder="请输入ShippedCOGS"/>

        </el-form-item>
        <el-form-item label="ShippedUnits">
          <el-input v-model="queryParams.shippedUnits" clearable="" placeholder="请输入ShippedUnits"/>

        </el-form-item>
        <el-form-item label="CustomerReturns">
          <el-input v-model="queryParams.customerReturns" clearable="" placeholder="请输入CustomerReturns"/>

        </el-form-item> -->
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = { sevenDaysSalesBatchId: props.id };
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddSevenDaysSales" v-auth="'sevenDaysSales:add'"> 新增 </el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 420px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="asin" label="ASIN" show-overflow-tooltip="" />
				<el-table-column prop="productTitle" label="ProductTitle" show-overflow-tooltip="" />
				<el-table-column prop="brand" label="Brand" show-overflow-tooltip="" />
				<el-table-column prop="shippedRevenue" label="ShippedRevenue" show-overflow-tooltip="" />
				<el-table-column prop="shippedCOGS" label="ShippedCOGS" show-overflow-tooltip="" />
				<el-table-column prop="shippedUnits" label="ShippedUnits" show-overflow-tooltip="" />
				<el-table-column prop="customerReturns" label="CustomerReturns" show-overflow-tooltip="" />
				<!-- <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('sevenDaysSales:edit') || auth('sevenDaysSales:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditSevenDaysSales(scope.row)" v-auth="'sevenDaysSales:edit'"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delSevenDaysSales(scope.row)" v-auth="'sevenDaysSales:delete'"> 删除 </el-button>
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
			<editDialog ref="editDialogRef" :title="editSevenDaysSalesTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="sevenDaysSales">
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

// import editDialog from '/@/views/main/sevenDaysSales/component/editDialog.vue';
import { pageSevenDaysSales, deleteSevenDaysSales } from '/@/api/operation/sevenDaysSales';

const props = defineProps(['id']);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ sevenDaysSalesBatchId: props.id });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editSevenDaysSalesTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageSevenDaysSales(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddSevenDaysSales = () => {
	editSevenDaysSalesTitle.value = '添加SevenDaysSales';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditSevenDaysSales = (row: any) => {
	editSevenDaysSalesTitle.value = '编辑SevenDaysSales';
	editDialogRef.value.openDialog(row);
};

// 删除
const delSevenDaysSales = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteSevenDaysSales(row);
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
		queryParams.value.sevenDaysSalesBatchId = props.id;
		handleQuery();
	}
);

handleQuery();
</script>
