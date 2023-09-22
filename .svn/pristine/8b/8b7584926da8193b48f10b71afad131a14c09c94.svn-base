<template>
	<div class="oFSStockWarning-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="序号" prop="serialID">
							<el-input v-model="ruleForm.serialID" placeholder="请输入序号" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="图片" prop="imageUrl">
							<el-input v-model="ruleForm.imageUrl" placeholder="请输入图片" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存SKU" prop="inventorySKU">
							<el-input v-model="ruleForm.inventorySKU" placeholder="请输入库存SKU" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品名称" prop="goodsName">
							<el-input v-model="ruleForm.goodsName" placeholder="请输入商品名称" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品类别" prop="commodityCategory">
							<el-input v-model="ruleForm.commodityCategory" placeholder="请输入商品类别" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品状态" prop="commodityStatus">
							<el-input v-model="ruleForm.commodityStatus" placeholder="请输入商品状态" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="发货仓库" prop="deliveryWarehouse">
							<el-input v-model="ruleForm.deliveryWarehouse" placeholder="请输入发货仓库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存数量" prop="inventoryQuantity">
							<el-input v-model="ruleForm.inventoryQuantity" placeholder="请输入库存数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="占用数量" prop="occupiedQuantity">
							<el-input v-model="ruleForm.occupiedQuantity" placeholder="请输入占用数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="可用数量" prop="availableQuantity">
							<el-input v-model="ruleForm.availableQuantity" placeholder="请输入可用数量" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="缺货占用数" prop="out_of_stock_occupation">
							<el-input v-model="ruleForm.out_of_stock_occupation" placeholder="请输入缺货占用数" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购未入库" prop="purchaseNotWarehoused">
							<el-input v-model="ruleForm.purchaseNotWarehoused" placeholder="请输入采购未入库" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="缺货及待派单数量" prop="quantity_of_out_of_stock_and_waiting_list">
							<el-input v-model="ruleForm.quantity_of_out_of_stock_and_waiting_list" placeholder="请输入缺货及待派单数量"
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="预计可用库存" prop="estimated_available_inventory">
							<el-input v-model="ruleForm.estimated_available_inventory" placeholder="请输入预计可用库存" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="上次采购价" prop="last_purchase_price">
							<el-input v-model="ruleForm.last_purchase_price" placeholder="请输入上次采购价" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存单价" prop="inventory_unit_price">
							<el-input v-model="ruleForm.inventory_unit_price" placeholder="请输入库存单价" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存金额" prop="inventory_amount">
							<el-input v-model="ruleForm.inventory_amount" placeholder="请输入库存金额" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="最低采购价格" prop="minimum_purchase_price">
							<el-input v-model="ruleForm.minimum_purchase_price" placeholder="请输入最低采购价格" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品重量(g)" prop="commodity_weight_g">
							<el-input v-model="ruleForm.commodity_weight_g" placeholder="请输入商品重量(g)" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="品牌" prop="brand">
							<el-input v-model="ruleForm.brand" placeholder="请输入品牌" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规格" prop="specifications">
							<el-input v-model="ruleForm.specifications" placeholder="请输入规格" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="型号" prop="model">
							<el-input v-model="ruleForm.model" placeholder="请输入型号" clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="材质" prop="texture_of_material">
							<el-input v-model="ruleForm.texture_of_material" placeholder="请输入材质" clearable />

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
						<el-form-item label="库位" prop="location">
							<el-input v-model="ruleForm.location" placeholder="请输入库位" clearable />

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
import { addOFSStockWarning, updateOFSStockWarning } from "/@/api/modular/main/oFSStockWarning";
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
				await updateOFSStockWarning(values);
			} else {
				await addOFSStockWarning(values);
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




