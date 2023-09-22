<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addOFSPurchaseOrder, updateOFSPurchaseOrder } from "/@/api/modular/main/oFSPurchaseOrder";
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
				await updateOFSPurchaseOrder(values);
			} else {
				await addOFSPurchaseOrder(values);
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
	<div class="oFSPurchaseOrder-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="下单日期" prop="dateOfOrderIssued">
							<el-input v-model="ruleForm.dateOfOrderIssued" placeholder="请输入下单日期" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="交货日期" prop="dateOfDelivery">
							<el-input v-model="ruleForm.dateOfDelivery" placeholder="请输入交货日期" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="供应商" prop="supplier">
							<el-input v-model="ruleForm.supplier" placeholder="请输入供应商" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购员" prop="buyer">
							<el-input v-model="ruleForm.buyer" placeholder="请输入采购员" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核状态" prop="auditStatus">
							<el-input v-model="ruleForm.auditStatus" placeholder="请输入审核状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="执行状态" prop="executionStatus">
							<el-input v-model="ruleForm.executionStatus" placeholder="请输入执行状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关闭状态" prop="offStatus">
							<el-input v-model="ruleForm.offStatus" placeholder="请输入关闭状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="付款状态" prop="paymentStatus">
							<el-input v-model="ruleForm.paymentStatus" placeholder="请输入付款状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="成交金额" prop="transactionAmount">
							<el-input v-model="ruleForm.transactionAmount" placeholder="请输入成交金额" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="已付款金额" prop="amountPaid">
							<el-input v-model="ruleForm.amountPaid" placeholder="请输入已付款金额" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="本次订金" prop="thisDeposit">
							<el-input v-model="ruleForm.thisDeposit" placeholder="请输入本次订金" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="累计预付" prop="cumulativePrepayment">
							<el-input v-model="ruleForm.cumulativePrepayment" placeholder="请输入累计预付" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="仓位" prop="warehousePosition">
							<el-input v-model="ruleForm.warehousePosition" placeholder="请输入仓位" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="行执行状态" prop="lineExecutionStatus">
							<el-input v-model="ruleForm.lineExecutionStatus" placeholder="请输入行执行状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="行入库状态" prop="lineStorageStatus">
							<el-input v-model="ruleForm.lineStorageStatus" placeholder="请输入行入库状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="行关闭状态" prop="rowClosedStatus">
							<el-input v-model="ruleForm.rowClosedStatus" placeholder="请输入行关闭状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品图片" prop="commodityPicture">
							<el-input v-model="ruleForm.commodityPicture" placeholder="请输入商品图片" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品编码" prop="commodityCode">
							<el-input v-model="ruleForm.commodityCode" placeholder="请输入商品编码" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品名称" prop="productName">
							<el-input v-model="ruleForm.productName" placeholder="请输入商品名称" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="仓库" prop="warehouse">
							<el-input v-model="ruleForm.warehouse" placeholder="请输入仓库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单位" prop="unit">
							<el-input v-model="ruleForm.unit" placeholder="请输入单位" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数量" prop="quantity">
							<el-input-number v-model="ruleForm.quantity" placeholder="请输入数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单价" prop="unitPrice">
							<el-input v-model="ruleForm.unitPrice" placeholder="请输入单价" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="含税单价" prop="unitPriceIncludingTax">
							<el-input v-model="ruleForm.unitPriceIncludingTax" placeholder="请输入含税单价" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="税额" prop="taxAmount">
							<el-input v-model="ruleForm.taxAmount" placeholder="请输入税额" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="价税合计" prop="totalPriceAndTax">
							<el-input v-model="ruleForm.totalPriceAndTax" placeholder="请输入价税合计" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="预计采购费用明细" prop="detailsOfEstimatedPurchaseCosts">
							<el-input v-model="ruleForm.detailsOfEstimatedPurchaseCosts" placeholder="请输入预计采购费用明细"
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规格" prop="specifications">
							<el-input v-model="ruleForm.specifications" placeholder="请输入规格" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规格2" prop="specification2">
							<el-input v-model="ruleForm.specification2" placeholder="请输入规格2" clearable />

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






