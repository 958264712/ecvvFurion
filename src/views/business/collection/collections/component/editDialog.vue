 <template>
	<div class="collectionOrderInfo-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="附件地址" prop="attachmentUrl">
							<el-input v-model="ruleForm.attachmentUrl" placeholder="请输入附件地址" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单据编号" prop="documentNo">
							<el-input v-model="ruleForm.documentNo" placeholder="请输入单据编号" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="目的地" prop="destination">
							<el-input v-model="ruleForm.destination" placeholder="请输入目的地" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="收货人" prop="consigneeName">
							<el-input v-model="ruleForm.consigneeName" placeholder="请输入收货人" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="创建日期" prop="orderCreatedDate">
							<el-date-picker v-model="ruleForm.orderCreatedDate" type="date" placeholder="创建日期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="创建人" prop="orderCreatedUser">
							<el-input v-model="ruleForm.orderCreatedUser" placeholder="请输入创建人" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="货代名称" prop="forwarderID">
							<el-input v-model="ruleForm.forwarderID" placeholder="请输入货代名称" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="运输方式" prop="shippingMethod">
							<el-input v-model="ruleForm.shippingMethod" placeholder="请输入运输方式" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="货代入仓号" prop="inWareHouseNo">
							<el-input v-model="ruleForm.inWareHouseNo" placeholder="请输入货代入仓号" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="截仓日期" prop="cutOffDate">
							<el-date-picker v-model="ruleForm.cutOffDate" type="date" placeholder="截仓日期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="state">
							<el-input v-model="ruleForm.state" placeholder="请输入状态" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="收件人" prop="recipientName">
							<el-input v-model="ruleForm.recipientName" placeholder="请输入收件人" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="收件联系电话" prop="recipientPhone">
							<el-input v-model="ruleForm.recipientPhone" placeholder="请输入收件联系电话" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="交仓地址" prop="deliveryAddress">
							<el-input v-model="ruleForm.deliveryAddress" placeholder="请输入交仓地址" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="验货完成日期" prop="departureDate">
							<el-date-picker v-model="ruleForm.departureDate" type="date" placeholder="验货完成日期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="预计到港日期" prop="estimatedArrivalDate">
							<el-date-picker v-model="ruleForm.estimatedArrivalDate" type="date" placeholder="预计到港日期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="实际到港日期" prop="actualArrivalDate">
							<el-date-picker v-model="ruleForm.actualArrivalDate" type="date" placeholder="实际到港日期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="送仓日期" prop="deliveryDate">
							<el-date-picker v-model="ruleForm.deliveryDate" type="date" placeholder="送仓日期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="实际送仓日期" prop="actualDeliveryDate">
							<el-date-picker v-model="ruleForm.actualDeliveryDate" type="date" placeholder="实际送仓日期" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物流预计到仓日期" prop="estimatedDeliveryDate">
							<el-date-picker v-model="ruleForm.estimatedDeliveryDate" type="date" placeholder="实际送仓日期" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="国际物流费用支付方" prop="internationalLogisticsFeePayer">
							<el-input v-model="ruleForm.internationalLogisticsFeePayer" placeholder="请输入国际物流费用支付方" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物流报价" prop="logisticsPrice">
							<el-input v-model="ruleForm.logisticsPrice" placeholder="请输入物流报价" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物流报价币种" prop="logisticsPriceCurrency">
							<el-input v-model="ruleForm.logisticsPriceCurrency" placeholder="请输入物流报价币种" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="汇率" prop="exchangeRate">
							<el-input v-model="ruleForm.exchangeRate" placeholder="请输入汇率" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="汇率USD" prop="exchangeRateUSD">
							<el-input v-model="ruleForm.exchangeRateUSD" placeholder="请输入汇率USD" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否需要报关" prop="neetCustoms">
							<el-switch v-model="ruleForm.neetCustoms" active-text="是" inactive-text="否" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="报关费" prop="totalCustomsDeclarationFee">
							<el-input v-model="ruleForm.totalCustomsDeclarationFee" placeholder="请输入报关费" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="报关单号" prop="customsDeclarationNo">
							<el-input v-model="ruleForm.customsDeclarationNo" placeholder="请输入报关单号" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="notes">
							<el-input v-model="ruleForm.notes" placeholder="请输入备注" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否锁定" prop="isLock">
							<el-switch v-model="ruleForm.isLock" active-text="是" inactive-text="否" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="锁定的用户ID" prop="lockUserID">
							<el-input v-model="ruleForm.lockUserID" placeholder="请输入锁定的用户ID" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="最近编辑时间" prop="lastEditTime">
							<el-date-picker v-model="ruleForm.lastEditTime" type="date" placeholder="最近编辑时间" />
							
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
	import { ref,onMounted } from "vue";
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addCollectionOrderInfo, updateCollectionOrderInfo } from "/@/api/main/collectionOrderInfo";
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
        await updateCollectionOrderInfo(values);
      } else {
        await addCollectionOrderInfo(values);
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
