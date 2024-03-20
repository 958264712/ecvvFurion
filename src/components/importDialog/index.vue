<template>
	<el-form label-width="150" label-position="right" size="large" :model="ImportParams" ref="ruleFormRef">
		<div style="width: 100%; height: 35px; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffe0">
			<el-text size="20">{{ props.text }}</el-text>
		</div>
		<el-form-item
			v-for="item in props.formList"
			:label="item.label + '：'"
			:prop="item.prop"
			:rules="[
				{
					required: true,
					message: `${item.label}不能为空`,
					trigger: 'blur',
				},
			]"
		>
			<el-select v-if="item.type === 'select' " v-model="ImportParams[item?.select]" size="large" style="width: 300px" @change="(val) => item?.change(val)">
				<el-option v-for="optionItem in item?.selectList" :value="optionItem.value" :label="optionItem.label" :disabled="optionItem?.disabled ?? false"></el-option>
			</el-select>
			<el-date-picker v-else-if="item.type === 'datePicker'" style="width: 300px" size="large" v-model="ImportParams.Time"  :type="item?.dateType" placeholder="请选择" />
		</el-form-item>
		<el-form-item>
			<el-button :loading="ImportsSalesloading" style="width: 65px; height: 32px; margin-left: 150px; margin-right: 20px" type="info" @click="close">取消</el-button>
			<el-upload ref="uploadRef" :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
				<el-button style="width: 65px; height: 32px" :loading="ImportsSalesloading" type="primary">确定</el-button>
			</el-upload>
		</el-form-item>
		<errorDialog ref="errorDialogRef" :title="errorDTitle" />
	</el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import errorDialog from '/@/views/business/procurements/InventoryManagement/component/error_table.vue';
/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * importDialog 配套参数
 * @props type 传入导入idname
 * @props text 传入表格提示文案
 * @props formList 传入form渲染列表
 * @props importsInterface 传入import接口
 * @props weeks 传入部分需要使用，周，月判断
 * @emit close 关闭窗口
 * @emit importQuery 调用外部接口刷新数据列表
 */
const props = defineProps(['type', 'text', 'formList', 'importsInterface', 'weeks']);
const emit = defineEmits(['close', 'importQuery']);
const ImportsSalesloading = ref(false);
const errorDTitle = ref('');
const errorDialogRef = ref();
const ImportParams = ref<any>({Time:new Date()});
const close = () => {
	emit('close', false);
};

// 导入
const Imports = (file: any) => {
	ImportParams.value.TimeQuantum = props?.weeks ?? '';
	const dateObject = new Date(ImportParams.value?.Time ?? null);
	const options = { year: 'numeric', month: 'long' };
	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
	let obj = {};
	// 格式化日期
	ImportsSalesloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	if (props.type === 'inventoryManagement') {
		formData.append('table', ImportParams.value.value2);
		obj.table = ImportParams.value.value2;
		if (ImportParams.value.value1 === '全部(UAE、SA)') {
			formData.append('type', 'UAE');
			obj.Type = 'UAE';
		} else {
			formData.append('type', ImportParams.value.value1);
			obj.Type = ImportParams.value.value1;
		}
	}else if (props.type === 'costprice_batch' || props.type === 'dFInventory_batch'){
		formData.append('site', ImportParams.value?.Site ?? null);
	} else {
		formData.append('Site', ImportParams.value?.Site ?? null);
		formData.append('TimeQuantum', props.weeks);
		formData.append('Time', formattedDate);
		formData.append('Week', ImportParams.value?.Week ?? null);
	}
	props.importsInterface(formData, obj).then((res: any) => {
		ImportsSalesloading.value = false;
		if (res.data.code == 200) {
			if (res.data.result == null) {
				ElMessage.success('导入成功');
				emit('importQuery');
			} else {
				if(props.type === 'inventoryManagement'){
					errorDTitle.value = '金蝶采购云申请单';
					errorDialogRef.value.openDialog(res.data.result);
				}
			}
		} else {
			ImportsSalesloading.value = false;
			ElMessage.error('导入失败'); // + res.message
		}
		emit('close', false);
		ImportParams.value = {};
	}).catch(()=>{
		ImportsSalesloading.value = false;
	})
};
</script>
