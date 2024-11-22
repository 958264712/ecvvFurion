<template>
	<el-form label-width="150" label-position="right" size="large" :model="exportParams" ref="ruleFormRef">
		<div
			style="width: 100%; height: 35px; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffe0">
			<el-text size="20">{{ props.text }}</el-text>
		</div>
		<el-form-item v-for="item in props.formList" :label="item.label + '：'" :prop="item.prop" :rules="[
		{
			required: true,
			message: `${item.label}不能为空`,
			trigger: 'blur',
		},
	]">
			<el-select v-if="item.type === 'select'" v-model="exportParams[item?.select]" size="large"
				style="width: 300px"
				@change="(val: any) => item?.change(val)">
				<el-option v-for="optionItem in item?.selectList" :value="optionItem.value" :label="optionItem.label"
					:disabled="optionItem?.disabled ?? false"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button style="width: 65px; height: 32px; margin-left: 150px; margin-right: 20px" type="info"
				@click="close">取消</el-button>
			<el-button style="width: 65px; height: 32px" :disabled="ifdisabled" :loading="exportSalesloading"
					type="primary" @click="exportQuery">确定</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import other from '/@/utils/other';
/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * exportDialog 配套参数
 * @props type 传入导入idname
 * @props text 传入表格提示文案
 * @props formList 传入form渲染列表
 * @props exportInterface 传入export接口
 * @emit close 关闭窗口
 */
const props = defineProps(['type', 'text', 'formList', 'exportInterface']);
const emit = defineEmits(['close', 'exportQuery']);
const exportSalesloading = ref(false);
const ifdisabled = ref(true);
const exportParams = ref<any>({ time: new Date() });
const close = () => {
	ElMessage.success('导出成功!');
	exportSalesloading.value = false;
	emit('close', false);
};


// 导入
const exportQuery = async () => {
	exportSalesloading.value = true;
	await props.exportInterface(exportParams.value).then((res:any)=>{
		other.downloadfile(res)
		close()
	}).catch((err: any) => {
		ElMessage.error(err);
		exportSalesloading.value = false;
	})
}

watch(() => exportParams.value.Site, () => {
	if (exportParams.value.Site) {
		ifdisabled.value = false;
	} else {
		ifdisabled.value = true;
	}
});
</script>