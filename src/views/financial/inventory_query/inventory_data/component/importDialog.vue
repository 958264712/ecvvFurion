<template>
	<div class="tableImport-container">
		<el-dialog v-model="isShowDialog" title="导入" :width="800" @close="closeDialog(ruleFormRef)" draggable="" center>
			<div class="import" v-if="isShowImport">
				<p>1、下载导入模版，如已有下载模版可直接跳过第一步，在后续步骤选择月份及文件上传</p>
				<div class="moban">
					<div style="display: flex; align-items: center">
						<svg t="1709867915105" class="icon" viewBox="0 0 1024 1024" version="1.1"
							xmlns="http://www.w3.org/2000/svg" p-id="2468" width="52" height="52">
							<path
								d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z"
								p-id="2469" fill="#707070"></path>
							<path
								d="M514.1 580.1l-61.8-102.4c-2.2-3.6-6.1-5.8-10.3-5.8h-38.4c-2.3 0-4.5 0.6-6.4 1.9-5.6 3.5-7.3 10.9-3.7 16.6l82.3 130.4-83.4 132.8c-1.2 1.9-1.8 4.1-1.8 6.4 0 6.6 5.4 12 12 12h34.5c4.2 0 8-2.2 10.2-5.7L510 664.8l62.3 101.4c2.2 3.6 6.1 5.7 10.2 5.7H620c2.3 0 4.5-0.7 6.5-1.9 5.6-3.6 7.2-11 3.6-16.6l-84-130.4 85.3-132.5c1.2-1.9 1.9-4.2 1.9-6.5 0-6.6-5.4-12-12-12h-35.7c-4.2 0-8.1 2.2-10.3 5.8l-61.2 102.3z"
								p-id="2470" fill="#707070"></path>
						</svg>
						<span>{{ props.excelName }}模板</span>
					</div>
					<el-button><el-link type="success" :href="props.tableAddress">下载</el-link></el-button>
				</div>
			</div>
			<div class="import" v-if="isShowImport">
				<p>2、选择需要导入数据的月份</p>
				<el-date-picker :clearable="false" v-model="time" type="month" style="width: 200px; margin-top: 10px"
					placeholder="请选择月份" />

			</div>
			<div class="import" v-if="isShowImport">
				<p>3、上传需要导入表格</p>
				<el-checkbox v-model="IsUpdData" label="是否需要重新生成上传文件之后月份的数据" size="large" />
				<el-upload :on-change="Imports" :multiple="false" :show-file-list="false" :auto-upload="false"
					name="file">
					<div class="moban1">
						<svg t="1709867915105" class="icon" viewBox="0 0 1024 1024" version="1.1"
							xmlns="http://www.w3.org/2000/svg" p-id="2468" width="104" height="104">
							<path
								d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z"
								p-id="2469" fill="#707070"></path>
							<path
								d="M514.1 580.1l-61.8-102.4c-2.2-3.6-6.1-5.8-10.3-5.8h-38.4c-2.3 0-4.5 0.6-6.4 1.9-5.6 3.5-7.3 10.9-3.7 16.6l82.3 130.4-83.4 132.8c-1.2 1.9-1.8 4.1-1.8 6.4 0 6.6 5.4 12 12 12h34.5c4.2 0 8-2.2 10.2-5.7L510 664.8l62.3 101.4c2.2 3.6 6.1 5.7 10.2 5.7H620c2.3 0 4.5-0.7 6.5-1.9 5.6-3.6 7.2-11 3.6-16.6l-84-130.4 85.3-132.5c1.2-1.9 1.9-4.2 1.9-6.5 0-6.6-5.4-12-12-12h-35.7c-4.2 0-8.1 2.2-10.3 5.8l-61.2 102.3z"
								p-id="2470" fill="#707070"></path>
						</svg>
						<span>支持.xls、.xlsx文件类型</span>
						<el-button>选择文件</el-button>
					</div>
				</el-upload>
			</div>
			<div v-if="!isShowImport">
				<div v-if="result?.total && isMime">
					<Check class="success" style="border: 2px solid #62e48d; border-radius: 50%; width: 18px" />
					导入成功，总<span class="success">{{ result?.total }}</span>条，成功导入<span class="success">
						{{ result?.total }}</span>条数据，失败<span class="fail">0</span>条
				</div>
				<div v-else-if="!isMime">
					<CloseBold class="fail"
						style="border: 2px solid #f44d4d; border-radius: 50%; width: 18px; margin-right: 5px" />
					导入失败，导入的文件类型不符，请检查导入的文件类型是否正确，再次上传
				</div>
				<div v-else>
					<CloseBold class="fail"
						style="border: 2px solid #f44d4d; border-radius: 50%; width: 18px; margin-right: 5px" />
					导入失败，导入的文件不符，请检查文件内的数据是否正确，再次上传
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { Check, CloseBold } from '@element-plus/icons-vue';
import { service } from '/@/utils/request';
import other from '/@/utils/other';
import moment from 'moment';

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
	area: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const loading1 = ref(false);
const isShowDialog = ref(false);
const isShowImport = ref(true);
const isMime = ref(true);
const time = ref<any>(undefined);
const IsUpdData = ref<any>(false);
const result = ref<any>({});
const tableParams = ref({
	Page: 1,
	pageSize: 1000,
	total: 0,
});
const beforeUpload = (rawFile: any) => {
	const isXLSX = rawFile.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || rawFile.raw.type === 'application/vnd.ms-excel';
	if (!isXLSX) {
		ElMessage.error('导入的文件类型不符，请选择.xlsx或.xls文件类型再次上传');
		return false;
	}
	return true;
};

//导入
const Imports = (file: any) => {
	loading.value = true;
	isMime.value = beforeUpload(file);
	if (time.value !== undefined) {
		if (isMime.value) {
			const formData = new FormData();
			formData.append('file', file.raw);
			formData.append('time', moment(time.value).format('YYYY-MM'));
			formData.append('IsUpdData', IsUpdData.value)
			service({
				url: props.url,
				method: 'post',
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
				},
			}).then((res: any) => {
				loading.value = false;
				isShowImport.value = false;
				if (res.data.result.total) {
					result.value = res.data.result;
					tableParams.value.total = res.data.result.total;
					ElMessage.success('导入成功');
					emit('reloadTable');
				} else {
					result.value = res.data.result;
					tableParams.value.total = res.data.result?.total;
					ElMessage.error('导入失败'); // + res.message
				}
			});
		}
	} else {
		ElMessage.error('请选择导入的数据月份');
	}
};

// 打开弹窗
const openDialog = (row: any) => {
	console.log(props.excelName);
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = (ruleFormRef: FormInstance | undefined) => {
	isShowImport.value = true;
	isShowDialog.value = false;
	if (!ruleFormRef) return;
	ruleFormRef.resetFields();
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
.import {
	margin: 20px;

	.moban {
		margin: 20px 0;
		border: 1px solid #ccc;
		border-radius: 3px;
		height: 66px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 720px;
		padding: 0 20px;
	}

	.moban1 {
		margin: 20px 0;
		border: 1px solid #ccc;
		border-radius: 3px;
		height: 220px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		width: 720px;
		padding: 20px;
	}
}

.success {
	color: #62e48d;
	margin: 0 5px;
}

.fail {
	color: #f44d4d;
}
</style>
