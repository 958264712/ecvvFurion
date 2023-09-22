<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addECVVHomeTaxonomicInfo, updateECVVHomeTaxonomicInfo,GetSubInfo } from '/@/api/modular/main/eCVVHomeTaxonomicInfo';
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
const selectBoxSubInfo = ref([])
// 打开弹窗
const openDialog = async (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	await GetSubInfo().then(res => {
      selectBoxSubInfo.value = res.data.result
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
				await updateECVVHomeTaxonomicInfo(values);
			} else {
				await addECVVHomeTaxonomicInfo(values);
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
	<div class="eCVVHomeTaxonomicInfo-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="700" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="100px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="类别名称" prop="tncName">
							<el-input v-model="ruleForm.tncName" placeholder="请输入类别名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="前端组件ID" prop="subInfoId">
							<el-select placeholder="请输入前端组件ID" v-model="ruleForm.subInfoId">
								<el-option v-for="item in selectBoxSubInfo" :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="类别标题" prop="tncTitle">
							<el-input v-model="ruleForm.tncTitle" placeholder="请输入类别标题" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="类别描述" prop="tncDescription">
							<el-input v-model="ruleForm.tncDescription" placeholder="请输入类别描述" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="备注" prop="tncRemark">
							<el-input v-model="ruleForm.tncRemark" placeholder="请输入备注" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="图片地址" prop="tncSrc">
							<el-input v-model="ruleForm.tncSrc" placeholder="请输入图片地址" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="页面超链接" prop="tncHref">
							<el-input v-model="ruleForm.tncHref" placeholder="请输入页面超链接" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="类别排序" prop="tncOrder">
							<el-input-number v-model="ruleForm.tncOrder" placeholder="请输入类别排序" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否启用" prop="tncEnable">
							<el-switch v-model="ruleForm.tncEnable" active-text="是" inactive-text="否" />
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





