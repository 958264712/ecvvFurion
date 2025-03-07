<template>
	<div class="sys-org-container">
		<el-row :gutter="8" style="width: 100%;height:100%">
			<el-col :span="4" :xs="24">
				<OrgTree ref="orgTreeRef" @node-click="nodeClick" />
			</el-col>
			<el-col :span="20" :xs="24">
				<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
					<el-form :model="state.queryParams" ref="queryForm" :inline="true">
						<el-form-item label="名称">
							<el-input v-model="state.queryParams.name" placeholder="请输入名称" clearable />
						</el-form-item>
						<el-form-item>
							<el-button-group>
								<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'sysOrg:list'"> 查询 </el-button>
								<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
							</el-button-group>
						</el-form-item>
					</el-form>
				</el-card>

				<el-card class="full-table" shadow="hover" style="margin-top: 8px">
					<div style="margin-bottom:10px">
						<el-button type="primary" icon="ele-Plus" @click="openAddOrg" v-auth="'sysOrg:add'"> 新增 </el-button>
					</div>
					<el-table :data="state.orgData" height="670" style="width: 100%;" v-loading="state.loading" row-key="id" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" border>
						<el-table-column prop="name" label="名称" header-align="center" show-overflow-tooltip />
						<el-table-column label="状态" width="70" align="center"  show-overflow-tooltip>
							<template #default="scope">
								<el-switch v-model="scope.row.status"  @change="changeStatus(scope.row)"  :active-value="1" :inactive-value="2" size="small"  />
							</template>
						</el-table-column>
						<el-table-column prop="remark" label="备注" header-align="center" show-overflow-tooltip />
						<el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip />
						<el-table-column prop="updateTime" label="更新时间" align="center" show-overflow-tooltip />
						<el-table-column prop="operatorName" label="操作人" header-align="center" show-overflow-tooltip />
						<el-table-column label="操作" width="140" fixed="right" align="center" show-overflow-tooltip>
							<template #default="scope">
								<el-button icon="ele-Edit" size="small" text type="primary" @click="openEditOrg(scope.row)" v-auth="'sysOrg:update'"> 编辑 </el-button>
								<el-button icon="ele-Delete" size="small" text type="danger" @click="delOrg(scope.row)" v-auth="'sysOrg:delete'"> 删除 </el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>

		<EditOrg ref="editOrgRef" :title="state.editOrgTitle" :orgData="state.orgTreeData" @handleQuery="handleQuery" />
	</div>
</template>

<script lang="ts" setup name="sysOrg">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import OrgTree from '/@/views/system/org/component/orgTree.vue';
import EditOrg from '/@/views/system/org/component/editOrg.vue';

import { getAPI } from '/@/utils/axios-utils';
import { SysOrgApi, SysDictDataApi } from '/@/api-services/api';
import { SysOrg } from '/@/api-services/models';

const editOrgRef = ref<InstanceType<typeof EditOrg>>();
const orgTreeRef = ref<InstanceType<typeof OrgTree>>();
const state = reactive({
	loading: false,
	orgData: [] as Array<SysOrg>, // 机构列表数据
	orgTreeData: [] as Array<SysOrg>, // 机构树所有数据
	queryParams: {
		id: -1,
		name: undefined,
		code: undefined,
		orgType: undefined,
	},
	editOrgTitle: '',
	orgTypeList: [] as any,
});

onMounted(async () => {
	handleQuery();
	let resDicData = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('org_type');
	state.orgTypeList = resDicData.data.result;
});
// 修改状态
const changeStatus = (row: any) => {
	getAPI(SysOrgApi)
		.apiSysOrgSetStatusPost({ id: row.id, status: row.status })
		.then(() => {
			handleQuery()
			ElMessage.success('账号状态设置成功');
			orgTreeRef.value?.initTreeData();
		})
		.catch(() => {
			row.status = row.status == 1 ? 2 : 1;
		});
};
// 查询操作
const handleQuery = async (updateTree: boolean = false) => {
	state.loading = true;
	var res = await getAPI(SysOrgApi).apiSysOrgListGet(state.queryParams.id, state.queryParams.name, state.queryParams.code, state.queryParams.orgType,true);
	var result = await getAPI(SysOrgApi).apiSysOrgListGet(0);
	state.orgData = res.data.result ?? [];
	state.orgTreeData = result.data.result ?? []
	state.loading = false;
	// 是否更新左侧机构列表树
	if (updateTree == true) {
		orgTreeRef.value?.initTreeData();
	}
};

// 重置操作
const resetQuery = () => {
	state.queryParams.id = -1;
	state.queryParams.name = undefined;
	state.queryParams.code = undefined;
	state.queryParams.orgType = undefined;
	handleQuery();
};

// 打开新增页面
const openAddOrg = () => {
	state.editOrgTitle = '新增';
	editOrgRef.value?.openDialog({ status: 1, orderNo: 100 });
};

// 打开编辑页面
const openEditOrg = (row: any) => {
	state.editOrgTitle = '编辑';
	editOrgRef.value?.openDialog(row);
};

// 删除
const delOrg = (row: any) => {
	ElMessageBox.confirm(`确定删除机构：【${row.name}】?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await getAPI(SysOrgApi).apiSysOrgDeletePost({ id: row.id });
			ElMessage.success('删除成功');
			handleQuery(true);
		})
		.catch(() => {});
};

// 树组件点击
const nodeClick = async (node: any) => {
	state.queryParams.id = node.id;
	state.queryParams.name = undefined;
	state.queryParams.code = undefined;
	state.queryParams.orgType = undefined;
	handleQuery();
};

// 字典转换
const dictFormatter = (row: any, column: any, cellValue: any) => {
	return state.orgTypeList.find((u: any) => u.code == cellValue)?.value;
};
</script>
