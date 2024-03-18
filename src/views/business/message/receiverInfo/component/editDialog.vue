<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addReceiverInfo, updateReceiverInfo, GetDingDingID } from '/@/api/modular/main/messageConfig';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
});

// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	emit("reloadTable");
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
				await updateReceiverInfo(values);
			} else {
				await addReceiverInfo(values);
			}
			closeDialog();
		} else {
			ElMessage({
				message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
				type: "error",
			});
		}
	});
};

const confirmLoading = ref(false)
// 根据手机号获取数据
const GetDdIds = () => {
	confirmLoading.value = true
	GetDingDingID({phone:ruleForm.value.phone}).then((res) => {
		if (res.data.type === 'success') {
			if (res.data.result) {
				ruleForm.value.dingDingID = res.data.result
				ElMessage.success('获取成功')
			} else {
				ElMessage.success('请确认手机号是否正确')
			}
			confirmLoading.value = false
		} else {
			ElMessage.error('获取失败：' + JSON.stringify(res.message))
		}
	}).finally((res) => {
		confirmLoading.value = false
	})
}


// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<template>
	<div class="receiverInfo-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="UserName" prop="userName">
							<el-input v-model="ruleForm.userName" placeholder="请输入UserName" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="Phone" prop="phone">
							<el-input v-model="ruleForm.phone" placeholder="请输入Phone" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="DingDingID" prop="dingDingID">
							<el-input v-model="ruleForm.dingDingID" placeholder="请输入DingDingID" clearable />
							<el-button type="primary" @click="GetDdIds">根据手机号获取</el-button>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="Email" prop="email">
							<el-input v-model="ruleForm.email" placeholder="请输入Email" clearable />
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






