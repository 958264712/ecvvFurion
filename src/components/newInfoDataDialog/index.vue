<script lang="ts" setup>
import { ref, watch ,nextTick} from 'vue';
import moment from 'moment';

/**
 * openBatchDialog 配套参数
 * @props id 传入文件id
 * @props idName 传入表格名称
 * @props title 传入弹窗标题
 * @props titleRender 传入弹窗标题渲染组件
 * @props footerRender 传入弹窗底部渲染组件
 * @props pointerface 传入表格相应接口
 * @props loading 传入表格loading
 * @props dataList 传入表格column列表 prop为字段名 label为列名 render为特殊列传入组件外部可使用h函数进行渲染
 * @props formList 传入筛选列表
 * @props ifClose 操作弹窗
 * @props defaultValues 给予默认参数
 * @props pagination 是否需要分页
 * @props query 是否需要查询功能
 * @props width 传入弹窗宽度
 */
declare type formListType<T = any> = {
	label: String;
	porp: String;
	select?: Boolean;
	options?: [T];
}[];
const props = defineProps(['id', 'idName', 'title','width','titleRender','footerRender','pagination', 'loading','pointerface', 'dataList', 'formList', 'ifClose', 'defaultValues','query']);
const loading = ref(false);
const tableData = ref<any>([]);
const visible = ref(false);
const queryParams = ref<any>(Object.assign({}, props.defaultValues));
const tableParams = ref<any>({
	page: 1,
	pageSize: 20,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
	if(props.idName){
		queryParams.value[props.idName] = props.id;
	}
	if (props.formList?.length) { 
		props.formList.forEach((item: any) => {
			if(item?.date && !item?.render && !item?.select){
				queryParams.value['start' + item.prop] = queryParams.value[item.prop] ? moment(queryParams.value[item.prop][0]).format('YYYY-MM-DD') : undefined;
				queryParams.value['end' + item.prop] = queryParams.value[item.prop] ? moment(queryParams.value[item.prop][1]).format('YYYY-MM-DD') : undefined;
			}
		});
	}
	if(props.loading){
		loading.value = props.loading;
	}else{
		loading.value = true;
	}
    const params = {
        ...queryParams.value,
        ...tableParams.value
    };
	if (props.pointerface) {
		var res = await props.pointerface(params);
		tableData.value = res.data.result?.items ?? [];
		tableParams.value.total = res.data.result?.total;
	}
	loading.value = false;
};

const openDialog = () => {
	visible.value = true;
	nextTick(() => {
        handleQuery();
    });
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
	() => props.ifClose,
	() => {
		if (props.ifClose) {
			resetQuery();
		}
	}
);
watch(
    () => props.defaultValues,
    (newVal) => {
        if (newVal) {
            queryParams.value = { ...newVal };
        }
    },
    { deep: true , immediate: true}
);
watch(
	() => props.loading,
	(newVal) => {
		loading.value = newVal;
	}
);
defineExpose({ openDialog,resetQuery,closeDialog });
</script>
<template>
	<el-dialog v-model="visible" :width="props.width ? props.width : 1000" @close="closeDialog" draggable="" >
		<template #header>
			<template v-if="props.title"><span style="font-size: 16px;font-weight: 700; color:#fff">{{ props.title }}</span></template>
			<template v-else>
				<component :is="props.titleRender" />
			</template>
		</template>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }" v-show="props.formList?.length">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="item.label" v-for="item in props.formList">
					<el-input v-model="queryParams[item.prop]" :placeholder="'请输入' + `${item.label}`" v-if="!item?.select && !item?.date && !item?.render" />
					<el-select v-model="queryParams[item.prop]" :placeholder="'请选择' + `${item.label}`" v-else-if="item?.select && !item?.render" :multiple="item?.multiple">
						<el-option v-for="ite in item.options" :label="ite.label" :value="ite.value" />
					</el-select>
					<el-date-picker v-model="queryParams[item.prop]" :type="item.type" start-placeholder=" 开始时间" end-placeholder="结束时间" v-else-if="item?.date && !item?.render" />
					<template v-else-if="item.render">
						<component :is="item.render" v-bind="{ queryParams, item }" @update:modelValue="(val:any) => queryParams[item.prop] = val" />
					</template>
				</el-form-item>
				<el-form-item>
					<el-button-group v-if="!props?.query">
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="" :loading="props.loading ?props.loading : loading">
				<template v-for="item in props.dataList">
					<el-table-column v-if="item.prop === 'operation'" :label="item.label" width="120" align="center" fixed="right">
						<template #default="scope">
							<component :is="item.render" v-if="item.render" :scope="scope" :row="scope.row" :column="item" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label === '序号'" align="center" type="index" :label="item.label" width="45" />
					<el-table-column v-else-if="item.prop" align="center" :prop="item.prop" :label="item.label" show-overflow-tooltip="" :width="item.width" :fixed="item.fixed">
						<template #default="scope">
							<component :is="item.render" v-if="item.render" :scope="scope" :row="scope.row" :column="item" />
							<span v-else>{{ scope.row[item.prop] }}</span>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination
				v-if="!props.pagination"
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
		<template #footer>
			<template v-if="props.footerRender">
				<component :is="props.footerRender" />
			</template>
		</template>
	</el-dialog>
</template>
