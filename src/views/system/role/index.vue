<template>
	<div class="sys-role-container">
		<el-row :gutter="8" style="width: 100%">
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
								<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'sysRole:page'"> 查询 </el-button>
								<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
							</el-button-group>
						</el-form-item>
					</el-form>
				</el-card>

				<el-card class="full-table" shadow="hover" style="margin-top: 8px">
					<div style="margin-bottom: 10px">
						<el-button type="primary" icon="ele-Plus" @click="openAddRole" v-auth="'sysRole:add'"> 新增 </el-button>
					</div>
					<el-table :data="state.roleData" height="650" style="width: 100%" v-loading="state.loading" border>
						<el-table-column type="index" label="序号" width="55" align="center" fixed />
						<el-table-column prop="name" label="角色名称" align="center" show-overflow-tooltip />
						<el-table-column prop="orgName" label="所属组织" align="center" show-overflow-tooltip />
						<el-table-column label="状态" width="70" align="center" show-overflow-tooltip>
							<template #default="scope">
								<el-switch v-model="scope.row.status" disabled :active-value="1" :inactive-value="2" size="small" />
							</template>
						</el-table-column>
						<el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
						<el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip />
						<el-table-column prop="updateTime" label="更新时间" align="center" show-overflow-tooltip />
						<el-table-column prop="operatorName" label="操作人" align="center" show-overflow-tooltip />
						<el-table-column label="授权账号" width="100" fixed="right" align="center" show-overflow-tooltip>
							<template #default="scope">
								<el-button size="small" text type="primary" @click="checkRole(scope.row)"> 查看 </el-button>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="150" fixed="right" align="center" show-overflow-tooltip>
							<template #default="scope">
								<el-button size="small" text type="primary" @click="openEditRole(scope.row)" v-auth="'sysRole:update'"> 编辑 </el-button>
								<el-button size="small" text type="primary" @click="delRole(scope.row)" v-auth="'sysRole:delete'"> 删除 </el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						v-model:currentPage="state.tableParams.page"
						v-model:page-size="state.tableParams.pageSize"
						:total="state.tableParams.total"
						:page-sizes="[10, 20, 50, 100]"
						small
						background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						layout="total, sizes, prev, pager, next, jumper"
					/>
				</el-card>
			</el-col>
		</el-row>
		<EditRole ref="editRoleRef" :title="state.editRoleTitle" :orgData="state.orgTreeData" :orgListData="state.orgTreeListData" @handleQuery="handleQuery" />
		<el-dialog v-model="state.visible" title="授权账号" @close="close" width="1000px">
			<el-table :data="state.dataList" style="width: 100%" border>
				<el-table-column type="index" label="序号" width="55" align="center" fixed />
				<el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip />
				<el-table-column prop="orgName" label="所属组织" align="center" show-overflow-tooltip />
				<el-table-column prop="departmentName" label="部门" align="center" show-overflow-tooltip />
				<el-table-column prop="accountNumber" label="账号" align="center" show-overflow-tooltip />
				<el-table-column prop="sex" label="性别" align="center" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.sex === 1 ? '男' : '女' }}
					</template>
				</el-table-column>
				<el-table-column prop="authorizationDate" label="授权时间" align="center" show-overflow-tooltip />
				<el-table-column prop="operatorName" label="操作人" align="center" show-overflow-tooltip />
			</el-table>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="sysRole">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
import EditRole from '/@/views/system/role/component/editRole.vue';
// import GrantData from '/@/views/system/role/component/grantData.vue';
import OrgTree from '/@/views/system/role/component/orgTree.vue';
// import OrgTree from '/@/views/system/org/component/orgTree.vue';
import InfoDataDialog from '/@/components/infoDataDialog/index.vue';

import { getAPI } from '/@/utils/axios-utils';
import { SysRoleApi, SysOrgApi } from '/@/api-services/api';
import { SysRole, SysOrg } from '/@/api-services/models';

const orgTreeRef = ref<InstanceType<typeof OrgTree>>();
const editRoleRef = ref<InstanceType<typeof EditRole>>();
const grantDataRef = ref<InstanceType<typeof GrantData>>();
const state = reactive({
	loading: false,
	roleData: [] as Array<SysRole>,
	orgTreeData: [] as Array<SysOrg>,
	orgTreeListData: [] as Array<SysOrg>,
	queryParams: {
		name: undefined,
		code: undefined,
		orgId: -1,
		account: undefined,
		realName: undefined,
		phone: undefined,
	},
	tableParams: {
		page: 1,
		pageSize: 20,
		total: 0 as any,
	},
	editRoleTitle: '',
	dataList: [] as any,
	visible: false,
});

onMounted(async () => {
	loadOrgData();
	handleQuery();
});

// 查询操作
const handleQuery = async () => {
	state.loading = true;
	let params = Object.assign(state.queryParams, state.tableParams);
	var res = await getAPI(SysRoleApi).apiSysRolePagePost(params);
	state.roleData = res.data.result?.items ?? [];
	state.tableParams.total = res.data.result?.total;
	state.loading = false;
};

// 重置操作
const resetQuery = () => {
	state.queryParams.name = undefined;
	state.queryParams.code = undefined;
	handleQuery();
};

// 打开新增页面
const openAddRole = () => {
	state.editRoleTitle = '新增';
	editRoleRef.value?.openDialog({ id: undefined, status: 1, orderNo: 100 });
};

// 打开编辑页面
const openEditRole = async (row: any) => {
	state.editRoleTitle = '编辑';
	editRoleRef.value?.openDialog(row);
};

// 打开授权人员页面
const checkRole = (row) => {
	state.visible = true;
	state.dataList = row?.authorizationInfoList ?? [];
};

// 打开授权数据范围页面
// const openGrantData = (row: any) => {
// 	grantDataRef.value?.openDialog(row);
// };

// 查询机构数据
const loadOrgData = async () => {
	state.loading = true;
	var res = await getAPI(SysOrgApi).apiSysOrgListGet(0);
	var result = await getAPI(SysOrgApi).getListByRoleDropDownBox();
	state.orgTreeListData = res.data.result ?? [];
	state.orgTreeData = result.data.result ?? []; //接口未提交暂时使用
	// state.orgTreeData = res.data.result ?? [];
	state.loading = false;
};

// 树组件点击
const nodeClick = async (node: any) => {
	state.queryParams.orgId = node.id;
	state.queryParams.name = undefined;
	state.queryParams.code = undefined;
	state.queryParams.orgType = undefined;
	handleQuery();
};

// 删除
const delRole = (row: any) => {
	ElMessageBox.confirm(`确定删角色：【${row.name}】?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await getAPI(SysRoleApi).apiSysRoleDeletePost({ id: row.id });
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

//关闭弹窗
const close = () => {
	state.visible = false;
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	state.tableParams.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	state.tableParams.page = val;
	handleQuery();
};
</script>
