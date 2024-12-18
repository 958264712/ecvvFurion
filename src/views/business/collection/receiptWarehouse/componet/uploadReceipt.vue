<template>
	<el-dialog v-model="isShowDialog" :title="props.title" :width="800" @close="closeDialog" draggable="">
		<template #header>
			<div class="my-header">
				<div>
					<span style="color: #fff; font-size: large; font-weight: bold">{{ props.title }}</span>
					<span style="color: #ec808d; font-size: large; font-weight: bold">1、选择货代入仓号，</span>
					<span style="color: #fff; font-size: large; font-weight: bold">2、上传收货清单）</span>
				</div>
				<span v-if="props.area === 'CN'">下载<el-link style="color: #4d01ab" underline :href="props.tableAddress">默认模版</el-link></span>
				<span v-else>Download <el-link style="color: #4d01ab" underline :href="props.tableAddress">Default Template</el-link></span>
			</div>
		</template>
		<div class="import">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="绑定入仓号">
                    <div style="border:1px solid #ccc;padding: 2px;min-height: 20px;min-width: 100px;">
					    <el-tag v-for="tag in queryParams.inWareHouseNos"  :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
						    {{ tag }}
					    </el-tag>
                    </div>
				</el-form-item>
			</el-form>
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
					<p v-else>
						Please <span class="blue">Click</span> or <span class="blue">Drop file here</span> to upload. .xls and .xlsx file are supported<span v-if="props.multiple"
							>, and can be imported in batches</span
						>
					</p>
				</div>
			</el-upload>
		</div>
		<template #footer>
			<div class="my_footer">
				<el-button @click="customUpload" :disabled="isImport" type="primary" :loading="loading" size="default">上传</el-button>
				<el-button @click="closeDialog" size="default">上一步</el-button>
				<el-button @click="closeDialog" size="default">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { service } from '/@/utils/request';

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
	inquireData: {
		type: Boolean,
		default: false,
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
    defaultValues: {
        type: Object,
        default:{}
    }
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable', 'returnHref']);
const loading = ref(false);
const isImport = ref(true);
const isShowDialog = ref(false);
const fileList = ref<any>([]);
const fileRawList = ref<any>([]);

const queryParams = ref<any>({ ...props.defaultValues });
const handleClose = (tag: string) => {
	queryParams.value.inWareHouseNos.splice(queryParams.value.inWareHouseNos.indexOf(tag), 1);
}

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
		? fileList.value.every((item: any) => {
				return beforeUpload(item);
		  })
		: true;
	fileList.value?.forEach((item: any) => {
		fileRawList.value.push(item.raw);
	});
	if (ifupload) {
		const formData = new FormData();
		fileRawList.value?.forEach((item: any) => {
			if (props.multiple) {
				formData.append('fileList', item);
			} else {
				formData.append('file', item);
			}
        });
        queryParams.value.inWareHouseNos.forEach((item:any)=>{
            formData.append('inWareHouseNos[]', item)
        })

		service({
			url: props.url,
			method: 'post',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
			},
		})
			.then((res: any) => {
				loading.value = false;
				isImport.value = true;
				fileList.value = [];
				fileRawList.value = [];
				if (res.data.code === 200) {
					ElMessage.success(props.area === 'CN' ? '导入成功' : 'Import Successed' + (props?.inquireData ? ', Please Wait Some Time,Now Downloading ZIP File' : ''));
					if (props?.inquireData) {
						emit('returnHref', res.data.result);
					}
					emit('reloadTable');
				} else {
					ElMessage.error(props.area === 'CN' ? '导入失败' : 'Import Failed！' + res.data.message);
				}
			})
			.catch((err) => {
				loading.value = false;
				isImport.value = true;
				fileList.value = [];
				fileRawList.value = [];
				ElMessage.error(props.area === 'CN' ? '导入失败' : 'Import Failed！' + err.message);
			});
	}
};
// 打开弹窗
const openDialog = (row: any) => {
	if(Array.isArray(props.defaultValues.inWareHouseNos) && props.defaultValues.inWareHouseNos.length === 0) {
		queryParams.value.inWareHouseNos = props.defaultValues.inWareHouseNos
	} else {
		queryParams.value.inWareHouseNos = props.defaultValues.inWareHouseNos
	}
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
	loading.value = false;
	isImport.value = true;
	fileList.value = [];
	fileRawList.value = [];
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
