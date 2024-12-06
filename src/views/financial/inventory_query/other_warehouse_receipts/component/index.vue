<script lang="ts" setup name="other_warehouse_receipts_info">
import { ref, onMounted, watch, h } from 'vue';
import { pYYOtherWarehouseReceiptsPage, getCollectionOrder, getAssociatedOutboundOrder, associatedOutboundOrder, associatedCollectionOrder } from '/@/api/modular/main/financial.ts';
import { ElMessage, ElButton } from 'element-plus';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import moment from 'moment';
import { clearEmptyDataByAny } from '/@/utils/constHelper';
import regexHelper from '/@/utils/regexHelper';
import { useRoute } from 'vue-router';
import newInfoData from '/@/components/newInfoDataDialog/index.vue';

const route = useRoute();
const { clearCharactersByRegex } = regexHelper();
const tableData = ref<any>([]);
const queryParams = ref<any>({ CreatorTime: '' });
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
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
const erpAndGoodsName = ref('');
const area = ref('CN');
const isWatch = ref(true);
const loading = ref(false);
const visibleTextarea1 = ref(false);
const TableData = ref<any>([
	{
		titleCN: '制单日期',
		dataIndex: 'productionDate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库单号',
		dataIndex: 'warehouseEntryNumber',
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
		titleCN: '配货名称',
		dataIndex: 'distributionName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库数量',
		dataIndex: 'inventoryQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '含税单价',
		dataIndex: 'unitPrice',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '含税金额',
		dataIndex: 'amountIncludingTax',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库仓库',
		dataIndex: 'inboundWarehouse',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '单据号/合同号',
		dataIndex: 'documentNumber',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库类别',
		dataIndex: 'inboundCategory',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库单备注',
		dataIndex: 'remarksOnTheWarehouseReceipt',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总数量',
		dataIndex: 'totalQuantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总金额',
		dataIndex: 'totalAmount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '入库单状态',
		dataIndex: 'receiptStatus',
		checked: true,
		fixed: false,
	},
]);

const outWarehouseOrderRef = ref<any>();
const collectionOrderRef = ref<any>();
const outWarehouseTitle = ref('关联出库单');
const collectionTitle = ref('关联集货单');
const outWarehouseId = ref(undefined);
const collectionId = ref(undefined);
const outWarehouseLoading = ref(false);
const collectionLoading = ref(false);
const outWarehouseFormList = ref<any>([
	{
		label: '制单时间',
		prop: 'CreatorTime',
		select: false,
		date: true,
		type: 'daterange',
	},
	{
		label: '出库仓库',
		prop: 'outboundWarehouse',
		select: true,
		options: warehouse,
	},
	{
		label: '出库单号',
		prop: 'deliveryNoteNumber',
	},
]);
const collectionFormList = ref<any>([
	{
		label: '制单时间',
		prop: 'OrderCreatedDate',
		select: false,
		date: true,
		type: 'daterange',
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
		select: true,
		options: warehouse,
	},
	{
		label: '集货单号',
		prop: 'documentNo',
	},
]);
const outWarehouseDataList = ref<any>([
	{
		label: '制单时间',
		prop: 'creatorTime',
	},
	{
		label: '出库单号',
		prop: 'deliveryNoteNumber',
	},
	{
		label: '出库仓库',
		prop: 'outboundWarehouse',
	},
	{
		label: '总数量',
		prop: 'totalQuantity',
	},
	{
		label: '总金额',
		prop: 'totalQuantity',
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => outWarehouseMatch(route.query.id, row.deliveryNoteNumber),
					type: 'primary',
				},
				'关联'
			);
		},
	},
]);
const collectionDataList = ref<any>([
	{
		label: '集货单号',
		prop: 'documentNo',
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
	},
	{
		label: '货代名称',
		prop: 'forwarderName',
	},
	{
		label: '总数量',
		prop: 'totalQuantity',
	},
	{
		label: '总金额',
		prop: 'totalQuantity',
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => collectionMatch(route.query.id, row.inWareHouseNo),
					type: 'primary',
				},
				'关联'
			);
		},
	},
]);
const openOutWarehouse = (row: any) => {
	outWarehouseId.value = row.id;
	outWarehouseTitle.value = `关联出库单（入库单：${route.query.id}）`;
	outWarehouseOrderRef.value.openDialog();
};
const openCollectionOrder = (row: any) => {
	collectionId.value = row.id;
	collectionTitle.value = `关联集货单（入库单：${route.query.id}）`;
	collectionOrderRef.value.openDialog();
};
const outWarehouseMatch = async (warehouseEntryNumber: any, associatedNumber: string) => {
	outWarehouseLoading.value = true;
	await associatedOutboundOrder({ warehouseEntryNumber, associatedNumber })
		.then((res) => {
			ElMessage.success('关联成功');
		})
		.catch((err) => {
			ElMessage.error(err.message);
		})
		.finally(() => {
			outWarehouseLoading.value = false;
		});
};
const collectionMatch = async (warehouseEntryNumber: any, associatedNumber: string) => {
	collectionLoading.value = true;
	await associatedCollectionOrder({ warehouseEntryNumber, associatedNumber })
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
	queryParams.value.StartCreatorTime = queryParams.value.CreatorTime ? moment(queryParams.value.CreatorTime[0]).format('YYYY-MM-DD') : undefined;
	queryParams.value.EndCreatorTime = queryParams.value.CreatorTime ? moment(queryParams.value.CreatorTime[1]).format('YYYY-MM-DD') : undefined;
	await pYYOtherWarehouseReceiptsPage(Object.assign(queryParams.value, tableParams.value)).then((res) => {
		tableData.value.splice(0, tableData.value.length);
		tableParams.value.total = res.data.result?.total;
		res.data.result.items.forEach((element: any) => {
			tableData.value.push(element);
		});
	});
	loading.value = false;
};

onMounted(() => {
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
		let arr = clearEmptyDataByAny(str_array);
		erpAndGoodsName.value = arr + '';
	}
	visibleTextarea1.value = false;
};
watch(
	() => erpAndGoodsName.value,
	() => {
		if (isWatch.value) {
			isWatch.value = false;
			let str_array = clearCharactersByRegex(erpAndGoodsName.value.trim());
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				queryParams.value.erpSkuList = arr;
				queryParams.value.erpTextArea = arr;
			} else {
				queryParams.value.erpSkuList = undefined;
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
			let str_array = clearCharactersByRegex(queryParams.value.erpTextArea);
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				queryParams.value.erpSkuList = arr;
				erpAndGoodsName.value = arr;
			} else {
				queryParams.value.erpSkuList = undefined;
				erpAndGoodsName.value = '';
			}
		} else {
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
				<el-form-item label="入库仓库">
					<el-select clearable="" v-model="queryParams.inboundWarehouse">
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
				<el-form-item label="入库单号">
					<el-input placeholder="请输入" v-model="queryParams.warehouseEntryNumber" clearable />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="reset" style="width: 70px; margin-right: 2px"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf" style="margin-bottom: 5px; display: flex; justify-content: space-between">
				<div class="flex flex-wrap items-center">
					<el-button type="primary" @click="openOutWarehouse">关联出库单</el-button>
					<el-button type="primary" @click="openCollectionOrder">关联集货单</el-button>
				</div>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light">
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column :fixed="item.fixed" :prop="item.dataIndex" :label="area == 'CN' ? item.titleCN : item.titleEN" align="center" min-width="150" show-overflow-tooltip="" />
				</template>
			</el-table>
			<newInfoData
				:title="outWarehouseTitle"
				idName="id"
				:id="outWarehouseId"
				:formList="outWarehouseFormList"
				ref="outWarehouseOrderRef"
				:dataList="outWarehouseDataList"
				:loading="outWarehouseLoading"
				:pointerface="getAssociatedOutboundOrder"
			/>
			<newInfoData
				:title="collectionTitle"
				idName="id"
				:loading="collectionLoading"
				:id="collectionId"
				:formList="collectionFormList"
				ref="collectionOrderRef"
				:dataList="collectionDataList"
				:pointerface="getCollectionOrder"
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
:deep(.el-textarea__inner) {
	box-shadow: initial;
	margin: 0;
	padding: 5px;
	height: 142px !important;
}
</style>
