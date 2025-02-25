<template>
	<el-card shadow="hover" :body-style="{ paddingLeft: '10px', paddingBottom: '60px', height: '100%' }">
		<el-form :model="queryParams" ref="queryForm" :inline="true">
			<el-form-item label="">
				<el-radio-group v-model="radio" size="large" class="radio-group" >
					<el-radio-button label="阿联酋" @change="changeInterface()" />
					<el-radio-button label="沙特" @change="changeInterface()" />
					<el-radio-button label="埃及" @change="changeInterface()" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary">{{ queryParams.unit }}</el-button>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary">月</el-button>
			</el-form-item>
		</el-form>
		<div class="common-layout">
			<div class="HeadBox">
				<el-divider style="margin: 0" />
				<el-row style="padding: 5px" :gutter="20">
					<el-col class="HeadCol" :span="5">
						<el-card style="width: 300px" :body-style="{ height: '145px' }" shadow="always">
							<div class="topdiv">
								<div class="title">​总库存金额</div>
								<div class="label">
									<h1 style="color:#70b603;font-size: 30px;">{{ operationsObj.allAmount }}</h1>
								</div>
								<div class="label">
									<span style="font-size: 12px; color: #7F7F7F;">数据时间：{{ operationsObj.time }}</span>
									<Refresh style="width: 20px; margin-right: 8px; cursor: pointer" @click="getHeadAmount"/>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col class="HeadCol" :span="5">
						<el-card style="width: 300px" :body-style="{ height: '145px' }" shadow="always">
							<div class="topdiv">
								<div class="title">一年以上库存金额</div>
								<div class="label">
									<h1 style="color:#70b603;font-size: 30px;">{{ operationsObj.oneYearAmount }}</h1>
								</div>
								<div class="label">
									<span style="font-size: 12px; color: #7F7F7F;">数据时间：{{ operationsObj.time }}</span>
									<Refresh style="width: 20px; margin-right: 8px; cursor: pointer" @click="getHeadAmount"/>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col class="HeadCol" :span="5">
						<el-card style="width: 300px" :body-style="{ height: '145px' }" shadow="always">
							<div class="topdiv">
								<div class="title">半年以上库存金额</div>
								<div class="label">
									<h1 style="color:#70b603;font-size: 30px;">{{ operationsObj.halfYearAmount }}</h1>
								</div>
								<div class="label">
									<span style="font-size: 12px; color: #7F7F7F;">数据时间：{{ operationsObj.time }}</span>
									<Refresh style="width: 20px; margin-right: 8px; cursor: pointer" @click="getHeadAmount"/>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
			</div>
			<div>
				<el-row>
					<el-col class="MainCol leftcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div style="height: 435px; background: #fff" ref="allAmountRef"></div>
						</el-card>
					</el-col>
					<el-col class="MainCol rightcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>总库存结余</span>
							</div>
							<el-table :data="tableData" height="400" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
								<el-table-column type="index" label="序号" width="40" align="center"  show-overflow-tooltip="" />
								<el-table-column label="月份" align="center"  show-overflow-tooltip="">
									<template #default="scoped">{{scoped.row.time.split('-01')[0]}}</template>
								</el-table-column>
								<el-table-column prop="InWareHouseNo" label="上期库存结余" align="center"  width="105" show-overflow-tooltip="" />
								<el-table-column prop="inboundAmount" label="本月入库" align="center"  show-overflow-tooltip="" />
								<el-table-column prop="outInboundAmount" label="本月出库" align="center"  show-overflow-tooltip="" />
								<el-table-column prop="remainingAmount" label="月底结余" align="center"  show-overflow-tooltip="" />
							</el-table>
						</el-card>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="MainCol leftcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div style="height: 435px; background: #fff" ref="inventoryHealthRef"></div>
						</el-card>
					</el-col>
				</el-row>
			</div>
		</div>
	</el-card>
</template>
<script lang="ts" setup="" name="inventoryInfo">
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { getInventoryAmountByStockAge, getInventoryAmountByloth, getInventorySurplusByAmount, getInventoryAmountByllonth } from '/@/api/modular/main/inventoryRunSales.ts';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';

const queryParams = ref<any>({ unit: 'AED', site: 'UAE' });
const operationsObj = ref<any>({});
const radio = ref('阿联酋');

const loading = ref(false);
const allAmountRef = ref();
const inventoryHealthRef = ref();
const tableData = ref<any>([])

const changeInterface = () => {
	switch (radio.value) {
		case '阿联酋':
			queryParams.value.site = 'UAE'
			queryParams.value.unit = 'AED'
			break;
		case '沙特':
			queryParams.value.site = 'SA'
			queryParams.value.unit = 'SAR'
			break;
		case '埃及':
			queryParams.value.site = 'EG'
			queryParams.value.unit = 'EGP'
			break;
	}
	getHeadAmount();
	getAllAmount();
	getAllInventory()
	getInventoryHealth();
}

const getHeadAmount = async () => {
	await getInventoryAmountByStockAge({ site: queryParams.value.site }).then((res) => {
		operationsObj.value = res.data.result;
		operationsObj.value.time = res.data.time;
	});
};

const getAllAmount = async () => {
	const myChart = echarts.init(allAmountRef.value);
	let thisMonthInBoundAmount = [] as any;
	let thisMonthOutBoundAmount = [] as any;
	let thisMonthBalanceTotalCost = [] as any;
	let thisMonthBalanceSalesPrice = [] as any;

	await getInventoryAmountByloth({ site: queryParams.value.site }).then((res) => {
		res.data.result.forEach((item: any) => {
			thisMonthInBoundAmount.push(item.inboundAmount);
			thisMonthOutBoundAmount.push(item.outboundAmount);
		});
	});

	let options = {
		title: {
			text: '总库存结余',
		},
		tooltip: {
			trigger: 'axis', // 提示框触发方式为坐标轴触发
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999',
				},
			},
		},
		legend: {
			left: '40%',
			data: ['本月总入库金额', '本月总出库金额', '本月结余总成本', '本月结余销售价'], // 图例组件，对应 series 中的 name
		},
		xAxis: [
			{
				type: 'category',
				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				axisPointer: {
					type: 'shadow',
				},
			},
		],
		yAxis: [
			{
				type: 'value',
				axisLabel: {
					formatter: '{value} 元',
				},
			},
		],
		series: [
			{
				name: '本月总入库金额',
				type: 'bar',
				itemStyle: { color: '#ff4d4d' }, // 红色柱子
				data: thisMonthInBoundAmount,
			},
			{
				name: '本月总出库金额',
				type: 'bar',
				itemStyle: { color: '#33cc33' }, // 绿色柱子
				data: thisMonthOutBoundAmount,
			},
			{
				name: '本月结余总成本',
				type: 'line',
				yAxisIndex: 0,
				itemStyle: { color: '#000' }, // 黑色折线
				data: thisMonthBalanceTotalCost,
			},
			{
				name: '本月结余销售价',
				type: 'line',
				yAxisIndex: 0,
				itemStyle: { color: '#ff0000' }, // 红色折线
				data: thisMonthBalanceSalesPrice,
			},
		],
	};

	myChart.setOption(options);
	window.onresize = function () {
		myChart.resize();
	};
};
const getAllInventory = async () => {
	loading.value = true
	await getInventorySurplusByAmount({ site: queryParams.value.site }).then((res) => {
		tableData.value = res.data.result
		loading.value = false
	});
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
			text: '库存健康图',
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

// 初始值
onMounted(() => {
	changeInterface()
});
</script>
<style lang="less" scoped>
:deep(.el-row) {
	margin: 0 !important;
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
