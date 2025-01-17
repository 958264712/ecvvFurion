<template>
	<div class="tableImport-container">
		<el-dialog v-model="isShowDialog" title="导入" :width="800" @close="closeDialog(ruleFormRef)" draggable="" center>
			<div class="import">
				<p>1、下载导入模版，如已有下载模版可直接在第二步选择文件上传</p>
				<div class="moban">
					<div style="display:flex;align-items:center;">
						<svg t="1709867915105" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2468" width="64" height="64">
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
						<span>{{ props.excelName }}模版</span>
					</div>
					<el-button><el-link type="success" :href="props.tableAddress">下载</el-link></el-button>
				</div>
			</div>
			<div class="import">
				<p>2、上传需要导入表格</p>
				<el-upload :on-change="Imports" :multiple="false" :show-file-list="false" :auto-upload="false" name="file">
					<div class="moban1">
						<svg t="1709867915105" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2468" width="128" height="128">
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
						<span>支持.xlsx文件类型</span>
						<el-button>选择文件</el-button>
					</div>
				</el-upload>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { service } from '/@/utils/request';
//父级传递来的参数
var props = defineProps({
	excelName: {
		type: String,
		default: '',
	},
	tableAddress: {
		type: String,
		default: '',
	},
	url: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<any>();
const loading = ref(false);
const isShowDialog = ref(false);

//导入
const Imports = (file: any) => {
	loading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('table', props.excelName);
	console.log(props);
	
	service({
		url: props.url,
		method: 'post',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	}).then((res: any) => {
		loading.value = false;
		if (res.data.code == 200) {
			ElMessage.success('导入成功');
			emit('reloadTable');
		} else {
			ElMessage.error('导入失败'); // + res.message
		}
	});
};
// 打开弹窗
const openDialog = (row: any) => {
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = (ruleFormRef: any) => {
	if (!ruleFormRef) return;
	ruleFormRef.resetFields();
	emit('reloadTable');
	isShowDialog.value = false;
};

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style lang="less" scope>
.import {
	margin: 20px;
	.moban {
		margin: 20px 0;
		border: 1px solid #000;
		border-radius: 3px;
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 720px;
		padding: 0 20px;
	}
	.moban1 {
		margin: 20px 0;
		border: 1px solid #000;
		border-radius: 3px;
		height: 300px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		width: 720px;
		padding: 50px;
	}
}
</style>
