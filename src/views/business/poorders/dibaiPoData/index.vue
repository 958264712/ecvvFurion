<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { pagePoData, deletePoData, updateOrderDate, ImportPO, bulkImportOrderDate, multipleExportByTemplate, downLoadPOZip } from '/@/api/modular/main/aSINBasicData.ts';
import PoDataSource from './components/poDataSource.vue';
import { service } from '/@/utils/request';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';

const timer = ref<any>();
const startTime = ref(0); // 初始开始请求时间
const loading = ref(false);
const loading1 = ref(false);
const bulkImportOrderDateloading = ref(false);
const ifClose = ref(false);
const cardLoading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<PoParamsType>({
	orderdate:'orderDate',
	vendor:'Verdor',
});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const pos = ref('');
const visible = ref(false); //ASIN列表弹窗
const visible1 = ref(false); //编辑OrderDate弹窗
const visible2 = ref(false); //导出历史记录弹窗
const remarkDisabled = ref(true)
const orderDates = ref('');
const disabledList = ref<any>([]);

const tabelList = ref<any>([
	{
		titleCN: 'PO',
		titleEN: 'PO',
		dataIndex: 'po',
	},
	{
		titleCN: 'Vendor',
		titleEN: 'Vendor',
		dataIndex: 'vendor',
	},
	{
		titleCN: 'ShipToLocation',
		titleEN: 'ShipToLocation',
		dataIndex: 'shipToLocation',
	},
	{
		titleCN: 'OrderDate',
		titleEN: 'OrderDate',
		dataIndex: 'orderDate',
	},
	{
		titleCN: '状态',
		titleEN: 'store',
		dataIndex: 'store',
	},
	{
		titleCN: '约仓日期',
		titleEN: 'lastDate',
		dataIndex: 'lastDate',
	},
	{
		titleCN: '最迟履单日期',
		titleEN: 'lastFulfillmentDate',
		dataIndex: 'lastFulfillmentDate',
	},
	{
		titleCN: '实际履单日期',
		titleEN: 'trueFulfillDate',
		dataIndex: 'trueFulfillDate',
	},
	{
		titleCN: 'Invoiced Status',
		titleEN: 'Invoiced Status',
		dataIndex: 'invoicedStatus',
	},
]);
const optionList = ref<any>([
	{
		label: '待约仓',
		value: '待约仓',
	},
	{
		label: '已约仓',
		value: '已约仓',
	},
	{
		label: '已送达',
		value: '已送达',
	},
	{
		label: '取消',
		value: '取消',
	},
]);
const statusOptionList = ref<any>([
	{
		label: 'YES',
		value: 'YES',
	},
	{
		label: 'NO',
		value: 'NO',
	},
]);
const vendorOptionList = ref<any>([
	{
		label: 'Verdor',
		value: 'Verdor',
	},
	{
		label: 'Locatior',
		value: 'Locatior',
	},
]);
const storeOptionList = ref<any>([
	{
		label: '全部',
		value: '全部',
	},
	{
		label: '待约仓',
		value: '待约仓',
	},
	{
		label: '已约仓',
		value: '已约仓',
	},
	{
		label: '已送达',
		value: '已送达',
	},
	{
		label: '取消',
		value: '取消',
	},
]);
const orderDateOptionList = ref<any>([
	{
		label: 'orderDate',
		value: 'orderDate',
	},
	{
		label: '约仓时间',
		value: '约仓时间',
	},
	{
		label: '最迟履单时间',
		value: '最迟履单时间',
	},
]);
const invoicedStatusOptionList = ref<any>([
	{
		label: 'ALL',
		value: 'ALL',
	},
	{
		label: 'YES',
		value: 'YES',
	},
	{
		label: 'NO',
		value: 'NO',
	},
]);
function showModal(po: any) {
	pos.value = po;
	visible.value = true;
}
function showModal1(orderDate: any, po: any) {
	pos.value = po;
	orderDates.value = orderDate;
	visible1.value = true;
}
//打开弹窗
function showModal2() {
	// costpriceBatchId = id;
	ifClose.value = true;
	visible2.value = true;
}

//关闭弹窗
function close2() {
	visible2.value = false;
	ifClose.value = false;
}
function close() {
	visible.value = false;
}
// infoDataDialog 配套参数
const formList = ref<any>([])
const dataList = ref<any>([
	{
		label:'Vendor',
		prop:'vendor'
	},
	{
		label:'ASIN',
		prop:'asin'
	},
	{
		label:'EAN_UPC',
		prop:'eaN_UPC'
	},
	{
		label:'ERP-SKU',
		prop:'erpSku'
	},
	{
		label:'Model',
		prop:'model'
	},
	{
		label:'ProductDescription',
		prop:'productDescription'
	},
	{
		label:'ReplenishmentStatus',
		prop:'replenishmentStatus'
	},
	{
		label:'EffectiveDate',
		prop:'effectiveDate'
	},
	{
		label:'CurrentCost',
		prop:'currentCost'
	},
	{
		label:'NewCost',
		prop:'newCost'
	},
	{
		label:'CurrentCostCurrency',
		prop:'currentCostCurrency'
	},
	{
		label:'NewCostCurrency',
		prop:'newCostCurrency'
	},
])
var costpriceBatchId = ref<number>(0);
// 修改日期
function submit() {

	service({
		url: `/api/poData/updateOrderDate/${pos.value}/${encodeURIComponent(orderDates.value)}`,
		method: 'get',
	}).then((res) => {
		if (res.data.type === 'success') {
			ElMessage.success('Edit successfully');
			handleQuery();
		} else {
			ElMessage.error('Edit failed ' + res.message);
		}
		remarkDisabled.value = true
		visible1.value = false;
	});
}
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pagePoData(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	res.data.result?.items.map((item) => {
		disabledList.value.push(item.id);
	});
	loading.value = false;
};
const openEdit = async (id: any): void => {
	if (disabledList.value.some((item) => item === id)) {
		const index = disabledList.value.findIndex((item) => item === id);
		disabledList.value.splice(index, 1);
	} else {
		disabledList.value.push(id);
	}
};
const disabledAuto = (scope: any): void => {
	return disabledList.value.some((item) => item === scope.row.id);
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

const selectedRows = ref([]);
const selectedRowKeys = ref([]);

// 开始准备轮询
const multipleExport = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('Please select at least one PO');
		return;
	}
	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.po);
	}
	cardLoading.value = true;
	multipleExportByTemplate(data).then((res: any) => {
		if (res.data.code !== 200) {
			cardLoading.value = false;
			ElMessage.error(res.message);
			return;
		} else {
			ElMessage.success('Table generated, waiting for compression');
			startTime.value = new Date().getTime(); // 获取触发轮询时的时间
			inquireData(); // 调用轮询接口,开始进行轮询
		}
	});
};

const inquireData = () => {
	const reload = () => {
		clearTimeout(timer.value); // 清除定时器
		// 超过30分钟则停止轮询
		if (new Date().getTime() - startTime.value > 30 * 60 * 1000) {
			clearTimeout(timer.value);
			return;
		}
		// 3s一次, 轮询中
		timer.value = setTimeout(() => {
			inquireData(); // 调用轮询
		}, 3000);
	};

	var data = [];
	for (let i = 0; i < selectedRows.value.length; i++) {
		data.push(selectedRows.value[i]?.po);
	}
	downLoadPOZip({ poList: data, count: selectedRows.value.length })
		.then((res: any) => {
			if (res.data.result === '') {
				// 没成功,调用轮询
				reload();
			} else {
				ElMessage.success('Build succeeded');
				cardLoading.value = false;
				window.open(res.data.result, '_blank');
				handleQuery();
			}
		})
		.catch((err: any) => {
			// 请求错误,也继续轮询
			// reload()
			cardLoading.value = false;
			ElMessage.error('Download exception: please contact the technician');
		});
};

// 获取keys
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item?.id);
	});
};

// handleQuery();
</script>
<template>
	<div class="poDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="PO">
					<el-input v-model="queryParams.po" clearable="" placeholder="请输入PO" />
				</el-form-item>
				<el-form-item>
					<el-select v-model="queryParams.vendor" style="width: 90px">
						<el-option v-for="i in vendorOptionList" :value="i.value" :label="i.label" />
					</el-select>
					<el-input v-model="queryParams.code" style="width: 150px" clearable="" placeholder="Please enter" />
				</el-form-item>
				<el-form-item >
					<el-select v-model="queryParams.orderdate" style="width: 90px" >
						<el-option v-for="i in orderDateOptionList" :value="i.value" :label="i.label" />
					</el-select>
					<el-date-picker
						v-model="queryParams.time"
						type="daterange"
						start-placeholder="Start date"
						end-placeholder="End date"
						format="YYYY-MM-DD"
						date-format="YYYY/MM/DD"
						style="width: 290px"
					/>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryParams.store" placeholder="全部">
						<el-option v-for="i in storeOptionList"  :value="i.value" :label="i.label" />
					</el-select>
				</el-form-item>
				<el-form-item label="Invoiced Status">
					<el-select v-model="queryParams.invoicedStatus" placeholder="ALL">
						<el-option v-for="i in invoicedStatusOptionList"  :value="i.value" :label="i.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> Search </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
									handleQuery();
								}
							"
						>
							Reset
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
				<el-dropdown>
					<el-button type="primary">Export</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="Export"> PO Picking List </el-dropdown-item>
							<el-dropdown-item @click="SelectedExport"> PO Panel </el-dropdown-item>
							<el-dropdown-item @click="showModal2"> 导出历史记录 </el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" size="lagre" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="55" />
				<template v-for="item in tabelList">
					<el-table-column v-if="item.dataIndex === 'shipToLocation'" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							{{ scope.row.shipToLocation.substring(0, 4) }}
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'store'" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="">
						<template #default="scope">
							<el-select v-model="scope.row.store" :disabled="disabledAuto(scope)">
								<el-option v-for="i in optionList" :value="i.value" :label="i.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'lastDate'"  :prop="item.dataIndex" :label="item.titleCN" align="center" width="125px">
						<template #default="scope">
							<el-date-picker v-model="scope.row.lastDate" style="width:96px;" format="YYYY-MM-DD" type="date" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'trueFulfillDate'" :prop="item.dataIndex" :label="item.titleCN" align="center" width="125px">
						<template #default="scope">
							<el-date-picker v-model="scope.row.trueFulfillDate" style="width:96px;" format="YYYY-MM-DD" type="date" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'invoicedStatus'" :prop="item.dataIndex" :label="item.titleCN" align="center" width="122px" show-overflow-tooltip="">
						<template #default="scope">
							<el-select v-model="scope.row.invoicedStatus" :disabled="disabledAuto(scope)">
								<el-option v-for="i in statusOptionList" :value="i.value" :label="i.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.dataIndex === 'orderDate'" width="150px" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" />
					<el-table-column v-else-if="item.dataIndex" :prop="item.dataIndex" :label="item.titleCN" align="center" show-overflow-tooltip="" />
				</template>

				<el-table-column label="Operation" width="350" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button  size="small" @click="openEdit(scope.row.id)"> Edits </el-button>
						<el-button size="small" text="" type="primary" @click="showModal(scope.row.po)"> Details </el-button>
						<el-button type="info" size="small" @click="showModal1(scope.row.orderDate, scope.row.po)"> Remark </el-button>
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
			<el-dialog v-model="visible" title="Product List" @close="close" width="1000px">
				<PoDataSource :po="pos"></PoDataSource>
			</el-dialog>
			<el-dialog v-model="visible1" title="Remark" width="400px">
				<el-input v-model="remark" placeholder="Please enter orderDate" :disabled="remarkDisabled"/>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="visible1 = false">Cancel</el-button>
						<el-button type="primary" @click="remarkDisabled = false" v-if="remarkDisabled"> Edit </el-button>
						<el-button type="primary" @click="submit" v-else> Confirm </el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog v-model="visible2" title="导出历史记录" @close="close2" width="1000px">
				<infoDataDialog :id="111" idName="dibaiPoDataData" :dataList="dataList" :ifClose="ifClose" :pointerface="bulkImportOrderDate" :formList="formList"/>
			</el-dialog>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 500px;
}

.dialog-footer button:first-child {
	margin-right: 10px;
}

.el-link {
	margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
	vertical-align: text-bottom;
}
/deep/ .el-select{
	.el-input{
		width:100%;
	}
}
</style>
