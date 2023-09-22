<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addECVVHomeProductTypeInfo, updateProductTypeInfo,GetTncList } from '/@/api/modular/main/eCVVHomeTaxonomicInfo';
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
const selectBoxTncInfo = ref<any>([])
// 打开弹窗
const openDialog = async (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	await GetTncList().then(res=>{
		selectBoxTncInfo.value = res.data.result
	})
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
				await updateProductTypeInfo(values);
			} else {
				await addECVVHomeProductTypeInfo(values);
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
	<div class="eCVVHomeProductTypeInfo-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="140px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="商品类目名称：" prop="productName">
							<el-input v-model="ruleForm.productName" placeholder="请输入商品类目名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="类别名称：" prop="productName">
							<el-select placeholder="请输入商品类目名称" v-model="ruleForm.tncInfoId">
								<el-option v-for="item in selectBoxTncInfo" :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="商品类目标题：" prop="productTitle">
							<el-input v-model="ruleForm.productTitle" placeholder="请输入商品类目标题" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="商品类目描述：" prop="productDescription">
							<el-input v-model="ruleForm.productDescription" placeholder="请输入商品类目描述" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="备注：" prop="productRemark">
							<el-input v-model="ruleForm.productRemark" placeholder="请输入备注" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="商品图片地址：" prop="productSrc">
							<el-input v-model="ruleForm.productSrc" placeholder="请输入商品类目资源地址" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="商品类目超链接：" prop="productHref">
							<el-input v-model="ruleForm.productHref" placeholder="请输入商品类目超链接" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="商品类目顺序：" prop="productOrder">
							<el-input-number v-model="ruleForm.productOrder" placeholder="请输入商品类目顺序" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否启用：" prop="productEnable">
							<el-switch v-model="ruleForm.productEnable" active-text="是" inactive-text="否" />
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






