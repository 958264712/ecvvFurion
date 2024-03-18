<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addUAE_ProcurementDetails, updateUAE_ProcurementDetails } from "/@/api/modular/main/uAE_ProcurementDetails";
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
				await updateUAE_ProcurementDetails(values);
			} else {
				await addUAE_ProcurementDetails(values);
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
<template>
	<div class="uAE_ProcurementDetails-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="索引" prop="index">
							<el-input v-model="ruleForm.index" placeholder="请输入索引" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="序号" prop="number">
							<el-input v-model="ruleForm.number" placeholder="请输入序号" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存SKU" prop="inventorySKU">
							<el-input v-model="ruleForm.inventorySKU" placeholder="请输入库存SKU" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品名称" prop="productName">
							<el-input v-model="ruleForm.productName" placeholder="请输入商品名称" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="供应商货号" prop="supplierItemNumber">
							<el-input v-model="ruleForm.supplierItemNumber" placeholder="请输入供应商货号" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="制单时间" prop="preparationTime">
							<el-date-picker v-model="ruleForm.preparationTime" type="date" placeholder="制单时间" />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="入库单号" prop="warehouseEntryNumber">
							<el-input v-model="ruleForm.warehouseEntryNumber" placeholder="请输入入库单号" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单据状态" prop="documentStatus">
							<el-input v-model="ruleForm.documentStatus" placeholder="请输入单据状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购数量" prop="purchaseQuantity">
							<el-input v-model="ruleForm.purchaseQuantity" placeholder="请输入采购数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="入库数量" prop="receiptQuantity">
							<el-input v-model="ruleForm.receiptQuantity" placeholder="请输入入库数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单价" prop="unitPrice">
							<el-input v-model="ruleForm.unitPrice" placeholder="请输入单价" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="金额" prop="money">
							<el-input v-model="ruleForm.money" placeholder="请输入金额" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="不合格数量" prop="unqualifiedQuantity">
							<el-input v-model="ruleForm.unqualifiedQuantity" placeholder="请输入不合格数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联采购采购单号" prop="associatedPurchaseOrderNumber">
							<el-input v-model="ruleForm.associatedPurchaseOrderNumber" placeholder="请输入关联采购采购单号"
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="制单人" prop="creator">
							<el-input v-model="ruleForm.creator" placeholder="请输入制单人" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="仓库审核人" prop="warehouseReviewer">
							<el-input v-model="ruleForm.warehouseReviewer" placeholder="请输入仓库审核人" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="仓库审核时间" prop="warehouseAuditTime">
							<el-input v-model="ruleForm.warehouseAuditTime" placeholder="请输入仓库审核时间" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="财务审核人" prop="financialReviewer">
							<el-input v-model="ruleForm.financialReviewer" placeholder="请输入财务审核人" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品备注" prop="productRemarks">
							<el-input v-model="ruleForm.productRemarks" placeholder="请输入商品备注" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="供应商" prop="supplier">
							<el-input v-model="ruleForm.supplier" placeholder="请输入供应商" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="含税" prop="includingTax">
							<el-input v-model="ruleForm.includingTax" placeholder="请输入含税" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购日期" prop="purchaseDate">
							<el-input v-model="ruleForm.purchaseDate" placeholder="请输入采购日期" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="天数判定值" prop="daysJudgmentValue">
							<el-input v-model="ruleForm.daysJudgmentValue" placeholder="请输入天数判定值" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="年份" prop="year">
							<el-input v-model="ruleForm.year" placeholder="请输入年份" clearable />

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
