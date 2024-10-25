<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }" v-show="props.formList?.length">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="item.label" v-for="item in props.formList">
					<el-input v-model="queryParams[item.prop]" :placeholder="props?.exportBarCode ? '请输入' + `${item.label}支持多个` :'请输入' + `${item.label}`" v-if="!item?.select" />
					<el-select v-model="queryParams[item.prop]" :placeholder="'请选择' + `${item.label}`" v-else-if="item?.select">
						<el-option v-for="ite in item.options" :label="ite.label" :value="ite.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
					<el-button-group v-if="props?.exportBarCode">
						<el-button type="primary" :loading="exportLoading" @click="exportBarCode" style="margin: 0 10px"> Export BarCode </el-button>
						<el-checkbox value="Made in China" label="Made in China" v-model="queryParams.checkbox" />
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="35" align="center" v-if="props?.exportBarCode" />
				<el-table-column type="index" label="序号" width="53" align="center" />
				<template v-for="item in props.dataList">
					<el-table-column v-if="item.prop === 'downloadPath'" align="center" :prop="item.prop" :label="item.label" width="260" show-overflow-tooltip="">
						<template #default="scope">
							<el-link type="success" :href="scope.row.downloadPath">{{ scope.row.downloadPath?.split('PO/')[1] }}</el-link>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label === '预计到仓日期'" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row?.warehouseArrivalDate ? moment(scope.row?.warehouseArrivalDate).format('YYYY-MM-DD') : undefined }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label === '最迟履单日期'" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row?.latestDate ? moment(scope.row?.latestDate).format('YYYY-MM-DD') : undefined }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label === '建议约仓时间'" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row?.swaDate ? moment(scope.row?.swaDate).format('YYYY-MM-DD') : undefined }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label === '实际约仓时间'" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row?.bookingTime ? moment(scope.row?.bookingTime).format('YYYY-MM-DD') : undefined }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.prop === 'exportHistoryDocx'" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="">
						<template #default="scope">
							{{scope.row?.exportHistoryDocx == 0 ? 'NO' : 'YES'}}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.prop" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="" />
				</template>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import moment from 'moment';
import { service } from '/@/utils/request';
import other from '/@/utils/other.ts';
/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * infoDataDialog 配套参数
 * @props id 传入文件id
 * @props weeks 页面专属属性判断周月
 * @props idName 传入表格名称
 * @props pointerface 传入表格相应接口
 * @props dataList 传入表格column列表
 * @props formList 传入筛选列表
 * @props ifClose 操作弹窗
 * @props exportBarCode 导出条形码  --- new po单特有
 * @props site 接口添加站点  --- new po单特有
 */
declare type formListType<T = any> = {
	label: String;
	porp: String;
	select?: Boolean;
	options?: [T];
}[];
const props = defineProps(['id', 'weeks', 'idName', 'pointerface', 'dataList', 'formList', 'ifClose', 'exportBarCode','site']);
const loading = ref(false);
const exportLoading = ref(false);
const timer = ref(null);
const startTime = ref(0);
const tableData = ref<any>([]);
const selectedRows = ref([]);
const selectedRowKeys = ref([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
	queryParams.value[props.idName] = props.id;
	loading.value = true;
	if (props.idName === 'BatchId') {
		queryParams.value.TimeQuantum = props.weeks;
	}
	if(props.exportBarCode){
		queryParams.value.site = props.site;
	}
	queryParams.value.checkbox = false;
	var res = await props.pointerface(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 导出条形码--new po单特有
const exportBarCode = async () => {
	queryParams.value[props.idName] = props.id;
	exportLoading.value = true;
	service({
		url: `/api/newPoData/getBarCode`,
		method: 'post',
		data: Object.assign(queryParams.value, { asinList: selectedRowKeys.value }),
	}).then((res: any) => {
		// 使用轮询下载文件
		inquireData(res.data.result);
		startTime.value = new Date().getTime();
	});
};
// 轮询
const inquireData = (fileName: String) => {
	const reload = () => {
		clearTimeout(timer.value); // 清除定时器
		// 超过3分钟则停止轮询
		if (new Date().getTime() - startTime.value > 3 * 60 * 1000) {
			clearTimeout(timer.value);
			return;
		}
		timer.value = setTimeout(() => {
			inquireData(fileName); // 调用轮询
		}, 3000);
	};
	service({
		url: `/api/newPoData/downPoFile/${fileName}`,
		method: 'post',
	}).then((res: any) => {
		if (res.data.result === '') {
			// 没成功,调用轮询
			reload();
		} else {
			window.open(res.data.result, '_blank');
			exportLoading.value = false;
			ElMessage.success('Export Success!');
			handleQuery()
		}
	});
};
// 选中条数导出条形码--new po单特有
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item?.asin);
	});
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
	() => props.id,
	(val) => {
		queryParams.value[props.idName] = props.id;
		handleQuery();
	}
);
watch(
	() => props.ifClose,
	() => {
		if (props.ifClose) {
			queryParams.value = {};
			exportLoading.value = false
		}else{
			if(props.exportBarCode)return clearTimeout(timer.value);
		}
	}
);
onMounted(() => {
	handleQuery();
});
</script>
