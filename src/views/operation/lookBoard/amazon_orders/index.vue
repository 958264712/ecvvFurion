<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="站点">
					<el-select @change="handleQuery()" v-model="queryParams.site">
						<el-option value="全部" label="全部"></el-option>
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="ASIN">
					<el-popover :visible="visibleTextarea" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input
								v-model="queryParams.asinTextArea"
								style="width: 215px"
								:autosize="{ minRows: 1, maxRows: 200 }"
								type="textarea"
								placeholder="可输入多个ASIN精确查询，每行一个，最多支持200个"
							/>
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.asin?.length ?? 0 }}/200</span>
							<el-button type="info" @click="resetQueryConditionsByASIN()">重置</el-button>
							<el-button type="primary" @click="handleConfirm">确定</el-button>
						</div>
						<template #reference>
							<el-input v-model="aSIN" clearable="" placeholder="请输入,点击展开可输多个" @clear="clearAsin">
								<template #suffix>
									<el-icon class="el-input__icon">
										<ArrowDownBold @click="showTextarea" v-if="!visibleTextarea" />
										<ArrowUpBold @click="showTextarea" v-else />
									</el-icon>
								</template>
							</el-input>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item label="Order Date">
					<el-date-picker style="width: 250px" v-model="queryParams.startDate" type="daterange" range-separator="——" start-placeholder="年/月/日" end-placeholder="年/月/日" />
				</el-form-item>
				<el-form-item label="Get time">
					<el-date-picker style="width: 250px" v-model="queryParams.createTime" type="daterange" range-separator="——" start-placeholder="年/月/日" end-placeholder="年/月/日" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'uAE_ProcurementDetails:page'"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									aSIN = ''
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light" @sort-change="sortfun" :header-cell-style="customHeaderCellStyle" row-key="id" border="">
				<el-table-column prop="site" label="站点" width="80" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="asin" label="ASIN" min-width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="shippedRevenue" label="Shipped Revenue" min-width="170" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="shippedCOGS" label="Shipped COGS" min-width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="shippedUnits" label="Shipped Units" min-width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="customerReturns" label="Customer Returns" min-width="170" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="startDate" label="Order Date" min-width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="createTime" label="Get Time" min-width="150" sortable align="center" show-overflow-tooltip="" />
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
	</div>
</template>
<script lang="ts" setup="" name="amazon_orders">
import { reactive, ref, onMounted, watch } from 'vue';
import { service } from '/@/utils/request';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, ElNotification, FormInstance, FormRules } from 'element-plus';
import axios from 'axios';
//import { formatDate } from '/@/utils/formatTime';
import { amazonOrdersPage, Import } from '/@/api/modular/main/OperationManagement.ts';
import importDialog from '/@/components/importDialog/index.vue';
import moment from 'moment';
import regexHelper from '/@/utils/regexHelper';
import { clearEmptyDataByAny } from '/@/utils/constHelper';

const { clearCharactersByRegex } = regexHelper();
const loading = ref(false);
const isWatch = ref(true);
const ImportsSalesloading = ref(false);
const visibleTextarea = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ site: '全部' });
const dialogFormVisible = ref(false);
const weeks = ref('周');
const aSIN = ref('');
interface RuleForm {
	site: string;
	TimeQuantum: string;
	Time: string;
	Week: string;
}
const ruleFormRef = ref<FormInstance>();
const ImportParams = ref<any>({
	site: '',
	TimeQuantum: weeks.value,
	Time: new Date(),
	Week: '',
});
const tableParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
	order: null,
	field: null,
});
const uploadRef = ref<any>(null);
let selectedRows = ref<any>([]);
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			uploadRef.value.$el.querySelector('input').click();
		} else {
		}
	});
};
const importType = ref('amazonOrders');
const importText = ref(weeks.value === '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : '选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据');
const options = ref([
	{
		value: 'UAE',
		label: 'UAE',
	},
	{
		value: 'SA',
		label: 'SA',
	},
]);
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
		label: '站点',
		prop: 'Site',
		type: 'select',
		select: 'Site',
		selectList: options.value,
	},
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
// function Imports(file: any) {
// 	ImportParams.value.TimeQuantum = weeks.value;
// 	const dateObject = new Date(ImportParams.value.Time);
// 	const options = { year: 'numeric', month: 'long' };
// 	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
// 	// 格式化日期
// 	ImportsSalesloading.value = true;
// 	const formData = new FormData();
// 	formData.append('file', file.raw);
// 	formData.append('TimeQuantum', ImportParams.value.TimeQuantum);
// 	formData.append('Site', ImportParams.value.Site);
// 	formData.append('Time', formattedDate);
// 	formData.append('Week', ImportParams.value.Week);
// 	axios.post(import.meta.env.VITE_API_URL as any + `/api/amazonOrders/import`, formData)
// 		//ImportInventorySummaryLedger(formData)
// 		.then((res: any) => {
// 			ImportsSalesloading.value = false;
// 			if (res.data.code == 200) {
// 				ElMessage.success('导入成功');
// 				handleQuery();
// 			} else {
// 				ImportsSalesloading.value = false;
// 				ElMessage.error('导入失败'); // + res.message
// 			}
// 		});
// }

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.Page = val;
	handleQuery();
};

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	queryParams.value.startOrderTime = queryParams.value.startDate ? moment(queryParams.value.startDate[0]).format('YYYY-MM-DD') : null;
	queryParams.value.endOrderTime = queryParams.value.startDate ? moment(queryParams.value.startDate[1]).format('YYYY-MM-DD') : null;
	queryParams.value.startImportTime = queryParams.value.createTime ? moment(queryParams.value.createTime[0]).format('YYYY-MM-DD') : null;
	queryParams.value.endImportTime = queryParams.value.createTime ? moment(queryParams.value.createTime[1]).format('YYYY-MM-DD') : null;
	if (queryParams.value.site === '全部') {
		queryParams.value.site = null;
	}

	var res = await amazonOrdersPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	weeks.value === '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : '选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据';
	if (weeks.value === '周') {
		importFormList.value.push({
			label: '周',
			prop: 'Week',
			type: 'select',
			select: 'Week',
			selectList: options1.value,
		});
	} else {
		importFormList.value.pop();
	}
	setTimeout(() => {
		if (queryParams.value.site === null) {
			queryParams.value.site = '全部';
		}
	}, 100);
	loading.value = false;
};
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.erpSKU);
	});
}

//排序
function sortfun(v: any) {
	tableParams.value.Order = v.order;
	tableParams.value.Field = v.prop;
	handleQuery();
}
function customHeaderCellStyle({ column, $index }) {
	// 返回包含 CSS 样式的对象
	return {
		backgroundColor: '#e9e9e9	', // 设置表头背景颜色为蓝色
	};
}
const resetQueryConditionsByASIN = () => {
	queryParams.value.asinTextArea = '';
	queryParams.value.asin = '';
	aSIN.value = '';
};
const clearAsin = () => {
	aSIN.value = '';
	queryParams.value.asinTextArea = '';
	queryParams.value.asin = null;
};
const handleConfirm = () => {
	let str_array = [];
	str_array = clearCharactersByRegex(queryParams.value.asinTextArea + '');
	//去除数组里面的空字符以及null
	let arr = clearEmptyDataByAny(str_array);
	if (arr?.length > 0) {
		aSIN.value = arr + '';
	}
	visibleTextarea.value = false;
};
const showTextarea = () => {
	visibleTextarea.value = !visibleTextarea.value;
};
watch(
	() => queryParams.value.asinTextArea,
	() => {
		//isWatch为true时才修改数据，防止死循环
		if(isWatch.value && queryParams.value.asinTextArea !== undefined){
			isWatch.value = false;
			let str_array = clearCharactersByRegex(queryParams.value.asinTextArea + ''.trim());
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				queryParams.value.asin = arr;
				aSIN.value = arr;
			} else {
				queryParams.value.asin = null;
				aSIN.value = '';
			}
		}else{
			isWatch.value = true;
		}
	}
);

watch(
	() => aSIN.value,
	() => {
		//isWatch为true时才修改数据，防止死循环
		if(isWatch.value ){
			isWatch.value = false;
			let str_array = clearCharactersByRegex(aSIN.value.trim());
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				queryParams.value.asin = arr;
				queryParams.value.asinTextArea = arr;
			} else {
				queryParams.value.asin = null;
				queryParams.value.asinTextArea = '';
			}
		}else
		{
			isWatch.value = true;
		}
	}
);
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

:deep(.el-dialog__title) {
	color: white;
}
:deep( .el-textarea__inner) {
	box-shadow: initial;
	margin:0;
	padding:5px;
	height: 142px !important;
}

</style>
