<template>
	<el-dialog v-model="isShowDialog" title="Shipping address" width="800">
		<div style="margin-bottom:5px;">
			<el-button style="background-color: transparent;border: none;color: #DF1515;padding:0;"
				icon="ele-CircleClose"></el-button>
			<el-text class="mx-1" size="large">导入失败,失败<el-text class="mx-1" type="danger"
					size="large">{{ errorData.length }}</el-text>条,修改后再次上传</el-text>
		</div>
		<el-table :data="errorData" :cell-style="customCellStyle">
			<template v-for="(item, index) in KINGDEEColumn" :key="index">
				<el-table-column :prop="item.prop" :label="item.label" :width="item.width" align="center" />
			</template>
		</el-table>
	</el-dialog>
</template>
<script lang="ts" setup="">
import { ref } from 'vue';
const KINGDEEColumn = ref<any>([
	{
		prop: 'row',
		label: '行数',
		width: 80
	},
	{
		prop: 'documentNumber',
		label: '单据编号',
		width: 150
	},
	{
		prop: 'erpSku',
		label: '规格型号',
		width: 120
	},
	{
		prop: 'errorStr',
		label: '失败原因',
		width: 400
	},
]);

//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const isShowDialog = ref(false);
const errorData = ref<any>({});
// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	isShowDialog.value = false;
};
// 打开弹窗
const openDialog = (row: any) => {
	errorData.value = JSON.parse(JSON.stringify(row));
	isShowDialog.value = true;
};
function customCellStyle({ row, column, rowIndex, columnIndex }) {
	if (column.property == "errorStr") {
		return { color: '#D9001B' };
	}
	// 返回一个包含自定义样式的对象
	return null;
}
function hasDuplicate(value) {
	return errorData.value.filter(item => item['errorStr'] === value).length > 1;
}
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>