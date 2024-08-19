<template>
	<el-dialog :width="800" v-model="dialogFormVisible" :title="props.title">
		<el-form :model="ruleForm" label-position="left" label-width="110px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="仓库名称" :rules="[{ required: true, message: `仓库名称不能为空`, trigger: 'blur' }]">
						<el-input v-model="ruleForm.warehouse" type="text" style="height: 30px; width: 250px" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="ruleForm.remarks" type="text" style="height: 30px; width: 250px" maxlength="15" show-word-limit placeholder="请输入" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="关联站点" :rules="[{ required: true, message: `关联站点不能为空`, trigger: 'blur' }]">
						<el-select v-model="ruleForm.relatedSite" clearable="" placeholder="请选择">
							<el-option v-for="(item, index) in siteItemList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
					<el-form-item label="状态" :rules="[{ required: true, message: `状态不能为空`, trigger: 'blur' }]">
						<el-switch v-model="ruleForm.state" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<el-button @click="dialogFormVisible = false" size="large">取消</el-button>
			<el-button type="primary" @click="confirm()" size="large"> 确定 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { wareHouseManagementAdd,wareHouseManagementUpdate } from '/@/api/modular/main/basicInfo.ts';

let dialogFormVisible = ref(false);
const props = defineProps(['title','siteItemList']);
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<any>({});


// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	dialogFormVisible.value = true;
};
// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	dialogFormVisible.value = false;
};

const confirm = () => {
	if (ruleForm.value.id != null) {
		wareHouseManagementUpdate(ruleForm.value).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '操作成功',
				});
				closeDialog();
			} else {
				ElMessage({
					type: 'info',
					message: '操作失败',
				});
			}
		});
	} else {
		wareHouseManagementAdd(ruleForm.value).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '添加成功',
				});
				closeDialog();
			} else {
				ElMessage({
					type: 'info',
					message: '添加失败',
				});
			}
		});
	}
};

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style scoped lang="less">
.flex {
	width: 100%;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.select {
	width: 250px;

	:deep(.el-input) {
		height: 30px;
		width: 100%;
	}
}
</style>
