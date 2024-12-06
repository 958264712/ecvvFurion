<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue';
import uploadReceipt from './uploadReceipt.vue';
import moment from 'moment';
import { log } from 'console';

const baseUrl = import.meta.env.VITE_API_URL;
const importDialogRef = ref();
const url = ref('/api/receiptAndWarehousing/import');
const tableAddress = `${baseUrl}/upload/TableAddress/收货箱单号模板.xlsx`;

const props = defineProps(['title', 'pointerface', 'dataList', 'formList', 'defaultValues']);
const emit = defineEmits(['returnValues']);
const loading = ref(false);
const tableData = ref<any>([]);
const visible = ref(false);
const queryParams = ref<any>({showFooter:true,...props.defaultValues});
const tableParams = ref<any>({
	page: 1,
	pageSize: 8,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
	queryParams.value.startProductionTime = queryParams.value.productionTime?.length ? moment(queryParams.value.productionTime[0]).format('YYYY-MM-DD') : '';
	queryParams.value.endProductionTime = queryParams.value.productionTime?.length ? moment(queryParams.value.productionTime[1]).format('YYYY-MM-DD') : '';
	loading.value = true;
	const params = {
		...queryParams.value,
		...tableParams.value,
	};

	var res = await props.pointerface(params);
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

const openDialog = (id?: any) => {
	nextTick(() => {
		if (id) {
			queryParams.value.showFooter = false;
		} else {
			queryParams.value = Object.assign({}, props.defaultValues);
			queryParams.value.showFooter = true;
		}
		handleQuery();
	});
	visible.value = true;
};

const importReceiptWarehouse = () => {
	importDialogRef.value.openDialog();
};
const handleClose = (tag: string) => {
	queryParams.value.inWareHouseNos.splice(queryParams.value.inWareHouseNos.indexOf(tag), 1);
};
const resetQuery = () => {
	tableData.value = [];
	queryParams.value = Object.assign({}, props.defaultValues);
	tableParams.value.page = 1;
	handleQuery();
};
// 关闭弹窗
const closeDialog = () => {
	visible.value = false;
	loading.value = false;
	emit('returnValues', queryParams.value.inWareHouseNos);
};
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};

watch(
	() => props.defaultValues,
	(newVal) => {
		if (newVal) {
			queryParams.value = {
				...newVal,
				showFooter: queryParams.value.showFooter,
				state: queryParams.value.state,
			};
		}
	},
	{ deep: true }
);

defineExpose({ openDialog, resetQuery });
</script>
<template>
	<el-dialog v-model="visible" :width="1000" @close="closeDialog" draggable="">
		<template #header>
			<span style="color: #fff; font-size: large; font-weight: bold">{{ props.title }}</span>
			<span style="color: #ec808d; font-size: large; font-weight: bold">2、上传收货清单</span>
			<span style="color: #fff; font-size: large; font-weight: bold">）</span>
		</template>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }" v-show="props.formList?.length">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="item.label" v-for="item in props.formList">
					<el-input v-model="queryParams[item.prop]" :placeholder="'请输入' + `${item.label}`" v-if="!item?.select && !item?.date" />
					<el-select v-model="queryParams[item.prop]" :placeholder="'请选择' + `${item.label}`" v-else-if="item?.select" :multiple="item?.multiple">
						<el-option v-for="ite in item.options" :label="ite.label" :value="ite.value" />
					</el-select>
					<el-date-picker v-model="queryParams[item.prop]" :type="item.type" start-placeholder=" 开始时间" end-placeholder="结束时间" v-else-if="item?.date" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-row>
				<el-col :span="16">
					<el-table :data="tableData" style="width: 100%; height: 320px" v-loading="loading" tooltip-effect="light" row-key="id" border="">
						<template v-for="item in props.dataList">
							<el-table-column v-if="item.prop === 'operation'" :label="item.label" width="120" align="center" fixed="right">
								<template #default="scope">
									<component :is="item.render" v-if="item.render" :scope="scope" :row="scope.row" :column="item" />
								</template>
							</el-table-column>
							<el-table-column v-else-if="item.label === '序号'" align="center" type="index" :label="item.label" width="45" />
							<el-table-column v-else-if="item.prop" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="" :width="item.width">
								<template #default="scope">
									<component :is="item.render" v-if="item.render" :scope="scope" :row="scope.row" :column="item" />
									<span v-else>{{ scope.row[item.prop] }}</span>
								</template>
							</el-table-column>
						</template>
					</el-table>
					<el-pagination
						v-model:currentPage="tableParams.page"
						v-model:page-size="tableParams.pageSize"
						:total="tableParams.total"
						:page-sizes="[8, 10, 20, 50, 100]"
						small=""
						background=""
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						layout="total, sizes, prev, pager, next, jumper"
					/>
				</el-col>
				<el-col :span="8">
					<div class="title">已选入仓号</div>
					<div class="inWareHouseNos">
						<el-tag v-for="tag in queryParams.inWareHouseNos" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
							{{ tag }}
						</el-tag>
					</div>
				</el-col>
			</el-row>
		</el-card>
		<template #footer>
			<div class="my_footer" v-if="queryParams.showFooter">
				<el-button type="primary" @click="importReceiptWarehouse" size="default"> 下一步 </el-button>
				<el-button @click="closeDialog" size="default"> 取消 </el-button>
			</div>
		</template>
		<uploadReceipt ref="importDialogRef" title="选择货代入仓号 （" :ifExcelBol="true" :defaultValues="queryParams" :tableAddress="tableAddress" area="EN" :url="url" @reloadTable="handleQuery" />
	</el-dialog>
</template>
<style lang="scss" scoped>
.title {
	text-align: center;
	margin-bottom: 10px;
}
.inWareHouseNos {
	border: 1px solid #ccc;
	border-radius: 5px;
	height: 55%;
	margin-left: 20px;
	padding: 10px;
}
.my_footer {
	text-align: start !important;
}


</style>
