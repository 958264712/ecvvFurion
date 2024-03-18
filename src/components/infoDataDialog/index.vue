<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item :label="item.label" v-for="item in props.formList">
					<el-input v-model="queryParams[item.prop]"  :placeholder="'请输入'+`${item.label}`" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() =>  {queryParams = { };handleQuery()}"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column v-for="item in props.dataList" align="center" :prop="item.prop" :label="item.label" width="150"  show-overflow-tooltip="" />
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
import { ref, onMounted,watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
/**
 * 和弹窗组件el-dialog配套使用，外部弹窗控制大小，本组件主要用于详情，带查询表格展示，不带弹窗
 * infoDataDialog 配套参数
 * @props id 传入文件id
 * @props idName 传入表格名称
 * @props interface 传入表格相应接口
 * @props dataList 传入表格column列表
 * @props formList 传入筛选列表
 */
const props = defineProps(['id','idName','interface','dataList','formList']);
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ });
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

// 查询操作
const handleQuery = async () => {
    queryParams.value[props.idName] = props.id
	loading.value = true;
	var res = await props.interface(Object.assign(queryParams.value, tableParams.value));
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
onMounted(()=>{
    handleQuery();
})
</script>
