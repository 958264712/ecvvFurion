<script lang="ts" setup name="stockSkuOperations">
import { ref, watch, onMounted, h } from 'vue';
import editDialog from './batchModify/index.vue';
import other from '/@/utils/other.ts';
import { ElMessage, ElTooltip } from 'element-plus';
import { useRouter } from 'vue-router';
import { Session } from '/@/utils/storage';
import { ArrowDownBold, ArrowUpBold, QuestionFilled } from '@element-plus/icons-vue';
import { SKUOperationPage, SKUOperationUpdate, SKUOperationExport } from '/@/api/modular/main/sotckSkuOperations';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import { clearEmptyDataByAny } from '/@/utils/constHelper';
import regexHelper from '/@/utils/regexHelper';

const { clearCharactersByRegex } = regexHelper();
const router = useRouter();
const queryParams = ref<any>({});
const tableParams = ref<any>({ PageNo: 1, PageSize: 20 });
const tableData = ref<any>([]);
const selectedRows = ref<any>([]);
const selectedRowKeys = ref<any>([]);
const selectedRowErp = ref<any>('');
const disabledList = ref<any>([]);
const editDialogRef = ref();
const editCostpeice_BatchTitle = ref<string>('批量修改');
const activeName = ref<string>('ALL');
const loading = ref(false);
const Exportloading = ref<any>(false);
const visibleTextarea1 = ref(false);
const erpAndGoodsName = ref('');
const isWatch = ref(true);
const queryLoading = ref(false);
const area = ref('CN');
const month = new Date().getMonth() + 1;
let month1, month2, month3, month4, month5;

switch (month) {
	case 1:
		month1 = 12;
		month2 = 11;
		month3 = 10;
		month4 = 9;
		month5 = 8;
		break;
	case 2:
		month1 = 1;
		month2 = 12;
		month3 = 11;
		month4 = 10;
		month5 = 9;
		break;
	case 3:
		month1 = 2;
		month2 = 1;
		month3 = 12;
		month4 = 11;
		month5 = 10;
		break;
	case 4:
		month1 = 3;
		month2 = 2;
		month3 = 1;
		month4 = 12;
		month5 = 11;
		break;
	case 5:
		month1 = 4;
		month2 = 3;
		month3 = 2;
		month4 = 1;
		month5 = 12;
		break;
	default:
		month1 = month - 1;
		month2 = month - 2;
		month3 = month - 3;
		month4 = month - 4;
		month5 = month - 5;
		break;
}
const TableData = ref<any>([
	{
		titleCN: '图片',
		titleEN: 'IMAGE',
		dataIndex: 'site',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '库存SKU',
		titleEN: 'ERP SKU',
		dataIndex: 'inventorySKU',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '库存品名',
		titleEN: 'ERP NAME',
		dataIndex: 'inventoryProductName',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '销售属性',
		titleEN: 'Sales Attributes',
		dataIndex: 'salesAttributes',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '产品CAT',
		titleEN: 'Category',
		dataIndex: 'productCAT',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '采购国',
		titleEN: 'Sourcing From',
		dataIndex: 'purchasingCountry',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '产品是否淘汰',
		titleEN: 'Item Status',
		dataIndex: 'itemStatus',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '有效ASIN数',
		titleEN: 'Total Available ASINS',
		dataIndex: 'listCount',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '库存',
		titleEN: 'ERP Inventory',
		dataIndex: 'inventoryQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '在途数量',
		titleEN: 'In Transit QTY',
		dataIndex: 'inTransitQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '库存周转状态',
		titleEN: 'Stock Turnover',
		dataIndex: 'stockTurnover',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '周转天数',
		titleEN: 'Turnover Time',
		dataIndex: 'turnoverTime',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '上周7日销量',
		titleEN: 'Last 7 Days Sales',
		dataIndex: 'lastShippedUnits',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '本周7日销量',
		titleEN: '7 Days Sales',
		dataIndex: 'thisShippedUnits',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '周销量趋势',
		titleEN: 'Trend',
		dataIndex: 'weekTrend',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: month + '月AMZ销量',
		titleEN: month + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P0',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: month1 + '月AMZ销量',
		titleEN: month1 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P1',
		checked: true,
		remark: false,
		desc: '',
		fixed: false,
	},
	{
		titleCN: month2 + '月AMZ销量',
		titleEN: month2 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P2',
		checked: true,
		remark: false,
		desc: '',
		fixed: false,
	},
	{
		titleCN: month3 + '月AMZ销量',
		titleEN: month3 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P3',
		checked: true,
		remark: false,
		desc: '',
		fixed: false,
	},
	{
		titleCN: month4 + '月AMZ销量',
		titleEN: month4 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P4',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: month5 + '月AMZ销量',
		titleEN: month5 + 'Month AMZ sales',
		dataIndex: 'shippedUnits_P5',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '首次上架时间',
		titleEN: 'First listing time',
		dataIndex: 'createTime',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '累计采购数量',
		titleEN: 'Accumulated procurement quantity',
		dataIndex: 'totalQuantityShipped',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE月入库数量',
		titleEN: 'UAE monthly inventory quantity',
		dataIndex: 'uaeCurrentInventoryQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA月入库数量',
		titleEN: 'SA monthly inventory quantity',
		dataIndex: 'saCurrentInventoryQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'UAE月出库数量',
		titleEN: 'UAE monthly outbound quantity',
		dataIndex: 'uaeCurrentOutboundQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: 'SA月出库数量',
		titleEN: 'SA monthly outbound quantity',
		dataIndex: 'saCurrentOutboundQuantity',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '现负责人',
		titleEN: 'Creator',
		dataIndex: 'creator',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '最优排名',
		titleEN: 'BestRankTwo',
		dataIndex: 'bestRankTwo',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '最优ASIN',
		titleEN: 'BestASIN',
		dataIndex: 'bestASIN',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '最优价格',
		titleEN: 'BestBuyboxSum',
		dataIndex: 'bestBuyboxSum',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '最优品牌',
		titleEN: 'BestBrand',
		dataIndex: 'bestBrand',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
]);

const handleData = (list: any) => {
	if (list?.length) {
		list.map((item: any, index: number) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].checked = item.checked;
				TableData.value[index].fixed = item.fixed;
			}
		});
	}
};
const handleRemarkData = (list: any) => {
	if (list?.length) {
		list.map((item: any, index: number) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].desc = item.desc;
				TableData.value[index].remark = item.remark;
			}
		});
	}
};
const buyer = ref([
	{
		key: 0,
		value: '全部',
	},
	{
		key: 1,
		value: 'UAE',
	},
	{
		key: 2,
		value: 'SA',
	},
	{
		key: 3,
		value: 'CN',
	},
]);
const ifoutProduct = ref([
	{
		key: 1,
		value: 'New Arrival',
	},
	{
		key: 2,
		value: 'Bestseller',
	},
	{
		key: 3,
		value: 'Clearance',
	},
	{
		key: 4,
		value: 'Obsolete',
	},
	{
		key: 5,
		value: 'Normal',
	},
]);
const stockStatus = ref([
	{
		key: 1,
		value: 'Poor Sale',
	},
	{
		key: 2,
		value: 'Exess Inventtory',
	},
	{
		key: 3,
		value: 'Hot Sale',
	},
	{
		key: 4,
		value: 'Sale Surge',
	},
	{
		key: 5,
		value: 'Normal',
	},
]);
const weekSales = ref([
	{
		key: 1,
		value: 'No Change',
	},
	{
		key: 2,
		value: 'Up',
	},
	{
		key: 3,
		value: 'Down',
	},
]);
const monthSales = ref([
	{
		key: 1,
		value: 'No Change',
	},
	{
		key: 2,
		value: 'Up',
	},
	{
		key: 3,
		value: 'Down',
	},
]);
const tabsList = ref([
	{
		label: '全部',
		name: 'ALL',
	},
	{
		label: 'UAE',
		name: 'UAE',
	},
	{
		label: 'SA',
		name: 'SA',
	},
]);
const area1 = ref('中文表头');
const changeArea = (val: string): void => {
	area.value = val;
	if (area.value === 'CN') {
		area1.value = '中文表头';
	} else {
		area1.value = 'English header';
	}
};
const handleQuery = async (): Promise<void> => {
	loading.value = true;
	queryLoading.value = true;
	queryParams.value.Site = activeName.value;
	if (activeName.value === 'ALL') {
		queryParams.value.Site = null;
	}
	var res = await SKUOperationPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	tableParams.value.PageNo = res.data.result?.page;
	tableParams.value.PageSize = res.data.result?.pageSize;
	res.data.result?.items.map((item: { id: any }) => {
		disabledList.value.push(item.id);
	});
	queryLoading.value = false;
	loading.value = false;
};
// 切换站点
const handleClick = (tab: any): void => {
	if (tab.props.name === 'SA') {
		TableData.value.map((item: any, index: number) => {
			if (item.dataIndex === 'uaeCurrentInventoryQuantity' || item.dataIndex === 'uaeCurrentOutboundQuantity') {
				item.checked = false;
			} else {
				item.checked = true;
			}
		});
	} else if (tab.props.name === 'UAE') {
		TableData.value.map((item: any, index: number) => {
			if (item.dataIndex === 'saCurrentInventoryQuantity' || item.dataIndex === 'saCurrentOutboundQuantity') {
				item.checked = false;
			} else {
				item.checked = true;
			}
		});
	} else {
		TableData.value.map((item: any, index: number) => {
			item.checked = true;
		});
	}

	activeName.value = tab.props.name;
};

// 获取keys
const selectChange = (selection: any): void => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRowErp.value = '';
	selectedRows.value = selection;
	selection.map((item: any, index: number) => {
		selectedRowKeys.value.push(item.id);
		if (activeName.value !== 'ALL') {
			if (index === selection.length - 1) {
				selectedRowErp.value += item.inventorySKU;
			} else {
				selectedRowErp.value += item.inventorySKU + '\n';
			}
		}
	});
};
// 导出选中
const SelectedExport = async (): Promise<void> => {
	Exportloading.value = true;
	await SKUOperationExport(Object.assign({ type: 1, area: area.value, ids: selectedRowKeys.value, isImages: false, site: activeName.value === 'ALL' ? null : activeName.value })).then((res) => {
		other.downloadfile(res);
		selectedRowKeys.value = [];
		selectedRows.value = [];
		Exportloading.value = false;
	});
};
// 导出所有
const AllExport = async (): Promise<void> => {
	if (activeName.value === 'ALL') {
		queryParams.value.Site = null;
	}
	//if (queryParams.value.erpSkuList?.length > 0) {
	// queryParams.value.erpTextArea = '';
	//queryParams.value.ErpSku = '';
	//} else {
	//queryParams.value.ErpSku = erpAndGoodsName.value;
	//queryParams.value.erpSkuList = null;
	//}
	Exportloading.value = true;
	await SKUOperationExport(Object.assign(queryParams.value, tableParams.value, { type: 0, isImages: false, area: area.value })).then((res) => {
		other.downloadfile(res);
		selectedRows.value = [];
		Exportloading.value = false;
	});
};

// 打开编辑页面
const batchModify = (): void => {
	editDialogRef.value.idList = selectedRowKeys.value;
	editDialogRef.value.openDialog();
};
// 修改与批量修改
const disabledfun = async (val: any): Promise<void> => {
	if (disabledList.value.some((item: any) => item === val.row.id)) {
		const index = disabledList.value.findIndex((item: any) => item === val.row.id);
		disabledList.value.splice(index, 1);
	} else {
		disabledList.value.push(val.row.id);
		var res = await SKUOperationUpdate(Object.assign({ id: val.row.id, itemStatus: val.row.itemStatus }));
		res.data.result?.type === 'success' ? ElMessage.success('Save Successfully!') : null;
	}
};
const disabledAuto = (scope: any): boolean => {
	return disabledList.value.some((item: any) => item === scope.row.id);
};
// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.PageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.PageNo = val;
	handleQuery();
};
const idList = () => {
	handleQuery();
};
// 跳转到asin管理页面并查询
const handleRouter = (storeSku: string, site: string) => {
	if (site !== 'ALL') {
		Session.set('queryObj', { country: site, erpAndGoodsName: storeSku, ifquery: false });
		router.push({ path: '/operation/asin/asindata' });
	}
};

const handleConfirm = () => {
	let str_array = [];
	if (queryParams.value.erpTextArea?.length) {
		str_array = clearCharactersByRegex(queryParams.value.erpTextArea + '');
		let arr = clearEmptyDataByAny(str_array);
		//queryParams.value.ErpSkuList = arr;
		erpAndGoodsName.value = arr + '';
	}
	visibleTextarea1.value = false;
};

const splitRank = (row:any, column:any) => {
	if (column.property) {
		let list = [];
		if (row[column.property]) {
			list = row[column.property].split('#');
		}
		let content = `<div>`;
		let hArr: any = [];
		list.map((item:any, index:number) => {
			let iArr = item.split('\n');
			if (iArr?.length > 2) {
				let arr:any = [];
				iArr.map((item:any, index:number) => {
					let str = '';
					if (index !== iArr?.length - 1) {
						if (index % 2 === 0) {
							// str += `<div><span>#${item}</span>`;
							// arr.push(h('span', null, '#'+item));
						} else {
							str += `<a href="${item}" target="_blank">#${iArr[index - 1]}</a></div>`;
							arr.push(h('a', { href: item, target: '_blank' }, '#' + iArr[index - 1]));
							let countArr = h('div', null, arr);
							hArr.push(countArr);
							arr = [];
						}
						content += str;
					}
				});
			} else {
				let arr:any = [];
				iArr.map((item:any, index:number) => {
					let str = '<div>';
					if (index % 2 === 0 && item?.length) {
						str += `#${item}</div>`;
						arr.push(h('span', null, '#' + item));
						let countArr = h('div', null, arr);
						hArr.push(countArr);
						arr = [];
					}
					content += str;
				});
			}
		});
		content += '</div>';
		return h(ElTooltip, { content, placement: 'top', rawContent: true, effect: 'light' }, [h('div', null, [...hArr])]);
	}
};

const resetQueryConditions = () => {
	queryParams.value.erpTextArea = '';
	queryParams.value.erpSkuList = null;
	erpAndGoodsName.value = '';
};

const clearErp = () => {
	erpAndGoodsName.value = '';
	queryParams.value.ErpSku = '';
	queryParams.value.erpTextArea = null;
	Session.set('queryObj', { ifquery: true });
};
// 重置
const reset = () => {
	erpAndGoodsName.value = '';
	Session.set('queryObj', {});
	queryParams.value = {};
	handleQuery();
};

const handleErpList = () => {
	Session.set('queryObj', { country: activeName.value, erpAndGoodsName: selectedRowErp.value, ifquery: false });
	router.push({ path: '/operation/asin/asindata' });
};

// 排序
const sortfun = (v: any) => {
	tableParams.value.order = v.order;
	tableParams.value.prop = v.prop;
	handleQuery();
};
watch(
	() => erpAndGoodsName.value,
	() => {
		if (isWatch.value) {
			isWatch.value = false;
			let str_array = clearCharactersByRegex(erpAndGoodsName.value.trim());
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				//if (arr[0] !== undefined) {
				queryParams.value.erpSkuList = arr;
				queryParams.value.erpTextArea = arr;
				//} else {
				//queryParams.value.ErpSkuList = null;
				//}
			} else {
				queryParams.value.erpSkuList = null;
				queryParams.value.erpTextArea = '';
			}
		} else {
			isWatch.value = true;
		}
	}
);

watch(
	() => queryParams.value.erpTextArea,
	() => {
		if (isWatch.value) {
			isWatch.value = false;
			let str_array = clearCharactersByRegex(queryParams.value.erpTextArea.trim());
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				//if (arr[0] !== undefined) {
				queryParams.value.erpSkuList = arr;
				erpAndGoodsName.value = arr;
				//} else {
				//queryParams.value.ErpSkuList = null;
				//}
			} else {
				queryParams.value.erpSkuList = null;
				erpAndGoodsName.value = '';
			}
		} else {
			isWatch.value = true;
		}
	}
);

// 站点改变调用接口
watch(
	() => activeName.value,
	() => {
		handleQuery();
	}
);
onMounted(() => {
	handleQuery();
});
</script>
<template>
	<div class="stock_sku_operations">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="品名/库存SKU">
					<el-popover :visible="visibleTextarea1" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input
								v-model="queryParams.erpTextArea"
								style="width: 215px"
								:autosize="{ minRows: 1, maxRows: 200 }"
								type="textarea"
								placeholder="可输入多个ERP-SKU精确查询，每行一个，最多支持200个"
							/>
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.erpSkuList?.length ?? 0 }}/200</span>
							<el-button type="info" @click="resetQueryConditions()">重置</el-button>
							<el-button type="primary" @click="handleConfirm()">确定</el-button>
						</div>
						<template #reference>
							<el-input v-model="erpAndGoodsName" clearable="" placeholder="请输入,点击展开可输多个" @clear="clearErp">
								<template #suffix>
									<el-icon class="el-input__icon">
										<ArrowDownBold @click="visibleTextarea1 = !visibleTextarea1" v-if="!visibleTextarea1" />
										<ArrowUpBold @click="visibleTextarea1 = !visibleTextarea1" v-else />
									</el-icon>
								</template>
							</el-input>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item label="采购国">
					<el-select clearable="" v-model="queryParams.PurchasingCountry" placeholder="全部">
						<el-option v-for="(item, index) in buyer" :key="index" :value="item.value" :label="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="产品是否淘汰">
					<el-select clearable="" v-model="queryParams.ItemStatus" placeholder="请选择">
						<el-option v-for="(item, index) in ifoutProduct" :key="index" :value="item.value" :label="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="库存周转状态">
					<el-select clearable="" v-model="queryParams.StockTurnover" placeholder="请选择">
						<el-option v-for="(item, index) in stockStatus" :key="index" :value="item.value" :label="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="周销量趋势">
					<el-select clearable="" v-model="queryParams.WeekTrend" placeholder="请选择">
						<el-option v-for="(item, index) in weekSales" :key="index" :value="item.value" :label="item.value" />
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="月销量趋势">
					<el-select clearable="" v-model="queryParams.MonthTrend" placeholder="请选择">
						<el-option v-for="(item, index) in monthSales" :key="index" :value="item.value"
							:label="item.label" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="负责人">
					<el-input v-model="queryParams.creator" clearable="" placeholder="请输入负责人" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" :disabled="queryLoading" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="reset"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px" :body-style="{ padding: '10px 20px' }">
			<div class="settingf" style="margin-bottom: 5px; display: flex; justify-content: space-between">
				<div>
					<el-button type="primary" @click="batchModify" style="margin-right: 0px" :disabled="!selectedRowKeys?.length"> 批量修改 </el-button>
					<el-button type="primary" @click="handleErpList" style="margin-right: 10px" :disabled="(activeName !== 'UAE' && activeName !== 'SA') || !selectedRowErp?.length"> 查询ASIN详情 </el-button>
					<el-dropdown style="margin-right: 20px">
						<el-button type="primary" :loading="Exportloading"> 导出 </el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="AllExport">导出所有</el-dropdown-item>
								<el-dropdown-item @click="SelectedExport" :disabled="!selectedRowKeys?.length">导出选中</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-radio-group v-model="area1" style="margin-left: 20px">
						<el-radio-button label="中文表头" value="中文表头" @change="changeArea('CN')" />
						<el-radio-button label="English header" value="English header" @change="changeArea('EN')" />
					</el-radio-group>
				</div>
				<tabDragColum :data="TableData" :tagInfo="true" :name="`stockSkuOperationsData`" :area="area" @handleData="handleData" @handleRemarkData="handleRemarkData" />
			</div>
			<el-tabs v-model="activeName" type="card" style="height: 85%" @tab-click="handleClick">
				<el-tab-pane :label="item.label" :name="item.name" style="height: 100%" v-for="item in tabsList">
					<el-table
						:data="tableData"
						style="height: 100%"
						v-loading="loading"
						tooltip-effect="light"
						row-key="id"
						@selection-change="(selection: any) => selectChange(selection)"
						@sort-change="sortfun"
					>
						<el-table-column type="selection" width="55" />
						<el-table-column type="index" :label="area == 'CN' ? '序号' : 'NO.'" width="55" align="center" />
						<template v-for="(item, index) in TableData" :key="index">
							<el-table-column
								v-if="item.checked && item.dataIndex === 'site'"
								:prop="item.dataIndex"
								show-overflow-tooltip
								:fixed="item.fixed"
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								sortable
								align="center"
							>
								<template #header>
									<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
										<div style="display: flex; align-items: center; justify-content: center">
											{{ area == 'CN' ? item.titleCN : item.titleEN }}
											<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
										</div>
										<template #content>
											<div v-html="item.desc"></div>
										</template>
									</el-tooltip>
									<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
								</template>
								<template #default="scope">
									<img :src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.inventorySKU + '.jpg'" />
								</template>
							</el-table-column>
							<el-table-column
								v-else-if="item.checked && item.dataIndex === 'inventorySKU'"
								width="110"
								:fixed="item.fixed"
								:prop="item.dataIndex"
								show-overflow-tooltip
								sortable
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								align="center"
							>
								<template #header>
									<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
										<div style="display: flex; align-items: center; justify-content: center">
											{{ area == 'CN' ? item.titleCN : item.titleEN }}
											<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
										</div>
										<template #content>
											<div v-html="item.desc"></div>
										</template>
									</el-tooltip>
									<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
								</template>
								<template #default="scope">
									<el-link style="color: red" @click="handleRouter(scope.row.inventorySKU, activeName)">{{ scope.row.inventorySKU }} </el-link>
								</template>
							</el-table-column>
							<el-table-column
								v-else-if="item.checked && item.dataIndex === 'itemStatus'"
								:fixed="item.fixed"
								:prop="item.dataIndex"
								show-overflow-tooltip
								sortable
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								width="100"
								align="center"
							>
								<template #header>
									<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
										<div style="display: flex; align-items: center; justify-content: center">
											{{ area == 'CN' ? item.titleCN : item.titleEN }}
											<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
										</div>
										<template #content>
											<div v-html="item.desc"></div>
										</template>
									</el-tooltip>
									<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
								</template>
								<template #default="scope">
									<el-select v-model="scope.row.itemStatus" :disabled="disabledAuto(scope)">
										<el-option v-for="(item, index) in ifoutProduct" :key="index" :value="item.value" :label="item.value" />
									</el-select>
								</template>
							</el-table-column>
							<el-table-column
								v-else-if="item.checked && item.dataIndex === 'listCount'"
								:fixed="item.fixed"
								:prop="item.dataIndex"
								show-overflow-tooltip
								width="110"
								sortable
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								align="center"
							>
								<template #header>
									<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
										<div style="display: flex; align-items: center; justify-content: center">
											{{ area == 'CN' ? item.titleCN : item.titleEN }}
											<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
										</div>
										<template #content>
											<div v-html="item.desc"></div>
										</template>
									</el-tooltip>
									<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
								</template>
								<template #default="scope">
									<el-link style="color: red" @click="handleRouter(scope.row.inventorySKU, activeName)">{{ scope.row.listCount }} </el-link>
								</template>
							</el-table-column>
							<el-table-column
								v-else-if="item.checked && item.dataIndex === 'bestRankTwo'"
								:fixed="item.fixed"
								:prop="item.dataIndex"
								width="110"
								sortable
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								align="center"
								:formatter="splitRank"
							>
								<template #header>
									<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
										<div style="display: flex; align-items: center; justify-content: center">
											{{ area == 'CN' ? item.titleCN : item.titleEN }}
											<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
										</div>
										<template #content>
											<div v-html="item.desc"></div>
										</template>
									</el-tooltip>
									<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
								</template>
							</el-table-column>
							<el-table-column
								v-else-if="item.checked"
								:fixed="item.fixed"
								:prop="item.dataIndex"
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								width="120"
								align="center"
								sortable
								show-overflow-tooltip
							>
								<template #header>
									<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
										<div style="display: flex; align-items: center; justify-content: center">
											{{ area == 'CN' ? item.titleCN : item.titleEN }}
											<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
										</div>
										<template #content>
											<div v-html="item.desc"></div>
										</template>
									</el-tooltip>
									<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
								</template>
							</el-table-column>
						</template>
						<el-table-column label="操作" width="140" align="center" fixed="right">
							<template #default="scope">
								<el-button size="small" text type="primary" @click="disabledfun(scope)">{{ disabledList.some((item: any) => item === scope.row.id) ? '编辑' : '保存' }}</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
			<el-pagination
				v-model:currentPage="tableParams.PageNo"
				v-model:page-size="tableParams.PageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<editDialog ref="editDialogRef" :title="editCostpeice_BatchTitle" @reloadTable="handleQuery" @idList="idList" />
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.settingf {
	margin-bottom: 10px;
}

:deep(.el-tabs--card) {
	.el-tabs__header {
		margin: 0;
	}

	.el-tabs__content {
		height: 90%;
	}

	// .el-table__body-wrapper{
	//     overflow:auto;
	// }
}

:deep(.cell) {
	white-space: nowrap;
	display: flex;
	align-items: center;
}

:deep(.el-table td.el-table__cell div) {
	overflow: hidden;
}

:deep(.el-textarea__inner) {
	box-shadow: initial;
	padding: 5px;
	margin: 0;
	height: 142px !important;
}
</style>
