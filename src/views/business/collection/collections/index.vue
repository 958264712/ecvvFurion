<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryList" :inline="true">
				<el-form-item label="货代入仓号">
					<el-input v-model="queryList.inWareHouseNo" clearable="" placeholder="请输入货代入仓号" />
				</el-form-item>
				<el-form-item label="报关单号">
					<el-input v-model="queryList.customsDeclarationNo" clearable="" placeholder="请输入报关单号" />
				</el-form-item>

				<el-form-item label="ECVV箱单号">
					<el-input v-model="queryList.ecvvBoxNo" clearable="" placeholder="请输入ECVV箱单号" />
				</el-form-item>

				<el-form-item label="品名、识别码">
					<el-input v-model="queryList.internalProductName" clearable="" placeholder="请输入内部品名、唯一识别码" />
				</el-form-item>
				<el-form-item label="目的地">
					<el-select v-model="queryList.destination" filterable clearable>
						<el-option v-for="item in destinationList" :label="item.value" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="采购合同号">
					<el-input v-model="queryList.purchaseContractNo" clearable="" placeholder="请输入采购合同号" />
				</el-form-item>

				<el-form-item label="运输方式">
					<el-select filterable clearable class="w100" v-model="queryList.shippingMethod">
						<el-option label="海运" value="海运" />
						<el-option label="空运" value="空运" />
						<el-option label="快递" value="快递" />
						<el-option label="小包" value="小包" />
						<el-option label="海运(KG计费)" value="海运(KG计费)" />
						
					</el-select>
				</el-form-item>

				<el-form-item label="状态">
					<el-select filterable clearable class="w100" v-model="queryList.state">
						<el-option label="集货" value="集货" />
						<el-option label="截仓" value="截仓" />
						<el-option label="在途中" value="在途中" />
						<el-option label="部分入仓" value="部分入仓" />
						<el-option label="已入仓" value="已入仓" />
					</el-select>
				</el-form-item>
				<el-form-item label="创建日期">
					<el-date-picker start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange"
						v-model="queryList.time" />
				</el-form-item>
				<el-form-item label="货代名称">
					<el-select v-model="queryList.forwarderName" filterable clearable class="w100">
						<el-option v-for="item in selectBox" :key="item.value" :label="item.label"
							:value="item.label" />
					</el-select>
					<!-- <span v-if="!collectionOrderInfo.forwarderID" class="error-message">贷代名称不能为空！</span> -->
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="queryfun()"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun()"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-form-item class="settingf">
				<el-button type="primary" icon="ele-Plus" @click="examine()" style="margin-right: 20px"> 新增集货单信息
				</el-button>
				<!-- <el-checkbox style="margin-right: 20px" v-model="isExProtAll">导出所有</el-checkbox>
				<el-button type="primary" icon="ele-Plus" style="margin-right: 20px" @click="exportfun()"> 出货明细汇总
				</el-button> -->
				<el-dropdown style="margin-right: 20px">
					<el-button type="primary" :loading="Exportloading">
						导出
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="exportfunAll()">导出所有</el-dropdown-item>
							<el-dropdown-item @click="exportfun()">导出选中</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<!-- <div class="block" style="margin-right: 20px">
					<span class="demonstration">计算此[送仓日期]后的价格 </span>
					<el-date-picker v-model="datevalue" type="date" placeholder="日期" />
				</div>
				<el-button type="primary" icon="ele-Plus" @click="recalculate()" style="margin-right: 20px"> 重新计算价格
				</el-button> -->
				<div class="custom">
					<el-button type="primary" icon="ele-Plus" @click="SettingColumnShow = !SettingColumnShow"> 自定义报关件表头
					</el-button>
					<div v-if="SettingColumnShow" class="s-tool-column-header s-tool-column-item" style="
							width: 230px;
							height: 500px;
							position: absolute;
							right: -45px;
							top: 30px;
							z-index: 2048;
							overflow-y: auto;
							background-color: #fff;
							padding: 10px 20px;
							box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.5);
						">
						<div style="padding: 0px 10px">
							<el-checkbox v-model="checkAll" @change="onCheckAllChange"> 列展示 </el-checkbox>
							<el-button style="margin: -6px 0 0 70px" @click="BaoguanReset" type="primary"
								link>重置</el-button>
						</div>
						<el-divider />
						<div class="ant-checkbox-group">
							<div>
								<draggable @update="handleUpdate" :list="BaoguancolumnsSetting" itemKey="dataIndex">
									<template #item="{ element }">
										<div class="s-tool-column-item">
											<el-icon style="margin: 0 5px 0 0px">
												<Grid />
											</el-icon>

											<el-checkbox v-model="element.checked"
												@change="BaoguanOnChange(element)">{{ element.title }}</el-checkbox>
										</div>
									</template>
								</draggable>
							</div>
						</div>
					</div>
				</div>

				<div class="setting">
					<el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom-end">
						<el-button type="primary" :icon="Refresh" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="密度" placement="bottom-end">
						<el-button type="primary" :icon="DCaret" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="列设置" placement="bottom-end">
						<el-button type="primary" @click="BaoguanShows = !BaoguanShows" :icon="Setting" />
					</el-tooltip>
					<div v-if="BaoguanShows" class="s-tool-column-header s-tool-column-item" style="
							width: 230px;
							height: 500px;
							position: absolute;
							right: -25px;
							top: 30px;
							z-index: 2048;
							overflow-y: auto;
							background-color: #fff;
							padding: 10px 20px;
							box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.5);
						">
						<div style="padding: 0px 10px">
							<el-checkbox v-model="checkOrderAll" @change="CollectionOrder"> 列展示 </el-checkbox>
							<el-button style="margin: -6px 0 0 70px" @click="CollectionOrderReset" type="primary"
								link>重置</el-button>
						</div>
						<el-divider />
						<div class="ant-checkbox-group">
							<div>
								<draggable @update="CollectionOrderUpdate" :list="CollectionOrderTable"
									itemKey="dataIndex">
									<template #item="{ element }">
										<div class="s-tool-column-item">
											<el-icon style="margin: 0 5px 0 0px">
												<Grid />
											</el-icon>

											<el-checkbox v-model="element.checked"
												@change="CollectionOrderOnChange(element)">{{ element.title }}</el-checkbox>
										</div>
									</template>
								</draggable>
							</div>
						</div>
					</div>
				</div>
			</el-form-item>

			<el-table :row-class-name="tableRowClassName" :data="tableData" size="large" style="width: 100%"
				v-loading="loading" tooltip-effect="light" row-key="id" @selection-change="handleSelectionChange"
				@sort-change="sortfun">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in  CollectionOrderTable " :key="index">
					<el-table-column v-if="item.checked && item.dataIndex == 'documentNo'" :prop="item.dataIndex"
						:label="item.title" :align="item.align" sortable="custom" :width="item.width" fixed="left"
						show-overflow-tooltip="">
						<template #default="scope">
							<el-button size="small" text type="primary" @click="examine(scope)">
								{{ scope.row.documentNo }}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.checked && (index !== CollectionOrderTable.length - 1 || item.title !== '操作')"
						:prop="item.dataIndex" :label="item.title" :align="item.align" sortable="custom"
						:width="item.width" show-overflow-tooltip="" />
					<el-table-column
						v-else-if="item.checked && index === CollectionOrderTable.length - 1 && item.title === '操作'"
						:label="item.title" width="200" :align="item.align" fixed="right" show-overflow-tooltip="">
						<template #default="scope">
							<el-button size="small" text type="primary" @click="examine(scope)"> 查看 </el-button>
							<el-dropdown>
								<el-button icon="ele-MoreFilled" size="small" text type="primary"
									style="padding-left: 12px" />
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item style="color: #C5C8D0;" v-if="IsDel(scope.row)"
											@click="delPrompt()">删除</el-dropdown-item>
										<el-dropdown-item v-else @click="deletefun(scope)">删除</el-dropdown-item>
										<el-dropdown-item @click="exportBaoguan(scope)"> 导出报关件 </el-dropdown-item>
										<el-dropdown-item @click="exportYanhuo(scope)"> 导出验货单 </el-dropdown-item>
										<el-dropdown-item @click="exportBoxTag(scope)"> 导出外箱标签 </el-dropdown-item>
										<el-dropdown-item @click="download(scope)"> 附件下载 </el-dropdown-item>
										<el-dropdown-item v-if="scope.row.customsDeclarationNo" @click="deblockingBox(scope)" v-auth="'collection:deblocking'"> 解锁 </el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editCollectionOrderInfoTitle" @reloadTable="getAppPage" />
		</el-card>
		<el-dialog v-model="dialogFormVisible" title="附件" style="width: 400px">
			<el-form label-width="130px">
				<el-divider />
				<!-- <a src="https://sa.ecvv.com/api/Upload/CollectionAttachment/EC-20220818-YJYZGM-001.pdf">23312</a> -->
				<div v-for=" el  in  fileList " :key="el.uid">
					<el-link :href="el.url" style="color: #13c2c2">{{ el.name }}</el-link>
				</div>
				<el-divider />
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogFormVisible = false">Cancel</el-button>
					<!-- <el-button type="primary" @click="confirm"> OK </el-button> -->
				</span>
			</template>
		</el-dialog>
		<deblockingDialog ref="deblockingDialogRef" :title="deblockingDialogTitle" @reloadTable="getAppPage"/>
	</div>
</template>
<script lang="ts" setup name="administrate">
import draggable from 'vuedraggable';
import { ref, onMounted, reactive } from 'vue';
import router from '/@/router';
import { getAPI } from '/@/utils/axios-utils';
import { service } from '/@/utils/request';
import moment from 'moment';
import { Refresh, Setting, DCaret, Grid } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { collectionOrderInfoPage } from '/@/api/modular/main/collections.ts';
import { SysAuthApi, SysDictDataApi } from '/@/api-services/api';
import deblockingDialog from './component/deblockingDialog.vue';

const editDialogRef = ref();
const deblockingDialogRef = ref();

const deblockingDialogTitle = ref('解锁集货单');

const loading = ref(true);
let dialogFormVisible = ref(false);
let Exportloading = ref<any>(false);
let tableData = ref<any>([]);
const destinationList = ref<any>([]);
const queryParams = ref<any>({});
let isExProtAll = ref<any>(false);
let activeNames = ref('1');
let selectBox = ref<any>();
// let datevalue = ref<any>(moment().format('YYYY-MM-DD'));
let SettingColumnShow = ref<any>(false);
let BaoguanShows = ref<any>(false);
let checkAll = ref<any>(true);
let ruleFormBase = ref<any>();
let checkOrderAll = ref<any>(true);
let tableParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
	field: '',
	order: '',
});

let fileList = ref<any>();
let selectedRows = ref<any>([]);
let Baoguancolumns = ref<any>([
	{
		title: '单据编号',
		dataIndex: 'DocumentNo',
		checked: false,
	},
	{
		title: '目的国',
		dataIndex: 'Destination',
		checked: false,
	},
	{
		title: '内部唯一识别码',
		dataIndex: 'InternalUniqueID',
		checked: false,
	},
	{
		title: '风险标签',
		dataIndex: 'WarnTag',
		checked: false,
	},
	{
		title: '运输方式',
		dataIndex: 'ShippingMethod',
		checked: false,
	},
	{
		title: '货代入仓号',
		dataIndex: 'InWareHouseNo',
		checked: false,
	},
	{
		title: '采购员',
		dataIndex: 'Purchaser',
		checked: true,
	},
	{
		title: '采购合同号',
		dataIndex: 'PurchaseContractNo',
		checked: true,
	},
	{
		title: 'ECVV箱单号',
		dataIndex: 'BoxNo',
		checked: false,
	},
	{
		title: '供应商',
		dataIndex: 'Supplier',
		checked: true,
	},
	{
		title: '品牌',
		dataIndex: 'Brand',
		checked: true,
	},
	{
		title: '产品图',
		dataIndex: 'ProductPic',
		checked: true,
	},
	{
		title: '报关品名',
		dataIndex: 'CustomsName',
		checked: true,
	},
	{
		title: '报关要素',
		dataIndex: 'CustomsElements',
		checked: true,
	},
	{
		title: '内部品名',
		dataIndex: 'InternalProductName',
		checked: false,
	},
	{
		title: '英文名称',
		dataIndex: 'EnProductName',
		checked: false,
	},
	{
		title: '材质',
		dataIndex: 'Material',
		checked: true,
	},
	{
		title: '用途',
		dataIndex: 'Use',
		checked: true,
	},
	{
		title: '报关型号',
		dataIndex: 'CustomsDeclarationModel',
		checked: true,
	},
	{
		title: '颜色',
		dataIndex: 'Color',
		checked: false,
	},
	{
		title: '规格',
		dataIndex: 'Specification',
		checked: true,
	},
	{
		title: '报关数量',
		dataIndex: 'PlannedShipmentQuantity',
		checked: false,
	},
	{
		title: '报关单位',
		dataIndex: 'CusUnit',
		checked: false,
	},
	{
		title: '集货数量',
		dataIndex: 'ActualShipmentQuantity',
		checked: true,
	},
	{
		title: '集货单位',
		dataIndex: 'Unit',
		checked: true,
	},
	{
		title: '补充说明',
		dataIndex: 'UnitInfo',
		checked: true,
	},
	{
		title: '装箱个数',
		dataIndex: 'QuantityInBoxes',
		checked: false,
	},
	{
		title: '总箱数(共多少箱)',
		dataIndex: 'PackBoxesQuantity',
		checked: true,
	},
	{
		title: '单个产品净重KG',
		dataIndex: 'UnitWeight',
		checked: true,
	},
	{
		title: '产品长cm',
		dataIndex: 'SingleProductLength',
		checked: true,
	},
	{
		title: '产品宽cm',
		dataIndex: 'SingleProductWidth',
		checked: true,
	},
	{
		title: '产品高cm',
		dataIndex: 'SingleProductHeight',
		checked: true,
	},
	{
		title: '整箱毛重KG',
		dataIndex: 'FCLGrossWeightKG',
		checked: false,
	},
	{
		title: '箱长cm',
		dataIndex: 'BoxLength',
		checked: false,
	},
	{
		title: '箱宽cm',
		dataIndex: 'BoxWidth',
		checked: false,
	},
	{
		title: '箱高cm',
		dataIndex: 'BoxHeight',
		checked: false,
	},
	{
		title: '总净重KG',
		dataIndex: 'TotalNetWeight',
		checked: true,
	},
	{
		title: '总毛重KG',
		dataIndex: 'TotalGrossWeight',
		checked: true,
	},
	{
		title: '总方数（立方米）',
		dataIndex: 'TotalSquaresM3',
		checked: false,
	},
	{
		title: '体积重',
		dataIndex: 'VolumeWeight',
		checked: false,
	},
	// {
	// 	title: '入货代仓时间',
	// 	dataIndex: 'ShippingTime',
	// 	checked: false,
	// },
	{
		title: '物流报价',
		dataIndex: 'LogisticsPrice',
		checked: false,
	},
	{
		title: '是否需要报关',
		dataIndex: 'NeetCustoms',
		checked: true,
	},
	{
		title: '集货采购价含税(RMB)',
		dataIndex: 'IncludingTaxPurchasePrice',
		checked: false,
	},
	{
		title: '报关采购价含税(RMB)',
		dataIndex: 'CusPurchasePrice',
		checked: false,
	},
	{
		title: '国内物流费用(RMB/个)',
		dataIndex: 'DomesticLogisticsCost',
		checked: false,
	},
	{
		title: '出口单价(USD)',
		dataIndex: 'ExportUnitPrice',
		checked: true,
	},
	{
		title: '出口总价(USD)',
		dataIndex: 'TotalExportPrice',
		checked: true,
	},
	{
		title: '商检费(RMB)个',
		dataIndex: 'CommodityInspectionFee',
		checked: false,
	},
	{
		title: '报关费/个(RMB)',
		dataIndex: 'CustomsDeclarationFee',
		checked: false,
	},
	{
		title: '报关单号',
		dataIndex: 'CustomsDeclarationNo',
		checked: false,
	},
	{
		title: '国际物流费用(RMB/个)',
		dataIndex: 'SingleInternationalLogisticsFee',
		checked: false,
	},
	{
		title: '国际物流费总费用(RMB)',
		dataIndex: 'TotalInternationalLogisticsFee',
		checked: true,
	},
	{
		title: '国际物流费用支付方',
		dataIndex: 'InternationalLogisticsFeePayer',
		checked: false,
	},
	{
		title: 'FOB供货价(AED/SAR)',
		dataIndex: 'FOBSupplyPrice',
		checked: true,
	},
	{
		title: '杂费',
		dataIndex: 'IncidentalPrice',
		checked: true,
	},
	{
		title: '物流状态',
		dataIndex: 'State',
		checked: false,
	},
	{
		title: '开船/起飞日期',
		dataIndex: 'ActualArrivalDate',
		checked: false,
	},
	
	{
		title: '验货完成日期',
		dataIndex: 'DepartureDate',
		checked: false,
	},
	{
		title: '预计送仓日期',
		dataIndex: 'EstimatedArrivalDate',
		checked: false,
	},
	{
		title: '实际送仓日期',
		dataIndex: 'ActualDeliveryDate',
		checked: false,
	},
	{
		title: '物流预计到仓日期',
		dataIndex: 'EstimatedDeliveryDate',
		checked: false,
	},
	{
		title: '备注',
		dataIndex: 'Notes',
		checked: false,
	},
]);
let OrderColumns = ref([{
	title: '单据编号',
	align: 'center',
	width: 140,
	sorter: true,
	checked: true,
	dataIndex: 'documentNo',
	scopedSlots: { customRender: 'documentNo' }
},
{
	title: '标签',
	align: 'center',
	width: 90,
	checked: true,
	dataIndex: 'warnTagCount',
	scopedSlots: { customRender: 'warnTagCount' }
},
{
	title: '目的地',
	align: 'center',
	width: 100,
	sorter: true,
	checked: true,
	dataIndex: 'destination'
},
{
	title: '货代名称',
	align: 'center',
	width: 120,
	sorter: true,
	checked: true,
	dataIndex: 'forwarderName',
	ellipsis: true
},
{
	title: '运输方式',
	align: 'center',
	width: 120,
	sorter: true,
	checked: true,
	dataIndex: 'shippingMethod'
},
{
	title: '报关单号',
	align: 'center',
	width: 140,
	sorter: true,
	checked: true,
	dataIndex: 'customsDeclarationNo',
	ellipsis: true
},
{
	title: '货代入仓号',
	align: 'center',
	width: 130,
	sorter: true,
	checked: true,
	dataIndex: 'inWareHouseNo'
},
{
	title: '总箱数',
	align: 'center',
	width: 100,
	sorter: true,
	checked: true,
	dataIndex: 'packBoxesQuantitySum'
},
{
	title: '总数量',
	align: 'center',
	width: 100,
	sorter: true,
	checked: true,
	dataIndex: 'tiDanSum'
},
{
	title: '总毛重KG',
	align: 'center',
	width: 120,
	sorter: true,
	checked: true,
	dataIndex: 'weightSum'
},
{
	title: '总方数',
	align: 'center',
	width: 100,
	sorter: true,
	checked: true,
	dataIndex: 'tiDanTotalSquaresM3'
},
{
	title: '是否报关',
	align: 'center',
	width: 120,
	sorter: true,
	checked: true,
	dataIndex: 'isCustomsDeclaration'
},
{
	title: '截仓日期',
	align: 'center',
	width: 120,
	sorter: true,
	checked: true,
	dataIndex: 'cutOffDate',
	customRender: (val: any) => {
		return val ? moment(val).format('YYYY-MM-DD') : ''
	}
},
{
	title: '状态',
	align: 'center',
	width: 100,
	sorter: true,
	checked: true,
	dataIndex: 'state'
},
{
	align: "center",
	checked: true,
	dataIndex: "action",
	fixed: "right",
	scopedSlots: { customRender: 'action' },
	title: "操作",
	width: 300
}
]);
let CollectionOrderTable = ref<any>();

let BaoguancolumnsSetting = ref<any>();
const editCollectionOrderInfoTitle = ref('');
// 查询表单数据
let queryList = reactive<any>({
	time: [],
	startTime: '',
	endTime: '',
	inWareHouseNo: '',
	customsDeclarationNo: '',
	internalProductName: '',
	ecvvBoxNo: '',
	purchaseContractNo: '',
	shippingMethod: '',
	state: '',
	destination: '',
});
//是否可以删除
function IsDel(row: any) {
	if (ruleFormBase.value.realName == '超级管理员' || ruleFormBase.value.realName == '系统管理员') {
		return false;
	} else {
		if (row.state == '截仓' || row.state == '在途中' || row.state == '已入仓') {
			return true;
		}
		return false;
	}
}


async function getAppPage() {
	loading.value = true;
	var res = await getAPI(SysAuthApi).apiSysAuthUserInfoGet();
	ruleFormBase.value = res.data.result ?? { account: '' };
	queryList.startTime = queryList.time.length ? moment(queryList.time[0]).format('YYYY-MM-DD') : '';
	queryList.endTime = queryList.time.length ? moment(queryList.time[1]).format('YYYY-MM-DD') : '';
	var result = await collectionOrderInfoPage(Object.assign(queryList, tableParams.value));
	tableData.value = result.data.result?.items ?? [];
	tableParams.value.total = result.data.result?.total;
	loading.value = false;

	service({
		url: `/api/tableShowColumnConfig/getColumn/BaoguanColumnsTable`,
		method: 'get',
		data: { tableName: 'BaoguanColumnsTable' },
	}).then((data) => {
		if (data.data.type == 'success') {
			if (data.data.result != null) {
				BaoguancolumnsSetting.value = data.data.result;
				BaoguancolumnsSetting.value.forEach((element: any) => {
					if (!element.checked) {
						checkAll.value = false;
					}
				});
			} else {
				BaoguancolumnsSetting.value = Baoguancolumns.value;
			}
		}
	});
	service({
		url: `/api/tableShowColumnConfig/getColumn/CollectionOrderTable`,
		method: 'get',
		data: { tableName: 'CollectionOrderTable' },
	}).then((data) => {

		if (data.data.type == 'success') {
			if (data.data.result != null) {
				CollectionOrderTable.value = data.data.result;
				CollectionOrderTable.value.forEach((element: any) => {
					if (!element.checked) {
						checkOrderAll.value = false;
					}
				});
			} else {
				CollectionOrderTable.value = OrderColumns.value;
			}
		}
	});
}


//行样式
const tableRowClassName = ({rowIndex}:{rowIndex: number}) => {
	if (tableData?._rawValue[rowIndex].warnTagCount) {
		return 'warnTag'
	}
	return ''
}

//排序
function sortfun(v: any) {
	tableParams.value.order = v.order;
	tableParams.value.field = v.prop;
	getAppPage();
}
//重新计算价格
// function recalculate() {
// 	if (datevalue.value) {
// 		service({
// 			url: `/api/collectionGoodsInfo/priceCheck/${moment(datevalue.value).format('YYYY-MM-DD')}`,
// 			method: 'get',
// 			data: { actualDeliveryDate: `${moment(datevalue.value).format('YYYY-MM-DD')}` },
// 		}).then((data) => {
// 			if (data.data.type == 'success') {
// 				ElMessage({
// 					type: 'success',
// 					message: '计价成功',
// 				});
// 				getAppPage();
// 			} else {
// 				ElMessage({
// 					type: 'error',
// 					message: '计价失败',
// 				});
// 			}
// 		});
// 	} else {
// 		ElMessage({
// 			type: 'error',
// 			message: '请选择数据',
// 		});
// 	}
// }
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.documentNo);
	});
}

//下载文件
function downloadfile(res: any) {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
	var result = patt.exec(contentDisposition);
	var filename = result?.[1];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURI(filename?.replace(reg, '$1') ?? ''); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
}
function exportfunAll() {
	isExProtAll.value = true;
	exportfun();
}
//出货明细下载
function exportfun() {
	Exportloading.value = true;
	if (isExProtAll.value) {
		queryList.startTime = queryList.time.length ? moment(queryList.time[0]).format('YYYY-MM-DD') : '';
		queryList.endTime = queryList.time.length ? moment(queryList.time[1]).format('YYYY-MM-DD') : '';
		service({
			url: `/api/collectionGoodsInfo/exportSum`,
			method: 'post',
			data: Object.assign(queryList, tableParams.value, { DocumentNos: "all" }),
			responseType: 'blob',
		})
			.then((data) => {
				downloadfile(data);
				if (data.statusText == 'OK') {
					ElNotification({
						title: '系统提示',
						message: '导出成功',
						type: 'success',
					});
					ElMessage({
						type: 'success',
						message: '导出成功',
					});
					getAppPage();
				}
				isExProtAll.value = false;
				Exportloading.value = false;
			})
			.catch((arr) => {
				ElNotification({
					title: '系统提示',
					message: '下载错误：获取文件流错误',
					type: 'error',
				});
				ElMessage({
					type: 'error',
					message: '导出失败',
				});
				isExProtAll.value = false;
				Exportloading.value = false;
			});
	} else if (selectedRows.value.length > 0) {
		service({
			url: `/api/collectionGoodsInfo/exportSum`,
			method: 'post',
			data: { DocumentNos: selectedRows.value.toString() },
			responseType: 'blob',
		})
			.then((data) => {
				downloadfile(data);
				if (data.statusText == 'OK') {
					ElNotification({
						title: '系统提示',
						message: '导出成功',
						type: 'success',
					});
					ElMessage({
						type: 'success',
						message: '导出成功',
					});
					selectedRows.value = [];
					getAppPage();
				}
				Exportloading.value = false;
			})
			.catch((arr) => {
				ElNotification({
					title: '系统提示',
					message: '下载错误：获取文件流错误',
					type: 'error',
				});
				ElMessage({
					type: 'error',
					message: '导出失败',
				});
				Exportloading.value = false;
			});
	} else {
		ElMessage({
			type: 'error',
			message: '请选择数据',
		});
		Exportloading.value = false;
	}
}
//禁用删除提示
function delPrompt() {
	ElMessageBox.confirm(`该信息状态不可删除，请联系您的系统管理员?`, '提示', {
		type: 'warning',
		showConfirmButton: false,
		showCancelButton: false
	})
}
//删除
function deletefun(val: any) {
	ElMessageBox.confirm(`确认删除该条信息吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			service({
				url: '/api/collectionOrderInfo/delete',
				method: 'post',
				data: { id: val.row.id },
			}).then((data) => {
				if (data.data.type == 'success') {
					ElMessage({
						type: 'success',
						message: '删除成功',
					});
					getAppPage();
				} else {
					ElMessage({
						type: 'info',
						message: '删除失败',
					});
				}
			});
		});

}
//导出报关件
function exportBaoguan(val: any) {
	if (Exportloading.value === true) {
		ElMessage({
			type: 'warning',
			message: '正在导出文件，请等待本次导出完成后再进行导出操作',
		});
		return;
	}
	Exportloading.value = true;
	service({
		url: `/api/collectionOrderInfo/export/${val.row.documentNo}`,
		method: 'get',
		data: { documentNo: val.row.documentNo },
		responseType: 'blob',
		timeout: 120000
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
				getAppPage();
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
			Exportloading.value = false;
		});
}
//导出验货单
function exportYanhuo(val: any) {
	service({
		url: `/api/collectionOrderInfo/exportYanhuo/${val.row.documentNo}`,
		method: 'get',
		data: { documentNo: val.row.documentNo },
		responseType: 'blob',
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出验货单成功',
				});
				getAppPage();
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
}
// ElMessage.error(row.internalProductName+'：数据异常，总净重大于总毛重。')
//导出外箱标签
const exportBoxTag = (val: any) => {
	service({
		url: `/api/collectionOrderInfo/exportWord/${val.row.documentNo}/${val.row.id}`,
		method: 'get',
		data: { documentNo: val.row.documentNo, goodsID: '' },
		responseType: 'blob',
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出外箱标签成功',
				});
				getAppPage();
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '装箱个数为0',
			});
		});
}

//附件下载
const download = (val: any) => {
	dialogFormVisible.value = !dialogFormVisible.value;
	service({
		url: `/api/collectionOrderInfo/getFileList/${val.row.id}`,
		method: 'get',
		data: { id: val.row.id },
	}).then((data) => {
		fileList.value = data.data.result;
	});
}
// 解锁集货单状态
const deblockingBox = (val: any) => {
	deblockingDialogTitle.value = `解锁集货单（${val.row.documentNo}）`;
	deblockingDialogRef.value.openDialog(val.row);
}
//查询
function queryfun(): void {
	loading.value = true;
	getAppPage();
}
//重置
function resetfun(): void {
	loading.value = true;
	Object.keys(queryList).forEach((key: any) => {
		queryList[key] = '';
	});
	getAppPage();
}
// 查看

function examine(val?: any): void {
	if (!val) {
		router.push({ path: '/business/collection/details?id' });
	} else {
		let name = val.row.forwarderName + val.row.shippingMethod + '(' + val.row.isCustomsDeclaration + ')';
		router.push({ path: '/business/edit/edit?id', query: { id: val.row.id, name } });
	}
}
onMounted(async() => {
	const res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('destination');
	destinationList.value = res.data.result
	getAppPage();
	service({
		url: '/api/collectionGoodsInfo/returnSelectBox',
		method: 'get',
	}).then((data) => {
		selectBox.value = data.data.result;
	});
});

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getAppPage();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	getAppPage();
};
//自定义报关件表头
function onCheckAllChange() {
	if (checkAll.value) {
		BaoguancolumnsSetting.value.forEach((element: any) => {
			element.checked = true;
		});
	} else {
		BaoguancolumnsSetting.value.forEach((element: any) => {
			element.checked = false;
		});
	}
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: BaoguancolumnsSetting.value,
			TableName: 'BaoguanColumnsTable',
		},
	});
}
function CollectionOrder() {
	if (checkOrderAll.value) {
		CollectionOrderTable.value.forEach((element: any) => {
			element.checked = true;
		});
	} else {
		CollectionOrderTable.value.forEach((element: any) => {
			element.checked = false;
		});
	}
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: CollectionOrderTable.value,
			TableName: 'CollectionOrderTable',
		},
	});
}
function CollectionOrderReset() {
	CollectionOrderTable.value = OrderColumns.value;
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: CollectionOrderTable.value,
			TableName: 'CollectionOrderTable',
		},
	});
}
//重置
function BaoguanReset() {
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: Baoguancolumns.value,
			TableName: 'BaoguanColumnsTable',
		},
	}).then((data) => {
		if (data.data.type == 'success') {
			getAppPage();
		}
	});
}

//列表顺序改变时触发
function handleUpdate(e: any) {
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: BaoguancolumnsSetting.value,
			TableName: 'BaoguanColumnsTable',
		},
	});
}
function CollectionOrderUpdate(e: any) {
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: CollectionOrderTable.value,
			TableName: 'CollectionOrderTable',
		},
	});
}
function BaoguanOnChange(v: any) {
	checkAll.value = !BaoguancolumnsSetting.value.some((elemant: any) => {
		return elemant.checked == false;
	});
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: BaoguancolumnsSetting.value,
			TableName: 'BaoguanColumnsTable',
		},
	});
}
function CollectionOrderOnChange(v: any) {
	checkOrderAll.value = !CollectionOrderTable.value.some((elemant: any) => {
		return elemant.checked == false;
	});
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: CollectionOrderTable.value,
			TableName: 'CollectionOrderTable',
		},
	});
}
</script>
<style lang="less" scoped>
.font_color {
	:deep(.el-dropdown-menu__item) {
		color: yellow;
	}
}

.settingf {
	position: relative;

	.setting {
		position: absolute;
		right: 0;
	}

	.custom {
		position: relative;
	}
}

:deep(.el-scrollbar__thumb) {
	height: 10px !important;
}
</style>
<style>
.warnTag {
	--el-table-tr-bg-color: var(--el-color-danger-light-9);
}

tr.warnTag td.el-table-fixed-column--left {
	background: var(--el-color-danger-light-9);
}
</style>