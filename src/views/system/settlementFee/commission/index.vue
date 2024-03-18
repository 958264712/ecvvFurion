<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import editDialog from './components/index.vue';
import { ElMessage } from 'element-plus';
import { SKUOperationPage, SKUOperationUpdate, SKUOperationExport } from '/@/api/modular/main/sotckSkuOperations';

const queryParams = ref<any>({ UAE: '23', SA: '10' });
const tableData = ref<any>([]);
const setUAE = ref(true);
const setSA = ref(true);
const loading = ref(false);

const handleQuery = async (): void => {
	loading.value = true;
	var res = await SKUOperationPage(Object.assign(queryParams.value));
	tableData.value = res.data.result?.items ?? [];
	loading.value = false;
};

const setItem = (name:string,item: boolean) => {
	switch (name) {
		case 'setUAE':
			setUAE.value = !item
			break;
		default:
			setSA.value = !item
			break;
	}
	if (!item) {
		ElMessage.success('保存成功');
	}
};
</script>
<template>
	<div class="stock_sku_operations">
		<el-form :model="queryParams" :inline="true" style="width: 99%">
			<el-row :gutter="35">
				<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20 mb">
					<div class="grossprofit">UAE亚马逊平台佣金</div>
					<el-form-item
						label="佣金(%)"
						:rules="[
							{
								required: true,
								message: 'UAE亚马逊平台佣金不能为空',
								trigger: 'blur',
							},
						]"
					>
						<el-input v-model="queryParams.UAE" :disabled="setUAE" />
						<el-button type="primary" style="marginLeft: 10px" @click="setItem('setUAE',setUAE)">{{ setUAE ? '设置' : '保存' }}</el-button>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="11" :md="11" :lg="11" :xl="11" class="mb20">
					<div class="grossprofit">SA亚马逊平台佣金</div>
					<el-form-item
						label="佣金(%)"
						:rules="[
							{
								required: true,
								message: 'SA亚马逊平台佣金不能为空',
								trigger: 'blur',
							},
						]"
					>
						<el-input v-model="queryParams.SA" :disabled="setSA" />
						<el-button type="primary" style="marginLeft: 10px" @click="setItem('setSA',setSA)">{{ setSA ? '设置' : '保存' }}</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-card class="full-table" shadow="hover" :body-style="{ padding: '10px 20px' }">
			<div class="settingf">历史记录</div>
			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column sortable prop="inventorySKU" label="站点" align="center" show-overflow-tooltip="" />
				<el-table-column prop="inventoryProductName" label="修改前佣金（%）" align="center" />
				<el-table-column prop="salesAttributes" label="修改后佣金（%）" align="center" />
				<el-table-column prop="productCAT" label="操作时间 " align="center" />
				<el-table-column prop="inTransitQuantity" label="操作人 " align="center" />
			</el-table>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.settingf {
	margin-bottom: 10px;
	display: flex;
	&&:before {
		content: '';
		display: inline-block;
		width: 4px;
		height: 20px;
		margin-right: 10px;
		background: #eee;
	}
}
.mb {
	margin: 0 20px;
}
.mb20 {
	border: 1px solid #eee;
	padding: 20px 0 0 0;
	background: #fff;
	margin-top: 20px;
}
.grossprofit {
	margin-bottom: 20px;
	display: flex;
	&&:before {
		content: '';
		display: inline-block;
		width: 4px;
		height: 20px;
		margin-right: 10px;
		background: #000;
	}
}
</style>
