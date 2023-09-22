<script lang="ts" setup>
	import { ref,onMounted } from "vue";
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addOFSProductNameDetail, updateOFSProductNameDetail } from "/@/api/modular/main/oFSProductNameDetail";
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
        await updateOFSProductNameDetail(values);
      } else {
        await addOFSProductNameDetail(values);
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
	<div class="oFSProductNameDetail-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品名称" prop="productName">
							<el-input v-model="ruleForm.productName" placeholder="请输入商品名称" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="state">
							<el-input v-model="ruleForm.state" placeholder="请输入状态" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="生产周期" prop="productionCycle">
							<el-input-number v-model="ruleForm.productionCycle" placeholder="请输入生产周期" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="物流周期" prop="logisticsCycle">
							<el-input-number v-model="ruleForm.logisticsCycle" placeholder="请输入物流周期" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="谈判周期" prop="negotiationCycle">
							<el-input-number v-model="ruleForm.negotiationCycle" placeholder="请输入谈判周期" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在迪拜库存" prop="inventoryDubai">
							<el-input-number v-model="ruleForm.inventoryDubai" placeholder="请输入在迪拜库存" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在国内库存" prop="inDomesticInventory">
							<el-input-number v-model="ruleForm.inDomesticInventory" placeholder="请输入在国内库存" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在途库存" prop="inTransitInventory">
							<el-input-number v-model="ruleForm.inTransitInventory" placeholder="请输入在途库存" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在生产库存" prop="inProductionInventory">
							<el-input-number v-model="ruleForm.inProductionInventory" placeholder="请输入在生产库存" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在生产最近交货期" prop="latestDeliveryDate">
							<el-date-picker v-model="ruleForm.latestDeliveryDate" type="date" placeholder="在生产最近交货期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在生产最远交货期" prop="farthestDeliveryDate">
							<el-date-picker v-model="ruleForm.farthestDeliveryDate" type="date" placeholder="在生产最远交货期" />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="距离今天" prop="fromToday">
							<el-input v-model="ruleForm.fromToday" placeholder="请输入距离今天" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="近7天日均销量" prop="averageSales7Days">
							<el-input v-model="ruleForm.averageSales7Days" placeholder="请输入近7天日均销量" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="近30天日均销量" prop="averageSales30Days">
							<el-input v-model="ruleForm.averageSales30Days" placeholder="请输入近30天日均销量" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在库可售天数" prop="numberOfDaysInWarehouse">
							<el-input-number v-model="ruleForm.numberOfDaysInWarehouse" placeholder="请输入在库可售天数" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="综合可售天数" prop="comprehensiveNumberOfDays">
							<el-input-number v-model="ruleForm.comprehensiveNumberOfDays" placeholder="请输入综合可售天数" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购返单结余周期" prop="purchaseReturnCycle">
							<el-input-number v-model="ruleForm.purchaseReturnCycle" placeholder="请输入采购返单结余周期" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在迪拜库销售预警" prop="sellEarlyWarning">
							<el-input v-model="ruleForm.sellEarlyWarning" placeholder="请输入在迪拜库销售预警" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购返单预警" prop="purchaseReturnWarning">
							<el-input v-model="ruleForm.purchaseReturnWarning" placeholder="请输入采购返单预警" clearable />
							
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






