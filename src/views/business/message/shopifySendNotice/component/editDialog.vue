<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addShopifySendNotice, updateShopifySendNotice } from '/@/api/modular/main/messageConfig';
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
//自行添加其他规则
const rules = ref<FormRules>({
	modularCode: [{ required: true, }],
	sendStatus: [{ required: true, }]
});

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
			if (values.sendStatus == '发送成功'){
				values.sendStatus = 1
			}else if(values.sendStatus == '不成功'){
				values.sendStatus = 2
			}else if(values.sendStatus == '未发送'){
				values.sendStatus = 0
			}
			if (ruleForm.value.id != undefined && ruleForm.value.id > 0) {
				await updateShopifySendNotice(values);
			} else {
				await addShopifySendNotice(values);
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
			ruleForm.value.modularCode = 'ECVV公共通知'
			break;
		case 'ecvvpro':
			ruleForm.value.modularCode = 'ECVV橱窗位已用完通知'
			break;
		case 'ecvvreg':
			ruleForm.value.modularCode = 'ECVV注册通知'
			break;
		case 'SiteCheck':
			ruleForm.value.modularCode = '站点监控通知'
			break;
		case 'sku_price_null_count':
			ruleForm.value.modularCode = 'SKU空价格数量通知'
			break;
		case 'product_launch':
			ruleForm.value.modularCode = '产品发布通知'
			break;
		case 'ae_order':
			ruleForm.value.modularCode = 'AE订单通知'
			break;
		case 'un_ae_order':
			ruleForm.value.modularCode = '非AE订单通知'
			break;
			case 'Ecvv_InvoicingNotice':
			ruleForm.value.modularCode = 'ECVV开票通知'
			break;
	}
}

const change1 = (val) => {
	switch (val) {
		case 0:
			ruleForm.value.sendStatus = '未发送'
			break;
		case 1:
			ruleForm.value.sendStatus = '发送成功'
			break;
		case 2:
			ruleForm.value.sendStatus = '不成功'
			break;
	}
}





//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<template>
	<div class="shopifySendNotice-container">
		<el-dialog v-model="isShowDialog" :title="props.title" :width="800" draggable="">
			<el-form :model="ruleForm" ref="ruleFormRef" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="40">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="通知模块代码：" prop="modularCode">
							<el-select placeholder="请选择通知模块代码" v-model="ruleForm.modularCode" @change="(val) => change(val)">
								<el-option v-for="(item, index) in modularCodeData" :key="index"
									:value="item.code" :label="item.name"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="标题：" prop="title">
							<el-input v-model="ruleForm.title" placeholder="请输入标题" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="内容：" prop="content">
							<el-input v-model="ruleForm.content" placeholder="请输入内容" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="消息图片：" prop="msgImgUrl">
							<el-input v-model="ruleForm.msgImgUrl" placeholder="请输入消息图片" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="消息链接：" prop="msgLink">
							<el-input v-model="ruleForm.msgLink" placeholder="请输入消息链接" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="预计发送时间：" prop="preSendingTime">
							<el-date-picker v-model="ruleForm.preSendingTime" type="datetime"  placeholder="预计发送时间" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="实际发送时间：" prop="actualSendingTime">
							<el-date-picker v-model="ruleForm.actualSendingTime" type="datetime" placeholder="实际发送时间" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="发送状态：" prop="sendStatus">
							<el-select placeholder="请输入发送状态" v-model="ruleForm.sendStatus" @change="(val) => change1(val)">
								<el-option label='未发送' :value="0"> </el-option>
								<el-option label='发送成功' :value="1"> </el-option>
								<el-option label='不成功' :value="2"> </el-option>
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






