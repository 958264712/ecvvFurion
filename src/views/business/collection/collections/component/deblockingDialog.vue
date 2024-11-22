<template>
	<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
		<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="0px" :rules="rules">
			<el-form-item label="" prop="notes">
				<el-text tag="b" size="large">解锁原因</el-text>
				<el-input v-model="ruleForm.notes" placeholder="请输入解锁原因" clearable type="textarea" />
			</el-form-item>
		</el-form>
		<div class="dialog-footer">
			<el-button type="primary" @click="submit" size="default">确定解锁</el-button>
			<el-button @click="cancel" size="default">取 消</el-button>
		</div>
		<div>
			<el-text tag="b" size="large">解锁原因</el-text>
			<el-table :data="ruleFormData.data" stripe tooltip-effect="light" row-key="id" border style="margin-top: 10px">
				<el-table-column label="序号" type="index" align="center" />
				<el-table-column label="解锁时间" prop="createTime" align="center" width="130" />
				<el-table-column label="备注" prop="notes" align="center" show-overflow-tooltip />
				<el-table-column label="操作员" prop="creator" align="center" show-overflow-tooltip />
				<el-table-column label="操作"  align="center">
					<template #default="scope">
						<el-button type="primary" size="default" link @click="exportHistoryCustoms(scope.row)">导出原报关件</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import other from '/@/utils/other';
import { downHistoryCustoms, getOriginalCustoms,unlockCusRecord } from '/@/api/main/collectionOrderInfo';
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
const ruleFormData = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	notes: [{ required: true, message: '请输入解锁原因', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	ruleFormData.value = JSON.parse(JSON.stringify(row));
	getOriginalCustoms({documentNo:ruleFormData.value.documentNo},ruleFormData.value.documentNo).then((res: any) => { 
		ruleFormData.value.data = res.data.result;
	})
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	isShowDialog.value = false;
};

// 取消
const cancel = () => {
	ruleForm.value = {};
};

// 提交
const submit = async () => {
	ruleFormRef.value.validate((valid: any) => {
		if (!valid) return;	
		unlockCusRecord({documentNo:ruleFormData.value.documentNo,notes:ruleForm.value.notes},ruleFormData.value.documentNo,ruleForm.value.notes).then((res:any)=>{
			if (res.data.code == 200) {
				ElMessage.success('解锁成功');
				ruleForm.value = {};
				closeDialog();
			}
		});
	});
};
const exportHistoryCustoms = async (row: any) => {
	await downHistoryCustoms({ id: row.id }, row.id).then((res: any) => {
		other.downloadfile(res);
		ElMessage.success('导出成功');
	});
};
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style lang="scss" scoped>
:deep(.el-textarea__inner) {
	height: 100px !important;
}
.dialog-footer {
	margin: 15px 0;
}
</style>
