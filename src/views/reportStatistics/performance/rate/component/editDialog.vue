<template>
	<el-dialog :width="800" v-model="dialogFormVisible" :title="props.title">
		<el-form :model="ruleForm" label-position="left" label-width="110px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="原币种" :rules="[{ required: true, message: `人员不能为空`, trigger: 'blur' }]">
						<el-select v-model="ruleForm.originalCurrency" clearable="" class="select"  placeholder="请选择">
							<el-option v-for="(item, index) in props.moneyList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
					<el-form-item label="汇率" :rules="[{ required: true, message: `汇率不能为空`, trigger: 'blur' },{}]">
						<el-input v-model="ruleForm.exchangeRate" type="number" style="height:30px;width:250px" placeholder="请输入汇率" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="兑换币种" :rules="[{ required: true, message: `年份不能为空`, trigger: 'blur' }]">
						<el-select v-model="ruleForm.exchangeCurrency" clearable="" class="select"  placeholder="请选择">
							<el-option v-for="(item, index) in props.moneyList1" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
					<el-form-item label="生效时间" :rules="[{ required: true, message: `年度目标值不能为空`, trigger: 'blur' }]">
						<el-date-picker :clearable="false"  v-model="ruleForm.takeEffectTime" type="month" style="height:30px;width:250px" placeholder="请选择月份"  />
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
import moment from 'moment';
import { ElMessage } from 'element-plus';
import { rateUpdate,rateAdd } from '/@/api/modular/main/performance.ts';

let dialogFormVisible = ref(false);
const tableData = ref<any>([{}]);
const props = defineProps(['title','moneyList1','moneyList'])
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<any>({});
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // JavaScript月份从0开始，所以要加1

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
const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};
const confirm = () => {
	ruleForm.value.operationTime = moment(ruleForm.value.operationTime).format('YYYY-MM-DD')
	ruleForm.value.takeEffectTime = moment(ruleForm.value.takeEffectTime).format('YYYY-MM-DD')
	if (ruleForm.value.id != null) {
		rateUpdate(ruleForm.value).then((data) => {
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
		rateAdd(ruleForm.value).then((data) => {
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
}
const isMonthDisabled = (month) => {
      // 判断月份是否小于当前月份
      return ruleForm.value.id != null && month < currentMonth - 1;
}
const computedMonth = () => {};
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
		height:30px;
		width: 100%;
	}
}
</style>
