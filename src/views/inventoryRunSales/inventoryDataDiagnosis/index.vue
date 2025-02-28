<template>
	<el-card shadow="hover" :body-style="{ paddingLeft: '10px', paddingBottom: '60px', height: '100%' }">
		<el-form :model="queryParams" ref="queryForm" :inline="true">
			<el-form-item label="">
				<el-radio-group v-model="radio" size="large" class="radio-group">
					<el-radio-button label="阿联酋" @change="handleQuery()" />
					<el-radio-button label="沙特" @change="handleQuery()" />
					<el-radio-button label="埃及" @change="handleQuery()" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary">{{ queryParams.unit }}</el-button>
			</el-form-item>
			<el-form-item label="ASIN">
				<el-input placeholder="请输入" v-model="queryParams.aSIN" />
			</el-form-item>
			<el-form-item label="ERPSKU">
				<el-input placeholder="请输入" v-model="queryParams.erpSku" />
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
					<el-button
						icon="ele-Refresh"
						@click="
							() => {
								queryParams = { site: 'UAE' };
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
						<el-table :data="inventoryDifferencesData" height="600" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="erpSku" label="ERPSKU" align="center" width="155" sortable show-overflow-tooltip="">
								<template #default="scoped">
									<el-link type="primary" @click="openHref(scoped.row.erpSku)">{{ scoped.row.erpSku }}</el-link>
								</template>
							</el-table-column>
							<el-table-column prop="initialInventoryQuantity" label="期初库存" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="thisMonthsInventory" label="本月入库" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="outboundThisMonth" label="本月出库" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="endingInventory" label="期末库存（计算）" align="center" sortable show-overflow-tooltip="">
								<template #default="scoped">
									{{ Number(scoped.row.initialInventoryQuantity) + Number(scoped.row.thisMonthsInventory) - Number(scoped.row.outboundThisMonth) }}
								</template>
							</el-table-column>
							<el-table-column prop="endingInventoryByErpSku" label="期末库存（ERP）" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="diffQuantity" label="库存差异" align="center" sortable show-overflow-tooltip="">
								<template #default="scoped">
									<el-text
										:type="(Number(scoped.row.endingInventoryByErpSku) - (Number(scoped.row.initialInventoryQuantity) + Number(scoped.row.thisMonthsInventory) - Number(scoped.row.outboundThisMonth))) > 0 ? 'success' :
											(Number(scoped.row.endingInventoryByErpSku) - (Number(scoped.row.initialInventoryQuantity) +  Number(scoped.row.thisMonthsInventory) - Number(scoped.row.outboundThisMonth))) < 0 ? 'primary'
										:'default' "
										>
										{{ 
											(Number(scoped.row.endingInventoryByErpSku) - (Number(scoped.row.initialInventoryQuantity) + Number(scoped.row.thisMonthsInventory) - Number(scoped.row.outboundThisMonth))) > 0 ? '+' :''
										}}
										{{
											Number(scoped.row.endingInventoryByErpSku) - (Number(scoped.row.initialInventoryQuantity) + Number(scoped.row.thisMonthsInventory) - Number(scoped.row.outboundThisMonth))
										}}</el-text
									>
								</template>
							</el-table-column>
							<el-table-column label="盘点库存（实际）" align="center">
								<template #default="scoped">
									<el-input v-model="scoped.row.quantity" type="number" />
								</template>
							</el-table-column>
							<el-table-column label="操作" align="center">
								<template #default="scoped">
									<el-button type="primary" text @click="saveQuantity(scoped.row)"> 保存 </el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							v-model:currentPage="tableParams.pageNumber"
							v-model:page-size="tableParams.pageSize"
							:total="tableParams.total"
							:page-sizes="[20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
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
import { getInitialInventoryInfo, setInventoryQuantity } from '/@/api/modular/main/inventoryRunSales.ts';
import { ElMessage } from 'element-plus';
import router from '/@/router';

const queryParams = ref<any>({ unit: 'AED', site: 'UAE' });
const radio = ref('阿联酋');
const loading = ref(false);
const inventoryDifferencesData = ref<any>([]);

const tableParams = ref({
	pageNumber: 1,
	pageSize: 20,
	total: 0,
});

const handleQuery = () => {
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
	getInitial();
};

const getInitial = async () => {
	await getInitialInventoryInfo(Object.assign(queryParams.value,tableParams.value)).then((res) => {
		if (res.data.result) {
			inventoryDifferencesData.value = res.data.result.items;
			tableParams.value.total = res.data.result.total;
		}
	});
};

const saveQuantity = async (rows: any) => {
	await setInventoryQuantity({ erpSku: rows.erpSku, quantity: +rows.quantity }).then((res) => {
		if (res.data.result) {
			ElMessage.success('保存成功！');
		}
	});
};

const openHref = (sku: string) => {
	const routeData = router.resolve({
		path: '/inventoryRunSales/inventoryDataDiagnosis/details',
		query: {
			site: queryParams.value.site,
			erpSku: sku,
		},
	});
	window.open(routeData.href, '_blank');
};

const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getInitial();
};
const handleCurrentChange = (val: number) => {
	tableParams.value.pageNumber = val;
	getInitial();
};

// 初始值
onMounted(() => {
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

.radio-group {
	height: 24px;
	:deep(.el-radio-button__inner) {
		padding: 4px 19px;
	}
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
