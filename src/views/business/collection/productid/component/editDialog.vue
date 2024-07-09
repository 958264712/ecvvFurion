<template>
	<el-dialog :width="1200" v-model="dialogFormVisible" title="新增集货单商品基础信息">
		<el-form ref="ruleFormRef" :model="ruleForm" label-width="160px" :rules="rules">
			<el-row>
				<el-form-item v-show="false">
					<el-input v-model="ruleForm.id" />
				</el-form-item>
				<el-col :span="12">
					<el-form-item label="内部唯一识别码" prop="internalUniqueID">
						<el-input v-model="ruleForm.internalUniqueID" placeholder="请输入内部唯一识别码" />
					</el-form-item>
					<el-form-item label="采购员">
						<el-input v-model="ruleForm.purchaser" placeholder="请输入采购员" />
					</el-form-item>
					<el-form-item label="品牌">
						<el-input v-model="ruleForm.brand" placeholder="请输入品牌" />
					</el-form-item>
					<el-form-item label="报关要素">
						<el-input v-model="ruleForm.customsName" placeholder="请输入报关要素" />
					</el-form-item>
					<el-form-item label="英文名称">
						<el-input v-model="ruleForm.enProductName" placeholder="请输入英文名称" />
					</el-form-item>
					<el-form-item label="颜色">
						<el-input v-model="ruleForm.color" placeholder="请输入颜色" />
					</el-form-item>
					<el-form-item label="材质">
						<el-input v-model="ruleForm.material" placeholder="请输入材质" />
					</el-form-item>
					<el-form-item label="标签">
						<el-select v-model="ruleForm.warnTag" multiple collapse-tags placeholder="请选择" style="width: 240px">
							<el-option v-for="item in tagoptions" :key="item.value" :label="item.value" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="报关数量">
						<el-input v-model="ruleForm.plannedShipmentQuantity" placeholder="请输入报关数量" />
					</el-form-item>
					<el-form-item label="迪拜仓库收货数量">
						<el-input v-model="ruleForm.dubaiWarehouseReceiptQuantity" placeholder="请输入迪拜仓库收货数量" />
					</el-form-item>
					<el-form-item label="补充说明">
						<el-input v-model="ruleForm.unitInfo" placeholder="请输入补充说明" />
					</el-form-item>
					<el-form-item label="装箱数">
						<el-input v-model="ruleForm.packBoxesQuantity" placeholder="请输入装箱数" />
					</el-form-item>
					<el-form-item label="产品长">
						<el-input v-model="ruleForm.singleProductLength" placeholder="请输入产品长" />
					</el-form-item>
					<el-form-item label="产品高">
						<el-input v-model="ruleForm.singleProductHeight" placeholder="请输入产品高" />
					</el-form-item>
					<el-form-item label="箱长">
						<el-input v-model="ruleForm.boxLength" placeholder="请输入箱长" />
					</el-form-item>
					<el-form-item label="箱高">
						<el-input v-model="ruleForm.boxHeight" placeholder="请输入箱高" />
					</el-form-item>
					<el-form-item label="总毛重KG">
						<el-input v-model="ruleForm.totalGrossWeightKG" placeholder="请输入总毛重KG" />
					</el-form-item>
					<el-form-item label="体积重">
						<el-input v-model="ruleForm.volumeWeight" placeholder="请输入体积重" />
					</el-form-item>
					<el-form-item label="采购价含税币种">
						<el-input v-model="ruleForm.includingTaxPurchasePriceCurrency" placeholder="请输入采购价含税币种" />
					</el-form-item>
					<el-form-item label="出口单价币种">
						<el-input v-model="ruleForm.exportUnitPriceCurrency" placeholder="请输入出口单价币种" />
					</el-form-item>
					<el-form-item label="商检费币种">
						<el-input v-model="ruleForm.commodityInspectionFeeCurrency" placeholder="请输入商检费币种" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="产品图">
						<el-input v-model="ruleForm.productPic" placeholder="请输入产品图" />
					</el-form-item>
					<el-form-item label="供应商">
						<el-input v-model="ruleForm.supplier" placeholder="请输入供应商" />
					</el-form-item>
					<el-form-item label="报关品名">
						<el-input v-model="ruleForm.customsName" placeholder="请输入报关品名" />
					</el-form-item>
					<el-form-item label="内部品名">
						<el-input v-model="ruleForm.internalProductName" placeholder="请输入内部品名" />
					</el-form-item>
					<el-form-item label="报关型号">
						<el-input v-model="ruleForm.customsDeclarationModel" placeholder="请输入报关型号" />
					</el-form-item>
					<el-form-item label="规格">
						<el-input v-model="ruleForm.specification" placeholder="请输入规格" />
					</el-form-item>
					<el-form-item label="用途">
						<el-input v-model="ruleForm.use" placeholder="请输入用途" />
					</el-form-item>
					<el-form-item label="实际出货数量">
						<el-input v-model="ruleForm.actualShipmentQuantity" placeholder="请输入实际出货数量" />
					</el-form-item>
					<el-form-item label="单位">
						<el-input v-model="ruleForm.unit" placeholder="请输入单位" />
					</el-form-item>
					<el-form-item label="装箱个数">
						<el-input v-model="ruleForm.quantityInBoxes" placeholder="请输入装箱个数" />
					</el-form-item>
					<el-form-item label="单个产品净重KG">
						<el-input v-model="ruleForm.singleProductNetWeightKG" placeholder="请输入单个产品净重KG" />
					</el-form-item>
					<el-form-item label="产品宽">
						<el-input v-model="ruleForm.singleProductWidth" placeholder="请输入产品宽" />
					</el-form-item>
					<el-form-item label="整箱毛重KG">
						<el-input v-model="ruleForm.fclGrossWeightKG" placeholder="请输入整箱毛重KG" />
					</el-form-item>
					<el-form-item label="箱宽">
						<el-input v-model="ruleForm.boxWidth" placeholder="请输入箱宽" />
					</el-form-item>
					<el-form-item label="总净重KG">
						<el-input v-model="ruleForm.totalNetWeightKG" placeholder="请输入总净重KG" />
					</el-form-item>
					<el-form-item label="总方数（立方米）">
						<el-input v-model="ruleForm.totalSquaresM3" placeholder="请输入总方数（立方米）" />
					</el-form-item>
					<el-form-item label="采购价含税">
						<el-input v-model="ruleForm.includingTaxPurchasePrice" placeholder="请输入采购价含税" />
					</el-form-item>
					<el-form-item label="出口单价（USD）">
						<el-input v-model="ruleForm.exportUnitPrice" placeholder="请输入出口单价（USD）" />
					</el-form-item>
					<el-form-item label="商检费（RMB）个">
						<el-input v-model="ruleForm.commodityInspectionFee" placeholder="请输入商检费（RMB）个" />
					</el-form-item>
					<el-form-item label="FOB供货价（AED/SAR）">
						<el-input v-model="ruleForm.FOBSupplyPrice" placeholder="请输入FOB供货价（AED/SAR）" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row style="margin-top: 18px">
				<el-col :span="24">
					<el-form-item label="备注">
						<el-input type="textarea" v-model="ruleForm.notes" placeholder="请输入备注" />
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-form-item v-for="el in columns" :key="el.dataIndex" :label="el.title" >
				<el-input v-model="ruleForm." :placeholder="`请输入${el.title}`"  />
			</el-form-item> -->
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click="confirm(ruleFormRef)"> OK </el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { ElMessageBox, ElMessage, ElNotification, FormRules } from 'element-plus';
import { SysCodeGenConfigApi, SysConstApi, SysDictDataApi, SysDictTypeApi, SysEnumApi } from '/@/api-services/api';
import { service } from '/@/utils/request';
import { getAPI } from '/@/utils/axios-utils';
let dialogFormVisible = ref(false);
const tagoptions = ref<any>([]);
onMounted(async () => {
	var res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('warn_tag');
	tagoptions.value = res.data.result;
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const isShowDialog = ref(false);
const ruleForm = ref<any>({
	warnTag: [],
});

const rules = reactive<FormRules<RuleForm>>({
	internalUniqueID: [{ required: true, message: '请输入内部唯一识别码' }],
});

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
function confirm(formEl: FormInstance | undefined) {
	ruleForm.value.warnTag = ruleForm.value.warnTag?.length ? ruleForm.value.warnTag.join(',') : null;
	if (!formEl) return;
	 formEl.validate((valid, fields) => {
		if (valid) {
			if (ruleForm.value.id != null) {
				service({
					url: '/api/collectionGoodsInfoCache/update',
					method: 'post',
					data: ruleForm.value,
				}).then((data) => {
					if (data.data.type == 'success') {
						ElMessage({
							type: 'success',
							message: '更新成功',
						});
						closeDialog();
					} else {
						ElMessage({
							type: 'info',
							message: '更新失败',
						});
					}
				});
			} else {
				service({
					url: '/api/collectionGoodsInfoCache/add',
					method: 'post',
					data: ruleForm.value,
				}).then((data) => {
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
		} else {
			console.log('error submit!', fields);
		}
	});
}
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
