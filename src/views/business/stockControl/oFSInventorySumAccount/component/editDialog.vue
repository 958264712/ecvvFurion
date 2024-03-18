<template>
	<div class="oFSInventorySumAccount-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="仓库名称" prop="warehouseName">
							<el-input v-model="ruleForm.warehouseName" placeholder="请输入仓库名称" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存SKU" prop="inventorySku">
							<el-input v-model="ruleForm.inventorySku" placeholder="请输入库存SKU" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品名称" prop="productName">
							<el-input v-model="ruleForm.productName" placeholder="请输入商品名称" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="款式1" prop="style1">
							<el-input v-model="ruleForm.style1" placeholder="请输入款式1" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="款式2" prop="style2">
							<el-input v-model="ruleForm.style2" placeholder="请输入款式2" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="款式3" prop="style3">
							<el-input v-model="ruleForm.style3" placeholder="请输入款式3" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购员" prop="buyer">
							<el-input v-model="ruleForm.buyer" placeholder="请输入采购员" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品信息成本价" prop="commodityInformationCostPrice">
							<el-input v-model="ruleForm.commodityInformationCostPrice" placeholder="请输入商品信息成本价" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数量-期初" prop="num1">
							<el-input v-model="ruleForm.num1" placeholder="请输入数量-期初" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="金额-期初" prop="amount1">
							<el-input v-model="ruleForm.amount1" placeholder="请输入金额-期初" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数量-本期入库" prop="num2">
							<el-input v-model="ruleForm.num2" placeholder="请输入数量-本期入库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="金额-本期入库" prop="amount2">
							<el-input v-model="ruleForm.amount2" placeholder="请输入金额-本期入库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数量-本期出库" prop="num3">
							<el-input v-model="ruleForm.num3" placeholder="请输入数量-本期出库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="金额-本期出库" prop="amount3">
							<el-input v-model="ruleForm.amount3" placeholder="请输入金额-本期出库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数量-期末" prop="num4">
							<el-input v-model="ruleForm.num4" placeholder="请输入数量-期末" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="平均单价-期末" prop="averageUnitPrice">
							<el-input v-model="ruleForm.averageUnitPrice" placeholder="请输入平均单价-期末" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="金额-期末" prop="amount4">
							<el-input v-model="ruleForm.amount4" placeholder="请输入金额-期末" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="周期" prop="days">
							<el-input-number v-model="ruleForm.days" placeholder="请输入周期" clearable />

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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addOFSInventorySumAccount, updateOFSInventorySumAccount } from "/@/api/modular/main/oFSInventorySumAccount";
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
				await updateOFSInventorySumAccount(values);
			} else {
				await addOFSInventorySumAccount(values);
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





// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>




