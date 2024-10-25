<template>
	<el-dialog v-model="isShowDialog" :title="props.title" :width="800" @close="closeDialog" draggable="">
		<template #header>
			<div class="my-header">
				<h3>{{ props.title }}</h3>
				<span v-if="props.area === 'CN'">下载<el-link style="color: #4d01ab" underline :href="props.tableAddress">默认模版</el-link></span>
				<span v-else>Download <el-link style="color: #4d01ab" underline :href="props.tableAddress">Default Template</el-link></span>
			</div>
		</template>
		<div class="import">
			<div style="display: flex" v-if="props.area === 'CN'">
				<p>上传需要导入表格<strong v-if="props.multiple">（导入成功后，将覆盖原有数据，支持批量导入）</strong></p>
			</div>
			<div style="display: flex" v-else>
				<p>Upload requires importing the table</p>
			</div>
			<el-upload :on-change="Imports" :multiple="props.multiple" drag :show-file-list="false" :auto-upload="false" v-model:file-list="fileList" name="file">
				<div class="moban1">
					<svg t="1709867915105" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2468" width="96" height="96">
						<path
							d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z"
							p-id="2469"
							fill="#707070"
						></path>
						<path
							d="M514.1 580.1l-61.8-102.4c-2.2-3.6-6.1-5.8-10.3-5.8h-38.4c-2.3 0-4.5 0.6-6.4 1.9-5.6 3.5-7.3 10.9-3.7 16.6l82.3 130.4-83.4 132.8c-1.2 1.9-1.8 4.1-1.8 6.4 0 6.6 5.4 12 12 12h34.5c4.2 0 8-2.2 10.2-5.7L510 664.8l62.3 101.4c2.2 3.6 6.1 5.7 10.2 5.7H620c2.3 0 4.5-0.7 6.5-1.9 5.6-3.6 7.2-11 3.6-16.6l-84-130.4 85.3-132.5c1.2-1.9 1.9-4.2 1.9-6.5 0-6.6-5.4-12-12-12h-35.7c-4.2 0-8.1 2.2-10.3 5.8l-61.2 102.3z"
							p-id="2470"
							fill="#707070"
						></path>
					</svg>
					<span v-if="props.area === 'CN'">支持<span class="blue">点击</span>或<span class="blue">拖拽文件</span>上传,支持.xls、.xlsx文件类型</span>
					<p v-else>Please <span class="blue">Click</span> or <span class="blue">Drop file here</span> to upload. .xls and .xlsx file are supported, and can be imported in batches</p>
				</div>
			</el-upload>
		</div>
		<template #footer>
			<div class="my_footer">
				<el-button @click="customUpload" :disabled="isImport" type="primary" :loading="loading" size="default">Import</el-button>
				<el-button @click="closeDialog" size="default">Cancel</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { Check, CloseBold } from '@element-plus/icons-vue';
import { service } from '/@/utils/request';
import other from '/@/utils/other';

/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * new PO importDialog 配套参数
 * @props tableAddress 下载模板链接
 * @props url 传入import接口
 * @props area 传入中英文格式
 * @props ifExcelBol 是否进行格式约束
 * @props multiple 是否导入多个文件
 * @emit close 关闭窗口
 * @emit reloadTable 调用外部接口刷新数据列表
 */

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '导入',
	},
	tableAddress: {
		type: String,
		default: '',
	},
	url: {
		type: String,
		default: '',
	},
	area: {
		type: String,
		default: '',
	},
	ifExcelBol: {
		type: Boolean,
		default: false,
	},
	exportUrl: {
		type: String,
		default: '',
	},
	errorData: {
		type: Array,
		default: [],
	},
	multiple: {
		type: Boolean,
		dafault: false,
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const isImport = ref(true);
const isShowDialog = ref(false);
const fileList = ref<any>([]);
const fileRawList = ref<any>([]);
const tableParams = ref({
	Page: 1,
	pageSize: 1000,
});
const beforeUpload = (rawFile: any) => {
	const isXLSX = rawFile.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || rawFile.raw.type === 'application/vnd.ms-excel';
	if (!isXLSX) {
		ElMessage.error(props.area === 'CN' ? '导入的文件类型不符，请选择.xls、.xlsx文件类型再次上传' : 'The type of the imported file does not match that of the imported file. Select .xls or .xlsx');
		return false;
	}
	return true;
};

//导入
const Imports = (file: any, fileList: any) => {
	fileList.value = fileList;

	if (fileList.value?.length) {
		isImport.value = false;
	}
};
const customUpload = () => {
	loading.value = true;
	const ifupload = props.ifExcelBol
		? fileList.value.every((item) => {
				return beforeUpload(item);
		  })
		: true;
	fileList.value?.forEach((item) => {
		fileRawList.value.push(item.raw);
	});
	if (ifupload) {
		const formData = new FormData();
		fileRawList.value?.forEach((item) => {
			if (props.multiple) {
				formData.append('fileList', item);
			} else {
				formData.append('file', item);
			}
		});
		service({
			url: props.url,
			method: 'post',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
			},
		}).then((res: any) => {
			loading.value = false;
			isImport.value = true;
			fileList.value = [];
			fileRawList.value = [];
			if (res.data.code === 200) {
				ElMessage.success(props.area === 'CN' ? '导入成功' : 'Import Successed');
				emit('reloadTable');
			} else {
				ElMessage.error(props.area === 'CN' ? '导入失败' : 'Import Failed'); // + res.message
			}
		});
	}
};
// 打开弹窗
const openDialog = (row: any) => {
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
	loading.value = false;
	isImport.value = true;
	fileList.value = [];
	fileRawList.value = [];
	emit('reloadTable');
};
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.Page = val;
	handleQuery();
};
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style lang="less" scope>
.my-header {
	color: #fff;
	display: flex;
	justify-content: space-between;
	width: 94%;
}
.blue {
	color: #0a00ff;
}
.import {
	margin: 10px 20px 0 20px;

	.moban1 {
		margin: 10px 0;
		border: 1px solid #ccc;
		border-radius: 5px;
		height: 200px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		background: #f2f2f2;
		width: 720px;
		padding: 30px 0px;
	}
}

.success {
	color: #62e48d;
	margin: 0 5px;
}

.fail {
	color: #f44d4d;
}
.my_footer {
	text-align: start !important;
}
</style>
