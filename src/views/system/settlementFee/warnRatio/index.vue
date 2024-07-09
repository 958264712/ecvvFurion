<script lang="ts" setup name="warnRatio">
import { ref, watch, onMounted } from 'vue';
import editDialog from './components/index.vue';
import { ElMessage } from 'element-plus';
import { warnPage, warnUpdate } from '/@/api/modular/main/targetGrossProfit';

const queryParams = ref<any>({});
const tableData = ref<any>([]);
const tableParams = ref<any>({ page: 1, pageSize: 20 });
const setUAE = ref(true);
const setSA = ref(true);
const loading = ref(false);
const disabledList = ref<any>([]);


const handleQuery = async (): void => {
	loading.value = true;
	// getRate();
	var res = await warnPage(Object.assign(tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	res.data.result?.items.map((item) => {
		disabledList.value.push(item.site);
	});
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

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
	if (disabledList.value.some((item) => item === val.row.site)) {
		const index = disabledList.value.findIndex((item) => item === val.row.site);
		disabledList.value.splice(index, 1);
	} else {
		const reg = /^[0-9]{1,10}$/
		if(reg.test(val.row.warningRatio)){
			var res = await warnUpdate(Object.assign({ site: val.row.site, warningRatio: parseFloat(val.row.warningRatio) })).then(ElMessage.success('Save Successfully!'));
			disabledList.value.push(val.row.site);
			handleQuery()
		}else{
			ElMessage.error('请输入只含数字的内容！')
		}
	}
};
const disabledAuto = (scope: any): void => {
	return disabledList.value.some((item) => item === scope.row.site);
};
handleQuery();
</script>
<template>
	<div class="stock_sku_operations">
		<el-card class="full-table" shadow="hover">
			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column prop="site" label="站点" align="center" show-overflow-tooltip="" />
				<el-table-column prop="warningRatio" label="预警比例（%）" align="center">
					<template #default="scope">
						<el-input v-model="scope.row.warningRatio" :disabled="disabledAuto(scope)" />
					</template>
				</el-table-column>
				<el-table-column prop="operatorTime" label="操作时间 " align="center" />
				<el-table-column prop="operatorUser" label="操作人 " align="center" />
				<el-table-column label="操作 " align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="disabledfun(scope)">{{ disabledList.some((item) => item === scope.row.site) ? '编辑' : '保存' }}</el-button>
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
