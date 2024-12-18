<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import moment from 'moment';

const props = defineProps(['id', 'idName', 'title', 'titleRender', 'tableData', 'footerRender', 'loading', 'dataList', 'formList', 'ifClose', 'defaultValues', 'query']);
const loading = ref(false);
const visible = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>(Object.assign({ tableData: [] }, props.defaultValues));
const tableParams = ref<any>({
	page: 1,
	pageSize: 20,
	total: 0,
});

const openDialog = () => {
	visible.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	visible.value = false;
	loading.value = false;
};
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	tableData.value = [];
	queryParams.value.tableData.forEach((item: any, index: number) => {
		if (index < tableParams.value.pageSize) {
			tableData.value.push(item);
		}
	});
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	tableData.value = [];
	queryParams.value.tableData.forEach((item: any, index: number) => {
		if ((val - 1 ?? 1) * tableParams.value.pageSize < index + 1) {
			tableData.value.push(item);
		}
	});
};

watch(
	() => props.defaultValues,
	(newVal) => {
		if (newVal) {
			queryParams.value = { ...newVal };
			tableParams.value.total = queryParams.value.tableData.length;
			tableData.value = [];
			if (queryParams.value.tableData.length > 0) {
				queryParams.value.tableData.forEach((item: any, index: number) => {
					if (index < tableParams.value.pageSize) {
						tableData.value.push(item);
					}
				});
			}
		}
	},
	{ deep: true, immediate: true }
);
watch(
	() => props.loading,
	(newVal) => {
		loading.value = newVal;
	}
);
defineExpose({ openDialog, closeDialog });
</script>
<template>
	<el-dialog v-model="visible" :width="1000" @close="closeDialog" draggable="">
		<template #header>
			<template v-if="props.title">{{ props.title }}</template>
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
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px; height: 440px">
			<el-scrollbar height="435px">
				<p v-for="item in tableData" :key="item">{{ item }}</p>
			</el-scrollbar>
		</el-card>
		<template #footer>
			<template v-if="props.footerRender">
				<component :is="props.footerRender" />
			</template>
		</template>
	</el-dialog>
</template>
