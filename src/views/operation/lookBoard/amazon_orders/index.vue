<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="站点">
					<el-select @change="handleQuery()" v-model="queryParams.Site">
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange" v-model="queryParams.OrderTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="导入时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange" v-model="queryParams.ImportTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'uAE_ProcurementDetails:page'"> 查询 </el-button>
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div style="width: 10%">
				<el-button @click="dialogFormVisible = true" type="primary"> 导入 </el-button>
				<el-dialog v-model="dialogFormVisible" title="亚马逊订单数据导入" width="600px" center>
					<importDialog :type="importType" :text="importText" :weeks="weeks" :formList="importFormList" :importsInterface="Import" @close="importClose" @importQuery="importQuery" />
					<!-- <el-form label-width="150" label-position="right" size="large" :model="ImportParams" ref="ruleFormRef">
						<div
							style="width: 100%;height: 35px;margin-bottom: 10px;display: flex;flex-direction: column;align-items: center;justify-content: center;background-color: #FFFFE0;">
							<el-text
								size="20">{{ weeks == '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : ' 选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据' }}</el-text>
						</div>
						<el-form-item label="站点：" prop="Site" :rules="[
							{
								required: true,
								message: '站点不能为空',
								trigger: 'blur',
							}]">
							<el-select v-model="ImportParams.Site" size="large" style="width:300px;">
								<el-option value="UAE" label="UAE"></el-option>
								<el-option value="SA" label="SA"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="日期：" prop="Time" :rules="[
							{
								required: true,
								message: '日期不能为空',
								trigger: 'blur',
							}]">
							<el-date-picker style="width:300px;" size="large" v-model="ImportParams.Time" type="month"
								placeholder="请选择月份" />
						</el-form-item>
						<el-form-item v-if="weeks == '周'" label="  周：" prop="Week" :rules="[
							{
								required: true,
								message: '周不能为空',
								trigger: 'blur',
							}]">
							<el-select v-model="ImportParams.Week" size="large" style="width:300px;">
								<el-option value="第一周" label="第一周"></el-option>
								<el-option value="第二周" label="第二周"></el-option>
								<el-option value="第三周" label="第三周"></el-option>
								<el-option value="第四周" label="第四周"></el-option>
								<el-option value="第五周" label="第五周"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button :loading="ImportsSalesloading"
								style="width: 65px;height: 32px;margin-left:160px;" type="info"
								@click="dialogFormVisible = false">取消</el-button>
							<el-button :loading="ImportsSalesloading"
								style="width: 65px;height: 32px;" type="primary"
								@click="submitForm(ruleFormRef)">确定</el-button>
							<el-upload v-show="false" ref="uploadRef" 
								:on-change="Imports" :multiple="false" action="#" :show-file-list="false"
								:auto-upload="false" name="file">
								<el-button style="width: 65px;height: 32px;" :loading="ImportsSalesloading"
									type="primary">导入</el-button>
							</el-upload>
						</el-form-item>
					</el-form> -->
				</el-dialog>
			</div>
			<div style="margin-top: 5px">
				<el-button-group>
					<el-button
						style="width: 80px; height: 27px"
						@click="
							weeks = '周';
							handleQuery();
						"
						:class="{ buttonBackground: weeks == '周' }"
						>周</el-button
					>
					<el-button
						style="width: 80px; height: 27px"
						@click="
							weeks = '月';
							handleQuery();
						"
						:class="{ buttonBackground: weeks == '月' }"
						>月</el-button
					>
				</el-button-group>
			</div>
			<el-table
				:data="tableData"
				size="lagre"
				style="width: 100%"
				v-loading="loading"
				tooltip-effect="light"
				@sort-change="sortfun"
				@selection-change="handleSelectionChange"
				:header-cell-style="customHeaderCellStyle"
				row-key="id"
				border=""
			>
				<el-table-column type="selection" width="55" class-name="custom-header" />
				<el-table-column prop="asin" label="ASIN" width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="productTitle" label="Product Title" width="130" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="brand" label="Brand" width="100" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="shippedRevenue" label="Shipped Revenue" width="170" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="shippedCOGS" label="Shipped COGS" width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="shippedUnits" label="Shipped Units" width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="customerReturns" label="Customer Returns" width="170" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="site" label="站点" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="beginTime" label="订单开始时间" width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="endTime" label="订单截止时间" width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="createTime" label="导入时间" width="150" sortable align="center" show-overflow-tooltip="" />
				<el-table-column prop="creator" label="操作人" width="110" sortable align="center" show-overflow-tooltip="" />
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
<script lang="ts" setup="">
import { reactive, ref, onMounted } from 'vue';
import { service } from '/@/utils/request';
import { ElMessageBox, ElMessage, ElNotification, FormInstance, FormRules } from 'element-plus';
import axios from 'axios';
//import { formatDate } from '/@/utils/formatTime';
import { amazonOrdersPage, Import } from '/@/api/modular/main/OperationManagement.ts';
import importDialog from '/@/components/importDialog/index.vue';
import moment from 'moment';

const loading = ref(false);
const ImportsSalesloading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const dialogFormVisible = ref(false);
const weeks = ref('周');
interface RuleForm {
	Site: string;
	TimeQuantum: string;
	Time: string;
	Week: string;
}
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
const importText = ref(weeks === '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : '选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据')
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
const importClose = (bol:boolean) => {
	dialogFormVisible.value = bol
}
const importQuery = ()=>{
	handleQuery()
}
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
	tableParams.value.pageNo = val;
	handleQuery();
};

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	queryParams.value.weeks = weeks.value;
	queryParams.value.StartOrderTime = queryParams.value.OrderTime ? queryParams.value.OrderTime[0] : null;
	queryParams.value.EndOrderTime = queryParams.value.OrderTime ? queryParams.value.OrderTime[1] : null;
	queryParams.value.StartImportTime = queryParams.value.ImportTime ? queryParams.value.ImportTime[0] : null;
	queryParams.value.EndImportTime = queryParams.value.ImportTime ? queryParams.value.ImportTime[1] : null;
	if (queryParams.value.StartOrderTime) {
		const date1 = new Date(queryParams.value.StartOrderTime);
		const year1 = date1.getFullYear();
		const month1 = date1.getMonth() + 1;
		const day1 = date1.getDate();
		queryParams.value.StartOrderTime = year1 + '-' + month1 + '-' + day1;
	}
	if (queryParams.value.EndOrderTime) {
		const date2 = new Date(queryParams.value.EndOrderTime);
		const year2 = date2.getFullYear();
		const month2 = date2.getMonth() + 1;
		const day2 = date2.getDate();
		queryParams.value.EndOrderTime = year2 + '-' + month2 + '-' + day2;
	}
	if (queryParams.value.StartImportTime) {
		const date3 = new Date(queryParams.value.StartImportTime);
		const year3 = date3.getFullYear();
		const month3 = date3.getMonth() + 1;
		const day3 = date3.getDate();
		queryParams.value.StartImportTime = year3 + '-' + month3 + '-' + day3;
	}
	if (queryParams.value.EndImportTime) {
		const date4 = new Date(queryParams.value.EndImportTime);
		const year4 = date4.getFullYear();
		const month4 = date4.getMonth() + 1;
		const day4 = date4.getDate();
		queryParams.value.EndImportTime = year4 + '-' + month4 + '-' + day4;
	}
	var res = await amazonOrdersPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	weeks.value === '周' ? '选择站点、日期、周，点击"确定"后，选择需要导入的文件，将导入该数据' : '选择站点、日期，点击"确定"后，选择需要导入的文件，将导入该数据'
	if(weeks.value === '周'){
		importFormList.value.push({
		label: '周',
		prop: 'Week',
		type: 'select' ,
		select: 'Week',
		selectList: options1.value,
	})
	}else{
		importFormList.value.pop()
	}
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
</style>
