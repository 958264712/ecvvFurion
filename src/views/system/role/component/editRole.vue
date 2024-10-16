<template>
	<div class="sys-role-container">
		<el-dialog v-model="state.isShowDialog" draggable :close-on-click-modal="false" width="700px" style="maxheight: 800px; overflow: hidden">
			<template #header>
				<div style="color: #fff">
					<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="state.ruleForm" ref="ruleFormRef" label-width="auto">
				<el-tabs v-model="state.activeName" class="demo-tabs">
					<el-tab-pane label="角色信息" name="first">
						<el-row :gutter="35">
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]">
									<el-input v-model="state.ruleForm.name" placeholder="角色名称" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="所属组织" prop="orgId" :rules="[{ required: true, message: '所属组织不能为空' }]">
									<el-cascader
										:options="props.orgData"
										:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name', expandTrigger: 'hover' }"
										placeholder="请选择所属组织"
										clearable
										class="w100"
										v-model="state.ruleForm.orgId"
									>
										<template #default="{ node, data }">
											<span>{{ data.name }}</span>
											<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
										</template>
									</el-cascader>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="状态">
									<el-switch v-model="state.ruleForm.status" :active-value="1" :inactive-value="2" />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="备注">
									<el-input v-model="state.ruleForm.remark" placeholder="请输入备注内容" clearable type="textarea" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="菜单权限" name="second">
						选择权限
						<el-checkbox v-model="state.allSelected" @change="toggleAllSelection">全选</el-checkbox>
						<el-tree
							ref="treeRef"
							:data="state.menuData"
							node-key="id"
							show-checkbox
							:props="{ children: 'children', label: 'title', class: treeNodeClass }"
							icon="ele-Menu"
							highlight-current
							default-expand-all
							:default-checked-keys="state.checkedKeys"
							check-on-click-node
							@check-change="handleCheckChange"
						/>
					</el-tab-pane>
					<el-tab-pane label="数据权限" name="third">
						<el-row :gutter="35">
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="组织范围" prop="frontEndDataScope" :rules="[{ required: true, message: '组织范围不能为空' }]">
									<el-select v-model="state.ruleForm.frontEndDataScope" placeholder="请选择组织范围" style="width: 100%">
										<el-option v-for="d in state.dataScopeType" :key="d.value" :label="d.label" :value="d.value" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-show="state.ruleForm.frontEndDataScope === 5">
								<el-form-item label="组织" prop="orgIdList" :rules="[{ required: state.ruleForm.frontEndDataScope === 5 ? true : false, message: '组织不能为空', trigger: 'blur' }]">
									<el-cascader :options="props.orgListData" ref="orgTreeRef" :props="orgProps" placeholder="请选择组织" clearable class="w100" v-model="state.ruleForm.orgIdList">
										<template #default="{ node, data }">
											<span>{{ data.name }}</span>
											<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
										</template>
									</el-cascader>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">{{ state.ruleForm.id != undefined && state.ruleForm.id > 0 ? '保存' : '确 定' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="sysEditRole">
import { onMounted, reactive, ref } from 'vue';
import type { ElTree } from 'element-plus';
import { ElMessage } from 'element-plus';
import { getAPI } from '/@/utils/axios-utils';
import { SysMenuApi, SysRoleApi, SysOrgApi } from '/@/api-services/api';
import { SysMenu, UpdateRoleInput, SysOrg } from '/@/api-services/models';
import OrgTree from '/@/views/system/org/component/orgTree.vue';

const props = defineProps({
	title: String,
	orgData: Array<SysOrg>,
	orgListData: Array<SysOrg>,
});
const orgProps = {  emitPath: false, multiple: true, value: 'id', label: 'name', expandTrigger: 'hover' };
const emits = defineEmits(['handleQuery']);
const orgTreeRef = ref();
const ruleFormRef = ref();
const treeRef = ref<InstanceType<typeof ElTree>>();
const state = reactive({
	loading: false,
	isShowDialog: false,
	allSelected: false,
	checkedKeys: [],
	nodeList: [],
	activeName: 'first',
	dataScopeType: [
		{ value: 1, label: '全部组织' },
		{ value: 2, label: '本组织' },
		{ value: 5, label: '自定义' },
	],
	roleData: [],
	ruleForm: {} as UpdateRoleInput,
	menuData: [] as Array<SysMenu>, // 菜单数据
});
onMounted(async () => {
	state.loading = true;
	var res = await getAPI(SysMenuApi).apiSysMenuListGet();
	state.menuData = res.data.result ?? [];
	state.loading = false;
});

// 打开弹窗
const openDialog = async (row: any) => {
	treeRef.value?.setCheckedKeys([]); // 清空选中值
	state.activeName = 'first';
	state.ruleForm = JSON.parse(JSON.stringify(row));
	if (row.id != undefined) {
		var res = await getAPI(SysRoleApi).apiSysRoleOwnMenuListGet(row.id);
		var result = await getAPI(SysRoleApi).apiSysRoleOwnOrgListGet(row.id);
		setTimeout(() => {
			treeRef.value?.setCheckedKeys(res.data.result ?? []);
			state.ruleForm.orgIdList = result.data.result ?? [];
		}, 100);
	}
	state.isShowDialog = true;
};

const toggleAllSelection = () => {
	if (state.allSelected) {
		// 选中所有节点
		treeRef.value?.setCheckedKeys(state.menuData.flatMap((node) => getAllNodes(node)));
		state.allSelected = true;
	} else {
		// 取消选中所有节点
		state.allSelected = false;
		treeRef.value?.setCheckedKeys([]);
	}
};

const handleCheckChange = (node, checked) => {
	// 更新全选复选框的状态
	if (node.type === 1 && checked && node.pid === 0) {
		state.nodeList.push(node.name);
	} else if (node.type === 1 && !checked && node.pid === 0) {
		state.nodeList = state.nodeList.filter((item) => item !== node.name);
	}
	state.allSelected = state.nodeList.length === state.menuData.length;
};
const getAllNodes = (node) => {
	const nodes = [node.id];
	if (node.children && node.children.length) {
		node.children.forEach((child) => {
			nodes.push(...getAllNodes(child));
		});
	}
	return nodes;
};
// 关闭弹窗
const closeDialog = () => {
	emits('handleQuery');
	state.isShowDialog = false;
};

// 取消
const cancel = () => {
	state.isShowDialog = false;
};

// 提交
const submit = () => {
	ruleFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		state.ruleForm.menuIdList = treeRef.value?.getCheckedKeys() as Array<number>; //.concat(treeRef.value?.getHalfCheckedKeys());
		if (state.ruleForm.frontEndDataScope === 5) {
			state.ruleForm.orgIdList = orgTreeRef.value?.getCheckedNodes()?.map((item) => {
				return item.value;
			});
		}
		if (state.ruleForm.id != undefined && state.ruleForm.id > 0) {
			await getAPI(SysRoleApi).apiSysRoleNewUpdatePost(state.ruleForm);
			// await getAPI(SysRoleApi).apiSysRoleUpdatePost(state.ruleForm);
			ElMessage.success('更新成功');
		} else {
			await getAPI(SysRoleApi).apiSysRoleNewAddPost(state.ruleForm);
			// await getAPI(SysRoleApi).apiSysRoleAddPost(state.ruleForm);
			ElMessage.success('新增成功');
		}
		closeDialog();
	});
};

// 叶子节点同行显示样式
const treeNodeClass = (node: SysMenu) => {
	let addClass = true; // 添加叶子节点同行显示样式
	for (var key in node.children) {
		// 如果存在子节点非叶子节点，不添加样式
		if (node.children[key].children?.length ?? 0 > 0) {
			addClass = false;
			break;
		}
	}
	return addClass ? 'penultimate-node' : '';
};

// 导出对象
defineExpose({ openDialog });
</script>

<style lang="scss" scoped>
.menu-data-tree {
	width: 100%;
	border: 1px solid var(--el-border-color);
	border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
	padding: 5px;
}

:deep(.penultimate-node) {
	.el-tree-node__children {
		padding-left: 40px;
		white-space: pre-wrap;
		line-height: 100%;

		.el-tree-node {
			display: inline-block;
		}

		.el-tree-node__content {
			padding-left: 5px !important;
			padding-right: 5px;

			// .el-tree-node__expand-icon {
			// 	display: none;
			// }
		}
	}
}
</style>
