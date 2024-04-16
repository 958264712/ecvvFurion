<script lang="ts" setup name="shippingDetails">
import { ref, onMounted, reactive } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { getShipmentDetails, ExportShipmentDetails } from '/@/api/modular/main/collections.ts';
import other from '/@/utils/other.ts';
import moment from 'moment';
import { SysCodeGenConfigApi, SysConstApi, SysDictDataApi, SysDictTypeApi, SysEnumApi } from '/@/api-services/api';
import { getAPI } from '/@/utils/axios-utils';
import tabDragColum from '/@/components/tabDragColum/index.vue'

const tagoptions = ref<any>([]);
const tableData: any[] = ref([]);
const queryParams = reactive<any>({
	destination: '迪拜',
	time: [],
	startTime_departureDate: '',
	endTime_departureDate: '',
});
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
const cardLoading = ref(false);
const loading = ref(false);
const selectedRows = ref([]);
const selectedRowKeys = ref([]);
const area = ref('CN')
const TableData = ref<any>([
	{
		titleCN: '标签',
		dataIndex: 'warnTag',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '单据编号',
		dataIndex: 'documentNo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '报关单号',
		dataIndex: 'customsDeclarationNo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '目的国',
		dataIndex: 'destination',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ECVV箱单号',
		dataIndex: 'boxNo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '产品图',
		dataIndex: 'productPic',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '内部唯一识别码',
		dataIndex: 'internalUniqueID',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '内部品名',
		dataIndex: 'internalProductName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '英文名称',
		dataIndex: 'enProductName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '备注',
		dataIndex: 'notes',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '颜色',
		dataIndex: 'color',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货数量',
		dataIndex: 'actualShipmentQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货单位',
		dataIndex: 'unit',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '补充说明',
		dataIndex: 'unitInfo',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '装箱个数',
		dataIndex: 'quantityInBoxes',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总箱数(共多少箱)',
		dataIndex: 'packBoxesQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '单个产品净重KG',
		dataIndex: 'singleProductNetWeightKG',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '产品长(cm)',
		dataIndex: 'singleProductLength',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '产品宽(cm)',
		dataIndex: 'singleProductWidth',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '产品高(cm)',
		dataIndex: 'singleProductHeight',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '整箱毛重KG',
		dataIndex: 'fclGrossWeightKG',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '箱长(cm)',
		dataIndex: 'boxLength',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '箱宽(cm)',
		dataIndex: 'boxWidth',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '箱高(cm)',
		dataIndex: 'boxHeight',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总净重KG',
		dataIndex: 'totalNetWeightKG',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总毛重KG',
		dataIndex: 'totalGrossWeightKG',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总方数m³',
		dataIndex: 'totalSquaresM3',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '体积重',
		dataIndex: 'volumeWeight',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入货代仓时间',
		dataIndex: 'shippingTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '运输方式',
		dataIndex: 'shippingMethod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流报价',
		dataIndex: 'logisticsPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '是否报关',
		dataIndex: 'neetCustoms',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购价含税(RMB)',
		dataIndex: 'includingTaxPurchasePrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '国内物流费用(RMB/个)',
		dataIndex: 'domesticLogisticsCost',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '杂费',
		dataIndex: 'incidentalPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '国际物流费用(RMB/个)',
		dataIndex: 'singleInternationalLogisticsFee',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '国际物流费用总额(RMB)',
		dataIndex: 'totalInternationalLogisticsFee',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'FOB供货价(AED/SAR)',
		dataIndex: 'fobSupplyPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '国际物流费用支付方',
		dataIndex: 'internationalLogisticsFeePayer',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流状态',
		dataIndex: 'state',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '出发日期',
		dataIndex: 'departureDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '预计送仓日期',
		dataIndex: 'estimatedArrivalDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实际送仓日期',
		dataIndex: 'actualDeliveryDate',
		checked: true,
		fixed: false,
	},

])

const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list
	}
}
// 查询
const getAppPage = async (): void => {
	loading.value = true;
	var res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('warn_tag');
	tagoptions.value = res.data.result;
	queryParams.startTime_departureDate = queryParams.time?.length ? moment(queryParams.time[0]).format('YYYY-MM-DD') : '';
	queryParams.endTime_departureDate = queryParams.time?.length ? moment(queryParams.time[1]).format('YYYY-MM-DD') : '';
	await getShipmentDetails(Object.assign(queryParams, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableParams.value.total = res.data.result?.total;
		tableData.value.splice(0, tableData.value.length);
		res.data.result.items.forEach((element: any) => {

			if (element.warnTag != null && element.warnTag != "") {
				element.warnTag = element.warnTag.split(',');
			}
			tableData.value.push(element);
		});
	});
	loading.value = false;
};

//重置
const resetfun = (): void => {
	Object.keys(queryParams).forEach((key: any) => {
		queryParams[key] = '';
	});
	queryParams = { destination: '迪拜' };
	getAppPage();
};
//判断标签是否存在于集合中
function IsTag(tag: any) {
	const element = tagoptions.value.find(item => item.value === tag);
	if (element) {
		return element.code;
	}
	return "#DE2910";
}
onMounted(() => {
	getAppPage();
});

// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	getAppPage();
};

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	getAppPage();
};
//排序
const handleSort = (v: any) => {
	tableParams.value.order = v.order;
	tableParams.value.field = v.prop;
	getAppPage();
};
// 获取keys
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item.id);
	});
};
// 导出选中
const SelectedExport = async (coltype) => {
	cardLoading.value = true;
	await ExportShipmentDetails(Object.assign({ type: 0, coltype: coltype, idList: selectedRowKeys.value, destination: queryParams.destination })).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
		//selectedRowKeys.value = [];
		//selectedRows.value = [];
	});
};
// 导出所有
const AllExport = async (coltype) => {
	cardLoading.value = true;
	await ExportShipmentDetails(Object.assign({ type: 1, queryParams, coltype: coltype }, queryParams, tableParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
		selectedRows.value = [];
	});
};
//底色
function customCellStyle({ row, column, rowIndex, columnIndex }) {
	if (row.warnTag != null && row.warnTag != "") {
		return { backgroundColor: '#FEF0F0' };
	}
	// 返回一个包含自定义样式的对象
	return null;
}
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="目的地">
					<el-select v-model="queryParams.destination" clearable="" placeholder="请输入目的地" @change="getAppPage">
						<el-option label="迪拜" value="迪拜" />
						<el-option label="沙特" value="沙特" />
					</el-select>
				</el-form-item>
				<el-form-item label="出发日期">
					<el-date-picker start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange"
						v-model="queryParams.time" />
				</el-form-item>
				<el-form-item label="单据编号／货代入仓号">
					<el-input v-model="queryParams.documentNo" clearable="" placeholder="单据编号／货代入仓号" />
				</el-form-item>
				<el-form-item label="箱单号">
					<el-input v-model="queryParams.boxNo" clearable="" placeholder="请输入箱单号" />
				</el-form-item>
				<el-form-item label="内部唯一识别码或内部品名">
					<el-input v-model="queryParams.internalUniqueID" clearable="" placeholder="请输入内部唯一识别码或内部品名" />
				</el-form-item>
				<el-form-item label="物流状态">
					<el-select v-model="queryParams.state" clearable="" placeholder="请选择物流状态" @change="getAppPage">
						<el-option label="集货" value="集货" />
						<el-option label="截仓" value="截仓" />
						<el-option label="在途中" value="在途中" />
						<el-option label="已入仓" value="已入仓" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search"
							@click="getAppPage()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun()" style="width: 70px; margin-right: 2px"> 重置
						</el-button>
						<div class="flex flex-wrap items-center">
							<el-dropdown>
								<el-button type="primary" :loading="cardLoading"> 导出 </el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item style="height:24px" @click="SelectedExport(0)">导出选中
											<!-- <el-dropdown placement='right-start'>
												<span style="font-size: 12px;" class="el-dropdown-link">
													导出选中
												</span>
												<template #dropdown>
													<el-dropdown-menu>
														<button
															style="background-color: #FFFFFF;border: none;display: block;width: 100%;"
															v-auth="'shippingDetails:export_all_columns'">
															<el-dropdown-item
																@click="SelectedExport(0)">全部列</el-dropdown-item>
														</button>
														<button
															style="background-color: #FFFFFF;border: none;display: block;width: 100%;"
															v-auth="'shippingDetails:Export_cargo_packing'"><el-dropdown-item
																@click="SelectedExport(1)">货代入仓号</el-dropdown-item></button>

													</el-dropdown-menu>
												</template>
</el-dropdown> -->
										</el-dropdown-item>
										<el-dropdown-item style="height:24px" @click="AllExport(0)">导出全部
											<!-- <el-dropdown placement='right-start'>
												<span style="font-size: 12px;" class=" el-dropdown-link">
													导出全部
												</span>
												<template #dropdown>
													<el-dropdown-menu>
														<button
															style="background-color: #FFFFFF;border: none;display: block;width: 100%;"
															v-auth="'shippingDetails:export_all_columns'">
															<el-dropdown-item
																@click="AllExport(0)">全部列</el-dropdown-item>
														</button>
														<button
															style="background-color: #FFFFFF;border: none;display: block;width: 100%;"
															v-auth="'shippingDetails:Export_cargo_packing'"><el-dropdown-item
																@click="AllExport(1)">货代入仓号</el-dropdown-item></button>

													</el-dropdown-menu>
												</template>
											</el-dropdown> -->
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<tabDragColum :data="TableData" :name="`shippingDetailsData`" :area="area" @handleData="handleData" />
			<el-table :data="tableData" size="large" style="width: 100%" :cell-style="customCellStyle"
				@selection-change="(selection: any) => selectChange(selection)" v-loading="loading"
				tooltip-effect="light" @sort-change="handleSort">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column v-if="item.dataIndex == 'warnTag' && item.checked" :fixed="item.fixed"
						:prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center"
						width="120">
						<template #default="scope">
							<div v-for="(i, index) in scope.row.warnTag" :key="ind">
								<el-tag class="mx-1" :color="IsTag(i)" :hit="false" effect="dark">{{ i }}</el-tag>
							</div>
						</template>
					</el-table-column>

					<el-table-column v-else-if="item.dataIndex == 'productPic' && item.checked" :fixed="item.fixed"
						:prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center"
						width="80">
						<template #default="scope">
							<img :src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.internalUniqueID + '.jpg'"
								alt="" />
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.checked" :fixed="item.fixed" :prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN" align="center" width="150" />

				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
