<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * openBatchDialog 配套参数
 * @props id 传入文件id
 * @props idName 传入表格名称
 * @props title 传入弹窗标题
 * @props pointerface 传入表格相应接口
 * @props dataList 传入表格column列表 prop为字段名 label为列名 render为特殊列传入组件外部可使用h函数进行渲染
 * @props formList 传入筛选列表
 * @props ifClose 操作弹窗
 * @props defaultValues 给予默认参数
 */
declare type formListType<T = any> = {
	label: String;
	porp: String;
	select?: Boolean;
	options?: [T];
}[];
const props = defineProps(['id', 'idName', 'title', 'pointerface', 'dataList', 'formList', 'ifClose', 'defaultValues']);
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
	queryParams.value[props.idName] = props.id;
	loading.value = true;
    const params = {
        ...queryParams.value,
        ...tableParams.value
    };
    
    var res = await props.pointerface(params);
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

const openDialog = () => {
	visible.value = true;
	handleQuery();
};
const resetQuery = () => {
	queryParams.value = {};
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
			queryParams.value = {};
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
    { deep: true }
);
defineExpose({ openDialog });
</script>
<template>
	<el-dialog v-model="visible" :title="props.title" :width="1000" @close="closeDialog" draggable="">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }" v-show="props.formList?.length">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="item.label" v-for="item in props.formList">
					<el-input v-model="queryParams[item.prop]" :placeholder="'请输入' + `${item.label}`" v-if="!item?.select" />
					<el-select v-model="queryParams[item.prop]" :placeholder="'请选择' + `${item.label}`" v-else-if="item?.select">
						<el-option v-for="ite in item.options" :label="ite.label" :value="ite.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<template v-for="item in props.dataList">
					<el-table-column v-if="item.prop === 'operation'" :label="item.label" width="120" align="center" fixed="right">
						<template #default="scope">
							<component :is="item.render" v-if="item.render" :scope="scope" :row="scope.row" :column="item" />
						</template>
					</el-table-column>
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
				:page-sizes="[10, 20, 50, 100]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
	</el-dialog>
</template>
