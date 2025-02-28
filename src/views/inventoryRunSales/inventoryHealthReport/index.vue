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
			<el-form-item>
				<el-button type="primary">{{ queryParams.unit }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary">月</el-button>
			</el-form-item>
			<el-form-item label="设置高库龄预警值">
				<el-input v-model="queryParams.oldAgeInventory" placeholder="请输入高库龄预警值" />
				<el-button type="primary" @click="setOldAgeInventory">设置</el-button>
			</el-form-item>
		</el-form>
		<div class="common-layout">
			<el-row>
				<el-col class="MainCol leftcard" :span="24">
					<el-card shadow="always" class="bottomdiv">
						<div style="height: 435px; background: #fff" ref="inventoryHealthRef"></div>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="24">
					<el-card shadow="always" class="bottomdiv">
						<div style="height: 435px; background: #fff" ref="nowInventoryHealthRef"></div>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="24">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU库龄详情</span>
						</div>
						<el-table :data="skuInventoryAgeDetailsData" height="450" style="width: 100%" @sort-change="sortfun" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="erpSku" label="SKU" align="center" width="105" sortable show-overflow-tooltip="" >
								<template #default="scoped">
									<el-link type="primary" @click="openHref(scoped.row.erpSku)">{{ scoped.row.erpSku }}</el-link>
								</template>
							</el-table-column>
							<el-table-column prop="totalInventoryCost" label="库存总成本" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="oldAgeInventoryCost" label="高龄库存成本" align="center" sortable show-overflow-tooltip="">
								<template #default="scoped">
									<el-text :type="scoped.row.oldAgeInventoryCost > queryParams.oldAgeInventory ? 'primary' : 'default'">{{ scoped.row.oldAgeInventoryCost }}</el-text>
								</template>
							</el-table-column>
							<el-table-column prop="totalInventoryCount" label="总库存数量" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="oldAgeInventoryCount" label="高龄库存数量" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="quantityInTransit" label="在途数量" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="salesVolumesByMonth" label="最近月销数量" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="salesRevenue" label="可售周期（天）（包括在途）" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="verifyInventoryAgeByAvg" label="平均核销库龄（天）" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="procurementSalesCycleByAvg" label="平均采销周期（天）" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="salesRevenue" label="可销售收入" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="estimatedProfit" label="预计利润" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="historicalPayback" label="历史回本" align="center" sortable show-overflow-tooltip="" />
							<el-table-column prop="annualizedReturnByAvg" label="平均年化收益率" align="center" sortable show-overflow-tooltip="" />
						</el-table>
						<el-pagination
							v-model:currentPage="skuInventoryAgeDetailsParams.page"
							v-model:page-size="skuInventoryAgeDetailsParams.pageSize"
							:total="skuInventoryAgeDetailsParams.total"
							:page-sizes="[20, 50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSkuInventoryAgeDetailsChange"
							@current-change="handleCurrentSkuInventoryAgeDetailsChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>
<script lang="ts" setup="" name="inventoryHealthReport">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import { getInventoryAmountByllonth, getInventoryAgeDetails, getHighInventoryAgeWarning, setHighInventoryAgeWarning,getInventoryHealthMap } from '/@/api/modular/main/inventoryRunSales.ts';
import { ElMessage } from 'element-plus';
import router from '/@/router';

const queryParams = ref<any>({ unit: 'AED', site: 'UAE', oldAgeInventory: '' });
const radio = ref('阿联酋');

const loading = ref(false);
const inventoryHealthRef = ref();
const nowInventoryHealthRef = ref();

const skuInventoryAgeDetailsData = ref<any>([]);
const skuInventoryAgeDetailsParams = ref<any>({
	pageNumber: 1,
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
	getHighInventoryAge();
	getInventoryAge();
	getInventoryHealth();
	getnowInventoryHealth()
};

const getInventoryHealth = async () => {
	const myChart = echarts.init(inventoryHealthRef.value);
	let moreThanOneYearAmount = [] as any;
	let halfYearAmount = [] as any;
	let oneYearAmount = [] as any;

	await getInventoryAmountByllonth({ site: queryParams.value.site }).then((res) => {
		res.data.result.forEach((item: any) => {
			oneYearAmount.push(item.oneYearAmount);
			halfYearAmount.push(item.halfYearAmount);
			moreThanOneYearAmount.push(item.moreThanOneYearAmount);
		});
	});
	let options = {
		title: {
			text: '历史库存健康图',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['>1年', '180天-1年', '<180天'],
		},
		xAxis: {
			type: 'category',
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			axisTick: {
				alignWithLabel: true,
			},
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} 元',
			},
		},
		series: [
			{
				name: '>1年',
				type: 'bar',
				stack: '总量',
				itemStyle: { color: '#ff4d4d' }, // 红色
				data: moreThanOneYearAmount,
			},
			{
				name: '180天-1年',
				type: 'bar',
				stack: '总量',
				itemStyle: { color: '#ffa500' }, // 橙色
				data: oneYearAmount,
			},
			{
				name: '<180天',
				type: 'bar',
				stack: '总量',
				itemStyle: { color: '#33cc33' }, // 绿色
				data: halfYearAmount,
			},
		],
	};
	myChart.setOption(options);
	window.onresize = function () {
		myChart.resize();
	};
};
const getnowInventoryHealth = async () => {
	const myChart = echarts.init(nowInventoryHealthRef.value);
	let xAxisData = [] as any;
	let totalCostAmount = [] as any;

	await getInventoryHealthMap({ site: queryParams.value.site }).then((res) => {
		res.data.result.forEach((item: any) => {
			xAxisData.push(item.yearMonth);
			totalCostAmount.push(item.totalCostAmount);
		});
	});
	let options = {
		title: {
			text: '当前库存健康图',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		
		xAxis: {
			type: 'category',
			data: xAxisData,
			axisTick: {
				alignWithLabel: true,
			},
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} 元',
			},
		},
		series: [
			{
				name: '库存金额',
				type: 'bar',
				stack: '总量',
				itemStyle: { color: '#ff4d4d' }, // 红色
				data: totalCostAmount,
			},
		],
	};
	myChart.setOption(options);
	window.onresize = function () {
		myChart.resize();
	};
};
const getInventoryAge = async () => {
	loading.value = true;
	await getInventoryAgeDetails(Object.assign({ site: queryParams.value.site },skuInventoryAgeDetailsParams.value ))
		.then((res) => {
			if (res.data.result) {
				skuInventoryAgeDetailsData.value = res.data.result.items;
				skuInventoryAgeDetailsParams.value.total = res.data.result.total;
			}
			loading.value = false;
		})
		.catch((err) => {
			loading.value = false;
		});
};
//排序
const sortfun = (v: any) => {
	skuInventoryAgeDetailsParams.value.sortType = v.order === 'descending' ? false : true;
	skuInventoryAgeDetailsParams.value.sortField = v.prop.charAt(0).toUpperCase() + v.prop.slice(1);
	getInventoryAge();
};

const getHighInventoryAge = async () => {
	await getHighInventoryAgeWarning({ site: queryParams.value.site }).then((res) => {
		if (res.data.result) {
			queryParams.value.oldAgeInventory = res.data.result;
		}
	});
};
const setOldAgeInventory = async () => {
	loading.value = true;
	await setHighInventoryAgeWarning({ site: queryParams.value.site, earlyWarningValue: queryParams.value.oldAgeInventory })
		.then((res) => {
			if (res.data.result) {
				ElMessage.success('设置成功');
			}
			loading.value = false;
		})
		.catch((err) => {
			loading.value = false;
		});
};

const openHref = (sku: string) => {
	router.push({
		path: '/inventoryRunSales/multiAxisChart',
		query: {
			site: queryParams.value.site,
			erpSku: sku,
		},
	});
};
// 改变页面容量
const handleSkuInventoryAgeDetailsChange = (val: number) => {
	skuInventoryAgeDetailsParams.value.pageSize = val;
	getInventoryAge();
};

// 改变页码序号
const handleCurrentSkuInventoryAgeDetailsChange = (val: number) => {
	skuInventoryAgeDetailsParams.value.pageNumber = val;
	getInventoryAge();
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
		margin-bottom: 10px;

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
