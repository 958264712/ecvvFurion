<template>
	<div class="sys-user-container">
		<el-row :gutter="8" style="width: 100%">
			<el-col :span="4" :xs="24">
				<OrgTree ref="orgTreeRef" @node-click="nodeClick" />
			</el-col>

			<el-col :span="20" :xs="24">
				<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
					<el-form :model="state.queryParams" ref="queryForm" :inline="true">
						<el-form-item label="账号">
							<el-input v-model="state.queryParams.account" placeholder="请输入账号" clearable />
						</el-form-item>
						<el-form-item label="姓名">
							<el-input v-model="state.queryParams.realName" placeholder="请输入姓名" clearable  />
						</el-form-item>
						<!-- <el-form-item label="手机号码">
							<el-input v-model="state.queryParams.phone" placeholder="手机号码" clearable />
						</el-form-item> -->
						<el-form-item label="创建时间">
							<el-date-picker start-placeholder="开始时间" end-placeholder="结束时间" type="daterange" v-model="state.queryParams.createTime" />
						</el-form-item>
						<el-form-item label="状态">
							<el-select v-model="state.queryParams.status" clearable="" placeholder="请选择" @change="getAppPage">
								<el-option label="全部" :value=null />
								<el-option label="启用" :value=1 />
								<el-option label="关闭" :value=2 />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button-group>
								<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'sysUser:page'"> 查询 </el-button>
								<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
							</el-button-group>
						</el-form-item>
					</el-form>
				</el-card>

				<el-card class="full-table" shadow="hover" style="margin-top: 8px">
					<div style="margin-bottom:10px">
						<el-button type="primary" icon="ele-Plus" @click="openAddUser" v-auth="'sysUser:add'"> 新增 </el-button>
					</div>
					<el-table :data="state.userData" height="600" style="width: 100%" v-loading="state.loading" border>
						<el-table-column type="index" label="序号" width="55" align="center" fixed />
						<el-table-column prop="realName" label="姓名" width="120" align="center" show-overflow-tooltip />
						<el-table-column prop="orgName" label="所属组织" width="120" align="center" show-overflow-tooltip />
						<el-table-column prop="departmentName" label="部门" width="120" align="center"  show-overflow-tooltip />
						<el-table-column prop="account" label="账号" width="120" align="center"  show-overflow-tooltip />
						<el-table-column label="性别" width="70" align="center" show-overflow-tooltip>
							<template #default="scope">
								<el-tag type="success" v-if="scope.row.sex === 1"> 男 </el-tag>
								<el-tag type="danger" v-else> 女 </el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="phone" label="手机号" width="120" align="center" show-overflow-tooltip />
						<el-table-column label="状态" width="70" align="center" show-overflow-tooltip>
							<template #default="scope">
								<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" size="small" @change="changeStatus(scope.row)" v-auth="'sysUser:setStatus'" />
							</template>
						</el-table-column>
						<el-table-column prop="remark" label="备注" header-align="center" show-overflow-tooltip />
						<el-table-column prop="createTime" label="创建时间" width="160" align="center" show-overflow-tooltip />
						<el-table-column prop="updateTime" label="更新时间" width="160" align="center" show-overflow-tooltip />
						<el-table-column prop="operatorName" label="操作人" width="120" align="center" show-overflow-tooltip />
						<el-table-column label="操作" width="200" align="center" fixed="right" show-overflow-tooltip>
							<template #default="scope">
								<el-button size="small" text type="primary" @click="openEditUser(scope.row)" v-auth="'sysUser:update'"> 编辑 </el-button>
								<el-button  size="small" text type="primary" @click="resetUserPwd(scope.row)" v-auth="'sysUser:resetPwd'"> 重置密码 </el-button>
								<el-button  size="small" text type="primary" @click="delUser(scope.row)" v-auth="'sysUser:delete'"> 删除账号 </el-button>
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

		<EditUser ref="editUserRef" :title="state.editUserTitle" :orgData="state.orgTreeData" @handleQuery="handleQuery" />
	</div>
</template>

<script lang="ts" setup name="sysUser">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { formatDate } from '/@/utils/formatTime';
import { auth } from '/@/utils/authFunction';
import OrgTree from '/@/views/system/org/component/orgTree.vue';
import EditUser from '/@/views/system/user/component/editUser.vue';
import moment from 'moment';

import { getAPI } from '/@/utils/axios-utils';
import { SysUserApi, SysOrgApi } from '/@/api-services/api';
import { SysUser, SysOrg } from '/@/api-services/models';

const orgTreeRef = ref<InstanceType<typeof OrgTree>>();
const editUserRef = ref<InstanceType<typeof EditUser>>();
const state = reactive({
	loading: false,
	userData: [] as Array<SysUser>,
	orgTreeData: [] as Array<SysOrg>,
	queryParams: {
		orgId: -1,
		account: undefined,
		phone: undefined,
	},
	tableParams: {
		page: 1,
		pageSize: 20,
		total: 0 as any,
	},
	editUserTitle: '',
});

onMounted(async () => {
	loadOrgData();
	handleQuery();
});

// 查询机构数据
const loadOrgData = async () => {
	state.loading = true; 
	var res = await getAPI(SysOrgApi).getListByUserDropDownBox(); //接口未提交暂时使用
	// var res = await getAPI(SysOrgApi).apiSysOrgListGet(0);
	state.orgTreeData = res.data.result ?? [];
	state.loading = false;
};

// 查询操作
const handleQuery = async () => {
	state.loading = true;
	if(state.queryParams.status === '全部'){
		state.queryParams.status = null
	}
	state.queryParams.startTime = state.queryParams.createTime?.length ? moment(state.queryParams.createTime[0]).format('YYYY-MM-DD') : '';
	state.queryParams.endTime = state.queryParams.createTime?.length ? moment(state.queryParams.createTime[1]).format('YYYY-MM-DD') : '';
	let params = Object.assign(state.queryParams, state.tableParams);
	var res = await getAPI(SysUserApi).apiSysUserPagePost(params);
	state.userData = res.data.result?.items ?? [];
	state.tableParams.total = res.data.result?.total;
	if(state.queryParams.status === null){
		state.queryParams.status = '全部'
	}
	state.loading = false;
};

// 重置操作
const resetQuery = () => {
	state.queryParams.orgId = -1;
	state.queryParams.account = undefined;
	state.queryParams.status = undefined;
	state.queryParams.createTime = undefined;
	state.queryParams.phone = undefined;
	state.queryParams.realName = undefined;
	handleQuery();
};

// 打开新增页面
const openAddUser = () => {
	state.editUserTitle = '新增';
	editUserRef.value?.openDialog({ id: undefined,  });
};

// 打开编辑页面
const openEditUser = (row: any) => {
	state.editUserTitle = '编辑';
	editUserRef.value?.openDialog(row);
};

// 删除
const delUser = (row: any) => {
	ElMessageBox.confirm(`确定删除账号：【${row.account}】?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await getAPI(SysUserApi).apiSysUserDeletePost({ id: row.id });
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
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

// 修改状态
const changeStatus = (row: any) => {
	getAPI(SysUserApi)
		.apiSysUserSetStatusPost({ id: row.id, status: row.status })
		.then(() => {
			ElMessage.success('账号状态设置成功');
		})
		.catch(() => {
			row.status = row.status == 1 ? 2 : 1;
		});
};

// 重置密码
const resetUserPwd = async (row: any) => {
	ElMessageBox.confirm(`确定重置密码：【${row.account}】?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await getAPI(SysUserApi).apiSysUserResetPwdPost({ id: row.id });
			ElMessage.success('密码重置成功：123456');
		})
		.catch(() => {});
};

// 树组件点击
const nodeClick = async (node: any) => {
	state.queryParams.orgId = node.id;
	state.queryParams.account = undefined;
	state.queryParams.realName = undefined;
	state.queryParams.phone = undefined;
	handleQuery();
};
</script>
