<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { SKUOperationBatchUpdate } from '/@/api/modular/main/sotckSkuOperations';

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
const ifoutProduct = ref([
	{
		key: 1,
		value: 'Obsolete',
	},
	{
		key: 2,
		value: 'Normal',
	},
]);
//父级传递来的函数，用于回调
const idList = ref<any>([]);
const ruleForm = ref<any>({});
const isShowDialog = ref(false);
const emits = defineEmits(['idList']);
// 打开弹窗
const openDialog = () => {
	isShowDialog.value = true;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 提交
const submit = async () => {
	const list = idList.value.map((item) => {
		let obj;
		return (obj = {
			id: item,
			itemStatus: ruleForm.value.itemStatus,
		});
	});
	var res = await SKUOperationBatchUpdate(list);
	res.data?.type === 'success' ? ElMessage.success('Save Successfully!') : null;
	idList.value = [];
	emits('idList', idList.value);
	isShowDialog.value = false;
};

//将属性或者函数暴露给父组件
defineExpose({ openDialog, idList });
</script>

<template>
	<div class="costpeice_Batch-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form label-width="150" label-position="right" :model="ruleForm" size="default" :rules="rules">
				<div style="width: 100%; height: 35px; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffe0">
					<el-text size="20">选择选项后，该批数据将更新为最新选择的选项</el-text>
				</div>
				<el-form-item
					label="产品是否淘汰"
					prop="site"
					:rules="[
						{
							required: true,
							message: '产品是否淘汰不能为空',
							trigger: 'blur',
						},
					]"
				>
					<el-select clearable="" v-model="ruleForm.itemStatus" placeholder="请选择" style="width: 300px">
						<el-option v-for="(item, index) in ifoutProduct" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
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
