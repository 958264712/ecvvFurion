<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }" v-show="props.formList?.length">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="item.label" v-for="item in props.formList">
					<el-input v-model="queryParams[item.prop]" :placeholder="'请输入' + `${item.label}`"  v-if="!item?.select"/>
					<el-select v-model="queryParams[item.prop]" :placeholder="'请选择' + `${item.label}`"  v-else-if="item?.select">
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
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="53" align="center" />
				<el-table-column v-for="item in props.dataList" align="center" :prop="item.prop" :label="item.label" :width="props.idName === 'dibaiPoDataDataId' ? 173 :150" show-overflow-tooltip="" />
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
/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * infoDataDialog 配套参数
 * @props id 传入文件id
 * @props weeks 页面专属属性判断周月
 * @props idName 传入表格名称
 * @props pointerface 传入表格相应接口
 * @props dataList 传入表格column列表
 * @props formList 传入筛选列表 
 */
declare type formListType<T = any> = {
	label:String,
	porp:String,
	select?:Boolean,
	options?:[T]
}[]
const props = defineProps(['id','weeks', 'idName', 'pointerface', 'dataList', 'formList', 'ifClose']);
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
	queryParams.value[props.idName] = props.id;
	loading.value = true;
	if(props.idName === 'BatchId'){
		queryParams.value.TimeQuantum = props.weeks
	}
	// else if(props.idName === 'dibaiPoDataDataId'){

	// }
	var res = await props.pointerface(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
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
			queryParams.value = {}
			handleQuery();
		}
	}
);
onMounted(() => {
	handleQuery();
});
</script>
