<template>
	<el-dialog v-model="isShowDialog" :title="props.title" :width="1000" draggable="" @close="cancel(ruleFormRef)">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ERP-SKU">
					<el-input v-model="queryParams.ErpSKU" clearable="" placeholder="请输入SKU" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"
							v-auth="'uAE_ProcurementDetails:page'">
							查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
							queryParams = {};
							handleQuery();
						}
							">
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				height="450" @sort-change="sortfun" :header-cell-style="customHeaderCellStyle" row-key="id" border="">
				<el-table-column prop="erpsku" label="ERP-SKU" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="images" label="图片" width="80" align="center" sortableshow-overflow-tooltip="">
					<template #default="scope">
						<el-image style="width: 40px; height: 40px"
							:src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpsku + '.jpg'"
							:zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
							:preview-src-list="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpsku + '.jpg'"
							:initial-index="1" fit="cover" />
					</template>
				</el-table-column>
				<el-table-column prop="origin" label="Origin" sortable width="90" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="shipmentQTY" label="Shipment QTY" sortable width="150" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="number" label="ERP Inventory 库存数量" sortable width="200" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="outofstockQTY" label="Out of stock QTY 缺货数量" sortable width="220" align="center"
					sortableshow-overflow-tooltip="" />
				<el-table-column prop="departureDate" label="Out of stock estimated delivery time缺货预计到货时间" sortable
					width="390" align="center" sortableshow-overflow-tooltip="" />
				<el-table-column prop="storageBin" label="StorageBin" sortable width="200" align="center"
					sortableshow-overflow-tooltip="" />
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</el-dialog>
</template>
<script lang="ts" setup="" name="oFSStockWarning">
import { ref } from 'vue';
//import { formatDate } from '/@/utils/formatTime';
import { DFPickingListInfo } from '/@/api/modular/main/BasicDataManagement.ts';
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<inventoryParamsType>({});
const tableParams = ref({
	pageNo: 1,
	pageSize: 20,
	total: 0,
	order: null,
	prop: null
});
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
// 关闭弹窗
const closeDialog = () => {
	emit('reloadTable');
	isShowDialog.value = false;
};
// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	isShowDialog.value = true;
	handleQuery();
};
// 取消
const cancel = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields();
	isShowDialog.value = false;
};
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.pageNo = val;
	handleQuery();
};

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await DFPickingListInfo(Object.assign(queryParams.value, tableParams.value, ruleForm.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

//排序
function sortfun(v: any) {
	tableParams.value.order = v.order;
	tableParams.value.prop = v.prop;
	handleQuery();
}
function customHeaderCellStyle({ column, $index }) {
	// 返回包含 CSS 样式的对象
	return {
		backgroundColor: '#e9e9e9	', // 设置表头背景颜色为蓝色
	};
}
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>