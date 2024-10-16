<script lang="ts" setup name="list_platform">
import { ref, onMounted } from 'vue';
import { getSitesListPlatform, listPlatformManagementPage,listPlatformManagementDelete } from '/@/api/modular/main/basicInfo.ts';
import { ElMessageBox, ElMessage } from 'element-plus';
import editDialog from './component/editDialog.vue';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import { auth } from '/@/utils/authFunction';

const loading = ref(false);
const visible = ref(false);
const tableData = ref<any>([]);
const siteItemList = ref<any>([])
const stateList = ref<any>([
	{ label: '全部', value: null },
	{ label: '启用', value: true },
	{ label: '关闭', value: false },
]);
const siteList = ref<any>([
	{ label: '全部', value: null },
]);
const platformList = ref<any>([
	{ label: '全部', value: null },
]);
const queryParams = ref<any>({ state: '全部',relatedSite:'全部',addASINAccount:'全部'});
const editDialogRef = ref();
const editCollectionOrderInfoTitle = ref('');
const area = ref('CN');

const tableParams = ref({
	page: 1,
	pageSize: 20,
});

const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list;
	}
};
const TableData = ref<any>([
	{
		titleCN: '上架平台',
		dataIndex: 'addASINAccount',
		titleEN: 'List Platform',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '关联站点',
		dataIndex: 'relatedSite',
		titleEN: 'Related Site',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '备注',
		dataIndex: 'remarks',
		titleEN: 'Remark',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '状态',
		dataIndex: 'state',
		titleEN: 'State',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作时间',
		dataIndex: 'updateTime',
		titleEN: 'operationTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作人',
		dataIndex: 'creator',
		titleEN: 'Creator',
		checked: true,
		fixed: false,
	},
]);

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	if(queryParams.value.state === '全部'){
		queryParams.value.state = null
	}
	if(queryParams.value.relatedSite === '全部'){
		queryParams.value.relatedSite = null
	}
	if(queryParams.value.addASINAccount === '全部'){
		queryParams.value.addASINAccount = null
	}
	var res = await listPlatformManagementPage(Object.assign(tableParams.value, queryParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	if(queryParams.value.state === null){
		queryParams.value.state = '全部'
	}
	if(queryParams.value.relatedSite === null){
		queryParams.value.relatedSite = '全部'
	}
	if(queryParams.value.addASINAccount === null){
		queryParams.value.addASINAccount = '全部'
	}
	loading.value = false;
};

const openAddManagement = () => {
	editCollectionOrderInfoTitle.value = '新增';
	editDialogRef.value.openDialog({state:true});
};
const openEdit = (row: any) => {
	editCollectionOrderInfoTitle.value = '编辑';
	editDialogRef.value.openDialog(row);
};
const deleteItem = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await listPlatformManagementDelete(row);
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

const reset = () => {
	queryParams.value = {}
	tableParams.value = {}
	handleQuery()
}

const getSiteAndListPlatform = async () => {
	await getSitesListPlatform().then(res=>{
		if(res.data.type === 'success'){
			res.data.result.sites?.map(item=>{
				let obj = { label: item, value:item }
				siteList.value.push(obj)
				siteItemList.value.push(obj)
			})
			res.data.result.listngPlatfroms?.map(item=>{
				let obj = { label: item, value:item }
				platformList.value.push(obj)
			})
		}
	})
	
}
onMounted(()=>{
	getSiteAndListPlatform()
})
handleQuery();
</script>

<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="上架平台">
					<el-select v-model="queryParams.addASINAccount" clearable="" placeholder="请选择">
						<el-option v-for="(item, index) in platformList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="关联站点">
					<el-select v-model="queryParams.relatedSite" clearable="" placeholder="请选择">
						<el-option v-for="(item, index) in siteList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>

				<el-form-item label="状态">
					<el-select v-model="queryParams.state" clearable="" placeholder="请选择">
						<el-option v-for="(item, index) in stateList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="reset"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<div style="display: flex; justify-content: space-between">
				<div style="margin-bottom: 20px; display: flex; justify-content: space-between">
					<el-button type="primary" @click="openAddManagement" v-auth="'listPlatform:add'">新增</el-button>
				</div>
				<tabDragColum :data="TableData" :name="`list_platform`" :area="area" @handleData="handleData" />
			</div>

			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column label="序号" align="center" type="index" width="55" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex === 'state' && item.checked"
						:fixed="item.fixed"
						:width="item.width"
						:prop="item.dataIndex"
						show-overflow-tooltip
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
					>
						<template #default="scope">
							<el-switch v-model="scope.row.state" disabled />
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.checked"
						:fixed="item.fixed"
						:width="item.width"
						:prop="item.dataIndex"
						show-overflow-tooltip
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
					/>
				</template>
				<el-table-column label="操作" align="center" fixed="right" width="180" v-if="auth('listPlatform:update') || auth('listPlatform:delete')">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="openEdit(scope.row)" v-auth="'listPlatform:update'"> 编辑 </el-button>
						<el-button size="small" text type="primary" @click="deleteItem(scope.row)" v-auth="'listPlatform:delete'"> 删除 </el-button>
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
		</el-card>
		<editDialog ref="editDialogRef" :title="editCollectionOrderInfoTitle" :siteItemList="siteItemList" @reloadTable="handleQuery()" />
	</div>
</template>

<style lang="less" scoped>
.select {
	width: 100px;

	:deep(.el-input) {
		width: 100%;
	}
}

.radio-group {
	height: 24px;
	margin: 0 10px;

	:deep(.el-radio-button__inner) {
		padding: 4px 13px;
	}
}

:deep(.el-pagination) {
	margin: 22px 0 -10px 0 !important;
}

:deep(.cell) {
	white-space: nowrap;
}

:deep(.el-table td.el-table__cell div) {
	overflow: hidden;
}
</style>
