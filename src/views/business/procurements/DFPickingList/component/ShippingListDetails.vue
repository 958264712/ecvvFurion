<template>
		<el-dialog v-model="isShowDialog" :title="props.title" :width="1000" draggable="" @close="cancel(ruleFormRef)">
			<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
				<el-form :model="queryParams" ref="queryForm" :inline="true">
					<el-form-item label="ASIN">
						<el-input v-model="queryParams.ASIN" clearable="" placeholder="请输入ASIN" />
					</el-form-item>
					<el-form-item label="ERP-SKU">
						<el-input v-model="queryParams.ErpSKU" clearable="" placeholder="请输入ErpSKU" />
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
			<el-card class="full-table" shadow="hover" style="margin-top: 8px;height: 500px">
				<el-table
					:data="tableData"
					size="lagre"
					style="width: 100%"
					v-loading="loading"
					tooltip-effect="light"
					@sort-change="sortfun"
					@selection-change="handleSelectionChange"
					:header-cell-style="customHeaderCellStyle"
					:cell-style="customCellStyle"
					row-key="id"
					border=""
				>
					<el-table-column type="selection" width="55" class-name="custom-header" align="center" />
					<el-table-column prop="images" label="图片" width="120" align="center" sortableshow-overflow-tooltip="">
						<template #default="scope">
							<el-image
								style="width: 40px; height: 40px"
								:src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpsku + '.jpg'"
								:zoom-rate="1.2"
								:max-scale="7"
								:min-scale="0.2"
								:preview-src-list="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.erpsku + '.jpg'"
								:initial-index="1"
								fit="cover"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="orderID" label="Order ID" sortable width="160" align="center" show-overflow-tooltip="" />
					<el-table-column prop="asin" label="ASIN" width="100" sortable align="center" show-overflow-tooltip="" />
					<el-table-column prop="erpsku" label="ERPSKU" width="110" sortable align="center" show-overflow-tooltip="" />
					<el-table-column prop="itemQuantity" label="Item Quantity" sortable align="center" sortableshow-overflow-tooltip="" width="160" />
					<el-table-column prop="shipmentQTY" label="Shipment QTY" sortable align="center" show-overflow-tooltip="" width="160" />
					<el-table-column prop="trackingID" label="Tracking ID" width="180" sortable align="center" >
						<template #default="scope">
							<el-popover effect="light" trigger="hover" placement="top" width="auto">
								<template #default>
									<div>双击可修改Tracking ID值</div>
								</template>
								<template #reference>
									<div style="width: 180px; height: 60px; text-align: center; line-height: 60px" @dblclick="openEdit(scope.row)">
										<el-input style="width:150px" lass="custom-input" v-if="scope.row.IsEdit" type="text" v-model="scope.row.trackingID" clearable="" @keyup.enter.native="keyDown" />
										<div v-else>{{ scope.row.trackingID }}</div>
									</div>
								</template>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					v-model:currentPage="tableParams.page"
					v-model:page-size="tableParams.pageSize"
					:total="tableParams.total"
					:page-sizes="[10, 20, 50, 100, 500, 1000]"
					small=""
					background=""
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper"
				/>
			</el-card>
		</el-dialog>
</template>
<script lang="ts" setup="">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { DFShippingListInfo, updateTrackingID } from '/@/api/modular/main/BasicDataManagement.ts';
import { FormInstance } from 'element-plus';
const loading = ref(false);
const tableData = ref<any>([]);
let IsEdit = ref<any>(false);
const queryParams = ref<inventoryParamsType>({});
const tableParams = ref<any>({
	pageNo: 1,
	pageSize: 10,
	total: 0,
	order: null,
	prop: null,
});
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
let selectedRows = ref<any>([]);
//父级传递来的函数，用于回调
const emit = defineEmits(['reloadTable']);
const ruleFormRef = ref<FormInstance>();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = JSON.parse(JSON.stringify(row));
	isShowDialog.value = true;
	handleQuery();
};
// 取消
const cancel = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
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
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
};
const keyDown = (e: any) => {
	if (e.keyCode == 13 || e.keyCode == 100) {
		Seva();
	}
};
const Seva = async () => {
	const Shipping = tableData.value.find((obj: any) => obj.IsEdit === true);
	await updateTrackingID(Shipping);
	ElMessage.success('修改成功');
	IsEdit.value = false;
	Shipping.IsEdit = false;
};
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await DFShippingListInfo(Object.assign(queryParams.value, tableParams.value, ruleForm.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	IsEdit.value = false;
	loading.value = false;
};
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}

//排序
function sortfun(v: any) {
	tableParams.value.order = v.order;
	tableParams.value.prop = v.prop;
	handleQuery();
}
function customHeaderCellStyle({ column, $index }: any) {
	// 返回包含 CSS 样式的对象
	return {
		backgroundColor: '#e9e9e9', // 设置表头背景颜色为蓝色
	};
}
function customCellStyle({ row, column, rowIndex, columnIndex }: any) {
	if (columnIndex == 7) {
		if (hasDuplicate(row.trackingID) && row.trackingID !== null) {
			return { backgroundColor: '#DDDDDD' };
		}
	}
	// 返回一个包含自定义样式的对象
	return null;
}
function hasDuplicate(value: any) {
	return tableData.value.filter((item: any) => item['trackingID'] === value).length > 1;
}
//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style lang="less" scoped>
.example-showcase .el-dropdown + .el-dropdown {
	margin-left: 15px;
}

.example-showcase .el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

.itemlabel {
	font-size: 16px;
	width: 20%;
	text-align: right;
}

:deep(.el-table .cell) {
	padding: 0;
}
</style>
