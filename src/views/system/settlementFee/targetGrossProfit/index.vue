<script lang="ts" setup name="targetGrossProfit">
import { ref, watch, onMounted } from 'vue';
import editDialog from './components/index.vue';
import { ElMessage } from 'element-plus';
import { targetPage, targetUpdate } from '/@/api/modular/main/targetGrossProfit';

const queryParams = ref<any>({});
const tableData = ref<any>([]);
const tableParams = ref<any>({ page: 1, pageSize: 20 });
const setUAE = ref(true);
const setSA = ref(true);
const loading = ref(false);
const disabledList = ref<any>([]);

// const getRate = async () => {
// 	await targetGetRate().then((res) => {
// 		if (res.data.code === 200) {
// 			queryParams.value = {
// 				UAE: res.data.result.uaeRate,
// 				SA: res.data.result.saRate,
// 			};
// 		}
// 	});
// };
const handleQuery = async (): void => {
	loading.value = true;
	// getRate();
	var res = await targetPage(Object.assign(tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	res.data.result?.items.map((item) => {
		disabledList.value.push(item.id);
	});
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
// const setItem = async (name: string, item: boolean) => {
// 	switch (name) {
// 		case 'UAE':
// 			setUAE.value = !item;
// 			break;
// 		default:
// 			setSA.value = !item;
// 			break;
// 	}
// 	if (!item) {
// 		await targetUpdate(Object.assign({ site: name, rate: queryParams.value[name] })).then((res) => {
// 			if (res.data.code === 200) {
// 				ElMessage.success('保存成功');
// 				handleQuery();
// 			}
// 		});
// 	}
// };
// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	handleQuery();
};
// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	handleQuery();
};
// 修改与批量修改
const disabledfun = async (val: any): void => {
	if (disabledList.value.some((item) => item === val.row.id)) {
		const index = disabledList.value.findIndex((item) => item === val.row.id);
		disabledList.value.splice(index, 1);
	} else {
		const reg = /^[0-9]{1,10}$/
		if(reg.test(val.row.rateStr)){
			var res = await targetUpdate(Object.assign({ id: val.row.id, rate: parseFloat(val.row.rateStr) })).then(ElMessage.success('Save Successfully!'));
			disabledList.value.push(val.row.id);
			handleQuery()
		}else{
			ElMessage.error('请输入只含数字的内容！')
		}
	}
};
const disabledAuto = (scope: any): void => {
	return disabledList.value.some((item) => item === scope.row.id);
};
handleQuery();
</script>
<template>
	<div class="stock_sku_operations">
		<!-- <el-form :model="queryParams" :inline="true" style="width: 99%">
			<el-row :gutter="35">
				<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20 mb">
					<div class="grossprofit">UAE目标毛利润</div>
					<el-form-item
						label="毛利润(%)"
						:rules="[
							{
								required: true,
								message: 'UAE目标毛利润不能为空',
								trigger: 'blur',
							},
						]"
					>
						<el-input v-model="queryParams.UAE" :disabled="setUAE" />
						<el-button type="primary" style="marginleft: 10px" @click="setItem('UAE', setUAE)">{{ setUAE ? '设置' : '保存' }}</el-button>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="11" :md="11" :lg="11" :xl="11" class="mb20">
					<div class="grossprofit">SA目标毛利润</div>
					<el-form-item
						label="毛利润(%)"
						:rules="[
							{
								required: true,
								message: 'SA目标毛利润不能为空',
								trigger: 'blur',
							},
						]"
					>
						<el-input v-model="queryParams.SA" :disabled="setSA" />
						<el-button type="primary" style="marginleft: 10px" @click="setItem('SA', setSA)">{{ setSA ? '设置' : '保存' }}</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form> -->
		<el-card class="full-table" shadow="hover">
			<!-- <div class="settingf">历史记录</div> -->
			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column prop="site" label="采购国" align="center" show-overflow-tooltip="" />
				<el-table-column prop="rateStr" label="毛利率（%）" align="center">
					<template #default="scope">
						<el-input v-model="scope.row.rateStr" :disabled="disabledAuto(scope)" />
					</template>
				</el-table-column>
				<el-table-column prop="operationTime" label="操作时间 " align="center" />
				<el-table-column prop="creator" label="操作人 " align="center" />
				<el-table-column label="操作 " align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="disabledfun(scope)">{{ disabledList.some((item) => item === scope.row.id) ? '编辑' : '保存' }}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:current-page="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:page-sizes="[10, 20, 50, 100, 500, 1000]"
				:small="small"
				:background="background"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableParams.total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
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
