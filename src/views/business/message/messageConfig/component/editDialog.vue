<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addMessageConfig, updateMessageConfig, listMessageConfig } from '/@/api/modular/main/messageConfig';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
});
interface Option {
  key: number
  label: string
  disabled: boolean
}
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const ruleForm = ref<any>({});
const isShowDialog = ref(false);
const list = ref<Option[]>([]);
//自行添加其他规则
const rules = ref<FormRules>({
	modularCode: [{ required: true, }],
	notificationMethod: [{ required: true, }]
});
const modularCodeData = ref([
	{
		code: 'ecvvcomm',
		name: 'ECVV公共通知'
	},
	{
		code: 'ecvvpro',
		name: 'ECVV橱窗位已用完通知'
	},
	{
		code: 'ecvvreg',
		name: 'ECVV注册通知'
	},
	{
		code: 'SiteCheck',
		name: '站点监控通知'
	},
	{
		code: 'sku_price_null_count',
		name: 'SKU空价格数量通知'
	},
	{
		code: 'product_launch',
		name: '产品发布通知'
	},
	{
		code: 'ae_order',
		name: 'AE订单通知'
	},
	{
		code: 'un_ae_order',
		name: '非AE订单通知'
	},
	{
		code: 'Ecvv_InvoicingNotice',
		name: 'ECVV开票通知'
	},
])
const options = ref([
	{
		value: '[\"dingding\",\"email\"]',
		label: '钉钉提醒,电子邮件'
	},
	{
		value: '[\"DingDingText\"]',
		label: '钉钉纯文本消息'
	},
	{
		value: '[\"dingding\"]',
		label: '钉钉提醒'
	},
	{
		value: '[\"sms\"]',
		label: '手机短信'
	},
])
const handleList = async () => {
	var res = await listMessageConfig()
	res.data.result.forEach((item) => {
		list.value.push({
			label: item.userName,
			key: item.id,
			disabled:false
		})
	})
}
handleList()
// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
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
			if (values.modularCode == 'ECVV公共通知') {
				values.modularCode = 'ecvvcomm'
			}else if(values.modularCode == 'ECVV橱窗位已用完通知'){
				values.modularCode = 'ecvvpro'
			}else if(values.modularCode == 'ECVV注册通知'){
				values.modularCode = 'ecvvreg'
			}else if(values.modularCode == '站点监控通知'){
				values.modularCode = 'SiteCheck'
			}else if(values.modularCode == 'SKU空价格数量通知'){
				values.modularCode = 'sku_price_null_count'
			}else if(values.modularCode == '产品发布通知'){
				values.modularCode = 'product_launch'
			}else if(values.modularCode == 'AE订单通知'){
				values.modularCode = 'ae_order'
			}else if(values.modularCode == '非AE订单通知'){
				values.modularCode = 'un_ae_order'
			}
			else if(values.modularCode == 'ECVV开票通知'){
				values.modularCode = 'Ecvv_InvoicingNotice'
			}	
			const methods = values.receiverIDs
			if(typeof methods != 'string'){
				const list = []
				methods.map((item: any) => {
					item = '\"' + `${item}\"`
					list.push(item)
				})
				values.receiverIDs = `[${list}]`
			}
			if (ruleForm.value.id != undefined && ruleForm.value.id > 0) {
				await updateMessageConfig(values);
			} else {
				await addMessageConfig(values);
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

const change = (val) => {
	switch (val) {
		case 'ecvvcomm':
			ruleForm.value.modularName = 'ECVV公共通知'
			ruleForm.value.modularCode = 'ECVV公共通知'
			break;
		case 'ecvvpro':
			ruleForm.value.modularName = 'ECVV橱窗位已用完通知'
			ruleForm.value.modularCode = 'ECVV橱窗位已用完通知'
			break;
		case 'ecvvreg':
			ruleForm.value.modularName = 'ECVV注册通知'
			ruleForm.value.modularCode = 'ECVV注册通知'
			break;
		case 'SiteCheck':
			ruleForm.value.modularName = '站点监控通知'
			ruleForm.value.modularCode = '站点监控通知'
			break;
		case 'sku_price_null_count':
			ruleForm.value.modularName = 'SKU空价格数量通知'
			ruleForm.value.modularCode = 'SKU空价格数量通知'
			break;
		case 'product_launch':
			ruleForm.value.modularName = '产品发布通知'
			ruleForm.value.modularCode = '产品发布通知'
			break;
		case 'ae_order':
			ruleForm.value.modularName = 'AE订单通知'
			ruleForm.value.modularCode = 'AE订单通知'
			break;
		case 'un_ae_order':
			ruleForm.value.modularName = '非AE订单通知'
			ruleForm.value.modularCode = '非AE订单通知'
			break;
		case 'Ecvv_InvoicingNotice':
			ruleForm.value.modularName = 'ECVV开票通知'
			ruleForm.value.modularCode = 'ECVV开票通知'
			break;
	}
}


//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<template>
	<div class="messageConfig-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="800" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col   class="mb20">
						<el-form-item label="通知模块代码：" prop="modularCode">
							<el-select placeholder="请选择通知模块代码" v-model="ruleForm.modularCode"
								@change="(val) => change(val)">
								<el-option v-for="(item, index) in modularCodeData" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="通知模块名称:" prop="modularName">
							<el-input v-model="ruleForm.modularName" placeholder="请输入通知模块名称" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="匹配规则:" prop="matchingRules">
							<el-input v-model="ruleForm.matchingRules" placeholder="请输入匹配规则（无规则不用填写）" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="通知到的人:" prop="receiverIDs">
							<el-transfer v-model="ruleForm.receiverIDs" filterable filter-placeholder="Search here"
								:data="list" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="通知方式:" prop="notificationMethod">
							<el-select v-model="ruleForm.notificationMethod" placeholder="请选择通知方式" style="width: 240px">
								<el-option v-for="item in options" :key="item.value" :label="item.label"
									:value="item.value" />
							</el-select>
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






