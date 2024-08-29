<template>
	<div class="tableImport-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="800" @close="closeDialog(ruleFormRef)" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="表格名称：" prop="tableName" :rules="{
							required: true,
							message: '请输入表格名称',
							trigger: 'blur',
						}">
							<el-input v-model="ruleForm.tableName" placeholder="请输入表格名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="表格模板：" prop="tableAddress">
							<el-upload v-model:file-list="fileList" class="upload-demo"
								:http-request="uploadTableAddressHandle" multiple :on-preview="handlePreview"
								:on-remove="handleRemove" :before-remove="beforeRemove" :limit="1"
								:on-exceed="handleExceed">
								<el-button type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="表格模板：" prop="tableAddress" :rules="{
							required: true,
							message: '请上传表格模板',
							trigger: 'blur',
						}">
							<el-upload v-model:file-list="fileList" class="upload-demo"
								:http-request="uploadTableAddressHandle" multiple :on-preview="handlePreview"
								:on-remove="handleRemove" :before-remove="beforeRemove" :limit="1"
								:on-exceed="handleExceed">
								<el-button type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="表格模板说明：" prop="tableAddress">
							<el-upload v-model:file-list="fileList2" class="upload-demo"
								:http-request="uploadtableDescriptionAddressHandle" multiple :on-preview="handlePreview"
								:on-remove="DescriptionhandleRemove" :before-remove="beforeRemove" :limit="1"
								:on-exceed="handleExceed">
								<el-button type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row> -->
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel(ruleFormRef)" size="default">取 消</el-button>
					<el-button type="primary" @click="submit(ruleFormRef)" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormRules, UploadProps, UploadUserFile, FormInstance } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { UploadRequestOptions, ElMessageBox } from 'element-plus';
import { uploadTableAddress } from '/@/api/main/tableImport';
import { addTableImport, updateTableImport } from '/@/api/main/tableImport';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({});
const fileList = ref<UploadUserFile[]>([]);
const fileList2 = ref<UploadUserFile[]>([]);
// 打开弹窗
const openDialog = (row: any) => {
	if (isEmptyObject(row)) {
		fileList.value = [];
		fileList2.value = [];
		ruleForm.value = {};
	} else {
		ruleForm.value = JSON.parse(JSON.stringify(row));
		if (row.tableAddress != null) {
			fileList.value = [{ name: cutString(row.tableAddress, 44, row.tableAddress.length - 44), url: row.tableAddress }];
		}
		if (row.tableDescriptionAddress) {
			fileList2.value = [{ name: cutString(row.tableDescriptionAddress, 44, row.tableDescriptionAddress.length - 44), url: row.tableDescriptionAddress }];
		}
	}
	isShowDialog.value = true;
};

//剪切字符串，去除表格模板链接前部分
const cutString = (str: String, start: number, length: number) => {
	return str.substring(start, start + length);
};

// 关闭弹窗
const closeDialog = (ruleFormRef: FormInstance | undefined) => {
	if (!ruleFormRef) return;
	ruleFormRef.resetFields();
	emit('reloadTable');
	isShowDialog.value = false;
};

// 取消
const cancel = (ruleFormRef: FormInstance | undefined) => {
	if (!ruleFormRef) return;
	ruleFormRef.resetFields();
	isShowDialog.value = false;
};

// 提交
const submit = async (ruleFormRef: FormInstance | undefined) => {
	if (!ruleFormRef) return;
	ruleFormRef.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			if (ruleForm.value.id != undefined && ruleForm.value.id > 0) {
				await updateTableImport(values);
			} else {
				await addTableImport(values);
			}
			closeDialog(ruleFormRef);
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	ruleForm.value.tableAddress = '';
};
const DescriptionhandleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	ruleForm.value.tableDescriptionAddress = '';
	// console.log(ruleForm.value);
};
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
	console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`只能上传一个文件，请删除当前文件后再次上传新的文件`);
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
	return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
		() => true,
		() => false
	);
};

const isEmptyObject = (obj: any) => {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
};

const uploadTableAddressHandle = async (options: UploadRequestOptions) => {
	const res = await uploadTableAddress(options);
	ruleForm.value.tableAddress = res.data.result?.url;
};
const uploadtableDescriptionAddressHandle = async (options: UploadRequestOptions) => {
	const res = await uploadTableAddress(options);
	ruleForm.value.tableDescriptionAddress = res.data.result?.url;
};
// 页面加载时
onMounted(async () => { });

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
