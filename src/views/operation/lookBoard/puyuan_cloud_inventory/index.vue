<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="日期">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="monthrange" v-model="queryParams.dateTime" format="YYYY-MM" />
				</el-form-item>
				<el-form-item label="导入时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间"
						type="daterange" v-model="queryParams.ImportTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"
							v-auth="'uAE_ProcurementDetails:page'"> 查询 </el-button>
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
			<div style="width: 10%">
				<el-button @click="dialogFormVisible = true" type="primary"> 导入 </el-button>
				<el-dialog v-model="dialogFormVisible" title="普源云库存数据导入" width="600px" center>
					<importDialog :type="importType" :text="importText" :weeks="weeks" :formList="importFormList"
						:importsInterface="puyuanCloudInventoryimport" @close="importClose"
						@importQuery="importQuery" />
				</el-dialog>
			</div>
			<div style="margin-top: 5px">
				<el-button-group>
					<el-button style="width: 80px; height: 27px" @click="
			weeks = '周';
		handleQuery();
		" :class="{ buttonBackground: weeks == '周' }">周</el-button>
					<el-button style="width: 80px; height: 27px" @click="
			weeks = '月';
		handleQuery();
		" :class="{ buttonBackground: weeks == '月' }">月</el-button>
				</el-button-group>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				:header-cell-style="customHeaderCellStyle" row-key="id" border="">
				<el-table-column type="index" label="序号" align="center" show-overflow-tooltip="" />
				<el-table-column prop="fileName" label="文件名" align="center" show-overflow-tooltip="" />
				<el-table-column prop="puyuanCloudInventoryTime" label="日期" align="center" show-overflow-tooltip="" />
				<el-table-column v-if="weeks === '周'" prop="weeks" label="周数" align="center" show-overflow-tooltip="" />
				<el-table-column prop="createTime" label="导入时间" align="center" show-overflow-tooltip="" />
				<el-table-column prop="creator" label="操作人" align="center" show-overflow-tooltip="" />
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button icon="ele-Document" size="small" text="" type="primary"
							@click="showModal(scope.row.id)"> 详情 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<el-dialog v-model="visible" title="详情" @close="close" width="1000px">
				<infoDataDialog :id="puyuanyunId" idName="BatchId" :weeks="weeks" :dataList="dataList"
					:ifClose="ifClose" :pointerface="puyuanCloudInventoryPage" :formList="formList" />
			</el-dialog>
		</el-card>
	</div>
</template>
<script lang="ts" setup="" name="puyuan_cloud_inventory">
import { ref } from 'vue';
import { service } from '/@/utils/request';
import { ElMessageBox, ElMessage, ElNotification, FormInstance } from 'element-plus';
import axios from 'axios';
//import { formatDate } from '/@/utils/formatTime';
import { puyuanCloudInventoryPage, puyuanCloudInventoryimport, batchPuyuanCloudInventoryPage } from '/@/api/modular/main/OperationManagement.ts';
import importDialog from '/@/components/importDialog/index.vue';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';

const loading = ref(false);
const ImportsSalesloading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const dialogFormVisible = ref(false);
const ifClose = ref(false);
const visible = ref(false);
const weeks = ref('周');
const puyuanyunId = ref<any>('')
const ruleFormRef = ref<FormInstance>();
const ImportParams = ref<any>({
	Site: '',
	TimeQuantum: weeks.value,
	Time: new Date(),
	Week: '',
});
const tableParams = ref({
	Page: 1,
	pageSize: 20,
	total: 0,
	Order: null,
	Field: null,
});
//打开弹窗
function showModal(id: any) {
	puyuanyunId.value = id;
	ifClose.value = true;
	visible.value = true;
}

//关闭弹窗
function close() {
	visible.value = false;
	ifClose.value = false;
}
// infoDataDialog 配套参数
const formList = ref<any>([
	{
		label: '库存SKU',
		prop: 'inventorySKU'
	}
]);
const dataList = ref<any>([
	{
		label: '仓库名称',
		prop: 'warehouse',
	},
	{
		label: '库存SKU',
		prop: 'inventorySKU',
	},
	{
		label: '商品名称',
		prop: 'tradeName',
	},
	{
		label: '款式1',
		prop: 'style1',
	},
	{
		label: '款式2',
		prop: 'style2',
	},
	{
		label: '款式3',
		prop: 'style3',
	},
	{
		label: '采购员',
		prop: 'purchaser',
	},
	{
		label: '商品信息',
		prop: 'costPriceOfProductInformation',
	},
	{
		label: '期初数量',
		prop: 'initialQuantity',
	},
	{
		label: '期初金额',
		prop: 'initialAmount',
	},
	{
		label: '本期入库数量',
		prop: 'currentInventoryQuantity',
	},
	{
		label: '本期出库数量',
		prop: 'currentOutboundQuantity',
	},
	{
		label: '本期出库金额',
		prop: 'currentOutboundAmount',
	},
	{
		label: '期末数量',
		prop: 'endOfPeriodQuantity',
	},
	{
		label: '平均单价',
		prop: 'averageUnitPrice',
	},
	{
		label: '金额',
		prop: 'amount',
	},
	{
		label: '导入时间',
		prop: 'createTime',
	},
	{
		label: '操作人',
		prop: 'creator',
	},

]);
let selectedRows = ref<any>([]);
const uploadRef = ref<any>(null);
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			uploadRef.value.$el.querySelector('input').click();
		} else {
		}
	});
};
const importType = ref('puyuanCloudInventory');
const importText = ref(weeks.value === '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : '选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据');
const options1 = ref([
	{
		value: '第一周',
		label: '第一周',
	},
	{
		value: '第二周',
		label: '第二周',
	},
	{
		value: '第三周',
		label: '第三周',
	},
	{
		value: '第四周',
		label: '第四周',
	},
	{
		value: '第五周',
		label: '第五周',
	},
]);
const importFormList = ref<any>([
	{
		label: '日期',
		prop: 'Time',
		type: 'datePicker',
		dateType: 'month',
	},
]);
const importClose = (bol: boolean) => {
	dialogFormVisible.value = bol;
};
const importQuery = () => {
	handleQuery();
};
function Imports(file: any) {
	ImportParams.value.TimeQuantum = weeks.value;
	const dateObject = new Date(ImportParams.value.Time);
	const options = { year: 'numeric', month: 'long' };
	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
	// 格式化日期
	ImportsSalesloading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('TimeQuantum', ImportParams.value.TimeQuantum);
	formData.append('Time', formattedDate);
	formData.append('Week', ImportParams.value.Week);
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/puyuanCloudInventory/import`, formData)
		//ImportInventorySummaryLedger(formData)
		.then((res: any) => {
			ImportsSalesloading.value = false;
			if (res.data.code == 200) {
				ElMessage.success('导入成功');
				handleQuery();
			} else {
				ImportsSalesloading.value = false;
				ElMessage.error('导入失败'); // + res.message
			}
		});
}

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
	queryParams.value.StartImportTime = queryParams.value.ImportTime ? queryParams.value.ImportTime[0] : null;
	queryParams.value.EndImportTime = queryParams.value.ImportTime ? queryParams.value.ImportTime[1] : null;
	queryParams.value.StartDateTime = queryParams.value.dateTime ? queryParams.value.dateTime[0] : null;
	queryParams.value.EndDateTime = queryParams.value.dateTime ? queryParams.value.dateTime[1] : null;

	if (queryParams.value.StartImportTime) {
		const date1 = new Date(queryParams.value.StartImportTime);
		const year1 = date1.getFullYear();
		const month1 = date1.getMonth() + 1;
		const day1 = date1.getDate();
		queryParams.value.StartImportTime = year1 + '-' + month1 + '-' + day1;
	}
	if (queryParams.value.EndImportTime) {
		const date2 = new Date(queryParams.value.EndImportTime);
		const year2 = date2.getFullYear();
		const month2 = date2.getMonth() + 1;
		const day2 = date2.getDate();
		queryParams.value.EndImportTime = year2 + '-' + month2 + '-' + day2;
	}
	if (queryParams.value.StartDateTime) {
		const date3 = new Date(queryParams.value.StartDateTime);
		const year3 = date3.getFullYear();
		const month3 = date3.getMonth() + 1;
		queryParams.value.StartDateTime = year3 + '-' + month3;
	}
	if (queryParams.value.EndDateTime) {
		const date4 = new Date(queryParams.value.EndDateTime);
		const year4 = date4.getFullYear();
		const month4 = date4.getMonth() + 1;
		queryParams.value.EndDateTime = year4 + '-' + month4;
	}
	var res = await batchPuyuanCloudInventoryPage(Object.assign(queryParams.value, tableParams.value));
	let arrList = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	weeks.value === '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : '选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据';
	let monthData = []
	tableData.value = []
	arrList.map((item, index) => {
		if ((item.timeQuantum === '月' && weeks.value !== '周') || !item.weeks) {
			monthData.push(item)
		} else if (item.timeQuantum === '周' && weeks.value === '周' && item.weeks) {
			tableData.value.push(item)
			tableParams.value.total = tableData.value?.length
		}
	})
	if (weeks.value === '周') {
		importFormList.value.push({
			label: '周',
			prop: 'Week',
			type: 'select',
			select: 'Week',
			selectList: options1.value,
		});
	} else {
		tableData.value = monthData
		tableParams.value.total = tableData.value?.length
		importFormList.value.pop();
	}
	loading.value = false;
};

function customHeaderCellStyle({ column, $index }) {
	// 返回包含 CSS 样式的对象
	return {
		backgroundColor: '#e9e9e9	', // 设置表头背景颜色为蓝色
	};
}
handleQuery();
</script>
<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 500px;
}

.buttonBackground {
	background-color: #e76957;
	box-shadow: 0 0 0 1px #e76957 inset;
	color: white;
}

.example-showcase .el-dropdown+.el-dropdown {
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

:deep(.el-dialog__title) {
	color: white;
}
</style>
