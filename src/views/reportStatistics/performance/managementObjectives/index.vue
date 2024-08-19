<script lang="ts" setup name="performance_management_objectives">
import { ref, onMounted } from 'vue';
import { targetPage, targetDel } from '/@/api/modular/main/performance.ts';
import { service } from '/@/utils/request';
import { auth } from '/@/utils/authFunction';
import { getAPI } from '/@/utils/axios-utils';
import { SysAuthApi } from '/@/api-services/api';
import { ElMessage } from 'element-plus';
import editDialog from './component/editDialog.vue';
import tabDragColum from '/@/components/tabDragColum/index.vue';

const loading = ref(false);
const visible = ref(false);
const tableData = ref<any>([]);
const yearList = ref<any>([
	{ label: '全部', value: null },
]);
const nameList1 = ref<any>([]);
const yearList1 = ref<any>([]);
const date = new Date();
const year = date.getFullYear();
for (let i = year+5; i >= 2005; i--) {
	yearList.value.push({label: `${i}`, value: `${i}`});
	yearList1.value.push({label: `${i}`, value: `${i}`});
}

const siteList = ref<any>([
	{ label: '全部', value: null },
	{ value: 'UAE', label: 'UAE' },
	{ value: 'SA', label: 'SA' },
]);
const siteList1 = ref<any>([
	{ value: 'UAE', label: 'UAE' },
	{ value: 'SA', label: 'SA' },
]);
const nameList = ref<any>([{ label: '全部', value: null }]);
const queryName = async (id: number) => {
	await service({
		url: '/api/sysUser/page',
		method: 'post',
		data: {
			orgId: id,
			page: 1,
			pageSize: 50,
		},
	}).then((res) => {
		if (res.data.type == 'success') {
			res.data.result.items?.map((item) => {
				nameList.value?.push({ value: item.realName, label: item.realName });
				nameList1.value?.push({ value: item.realName, label: item.realName });
			});
		}
	});
};
const queryParams = ref<any>({ site: null, yearList: null });
const editDialogRef = ref();
const editCollectionOrderInfoTitle = ref('');
const area = ref('CN');

const tableParams = ref({
	page: 1,
	pageSize: 20,
});

const handleAuth = async () => {
	var res = await getAPI(SysAuthApi).apiSysAuthUserInfoGet();
	if (res.data.type === 'success') {
		if (res.data.result.account === 'superadmin') {
			queryName();
			handleQuery();
		} else {
			queryParams.value.nameList=[res.data.result.realName]
			nameList.value = [{ value: res.data.result.realName, label: res.data.result.realName }];
			nameList1.value = [{ value: res.data.result.realName, label: res.data.result.realName }];
			handleQuery();
		}
	}
};
handleAuth();
const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list;
	}
};
const TableData = ref<any>([
	{
		titleCN: '姓名',
		dataIndex: 'name',
		titleEN: 'Name',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '年份',
		dataIndex: 'year',
		titleEN: 'Year',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '站点',
		dataIndex: 'site',
		titleEN: 'Site',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '年度目标值',
		dataIndex: 'targetValue',
		titleEN: 'Target Value',
		width:110,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '01月',
		dataIndex: 'january',
		titleEN: 'january',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '02月',
		dataIndex: 'february',
		titleEN: 'february',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '03月',
		dataIndex: 'march',
		titleEN: 'march',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '04月',
		dataIndex: 'april',
		titleEN: 'april',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '05月',
		dataIndex: 'may',
		titleEN: 'may',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '06月',
		dataIndex: 'june',
		titleEN: 'june',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '07月',
		dataIndex: 'july',
		titleEN: 'july',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '08月',
		dataIndex: 'august',
		titleEN: 'august',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '09月',
		dataIndex: 'september',
		titleEN: 'september',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '10月',
		dataIndex: 'october',
		titleEN: 'october',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '11月',
		dataIndex: 'november',
		titleEN: 'november',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '12月',
		dataIndex: 'december',
		titleEN: 'december',
		checked: true,
		fixed: false,
	},
]);

// 查询操作
const handleQuery = async () => {
	if(queryParams.value.nameList?.length === 0 || queryParams.value.nameList[0] === null){
		queryParams.value.nameList = null
	}
	if(queryParams.value.yearList?.length === 0 || queryParams.value.yearList[0] === null){
		queryParams.value.yearList = null
	}
	loading.value = true;
	var res = await targetPage(Object.assign(tableParams.value, queryParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
	if(queryParams.value.nameList === null){
		queryParams.value.nameList=[null]
	}
	if(queryParams.value.yearList === null){
		queryParams.value.yearList=[null]
	}
};

const openAddManagement = () => {
	editCollectionOrderInfoTitle.value = '新增业绩目标';
	editDialogRef.value.openDialog({});
};
const openEdit = (row: any) => {
	editCollectionOrderInfoTitle.value = '编辑业绩目标';
	editDialogRef.value.openDialog(row);
};
const deletes = (val: any) => {
	visible.value = !visible.value;
	targetDel({ id: val.row.id }).then((data) => {
		if (data.data.type == 'success') {
			ElMessage({
				type: 'success',
				message: '删除成功',
			});
			handleQuery()
		} else {
			ElMessage({
				type: 'info',
				message: '删除失败',
			});
		}
	});
	
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


</script>

<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="queryParams.yearList" clearable="" multiple placeholder="请选择">
						<el-option v-for="(item, index) in yearList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="站点">
					<el-select v-model="queryParams.site" clearable="" placeholder="请选择">
						<el-option v-for="(item, index) in siteList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="姓名">
					<el-select v-model="queryParams.nameList" clearable=""  filterable multiple placeholder="请选择">
						<el-option v-for="(item, index) in nameList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
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
		<el-card class="full-table" shadow="hover">
			<div style="display: flex; justify-content: space-between">
				<div style="margin-bottom: 20px; display: flex; justify-content: space-between">
					<el-button type="primary" @click="openAddManagement" v-if="auth('performance_management_objectives:add')">新增</el-button>
				</div>
				<tabDragColum :data="TableData" :name="`performance_management_objectives`" :area="area" @handleData="handleData" />
			</div>

			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" align="center" width="50" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column v-if="item.dataIndex === 'targetValue'" :fixed="item.fixed"
						:width="item.width"
						:prop="item.dataIndex"
						show-overflow-tooltip
						:label="area == 'CN' ? item.titleCN : item.titleEN" align="center" >
							<template #default="scope">
								{{scope.row.targetValue}}({{scope.row.unit}})
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
				<el-table-column label="操作" align="center" fixed="right" width="180">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="openEdit(scope.row)"> 编辑 </el-button>
						<el-popover placement="top" width="200" :disabled="visible" trigger="click">
							<p>确定删除吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visible = true">取消</el-button>
								<el-button type="primary" size="small" @click="deletes(scope)">确定</el-button>
							</div>
							<template #reference>
								<el-button size="small" :disabled="allCompiles" text type="primary" @click="visible = false"> 删除</el-button>
							</template>
						</el-popover>
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
		<editDialog ref="editDialogRef" :monthList="monthList" :nameList="nameList1" :siteList="siteList1" :yearList="yearList1" :title="editCollectionOrderInfoTitle" @reloadTable="handleQuery()" />
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
