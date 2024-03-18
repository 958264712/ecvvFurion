<template>
	<div class="costpeice-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="Vendor">
					<el-input v-model="queryParams.vendor" clearable="" placeholder="请输入Vendor" />
				</el-form-item> -->
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<!-- <el-form-item label="EAN_UPC">
					<el-input v-model="queryParams.eAN_UPC" clearable="" placeholder="请输入EAN_UPC" />
				</el-form-item>
				<el-form-item label="Model">
					<el-input v-model="queryParams.model" clearable="" placeholder="请输入Model" />
				</el-form-item>
				<el-form-item label="ProductDescription">
					<el-input v-model="queryParams.productDescription" clearable="" placeholder="请输入ProductDescription" />
				</el-form-item>
				<el-form-item label="ReplenishmentStatus">
					<el-input v-model="queryParams.replenishmentStatus" clearable="" placeholder="请输入ReplenishmentStatus" />
				</el-form-item>
				<el-form-item label="EffectiveDate">
					<el-input v-model="queryParams.effectiveDate" clearable="" placeholder="请输入EffectiveDate" />
				</el-form-item>
				<el-form-item label="CurrentCost">
					<el-input v-model="queryParams.currentCost" clearable="" placeholder="请输入CurrentCost" />
				</el-form-item>
				<el-form-item label="NewCost">
					<el-input v-model="queryParams.newCost" clearable="" placeholder="请输入NewCost" />
				</el-form-item>
				<el-form-item label="CurrentCostCurrency">
					<el-input v-model="queryParams.currentCostCurrency" clearable="" placeholder="请输入CurrentCostCurrency" />
				</el-form-item>
				<el-form-item label="NewCostCurrency">
					<el-input v-model="queryParams.newCostCurrency" clearable="" placeholder="请输入NewCostCurrency" />
				</el-form-item> -->
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = { costpriceBatchId: props.id };
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddCostpeice" v-auth="'costpeice:add'"> 新增 </el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="vendor" label="Vendor" align="center" />
				<el-table-column prop="asin" label="ASIN" align="center" width="110" />
				<el-table-column prop="eaN_UPC" label="EAN_UPC" align="center" width="125" />
				<el-table-column prop="model" label="Model" align="center" width="125" show-overflow-tooltip="" />
				<el-table-column prop="productDescription" label="ProductDescription" align="center" width="125" show-overflow-tooltip="" />
				<el-table-column prop="replenishmentStatus" label="ReplenishmentStatus" align="center" width="135" />
				<el-table-column prop="effectiveDate" label="EffectiveDate" align="center" width="115" />
				<el-table-column prop="currentCost" label="CurrentCost" align="center" width="110" />
				<el-table-column prop="newCost" label="NewCost" align="center" />
				<el-table-column prop="currentCostCurrency" label="CurrentCostCurrency" align="center" width="135" />
				<el-table-column prop="newCostCurrency" label="NewCostCurrency" align="center" width="130" />
				<!-- <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('costpeice:edit') || auth('costpeice:delete')">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditCostpeice(scope.row)" v-auth="'costpeice:edit'"> 编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delCostpeice(scope.row)" v-auth="'costpeice:delete'"> 删除 </el-button>
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
			<editDialog ref="editDialogRef" :title="editCostpeiceTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup="" name="costprice">
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';

// import editDialog from '/@/views/main/costpeice/component/editDialog.vue';
import { pageCostpeice, deleteCostpeice } from '/@/api/operation/costprice';

const props = defineProps(['id']);
const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ costpriceBatchId: props.id });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editCostpeiceTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageCostpeice(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddCostpeice = () => {
	editCostpeiceTitle.value = '添加Costpeice';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditCostpeice = (row: any) => {
	editCostpeiceTitle.value = '编辑Costpeice';
	editDialogRef.value.openDialog(row);
};

// 删除
const delCostpeice = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteCostpeice(row);
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
		queryParams.value.costpriceBatchId = props.id;
		handleQuery();
	}
);

handleQuery();
</script>
