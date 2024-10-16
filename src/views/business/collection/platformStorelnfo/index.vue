<script lang="ts" setup="" name="platformStoreInfo">
import { ref, reactive } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { platformStorePage, platformStoreDelete,platformStoreUpdate } from '/@/api/modular/main/platformStoreInfo.ts';
import Edit from './components/index.vue'

const state = reactive({
	loading: false,
	tableData: [],
	queryParams: {},
	tableParams: {
		pageNo: 1,
		pageSize: 20,
		total: 0,
		Order: null,
		Field: null,
	},
	editTitle: '',
});
const editRef = ref();

// 改变页面容量
const handleSizeChange = (val: number) => {
	state.tableParams.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	state.tableParams.pageNo = val;
	handleQuery();
};

// 查询操作
const handleQuery = async () => {
	state.loading = true;
	var res = await platformStorePage(Object.assign(state.queryParams, state.tableParams));
	state.tableData = res.data.result?.items ?? [];
	state.tableParams.total = res.data.result?.total;
	state.loading = false;
};
// 打开新增页面
const openAdd = () => {
	state.editTitle = '新增';
	editRef.value?.openDialog({state:true});
};

// 打开编辑页面
const openEdit = (row: any) => {
	state.editTitle = '编辑';
	editRef.value?.openDialog(row);
};
// 删除
const delData = (row: any) => {
	ElMessageBox.confirm(`你确定要删除此列吗?`, '提示信息', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await platformStoreDelete(row);
			handleQuery();
			ElMessage.success('删除成功!');
		})
		.catch(() => {});
};
// 页面修改状态
const changeState =async (row) => {
	await platformStoreUpdate(Object.assign(row)).then(res=>{
		ElMessage.success('更新成功')
	})
}

handleQuery();
</script>
<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="state.queryParams" ref="queryForm" :inline="true">
				<el-form-item label="名称">
					<el-input v-model="state.queryParams.name" clearable="" placeholder="请输入" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									state.queryParams = {};
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
			<div style="width: 10%;margin-bottom:20px">
				<el-button type="primary" icon="ele-Plus" @click="openAdd">新增</el-button>
			</div>
			<el-table :data="state.tableData" size="lagre" style="width: 100%" v-loading="state.loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="65" align="center" />
				<el-table-column prop="name" label="名称"  align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="state" label="状态" align="center" sortableshow-overflow-tooltip="">
					<template #default="scope">
						<el-switch v-model="scope.row.state" :active-value="true" :inactive-value="false" size="small" @change="changeState(scope.row)" />
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序"  align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="remarks" label="备注"  align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="operationTime" label="操作时间"  align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="creator" label="操作人" sortable width="150" align="center" sortableshow-overflow-tooltip="" />
				<el-table-column label="操作" width="150" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button size="small" @click="openEdit(scope.row)"> 编辑 </el-button>
						<el-button type="info" size="small" @click="delData(scope.row)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="state.tableParams.page"
				v-model:page-size="state.tableParams.pageSize"
				:total="state.tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<Edit ref="editRef" :title="state.editTitle" @handleQuery="handleQuery" />
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

.example-showcase .el-dropdown + .el-dropdown {
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
