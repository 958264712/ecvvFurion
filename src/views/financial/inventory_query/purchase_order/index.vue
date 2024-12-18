<script lang="ts" setup name="purchase_order">
import { ref, onMounted, watch,h } from 'vue';
import { pYYPurchaseOrderPage, pYYPurchaseOrderupdate, importPurchaseUnitPrice,getAssociatedCollectionGoodInfo,pYYAssociatedCollectionOrder } from '/@/api/modular/main/financial.ts';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import { ElMessage,ElButton } from 'element-plus';
import importDialog from '/@/components/importDialog/index.vue';
import moment from 'moment';
import axios from 'axios';
import { clearEmptyDataByAny } from '/@/utils/constHelper';
import regexHelper from '/@/utils/regexHelper';
import newInfoData from '/@/components/newInfoDataDialog/index.vue';
import { getAPI } from '/@/utils/axios-utils';
import { SysDictDataApi } from '/@/api-services/api';

const { clearCharactersByRegex } = regexHelper();
const tableData = ref<any>([]);
const queryParams = ref<any>({ CreatorTime: '' });
const tableParams = ref<any>({
	page: 1,
	pageSize: 50,
	total: 0,
});
const dialogFormVisible = ref(false);
const area = ref('CN');
const IsEdit = ref<any>(false);
const loading = ref(false);
const loading2 = ref(false);
const isWatch = ref(true);
const visibleTextarea1 = ref(false);
const erpAndGoodsName = ref('');
const warehouse = ref<any>([
	{ value: 'EG Warehouse X1', lable: 'EG Warehouse X1' },
	{ value: '埃及不良品仓', lable: '埃及不良品仓' },
	{ value: 'EG Warehouse', lable: 'EG Warehouse' },
	{ value: '沙特不良品仓', lable: '沙特不良品仓' },
	{ value: 'SA Warehouse X1', lable: 'SA Warehouse X1' },
	{ value: 'SA Warehouse', lable: 'SA Warehouse' },
	{ value: '阿曼仓', lable: '阿曼仓' },
	{ value: 'UAE Store Warehouse', lable: 'UAE Store Warehouse' },
	{ value: '阿联酋不良品仓6Z2', lable: '阿联酋不良品仓6Z2' },
	{ value: 'UAE Warehouse No. 2', lable: 'UAE Warehouse No. 2' },
	{ value: 'UAE Warehouse No. 6', lable: 'UAE Warehouse No. 6' },
	{ value: '深圳仓库', lable: '深圳仓库' },
	{ value: '迪拜虚拟仓库', lable: '迪拜虚拟仓库' },
	{ value: '默认仓库', lable: '默认仓库' },
]);
const TableData = ref<any>([
	{
		titleCN: '采购单号',
		dataIndex: 'purchaseOrderNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购仓库',
		dataIndex: 'purchaseWarehouse',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购SKU个数',
		dataIndex: 'purchaseSKUQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购总数量',
		dataIndex: 'purchaseTotalQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购总金额',
		dataIndex: 'purchaseTotalAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购数量',
		dataIndex: 'purchaseQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单价',
		dataIndex: 'purchaseUnitPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购金额',
		dataIndex: 'purchaseAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流费用',
		dataIndex: 'logisticsCost',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未到货总数量',
		dataIndex: 'totalQuantityNotYetArrived',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未到货总金额',
		dataIndex: 'totalAmountNotYetArrived',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '已到货总金额',
		dataIndex: 'totalAmountAlreadyArrived',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单供应商',
		dataIndex: 'purchaseOrderSupplier',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '预计到货日期',
		dataIndex: 'estimatedArrivalDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购员',
		dataIndex: 'purchaser',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '制单人',
		dataIndex: 'creator',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '制单时间',
		dataIndex: 'creationTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购审核人',
		dataIndex: 'purchaseReviewer',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购审核时间',
		dataIndex: 'purchaseReviewTime',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '账单日期',
		dataIndex: 'billingDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '平台供应商ID',
		dataIndex: 'platformSupplierID',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '平台订单号',
		dataIndex: 'platformOrderNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '平台订单状态',
		dataIndex: 'platformPrderStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流方式',
		dataIndex: 'logisticsMethod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流单号',
		dataIndex: 'logisticsNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '付款方式',
		dataIndex: 'paymentMethod',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实付款',
		dataIndex: 'disbursements',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '差额(总金额-实付款)',
		dataIndex: 'difference',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '预付款',
		dataIndex: 'prepaymentContractNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '合同号',
		dataIndex: 'contractNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购备注',
		dataIndex: 'procurementRemarks',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '付款状态',
		dataIndex: 'paymentStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购单状态',
		dataIndex: 'purchaseOrderStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '图片',
		dataIndex: 'image',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存SKU',
		dataIndex: 'erpSku',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品名称',
		dataIndex: 'goodsName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未到货数量',
		dataIndex: 'undeliveredQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '已到货数量',
		dataIndex: 'receivedQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品备注',
		dataIndex: 'productRemark',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '5天销量',
		dataIndex: 'sales5Day',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '15天销量',
		dataIndex: 'sales15Day',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '30天销量',
		dataIndex: 'sales30Day',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '可用数量',
		dataIndex: 'availableQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存上限',
		dataIndex: 'inventoryCeiling',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '单位',
		dataIndex: 'unit',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库位',
		dataIndex: 'storageLocation',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '款式1',
		dataIndex: 'style1',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '款式2',
		dataIndex: 'style2',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '款式3',
		dataIndex: 'style3',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '品牌',
		dataIndex: 'brand',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '规格',
		dataIndex: 'specifications',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '型号',
		dataIndex: 'modelNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '材质',
		dataIndex: 'materialQuality',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品状态',
		dataIndex: 'productStatus',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '商品供应商',
		dataIndex: 'commoditySupplier',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '物流分摊前单价',
		dataIndex: 'unitPriceBeforLogisticsAllocation',
		checked: true,
		fixed: false,
	},
]);
const importType = ref('purchase_order');
const importText = ref('选择日期，点击"确定"后，选择需要导入的文件，将导入该数据');
const importFormList = ref<any>([
	{
		label: '日期',
		prop: 'Time',
		type: 'datePicker',
		dateType: 'month',
	},
]);

const collectionOrderRef = ref<any>();
const collectionTitle = ref('关联集货单');
const collectionId = ref(undefined);
const collectionLoading = ref(false);
const destinationList = ref<any>([]);
const collectionFormList = ref<any>([
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
	},
	{
		label: '集货单号',
		prop: 'documentNo',
	},
	{
		label: 'ERP SKU',
		prop: 'erpsku',
	},
	{
		label: '状态',
		prop: 'state',
		select: true,
		multiple: true,
		options: [
			{
				label: '集货',
				value: '集货',
			},
			{
				label: '在途中',
				value: '在途中',
			},
			{
				label: '部分入仓',
				value: '部分入仓',
			},
			{
				label: '已入仓',
				value: '已入仓',
			},
		],
	},
	{
		label:'目的地',
		prop:'destination',
		select:true,
		options:destinationList,
	}
]);
const collectionDataList = ref<any>([
	{
		label: '目的地',
		prop: 'destination',
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
	},
	{
		label: 'SKU',
		prop: 'erpsku',
	},
	{
		label: 'FOB供货价',
		prop: 'fobSupplyPrice',
	},
	{
		label: '制单时间',
		prop: 'productionTime',
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => collectionMatch(collectionId.value, row.correlationId),
					type: 'primary',
				},
				'关联'
			);
		},
	},
]);
const openCollectionOrder = (row: any) => {
	collectionId.value = row.id;
	collectionTitle.value = `关联集货单（id：${row.id}）`;
	collectionOrderRef.value.openDialog();
};
const collectionMatch = async (id: any, correlationId: any) => {
	collectionLoading.value = true;
	await pYYAssociatedCollectionOrder({ id, correlationId })
		.then((res) => {
			ElMessage.success('关联成功');
		})
		.catch((err) => {
			ElMessage.error(err.message);
		})
		.finally(() => {
			collectionLoading.value = false;
		});
};
// 查询
const handleQuery = async (): Promise<void> => {
	loading.value = true;
	queryParams.value.StartCreatorTime = queryParams.value.CreatorTime ?  moment(queryParams.value.CreatorTime[0]).format('YYYY-MM-DD') : undefined;
	queryParams.value.EndCreatorTime = queryParams.value.CreatorTime ?  moment(queryParams.value.CreatorTime[1]).format('YYYY-MM-DD') : undefined;
	await pYYPurchaseOrderPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		//tableData.value = res.data.result.items;
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	loading.value = false;
	IsEdit.value = false;
};
// 导入采购单
function ImportPurchaseOrder(file: any) {
	loading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	axios.post((import.meta.env.VITE_API_URL as any) + `/api/pYYPurchaseOrder/importPurchaseOrder`, formData).then((res) => {
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			handleQuery();
			loading.value = false;
		} else {
			ElMessage.error(res.message); // + res.message
			loading.value = false;
		}
	});
}
// 导入采购单价
function ImportPurchaseUnitPrice(file: any) {
	loading2.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	axios.post((import.meta.env.VITE_API_URL as any) + `/api/pYYPurchaseOrder/importPurchaseUnitPrice`, formData).then((res) => {
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			handleQuery();
			loading2.value = false;
		} else {
			ElMessage.error(res.message); // + res.message
			loading2.value = false;
		}
	});
}
const update = async (row: any) => {
	await pYYPurchaseOrderupdate(row);
	ElMessage.success('update succeeded');
	IsEdit.value = false;
	row.IsEdit = false;
};
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
};
const importClose = (bol: boolean) => {
	dialogFormVisible.value = bol;
};
const clearErp = () => {
	erpAndGoodsName.value = '';
	queryParams.value.erpTextArea = '';
	queryParams.value.erpSkuList = null;
};
// 重置
const reset = () => {
	queryParams.value = { erpTextArea: '' };
	erpAndGoodsName.value = '';
	handleQuery();
};
const handleConfirm = () => {
	let str_array = [];
	if (queryParams.value.erpTextArea?.length) {
		str_array = clearCharactersByRegex(queryParams.value.erpTextArea + '');
		let arr = clearEmptyDataByAny(str_array)
		erpAndGoodsName.value = arr + '';
	}
	visibleTextarea1.value = false;
};
onMounted(async () => {
	const res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('destination');
	destinationList.value = res.data.result
	handleQuery();
});


// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	handleQuery();
};
// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	handleQuery();
};

watch(
	() => erpAndGoodsName.value,
	() => {
		if(isWatch.value){
			isWatch.value = false;
			let str_array = clearCharactersByRegex(erpAndGoodsName.value.trim());
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				queryParams.value.erpSkuList = arr;
				queryParams.value.erpTextArea = arr;
			}else{
				queryParams.value.erpSkuList = undefined;
				queryParams.value.erpTextArea = '';
			}
		}else{
			isWatch.value = true;
		}
	}
);

watch(
	() => queryParams.value.erpTextArea,
	() => {
		if(isWatch.value){
			isWatch.value = false;
			let str_array = clearCharactersByRegex(queryParams.value.erpTextArea);
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				queryParams.value.erpSkuList = arr;
				erpAndGoodsName.value = arr;
			}else{
				queryParams.value.erpSkuList = undefined;
				erpAndGoodsName.value = '';
			}
		}else{
			isWatch.value = true;
		}
	}
);



</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="制单时间">
					<el-date-picker style="width: 250px" start-placeholder=" 开始时间" end-placeholder="结束时间" type="daterange" v-model="queryParams.CreatorTime" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="采购仓库">
					<el-select clearable="" v-model="queryParams.purchaseWarehouse">
						<el-option v-for="item in warehouse" :value="item.value" :label="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="库存SKU">
					<el-popover :visible="visibleTextarea1" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input v-model="queryParams.erpTextArea" style="width: 215px" :autosize="{ minRows: 1, maxRows: 200 }" type="textarea" placeholder="可输入多个SKU精确查询，每行一个，最多支持200个" />
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.erpSkuList?.length ?? 0 }}/200</span>
							<el-button
								type="info"
								@click="
									() => {
										queryParams.erpTextArea = '';
										erpAndGoodsName = '';
									}
								"
								>重置</el-button
							>
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
				<el-form-item label="采购单号">
					<el-input placeholder="请输入" v-model="queryParams.purchaseOrderNumber" clearable />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button  type="primary" icon="ele-Search" @click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="reset"
							style="width: 70px; margin-right: 2px"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf" style="margin-bottom: 5px; display: flex; justify-content: space-between">
				<div class="flex flex-wrap items-center">
					<el-upload :on-change="ImportPurchaseOrder" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
						<el-button :loading="loading" type="primary">导入采购订单</el-button>
					</el-upload>
					<el-button style="margin-left: 10px" @click="dialogFormVisible = true" type="primary"> 导入采购单价 </el-button>
					<el-dialog v-model="dialogFormVisible" title="普源采购单价数据导入" width="600px" center>
						<importDialog :type="importType" :text="importText" :formList="importFormList" :importsInterface="importPurchaseUnitPrice" @close="importClose" @importQuery="handleQuery" />
					</el-dialog>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%"  v-loading="loading" tooltip-effect="light">
				<el-table-column width="155" align="center" fixed="left" show-overflow-tooltip="">
					<template #header>
						<el-button style="background-color: transparent; border: none; color: #df1515" icon="ele-Setting"></el-button>
					</template>
					<template #default="scope">
						<el-button v-if="scope.row.IsEdit" icon="ele-Document" size="small" text type="primary" @click="update(scope.row)"></el-button>
						<el-button v-if="!scope.row.IsEdit" icon="ele-Edit" size="small" text type="primary" @click="openEdit(scope.row)"></el-button>
						<el-button type="primary" @click="openCollectionOrder(scope.row)">关联集货单</el-button>
					</template>
				</el-table-column>
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex == 'purchaseUnitPrice'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						min-width="150"
						show-overflow-tooltip=""
					>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.purchaseUnitPrice" clearable="" />
								<div v-else>{{ scope.row.purchaseUnitPrice }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else :fixed="item.fixed" :prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" show-overflow-tooltip="" />
				</template>
			</el-table>
			<newInfoData
				:title="collectionTitle"
				idName="id"
				:loading="collectionLoading"
				:id="collectionId"
				:formList="collectionFormList"
				ref="collectionOrderRef"
				:dataList="collectionDataList"
				:pointerface="getAssociatedCollectionGoodInfo"
			/>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}

:deep(.el-dialog__title) {
	color: white;
}

:deep( .el-textarea__inner) {
	box-shadow: initial;
	padding: 0;
	margin: 4px 0 4px 3px;
	height: 142px !important;
}
</style>
