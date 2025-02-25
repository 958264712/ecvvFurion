<template>
	<el-card shadow="hover" :body-style="{ paddingLeft: '10px', paddingBottom: '60px', height: '100%' }">
		<el-form :model="queryParams" ref="queryForm" :inline="true">
			<el-form-item label="">
				<el-radio-group v-model="radio" size="large" class="radio-group">
					<el-radio-button label="阿联酋" @change="changeInterface()" />
					<el-radio-button label="沙特" @change="changeInterface()" />
					<el-radio-button label="埃及" @change="changeInterface()" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary">{{ queryParams.unit }}</el-button>
			</el-form-item>
			<el-form-item label="ASIN">
				<el-input placeholder="请输入" v-model="queryParams.asin" />
			</el-form-item>
			<el-form-item label="ERPSKU">
				<el-input placeholder="请输入" v-model="queryParams.sku" />
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
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
		<div class="common-layout">
			<el-row>
				<el-col class="MainCol leftcard" :span="24">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>库存差异表</span>
						</div>
						<el-table :data="inventoryDifferencesData" height="450" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="ERPSKU" align="center" width="105" sortable show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="期初库存" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="本月入库" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="本月出库" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="期末库存（计算）" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="期末库存（ERP）" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="库存差异" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="盘点库存（实际）" align="center">
								<template #default="scoped">
									<el-input v-model="scoped.row.inventory" />
								</template>
							</el-table-column>
						</el-table>
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
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>集货单</span>
						</div>
						<el-table :data="collectionData" height="370" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="入库记录ID" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="入库时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="集货数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="已入库数量" align="center" show-overflow-tooltip="" />
						</el-table>
					</el-card>
				</el-col>
				<el-col class="MainCol rightcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU入库记录表</span>
						</div>
						<el-table :data="skuInBountData" height="370" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="入库记录ID" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="inboundAmount" label="入库类型" align="center" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="入库时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="入库数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="已核销数量" align="center" show-overflow-tooltip="" />
						</el-table>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>订单记录</span>
						</div>
						<el-table :data="orderRecordData" height="370" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="订单ID" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="inboundAmount" label="下单日期" align="center" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="出库日期" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="下单数" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="确认数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="核销状态" align="center" show-overflow-tooltip="" />
						</el-table>
					</el-card>
				</el-col>
				<el-col class="MainCol rightcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU出库核销记录表</span>
						</div>
						<el-table :data="skuOutBountData" height="370" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="出库记录" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="inboundAmount" label="核销类型" align="center" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="关联编号" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="核销时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="核销数量" align="center" show-overflow-tooltip="" />
						</el-table>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>
<script lang="ts" setup="" name="inventoryDataDiagnosis">
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { getInventoryAmountByStockAge, getInventoryAmountByloth, getInventorySurplusByAmount, getInventoryAmountByllonth } from '/@/api/modular/main/inventoryRunSales.ts';
import { ElMessage } from 'element-plus';

const queryParams = ref<any>({ unit: 'AED', site: 'UAE' });
const operationsObj = ref<any>({});
const radio = ref('阿联酋');

const loading = ref(false);

const inventoryDifferencesData = ref<any>([]);
const collectionData = ref<any>([]);
const skuInBountData = ref<any>([]);
const orderRecordData = ref<any>([]);
const skuOutBountData = ref<any>([]);

const tableParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
});
const changeInterface = () => {
	switch (radio.value) {
		case '阿联酋':
			queryParams.value.site = 'UAE';
			queryParams.value.unit = 'AED';
			break;
		case '沙特':
			queryParams.value.site = 'SA';
			queryParams.value.unit = 'SAR';
			break;
		case '埃及':
			queryParams.value.site = 'EG';
			queryParams.value.unit = 'EGP';
			break;
	}
	getHeadAmount();
	getAllAmount();
	getAllInventory();
	getInventoryHealth();
};

const getHeadAmount = async () => {
	await getInventoryAmountByStockAge({ site: queryParams.value.site }).then((res) => {
		operationsObj.value = res.data.result;
		operationsObj.value.time = res.data.time;
	});
};

const handleQuery = () => {

}

const getAllAmount = async () => {
	
	
};
const getAllInventory = async () => {
	loading.value = true;
	await getInventorySurplusByAmount({ site: queryParams.value.site }).then((res) => {
		loading.value = false;
	});
};
const getInventoryHealth = async () => {

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


// 初始值
onMounted(() => {
	changeInterface();
});
</script>
<style lang="less" scoped>
:deep(.el-row) {
	margin: 0 !important;
}
:deep(.el-pagination) {
	margin:10px 0 !important;
}
:deep(.el-form--inline .el-form-item) {
	margin-right: 12px;
}

.el-row:last-child {
	margin-bottom: 0;
}

.select {
	width: 100px;

	:deep(.el-input) {
		width: 100%;
	}
}

.radio-group {
	height: 24px;

	:deep(.el-radio-button__inner) {
		padding: 4px 19px;
	}
}

.el-col {
	border-radius: 4px;
}

.grid-content {
	border-radius: 4px;
	min-height: 36px;
}

.common-layout {
	height: 100%;
	overflow: scroll;
}

// 头部销量等样式
.topdiv {
	.title {
		font-size: 16px;
		margin-bottom: 10px;
		max-width: 90px;
		white-space: nowrap;
		margin-bottom: 20px;
	}

	.label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;

		span:last-child {
			font-size: 16px;
		}
	}

	strong {
		font-size: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 117px;
		display: block;
		white-space: nowrap;
	}
}

// 底部echarts模块
.bottomdiv {
	border: 1px solid #ccc;

	.topchange {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40px;

		span {
			font-size: 18px;
			color: #7f7f7ff3;
			font-weight: 700;
		}
	}
}

.HeadBox {
	:deep(.el-row) {
		margin-bottom: 0px;
	}

	border: 1px solid #d7d7d7;
	border-radius: 4px;
}

.card-header {
	padding: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 35px;
	/* 使容器充满视口高度 */
}

.HeadCol {
	padding: 5px;
}

.MainCol {
	padding: 10px 0;
}

.leftcard {
	padding-right: 10px;
}

.rightcard {
	padding-left: 10px;
}
</style>
