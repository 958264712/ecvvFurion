<template>
	<el-card shadow="hover" :body-style="{ paddingLeft: '10px', paddingBottom: '60px', height: '100%' }">
		<div class="common-layout">
			<el-row>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>集货单</span>
						</div>
						<el-table :data="collectionData" height="350" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="documentNo" label="入库记录ID" align="center" width="125" show-overflow-tooltip="" />
							<el-table-column prop="actualDeliveryDate" label="入库时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="actualShipmentQuantity" label="集货数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="actualQuantityInBoxes" label="已入库数量" align="center" show-overflow-tooltip="" />
						</el-table>
						<el-pagination
							v-model:currentPage="collectionParams.pageNumber"
							v-model:page-size="collectionParams.pageSize"
							:total="collectionParams.total"
							:page-sizes="[20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleCollectionSizeChange"
							@current-change="handleCollectionCurrentChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
				<el-col class="MainCol rightcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU入库记录表</span>
						</div>
						<el-table :data="skuInBountData" height="350" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="inWareHouseNo" label="入库记录ID" align="center" width="155" show-overflow-tooltip="" />
							<el-table-column prop="type" label="入库类型" align="center" show-overflow-tooltip="" />
							<el-table-column prop="actualDeliveryTime" label="入库时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="totalNumber" label="入库数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="verifiedQuantity" label="已核销数量" align="center" show-overflow-tooltip="" />
						</el-table>
						<el-pagination
							v-model:currentPage="skuInBoundParams.pageNumber"
							v-model:page-size="skuInBoundParams.pageSize"
							:total="skuInBoundParams.total"
							:page-sizes="[20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSkuInBoundSizeChange"
							@current-change="handleSkuInBoundCurrentChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>订单记录</span>
						</div>
						<el-table :data="orderRecordData" height="350" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="orderNumber" label="订单ID" align="center" width="155" show-overflow-tooltip="" />
							<el-table-column prop="orderCreateTime" label="下单日期" align="center" show-overflow-tooltip="" />
							<el-table-column prop="orderDeliveryDate" label="出库日期" align="center" show-overflow-tooltip="" />
							<el-table-column prop="orderQuantity" label="下单数" align="center" show-overflow-tooltip="" />
							<el-table-column prop="ConfirmQuantity" label="确认数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="VerificationStatus" label="核销状态" align="center" show-overflow-tooltip="" />
						</el-table>
                        <el-pagination
							v-model:currentPage="orderRecordParams.pageNumber"
							v-model:page-size="orderRecordParams.pageSize"
							:total="orderRecordParams.total"
							:page-sizes="[20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleOrderRecordSizeChange"
							@current-change="handleOrderRecordCurrentChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
				<el-col class="MainCol rightcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU出库核销记录表</span>
						</div>
						<el-table :data="skuOutBountData" height="350" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="outboundRecordID" label="出库记录" align="center" width="155" show-overflow-tooltip="" />
							<el-table-column prop="type" label="核销类型" align="center" show-overflow-tooltip="" >
								<template #default="scoped">
									{{verificationOrderType(scoped.row.type)}}
								</template>
							</el-table-column>
							<el-table-column prop="managementNumber" label="关联编号" align="center" show-overflow-tooltip="" />
							<el-table-column prop="verificationDate" label="核销时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="verificationQuantity" label="核销数量" align="center" show-overflow-tooltip="" />
						</el-table>
                        <el-pagination
							v-model:currentPage="skuOutBoundParams.pageNumber"
							v-model:page-size="skuOutBoundParams.pageSize"
							:total="skuOutBoundParams.total"
							:page-sizes="[20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSkuOutBoundSizeChange"
							@current-change="handleSkuOutBoundCurrentChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>
<script lang="ts" setup="" name="inventoryDataDiagnosis">
import { ref, onMounted } from 'vue';
import { getCollectionOrderInfo, getStorageRecord, getOrderRecord, getVerificationRecord} from '/@/api/modular/main/inventoryRunSales.ts';
import { useRoute } from 'vue-router'
import { NextLoading } from '/@/utils/loading';

const loading = ref(false);
const router = useRoute()
const collectionData = ref<any>([]);
const skuInBountData = ref<any>([]);
const orderRecordData = ref<any>([]);
const skuOutBountData = ref<any>([]);

const collectionParams = ref({
	pageNumber: 1,
	pageSize: 20,
	total: 0,
});
const skuInBoundParams = ref({
	pageNumber: 1,
	pageSize: 20,
	total: 0,
});
const orderRecordParams = ref({
	pageNumber: 1,
	pageSize: 20,
	total: 0,
});
const skuOutBoundParams = ref({
	pageNumber: 1,
	pageSize: 20,
	total: 0,
});

const verificationOrderType = (type: string) => {
	switch(type) {
		case '1':
			return 'PO'
		case '2':
			return 'DF'
		case '3':
			return 'Stocktaking'
		case '4':
			return 'Transfer'
		case '5':
			return 'Other'
		case '6':
			return 'Loss'
		case '7':
			return 'Damage'
		case '8':
			return 'OfflineOrders'
		case '9':
			return 'Virtual'
		default:
			return 'PO'
	}
}

const handleQuery = () => {
	getCollection();
	getRecord();
	getORecord()
	getVRecord()
};

const getCollection = async () => {
	await getCollectionOrderInfo(Object.assign(collectionParams.value,router.query)).then((res) => {
		if (res.data.result) {
			collectionData.value = res.data.result.items;
			collectionParams.value.total = res.data.result.total;
		}
	});
};
const getRecord = async () => {
	await getStorageRecord(Object.assign(skuInBoundParams.value,router.query)).then((res) => {
		if (res.data.result) {
			skuInBountData.value = res.data.result.items;
			skuInBoundParams.value.total = res.data.result.total;
		}
	});
};
const getORecord = async () => {
	await getOrderRecord(Object.assign(orderRecordParams.value,router.query)).then((res) => {
		if (res.data.result) {
			orderRecordData.value = res.data.result.items;
			orderRecordParams.value.total = res.data.result.total;
		}
	});
};
const getVRecord = async () => {
	await getVerificationRecord(Object.assign(skuOutBoundParams.value,router.query)).then((res) => {
		if (res.data.result) {
			skuOutBountData.value = res.data.result.items;
			skuOutBoundParams.value.total = res.data.result.total;
		}
	});
};

const handleCollectionSizeChange = (val: number) => {
	collectionParams.value.pageSize = val;
	getCollection();
};
const handleCollectionCurrentChange = (val: number) => {
	collectionParams.value.pageNumber = val;
	getCollection();
};
const handleSkuInBoundSizeChange = (val: number) => {
	skuInBoundParams.value.pageSize = val;
	getRecord();
};
const handleSkuInBoundCurrentChange = (val: number) => {
	skuInBoundParams.value.pageNumber = val;
	getRecord();
};
const handleOrderRecordSizeChange = (val: number) => {
	orderRecordParams.value.pageSize = val;
	getORecord();
};
const handleOrderRecordCurrentChange = (val: number) => {
	orderRecordParams.value.pageNumber = val;
	getORecord();
};
const handleSkuOutBoundSizeChange = (val: number) => {
	skuOutBoundParams.value.pageSize = val;
	getVRecord();
};
const handleSkuOutBoundCurrentChange = (val: number) => {
	skuOutBoundParams.value.pageNumber = val;
	getVRecord();
};
// 初始值
onMounted(() => {
	NextLoading.done();
	handleQuery();
});
</script>
<style lang="less" scoped>
:deep(.el-row) {
	margin: 0 !important;
}
:deep(.el-pagination) {
	margin: 10px 0 !important;
}
:deep(.el-form--inline .el-form-item) {
	margin-right: 12px;
}

.el-row:last-child {
	margin-bottom: 0;
}

.el-col {
	border-radius: 4px;
}

.common-layout {
	height: 100%;
	overflow: scroll;
}

// 底部echarts模块
.bottomdiv {
	border: 1px solid #ccc;
	.topchange {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;

		span {
			font-size: 18px;
			color: #7f7f7ff3;
			font-weight: 700;
		}
	}
}

</style>
