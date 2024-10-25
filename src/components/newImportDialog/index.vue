<template>
	<div class="tableImport-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="800" @close="closeDialog(ruleFormRef)" draggable="" center>
			<div class="import" v-if="isShowImport">
				<p v-if="props.area === 'CN'">1、下载导入模版，如已有下载模版可直接在第二步选择文件上传</p>
				<p v-else>1、Download the import template, if there is a download template, you can directly select the file upload in the second step</p>
				<div class="moban">
					<div style="display: flex; align-items: center">
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
						<span v-if="props.area === 'CN'">{{ props.excelName }}模版</span>
						<span v-else>{{ props.excelName }}Template</span>
					</div>
					<el-button v-if="props.area === 'CN'"><el-link type="success" :href="props.tableAddress">下载</el-link></el-button>
					<el-button v-else><el-link type="success" :href="props.tableAddress">Download</el-link></el-button>
				</div>
			</div>
			<div class="import" v-if="isShowImport">
				<div style="display: flex" v-if="props.area === 'CN'">
					<p>2、上传需要导入表格<strong v-if="props.multiple">（导入成功后，将覆盖原有数据，支持批量导入）</strong></p>
				</div>
				<div style="display: flex" v-else>
					<p>2、Upload requires importing the table<strong v-if="props.multiple">（After the import is successful, the original data will be overwritten and can be imported in batches）</strong></p>
				</div>
				<el-upload :on-change="Imports" :multiple="props.multiple" drag :show-file-list="false" :auto-upload="false" name="file">
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
						<span v-if="props.area === 'CN'">支持.xls、.xlsx文件类型</span>
						<span v-else>.xls and .xlsx files are supported</span>
						<el-button v-if="props.area === 'CN'">选择文件</el-button>
						<el-button v-else>Select file</el-button>
					</div>
				</el-upload>
			</div>
			<div v-if="!isShowImport">
				<div v-if="result?.istrue && result?.total !== 0">
					<Check class="success" style="border: 2px solid #62e48d; border-radius: 50%; width: 18px" />
					{{ props.area === 'CN' ? '导入成功，总' : 'Import successed, Total' }}<span class="success">{{ result?.total }}</span
					>{{ props.area === 'CN' ? '条，成功导入' : 'article, Successfully imported' }}<span class="success"> {{ result?.total }}</span
					>{{ props.area === 'CN' ? '条数据，失败' : 'rows data, Failed'}}<span class="fail">0</span>{{ props.area === 'CN' ? '条' : 'rows'}}
				</div>
				<div v-else-if="result?.istrue && result?.total === 0">
					<CloseBold class="fail" style="border: 2px solid #f44d4d; border-radius: 50%; width: 18px" />
					{{ props.area === 'CN' ? '导入失败，表格为空' : 'The table is empty because the import failed' }}
				</div>
				<div v-else>
					<CloseBold class="fail" style="border: 2px solid #f44d4d; border-radius: 50%; width: 18px; margin-right: 5px" />
					<template v-if="result.isTemplate">{{ result?.error }}</template>
					<template v-else>
						{{ props.area === 'CN' ? '导入失败，总' : 'Import failed, Total' }}<span class="success">{{ result?.total }}</span
						>{{ props.area === 'CN' ? '条，成功导入' : 'article, Successfully imported' }}<span class="success">0</span> {{ props.area === 'CN' ? '条数据，失败' : 'rows data, Failed'
						}}<span class="fail">{{ result?.fail }}</span
						>{{ props.area === 'CN' ? '条，可下载错误报告，修改后再次上传' : 'article, You can download the error report, modify it and upload it again' }}
						<el-table :data="result?.items" size="lagre" style="width: 100%; margin: 20px 0" v-loading="loading1" tooltip-effect="light" row-key="id" border="">
							<el-table-column prop="rowNO" :label="props.area === 'CN' ? '行数' : 'Line Number'" width="80" sortable align="center" show-overflow-tooltip="" />
							<el-table-column v-for="item in errorData" :prop="item.prop" :label="item.label" min-width="150" sortable align="center" show-overflow-tooltip="" />
							<el-table-column prop="errorInfo" :label="props.area === 'CN' ? '失败原因' : 'Cause of failure'" min-width="150" sortable align="center" show-overflow-tooltip="">
								<template #default="scope">
									<span class="fail">{{ scope.row.errorInfo }}</span>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							v-model:currentPage="tableParams.page"
							v-model:page-size="tableParams.pageSize"
							:total="tableParams.total"
							:page-sizes="[10, 20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
						<el-button type="primary" :loading="Exportloading" @click="exportExcel" style="margin: 10px auto 0">下载报告</el-button>
					</template>
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

/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * importDialog 配套参数
 * @props excelName 模板名称
 * @props tableAddress 下载模板链接
 * @props url 传入import接口
 * @props area 传入中英文格式
 * @props ifExcelBol 是否进行格式约束
 * @props exportUrl 导出接口链接
 * @props errorData 报错字段表格
 * @props multiple 是否导入多个文件
 * @props madeChina 是否加入madechina条形码
 * @emit close 关闭窗口
 * @emit reloadTable 调用外部接口刷新数据列表
 */

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '导入',
	},
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
const loading1 = ref(false);
const isShowDialog = ref(false);
const Exportloading = ref(false);
const isShowImport = ref(true);
const result = ref<any>({});
const tableParams = ref({
	Page: 1,
	pageSize: 1000,
	total: 0,
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
const Imports = (file: any) => {
	loading.value = true;
	const ifupload = props.ifExcelBol ? beforeUpload(file) : true;

	if (ifupload) {
		const formData = new FormData();
		formData.append('file', file.raw);
		formData.append('Site', props.area);
		service({
			url: props.url,
			method: 'post',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
			},
		}).then((res: any) => {
			loading.value = false;
			if (props.area === 'CN') {
				isShowImport.value = false;
				if (res.data.result.istrue && res.data.result.total !== 0) {
					result.value = res.data.result;
					tableParams.value.total = res.data.result.total;
					ElMessage.success(props.area === 'CN' ? '导入成功' : 'Import Successed');
					emit('reloadTable');
				} else {
					result.value = res.data.result;
					tableParams.value.total = res.data.result?.total;
					ElMessage.error(props.area === 'CN' ? '导入失败' : 'Import Failed'); // + res.message
				}
			}else{
				if (res.data.result && res.data.code === 200) {
					ElMessage.success(props.area === 'CN' ? '导入成功' : 'Import Successed');
					emit('reloadTable');
				} else {
					ElMessage.error(props.area === 'CN' ? '导入失败' : 'Import Failed'); // + res.message
				}
			}
		});
	}
};
const exportExcel = () => {
	Exportloading.value = true;
	service({
		url: (import.meta.env.VITE_API_URL as any) + props.exportUrl + result.value.bacthId,
		method: 'post',
		responseType: 'blob',
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	})
		.then((data) => {
			other.downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: props.area === 'CN' ? '系统提示' : 'System prompt',
					message: props.area === 'CN' ? '导出成功' : 'Export Successed',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: props.area === 'CN' ? '导出成功' : 'Export Successed',
				});
			}
			Exportloading.value = false;
		})
		.catch((err) => {
			ElNotification({
				title: props.area === 'CN' ? '系统提示' : 'System prompt',
				message: props.area === 'CN' ? '下载错误：获取文件流错误' : 'Download error: Obtaining file stream error',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: props.area === 'CN' ? '导出失败' : 'Export Failed',
			});
			Exportloading.value = false;
		});
};
// 打开弹窗
const openDialog = (row: any) => {
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

.success {
	color: #62e48d;
	margin: 0 5px;
}

.fail {
	color: #f44d4d;
}
</style>
