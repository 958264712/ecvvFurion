<template>
	<div class="sys-user-container">
		<el-dialog v-model="state.isShowDialog" draggable :close-on-click-modal="false" width="700px">
			<template #header>
				<div style="color: #fff">
					<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-tabs v-loading="state.loading" v-model="state.selectedTabName">
				<el-tab-pane label="基础信息">
					<el-form :model="state.ruleForm" ref="ruleFormRef" label-width="auto">
						<el-row :gutter="35">
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="姓名" prop="realName" :rules="[{ required: true, message: '真实不能为空', trigger: 'blur' }]">
									<el-input v-model="state.ruleForm.realName" placeholder="请输入姓名" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="性别">
									<el-radio-group v-model="state.ruleForm.sex">
										<el-radio :label="1">男</el-radio>
										<el-radio :label="2">女</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="账号" prop="account" :rules="[{ required: true, message: '账号不能为空', trigger: 'blur' }]">
									<el-input v-model="state.ruleForm.account" placeholder="请输入账号" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="手机号码" prop="phone" :rules="[{ required: true, message: '手机号码不能为空', trigger: 'blur' }]">
									<el-select v-model="state.ruleForm.phoneCRCode" placeholder="国家" style="width:25%">
										<el-option label="+86   中国" value="+86" />
										<el-option label="+971  阿联酋" value="+971" />
										<el-option label="+20   埃及" value="+20" />
										<el-option label="+1    美国" value="+1" />
									</el-select>
									<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号码" clearable style="width:75%" />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="所属组织" prop="orgId" :rules="[{ required: true, message: '所属组织不能为空', trigger: 'blur' }]">
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
								<el-form-item label="角色" prop="roleIdList" :rules="[{ required: true, message: '角色集合不能为空', trigger: 'blur' }]">
									<el-select v-model="state.ruleForm.roleIdList" multiple value-key="id" clearable placeholder="请输入角色集合" collapse-tags collapse-tags-tooltip class="w100" filterable>
										<el-option v-for="item in state.roleData" :key="item.id" :label="item.name" :value="item.id" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="职位" prop="posId">
									<el-select v-model="state.ruleForm.posId" placeholder="请输入职位" class="w100">
										<el-option v-for="d in state.posData" :key="d.id" :label="d.name" :value="d.id" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="出生日期" prop="birthday">
									<el-date-picker v-model="state.ruleForm.birthday" type="date" placeholder="请输入出生日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="w100" />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="工号">
									<el-input v-model="state.ruleForm.jobNum" placeholder="工号" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="入职日期">
									<el-date-picker v-model="state.ruleForm.joinDate" type="date" placeholder="入职日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="w100" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="档案信息">
					<el-form :model="state.ruleForm" label-width="auto">
						<el-row :gutter="35">
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="证件类型" prop="cardType">
									<el-select v-model="state.ruleForm.cardType" placeholder="请选择证件类型" class="w100">
										<el-option label="身份证" :value="0" />
										<el-option label="护照" :value="1" />
										<el-option label="出生证" :value="2" />
										<el-option label="港澳台通行证" :value="3" />
										<el-option label="外国人居留证" :value="4" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="证件号码">
									<el-input v-model="state.ruleForm.idCardNum" placeholder="请输入证件号码" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="民族">
									<el-input v-model="state.ruleForm.nation" placeholder="请输入民族" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="政治面貌">
									<el-input v-model="state.ruleForm.politicalOutlook" placeholder="请输入政治面貌" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
								<el-form-item label="地址">
									<el-input v-model="state.ruleForm.address" placeholder="请输入地址" clearable type="textarea" />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="毕业学校">
									<el-input v-model="state.ruleForm.college" placeholder="请输入毕业学校" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="文化程度">
									<el-select v-model="state.ruleForm.cultureLevel" placeholder="请选择文化程度" class="w100">
										<el-option label="小学" :value="0" />
										<el-option label="初中" :value="1" />
										<el-option label="高中" :value="2" />
										<el-option label="中专" :value="3" />
										<el-option label="大专" :value="4" />
										<el-option label="本科" :value="5" />
										<el-option label="硕士研究生" :value="6" />
										<el-option label="博士研究生" :value="7" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="紧急联系人">
									<el-input v-model="state.ruleForm.emergencyContact" placeholder="请输入紧急联系人" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="联系人电话">
									<el-input v-model="state.ruleForm.emergencyPhone" placeholder="联系人电话" clearable />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="工作状态">
									<el-select v-model="state.ruleForm.cultureLevel" placeholder="请选择工作状态" class="w100">
										<el-option label="在职(在岗)" :value="0" />
										<el-option label="已退休" :value="1" />
										<el-option label="免职未退休" :value="2" />
										<el-option label="已离职" :value="3" />
										<el-option label="离职(离司)" :value="4" />
										<el-option label="其他" :value="5" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="备注">
									<el-input v-model="state.ruleForm.remark" placeholder="请输入备注" clearable type="textarea" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-tab-pane>
			</el-tabs>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="sysEditUser">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getAPI } from '/@/utils/axios-utils';
import { SysPosApi, SysRoleApi, SysUserApi } from '/@/api-services/api';
import { RoleOutput, SysOrg, SysPos, UpdateUserInput } from '/@/api-services/models';

const props = defineProps({
	title: String,
	orgData: Array<SysOrg>,
});
const emits = defineEmits(['handleQuery']);
const ruleFormRef = ref();
const state = reactive({
	loading: false,
	isShowDialog: false,
	selectedTabName: '0', // 选中的 tab 页
	ruleForm: {} as UpdateUserInput,
	posData: [] as Array<SysPos>, // 职位数据
	roleData: [] as Array<RoleOutput>, // 角色数据
});

onMounted(async () => {
	state.loading = true;
	var res = await getAPI(SysPosApi).apiSysPosListGet();
	state.posData = res.data.result ?? [];
	var res1 = await getAPI(SysRoleApi).apiSysRoleListGet();
	state.roleData = res1.data.result ?? [];
	state.loading = false;
});

// 打开弹窗
const openDialog = async (row: any) => {
	state.selectedTabName = '0'; // 重置为第一个 tab 页
	state.ruleForm = JSON.parse(JSON.stringify(row));
	if (row.id != undefined) {
		var resRole = await getAPI(SysUserApi).apiSysUserOwnRoleListUserIdGet(row.id);
		state.ruleForm.roleIdList = resRole.data.result;
		var resExtOrg = await getAPI(SysUserApi).apiSysUserOwnExtOrgListUserIdGet(row.id);
		state.ruleForm.extOrgIdList = resExtOrg.data.result;
		state.isShowDialog = true;
	} else state.isShowDialog = true;
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
		if (state.ruleForm.id != undefined && state.ruleForm.id > 0) {
			await getAPI(SysUserApi).apiSysUserUpdatePost(state.ruleForm);
			ElMessage.success('更新成功')
		} else {
			await getAPI(SysUserApi).apiSysUserAddPost(state.ruleForm);
			ElMessage.success('新增成功')
		}
		closeDialog();
	});
};

// 增加附属机构行
const addExtOrgRow = () => {
	if (state.ruleForm.extOrgIdList == undefined) state.ruleForm.extOrgIdList = [];
	state.ruleForm.extOrgIdList?.push({});
};

// 删除附属机构行
const deleteExtOrgRow = (k: number) => {
	state.ruleForm.extOrgIdList?.splice(k, 1);
};

// 导出对象
defineExpose({ openDialog });
</script>
