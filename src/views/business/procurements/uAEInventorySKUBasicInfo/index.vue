<script lang="ts" setup="" name="uAEInventorySKUBasicInfo">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import other from '/@/utils/other.ts'
import { uAEgetInventorySKUBasicInfo, uAEExportInventorySKUBasicInfo, getInterestRate, updateConfig } from '/@/api/modular/main/uAE_ProcurementDetails.ts';
import { getAPI } from '/@/utils/axios-utils';
import { SysConfigApi } from '/@/api-services/api';
const exchangeRate = ref<any>({
	value: 0
});
const setexchangeRate = ref<any>(true);
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<inventoryParamsType>({});
const tableParams = ref({
	exchangeRate: exchangeRate.value.value,
	pageNo: 1,
	pageSize: 50,
	// inventorySKU : '123 ',
	total: 0,
});

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
const getData = () => {
	const param = {
		name: 'RMB/汇率',
		page: 1,
		pageSize: 1
	};
	getInterestRate(param)
		.then((res) => {
			exchangeRate.value = res.data.result.items[0];
			handleQuery();
		});
};
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	tableParams.value.exchangeRate = exchangeRate.value.value;
	var res = await uAEgetInventorySKUBasicInfo(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

function Export() {
	loading.value = true;
	uAEExportInventorySKUBasicInfo({ exchangeRate: exchangeRate.value.value }).then((res: any) => {
		loading.value = false;
		other.downloadfile(res);
		handleQuery();
	});
}
const setItem = async (name: string, item: boolean) => {
	switch (name) {
		case 'setexchangeRate':
			setexchangeRate.value = !item
			break;
		default:
			setexchangeRate.value = !item
			break;
	}
	if (!item) {
		await updateConfig(exchangeRate.value);
		ElMessage.success('保存成功');
		handleQuery()
	}
};
getData();
//handleQuery();
</script>

<template>
	<div class="oFSStockWarning-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="库存SKU">
					<el-input v-model="queryParams.inventorySKU" clearable="" placeholder="请输入库存SKU" />
				</el-form-item>
				<el-form-item label="产品名称">
					<el-input v-model="queryParams.goodsName" clearable="" placeholder="请输入产品名称" />
				</el-form-item>
				<!-- <el-form-item label="供应商货号">
          <el-input v-model="queryParams.supplierItemNumber" clearable="" placeholder="请输入供应商货号" />

        </el-form-item> -->

				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
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
			<div>
				<el-button style="float: left;" @click="Export" type="primary" size="small">导出库存Sku信息</el-button>
				<el-form-item style="width: 300px;float: left;margin-left: 10px;" label="RMB/汇率" :rules="[
			{
				required: true,
				message: 'RMB/汇率不能为空',
				trigger: 'blur',
			},
		]">
					<el-input v-model="exchangeRate.value" :disabled="setexchangeRate" style="width: 70%;" />
					<el-button type="primary" style="marginLeft: 10px"
						@click="setItem('setexchangeRate', setexchangeRate)">{{ setexchangeRate ? '设置' : '保存' }}</el-button>
				</el-form-item>
			</div>

			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				row-key="id" border="">
				<el-table-column prop="inventorySKU1" align="center" label="库存SKU" width="120" />
				<el-table-column prop="goodsName" align="center" label="产品名称" width="150" />
				<el-table-column prop="purchasingCountry" align="center" label="采购国" width="60"
					show-overflow-tooltip="" />
				<el-table-column prop="totalQuantityShipped" align="center" label="发货总数量" show-overflow-tooltip="" />
				<el-table-column prop="totalProcurementCost" align="center" label="采购总成本" show-overflow-tooltip="" />
				<el-table-column prop="totalCostOfCNHeadProcess" align="center" label="CN头程总成本"
					show-overflow-tooltip="" />
				<el-table-column prop="comprehensiveProcurementUnitPrice" align="center" label="综合采购单价"
					show-overflow-tooltip="" />
				<el-table-column prop="monetaryUnit" label="货币单位" align="center" width="60" show-overflow-tooltip="" />
				<el-table-column prop="comprehensiveProcurementUnitPriceAED" align="center" label="综合采购单价AED" width="85"
					show-overflow-tooltip="" />
				<el-table-column prop="comprehensiveSupplyPriceAED" align="center" label="综合供货价AED" width="85"
					show-overflow-tooltip="" />
				<el-table-column prop="comprehensiveInitialUnitPriceAED" align="center" label="综合头程单价AED" width="90"
					show-overflow-tooltip="" />
				<el-table-column prop="seaComprehensiveInitialUnitPriceAED" align="center" label="综合海运单价"
					show-overflow-tooltip="" />
				<el-table-column prop="emptyComprehensiveInitialUnitPriceAED" align="center" label="综合空运单价"
					show-overflow-tooltip="" />
				<el-table-column prop="quantityShippedInThePast90Days" align="center" label="近90天发货数量" width="90"
					show-overflow-tooltip="" />
				<el-table-column prop="totalProcurementCostInThePast90DaysAED" align="center" label="近90天总采购成本AED"
					width="100" show-overflow-tooltip="" />
				<el-table-column prop="purchaseUnitPriceAEDInThePast90Days" align="center" label="近90天采购单价AED"
					width="100" show-overflow-tooltip="" />
				<el-table-column prop="lastYearcomprehensivePriceAED" align="center" label="去年综合采购单价AED" width="100"
					show-overflow-tooltip="" />
				<el-table-column prop="salesAttributes" align="center" label="销售属性" show-overflow-tooltip="" />
				<el-table-column prop="productCAT" align="center" label="产品CAT" show-overflow-tooltip="" />
			</el-table>
			<el-pagination v-model:currentPage="tableParams.pageNo" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>
	</div>
</template>
