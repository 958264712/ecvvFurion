<template>
	<el-dialog :width="1078" v-model="dialogFormVisible" :title="props.title">
		<el-form :model="ruleForm" label-position="left" label-width="160px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="人员" :rules="[{ required: true, message: `人员不能为空`, trigger: 'blur' }]">
						<el-select v-model="ruleForm.name" clearable="" filterable class="select"  placeholder="请选择">
							<el-option v-for="(item, index) in props.nameList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
					<el-form-item label="站点" :rules="[{ required: true, message: `站点不能为空`, trigger: 'blur' }]">
						<el-select v-model="ruleForm.site" clearable="" class="select" placeholder="请选择">
							<el-option v-for="(item, index) in props.siteList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="年份" :rules="[{ required: true, message: `年份不能为空`, trigger: 'blur' }]">
						<el-select v-model="ruleForm.year" clearable="" class="select"  placeholder="请选择">
							<el-option v-for="(item, index) in props.yearList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</el-form-item>
					<el-form-item label="年度目标值" :rules="[{ required: true, message: `年度目标值不能为空`, trigger: 'blur' }]">
						<el-input v-model="ruleForm.targetValue" type="number" style="height: 30px; width: 300px" placeholder="请输入" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row style="margin-top: 18px">
				<div class="flex">
					<span>月度目标细分</span>
					<el-button type="primary" @click="computedMonth" :disabled="(ruleForm.id != null&&ruleForm.year === toYear.toString())">全年平均到每月</el-button>
				</div>
				<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
					<el-table-column label="月份" align="center"> <template #default="scope">金额</template> </el-table-column>
					<el-table-column prop="january" label="01月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(1)" v-model="ruleForm.january" :value="ruleForm.january" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="february" label="02月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(2)" v-model="ruleForm.february" :value="ruleForm.february" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="march" label="03月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(3)" v-model="ruleForm.march" :value="ruleForm.march" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="april" label="04月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(4)" v-model="ruleForm.april" :value="ruleForm.april" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="may" label="05月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(5)" v-model="ruleForm.may" :value="ruleForm.may" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="june" label="06月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(6)" v-model="ruleForm.june" :value="ruleForm.june" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="july" label="07月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(7)" v-model="ruleForm.july" :value="ruleForm.july" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="august" label="08月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(8)" v-model="ruleForm.august" :value="ruleForm.august" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="september" label="09月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(9)" v-model="ruleForm.september" :value="ruleForm.september" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="october" label="10月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(10)" v-model="ruleForm.october" :value="ruleForm.october" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="november" label="11月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(11)" v-model="ruleForm.november" :value="ruleForm.november" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
					<el-table-column prop="december" label="12月" align="center">
						<template #default="scope">
							<el-input :disabled="isMonthDisabled(12)" v-model="ruleForm.december" :value="ruleForm.december" placeholder="请输入" @input="ifComputed = false"/>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</el-form>
		<template #footer>
			<el-button @click="dialogFormVisible = false" size="large">取消</el-button>
			<el-button type="primary" @click="confirm()" size="large"> 确定 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { targetAdd, targetUpdate } from '/@/api/modular/main/performance.ts';

let dialogFormVisible = ref(false);
const ifComputed = ref(false)
const tableData = ref<any>([{}]);
const props = defineProps(['title', 'nameList', 'siteList', 'yearList', ]);
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<any>({});
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // JavaScript月份从0开始，所以要加1
const toYear = currentDate.getFullYear()

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
		targetUpdate(ruleForm.value).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '操作成功',
				});
				closeDialog();
			} else {
				ElMessage({
					type: 'info',
					message: '操作成功',
				});
			}
		});
	} else {
		targetAdd(ruleForm.value).then((data) => {
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
const isMonthDisabled = (month) => {
	// 判断月份是否小于当前月份
	return ruleForm.value.year === toYear.toString() ? ruleForm.value.id != null && month < currentMonth - 1 : Number(ruleForm.value.year) > toYear ? false : Number(ruleForm.value.year) < toYear ?true :false;
};
const blur = (n1,o1)=>{
	if(!ruleForm.value.targetValue){ruleForm.value.targetValue = 0}
	if(!ifComputed.value){
		if(o1){
			ruleForm.value.targetValue = (Number(ruleForm.value.targetValue) + Number(n1) - Number(o1)).toFixed(2)
		}else{
			ruleForm.value.targetValue = (Number(ruleForm.value.targetValue) + Number(n1)).toFixed(2)
		}
	}
}
const computedMonth = () => {
	ifComputed.value = true
	if (ruleForm.value.targetValue) {
		const val = (ruleForm.value.targetValue / 12).toFixed(2)
		ruleForm.value.january = val
		ruleForm.value.february = val
		ruleForm.value.march = val
		ruleForm.value.april = val
		ruleForm.value.may = val
		ruleForm.value.june = val
		ruleForm.value.july = val
		ruleForm.value.august = val
		ruleForm.value.september = val
		ruleForm.value.october = val
		ruleForm.value.november = val
		ruleForm.value.december = val
	}
};
watch(()=>ruleForm.value.january,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.february,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.march,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.april,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.may,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.june,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.july,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.august,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.september,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.october,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.november,(n1,o1)=>{blur(n1,o1)})
watch(()=>ruleForm.value.december,(n1,o1)=>{blur(n1,o1)})
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
	width: 300px;
	:deep(.el-input) {
		height: 30px;
		width: 100%;
	}
}
</style>
