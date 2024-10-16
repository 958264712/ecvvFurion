<template>
	<div class="sys-org-container">
		<el-dialog v-model="state.isShowDialog" draggable :close-on-click-modal="false" width="700px">
			<template #header>
				<div style="color: #fff">
					<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>
					<span> {{ props.title }} </span>
				</div>
			</template>
			<el-form :model="state.ruleForm" ref="ruleFormRef" label-width="auto">
				<el-row :gutter="35">
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.name" placeholder="请输入" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="state" :rules="[{ required: true, message: '状态不能为空', trigger: 'blur' }]">
							<el-switch v-model="state.ruleForm.state" :active-value="true" :inactive-value="false" size="small" />
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序" prop="sort" :rules="[{ required: true, message: '排序不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.sort" placeholder="请输入" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remarks">
							<el-input v-model="state.ruleForm.remarks" placeholder="请输入(20个字)" clearable type="textarea" :max="20" :maxlength="20"/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">{{state.ruleForm.id != undefined && state.ruleForm.id > 0 ?'保存':'确 定'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup >
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { platformStoreAdd, platformStoreUpdate } from '/@/api/modular/main/platformStoreInfo.ts';

const props = defineProps({
	title: String,
});
const emits = defineEmits(['handleQuery']);
const ruleFormRef = ref();
const state = reactive({
	isShowDialog: false,
	ruleForm: {} as UpdateOrgInput,
});


// 打开弹窗
const openDialog = (row: any) => {
	state.ruleForm = JSON.parse(JSON.stringify(row));
	state.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	emits('handleQuery', true);
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
			await platformStoreUpdate(state.ruleForm);
			ElMessage.success('更新成功')
		} else {
			await platformStoreAdd(state.ruleForm);
			ElMessage.success('新增成功')
		}
		closeDialog();
	});
};

// 导出对象
defineExpose({ openDialog });
</script>
