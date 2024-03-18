<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { addASINBasicData, updateASINBasicData } from '/@/api/modular/main/aSINBasicData';
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

// 规则
const validateASIN = (rule: any, value: any, callback: any) => {
	const reg = /^[A-Za-z0-9]{1,10}$/;
	if (reg.test(ruleForm.value.asin)) {
		if (!ruleFormRef.value) return;
		ruleFormRef.value.validateField('asin', () => null);
	} else {
		ruleForm.value.asin = '';
		ElMessage.error('请输入1-10位数的字母或者数字，并且不包含空格');
	}
	callback();
};
const validateStoreSKU = (rule: any, value: any, callback: any) => {
	const reg = /^\S*$/;
	if (reg.test(ruleForm.value.storeSKU)) {
		if (!ruleFormRef.value) return;
		ruleFormRef.value.validateField('storeSKU', () => null);
	} else {
		ruleForm.value.storeSKU = '';
		ElMessage.error('请输入不包含空格的字母或者数字');
	}
	callback();
};
const valierpSku = (rule: any, value: any, callback: any) => {
	const reg = /^\S{0,13}$/;
	if (reg.test(ruleForm.value.erpSku)) {
		if (!ruleFormRef.value) return;
		ruleFormRef.value.validateField('erpSku', () => null);
	} else {
		ruleForm.value.erpSku = '';
		ElMessage.error('请输入1-13个字母或者数字，并且不包含空格和回车');
	}
	callback();
};
const validateUnit = (rule: any, value: any, callback: any) => {
	const reg = /^[0-9A-Za-z]*$/;
	if (reg.test(ruleForm.value.unit)) {
		if (!ruleFormRef.value) return;
		ruleFormRef.value.validateField('unit', () => null);
	} else {
		ruleForm.value.unit = '';
		ElMessage.error('请输入英文或数字的单位');
	}
	callback();
};

//自行添加其他规则
const rules = ref<FormRules>({
	asin: [{ required: true, message: '请输入0-10位数的字母或者数字，并且不包含空格', trigger: 'blur' }],
	storeSKU: [{ required: true, message: '请输入不包含空格的字母或者数字', trigger: 'blur' }],
	erpSku: [{ required: true, message: '请输入小于等于13个字母或者数字，并且不包含空格和回车', trigger: 'blur' }],
	unit: [{ required: true, message: '请输入英文或数字的单位', trigger: 'blur' }],
});

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
const cancel = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	isShowDialog.value = false;
};

// 提交
const submit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid, fields?: any) => {
		if (valid) {
			let values = ruleForm.value;
			if (ruleForm.value.id != undefined && ruleForm.value.id > 0) {
				updateASINBasicData(values);
				ElMessage.success('修改成功');
			} else {
				addASINBasicData(values);
				ElMessage.success('添加成功');
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


//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>

<template>
	<div class="aSINBasicData-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="1000" draggable="" @close="cancel(ruleFormRef)">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="130px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="ASIN：" prop="asin">
							<el-input v-model="ruleForm.asin" placeholder="请输入ASIN" width="40%" clearable
								@blur="validateASIN" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="StoreSKU：" prop="storeSKU">
							<el-input v-model="ruleForm.storeSKU" placeholder="请输入店铺SKU" clearable
								@blur="validateStoreSKU" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="goodsName：" prop="goodsName">
							<el-input v-model="ruleForm.goodsName" placeholder="请输入对应品名" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="ERP-SKU：" prop="erpSku">
							<el-input v-model="ruleForm.erpSku" placeholder="请输入ERP-SKU" clearable @blur="valierpSku" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="Origin：" prop="origin">
							<el-select v-model="ruleForm.origin" placeholder="请选择" clearable>
								<el-option label="CN" value="CN"></el-option>
								<el-option label="UAE" value="UAE"></el-option>
								<el-option label="SA" value="SA"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="LowestPrice：" prop="costPrice">
							<el-input v-model="ruleForm.costPrice" placeholder="请输入CostPrice" clearable />
						</el-form-item>
					</el-col> -->
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="SaudiBottomPrice_R96EP" prop="saudiBottomPrice_R96EP">
							<el-input v-model="ruleForm.saudiBottomPrice_R96EP" placeholder="请输入SaudiBottomPrice_R96EP" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="SaudiBottomPrice_63FV3" prop="saudiBottomPrice_63FV3">
							<el-input v-model="ruleForm.saudiBottomPrice_63FV3" placeholder="请输入SaudiBottomPrice_63FV3" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="SaudiBottomPrice_YZ6VH" prop="saudiBottomPrice_YZ6VH">
							<el-input v-model="ruleForm.saudiBottomPrice_YZ6VH" placeholder="请输入SaudiBottomPrice_YZ6VH" clearable />
						</el-form-item>
					</el-col> -->
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="Specs Unit" prop="specsUnit">
								<el-input v-model="ruleForm.specsUnit" placeholder="请输入规格" clearable />
							</el-form-item>
						</el-col> -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="SingleOrderQTY：" prop="unit">
							<el-input v-model="ruleForm.unit" placeholder="请输入单位" clearable @blur="validateUnit" />
						</el-form-item>
					</el-col>
				</el-row>
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
