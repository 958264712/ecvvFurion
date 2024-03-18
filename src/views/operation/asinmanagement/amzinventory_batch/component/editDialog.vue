<template>
	<div class="aMZInventory_Batch-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="站点" prop="site">
							<el-select clearable v-model="ruleForm.site" placeholder="请选择站点">
								<el-option v-for="(item, index) in getEditsiteData" :key="index" :value="item.code" :label="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="文件名" prop="fileName">
							<el-input v-model="ruleForm.fileName" placeholder="请输入文件名" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="批次号" prop="batchId">
							<el-input v-model="ruleForm.batchId" placeholder="请输入批次号" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="查询开始时间" prop="queryStartTime">
							<el-input v-model="ruleForm.queryStartTime" placeholder="请输入查询开始时间" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="查询结束时间" prop="queryEndTime">
							<el-input v-model="ruleForm.queryEndTime" placeholder="请输入查询结束时间" clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel" size="default">取 消</el-button>
					<el-button type="primary" @click="submit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { addAMZInventory_Batch, updateAMZInventory_Batch } from '/@/api/operation/aMZInventory_Batch';
import { getDictDataList } from '/@/api/system/admin';
const getEditsiteData = ref<any>([]);
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({});

// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	isShowDialog.value = false;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 提交
const submit = async () => {
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			if (ruleForm.value.id != undefined && ruleForm.value.id > 0) {
				await updateAMZInventory_Batch(values);
			} else {
				await addAMZInventory_Batch(values);
			}
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: 'error',
			});
		}
	});
};

const dictTypeDataList = async (val: any) => {
	let list = await getDictDataList(val);
	return list.data.result ?? [];
};

// 页面加载时
onMounted(async () => {
	getEditsiteData.value = await dictTypeDataList('zhandian');
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
