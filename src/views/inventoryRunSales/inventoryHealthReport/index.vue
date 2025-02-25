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
			<el-form-item label="">
				<el-button type="primary">月</el-button>
			</el-form-item>
		</el-form>
		<div class="common-layout">
			<el-row>
				<el-col class="MainCol leftcard" :span="24">
					<el-card shadow="always" class="bottomdiv">
						<div style="height: 435px; background: #fff" ref="historyInventoryHealthRef"></div>
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
						<el-table :data="skuInventoryAgeDetailsData" height="450" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="SKU" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="库存总成本" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="高龄库存成本" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="总库存数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="高龄库存数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="在途数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="最近月销数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="可售周期（天）（包括在途）" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="平均核销库龄（天）" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="平均采销周期（天）" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="可销售收入" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="预计利润" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="历史回本" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="平均年化收益率" align="center" show-overflow-tooltip="" />
						</el-table>
						<el-pagination
							v-model:currentPage="skuInventoryAgeDetailsParams.page"
							v-model:page-size="skuInventoryAgeDetailsParams.pageSize"
							:total="skuInventoryAgeDetailsParams.total"
							:page-sizes="[50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSkuInventoryAgeDetailsChange"
							@current-change="handleCurrentSkuInventoryAgeDetailsChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div style="height: 435px; background: #fff" ref="skuInventoryHistoryRef"></div>
					</el-card>
				</el-col>
				<el-col class="MainCol rightcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<el-radio-group v-model="radio1" size="large" class="radio-group">
								<el-radio-button label="年化" @change="changeInterface()" />
								<el-radio-button label="利润" @change="changeInterface()" />
								<el-radio-button label="核销库龄" @change="changeInterface()" />
								<el-radio-button label="采销周期" @change="changeInterface()" />
							</el-radio-group>
						</div>
						<div style="height: 435px; background: #fff" ref="otherDataHistoryChangeRef"></div>
					</el-card>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU入库核销记录表</span>
						</div>
						<el-table :data="inBountData" height="450" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="入库记录ID" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="入库时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="入库数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="已核销数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="采购成本" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="已核销成本" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="可售周期（天）" align="center" show-overflow-tooltip="" />
						</el-table>
						<el-pagination
							v-model:currentPage="inBountParams.page"
							v-model:page-size="inBountParams.pageSize"
							:total="inBountParams.total"
							:page-sizes="[50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleinBountChange"
							@current-change="handleCurrentinBountChange"
							layout="total, sizes, prev, pager, next, jumper"
						/>
					</el-card>
				</el-col>
				<el-col class="MainCol leftcard" :span="12">
					<el-card shadow="always" class="bottomdiv">
						<div class="topchange">
							<span>SKU出库核销记录表</span>
						</div>
						<el-table :data="skuOutBountVerificationRecordData" height="450" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id">
							<el-table-column prop="InWareHouseNo" label="出库记录" align="center" width="105" show-overflow-tooltip="" />
							<el-table-column prop="outInboundAmount" label="核销时间" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="采销周期（天）" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="存放天数=核销库龄" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="核销数量" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="采购成本(AED)" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="核销收入(AED)" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="毛利润(AED)" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="毛利率" align="center" show-overflow-tooltip="" />
							<el-table-column prop="remainingAmount" label="年化收益率" align="center" show-overflow-tooltip="" />
						</el-table>
						<el-pagination
							v-model:currentPage="skuOutBountVerificationRecordParams.page"
							v-model:page-size="skuOutBountVerificationRecordParams.pageSize"
							:total="skuOutBountVerificationRecordParams.total"
							:page-sizes="[50, 100, 500, 1000]"
							small=""
							background=""
							@size-change="handleSkuOutBountVerificationRecordChange"
							@current-change="handleCurrentSkuOutBountVerificationRecordChange"
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
import { ref, onMounted, watch } from 'vue';
import { getInventoryAmountByStockAge, getInventoryAmountByloth, getInventorySurplusByAmount, getInventoryAmountByllonth } from '/@/api/modular/main/inventoryRunSales.ts';
import { ElMessage } from 'element-plus';

const queryParams = ref<any>({ unit: 'AED', site: 'UAE' });
const operationsObj = ref<any>({});
const radio = ref('阿联酋');
const radio1 = ref('年化');

const loading = ref(false);
const historyInventoryHealthRef = ref();
const nowInventoryHealthRef = ref();
const skuInventoryHistoryRef = ref();

const skuInventoryAgeDetailsData = ref<any>([]);
const inBountData = ref<any>([]);
const skuOutBountVerificationRecordData = ref<any>([]);
const skuInventoryAgeDetailsParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
});
const inBountParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
});
const skuOutBountVerificationRecordParams = ref({
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

const getHistoryInventory = async () => {
	const myChart = echarts.init(historyInventoryHealthRef.value);
	const option = {
		tooltip: {
			trigger: 'axis',
			formatter: function (params: any) {
				var result = `<div><p>${params[0].axisValue}</p>`
                    params.forEach(function (param:any) {
						if (param.seriesName === 'Buybox价格' || param.seriesName === 'List Price') {
							result += `
							<div style="display:flex;justify-content:space-between;align-items:center;">
								<div style="display:flex;justify-content:space-between;align-items:center;">
				 					<span style="display:block;width:7px;height:7px;margin-right:2px;border-radius:50%;background:${param.color}"></span>
				 					<span>${param.seriesName}</span>
				 				</div> `+
								'<div style="color:#000;margin-left:20px"">$' + param.value.toFixed(2) + '</div></div>';
						} else if (param.seriesName === 'Best Deal') {
                            result += `
							<div style="display:flex;justify-content:space-between;align-items:center;">
								<div style="display:flex;justify-content:space-between;align-items:center;">
				 					<span style="display:block;width:7px;height:7px;margin-right:2px;border-radius:50%;background:${param.color}"></span>
				 					<span>${param.seriesName}</span>
				 				</div> `+
								'<div style="color:#000;margin-left:20px">促销价格$' + param.value.toFixed(2) + '</div></div>';
                        } else if (param.seriesName === '大类排名' || param.seriesName === '小类排名') {
                            result += `
							<div style="display:flex;justify-content:space-between;align-items:center;">
								<div style="display:flex;justify-content:space-between;align-items:center;">
				 					<span style="display:block;width:7px;height:7px;margin-right:2px;border-radius:50%;background:${param.color}"></span>
				 					<span>${param.seriesName}</span>
								</div>
				 				<div style="color:#000;margin-left:20px"> ` + param.value + '</div></div>'
							;
                        }
					});
				 result += '</div>';
				return result

            }
		},
		legend: {
			lineStyle: {
				type:'solid'
			},
			data: ['大类排名', '小类排名', '30天销量', 'Buybox价格', '优惠券价格', 'List Price', '亚马逊价格', 'PD价格', 'Lightning Deal', 'Best Deal', 'FBA最低价变动', 'FBM最低价变动', '促销活动', 'Listing调整', '断货', '新卖家'],
			formatter: (name:any) => {
				return name
			},
		},
		toolbox: {
			feature: {
				saveAsImage: {},
			},
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [
				'2024-2-1',
				'2024-2-2',
				'2024-2-3',
				'2024-2-4',
				'2024-2-5',
				'2024-2-6',
				'2024-2-7',
				'2024-2-8',
				'2024-2-9',
				'2024-2-10',
				'2024-2-11',
				'2024-2-12',
				'2024-2-13',
				'2024-2-14',
				'2024-2-15',
				'2024-2-16',
				'2024-2-17',
				'2024-2-18',
				'2024-2-19',
			],

		},
		yAxis: [
			{
				type: 'value',
				position: 'left',
				axisLabel: {
					formatter: '${value}',
					color: 'rgba(215,153,251, 1)',
				},
			},
			{
				type: 'value',
				position: 'right',
				inverse: true,
				min:1,
				minInterval: 1,
				axisLabel: {
					formatter: '{value}',
					color: 'rgba(255,151,169, 1)',
				},
			},
			{
				type: 'value',
				position: 'right',
				offset: 80, // 调整与右侧的距离
				inverse: true,
				min:1,
				minInterval: 1,
				axisLabel: {
					formatter: '{value}',
					color: 'rgba(196,234,172, 1)',
				},
			},
		],
		series: [
			{
				name: 'Buybox价格',
				type: 'line',
				step: 'start',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(56,211,217, 1)',
				},
				data: [5.99, 5.99, 5.99, 6.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 6.99, 5.99, 6.99, 5.99, 5.99, 5.99, 5.99],
			},
			// {
			// 	name: '优惠券价格',
			// 	type: 'line',
			// 	yAxisIndex: 0,
			// 	symbol: 'none',
			// 	itemStyle: {
			// 		color: 'rgba(255,181,135, 1)',
			// 	},
			// 	step: 'middle',
			// 	data: [1.99, 1.99, 1.99, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 2.99, 1.99, 2.99, 1.99, 1.99, 1.99, 1.99],
			// },
			{
				name: 'List Price',
				type: 'line',
				yAxisIndex: 0,
				symbol: 'none',
				itemStyle: {
					color: 'rgba(206,130,250, 1)',
				},
				step: 'middle',
				data: [5.99, 5.99, 5.99, 6.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 6.99, 5.99, 6.99, 5.99, 5.99, 5.99, 5.99],
			},
			{
				name: 'Best Deal',
				type: 'line',
				step: 'start',
				symbol: 'path://M2.1679688,0 l0,-15.035156 l4.8515625,0 c3.515625,0 5.2734375,1.1640625 5.2734375,3.4921875 c0,0.890625 -0.3046875,1.65625 -0.9140625,2.296875 c-0.6015625,0.6484375 -1.4453125,1.109375 -2.53125,1.3828125 c2.7890625,0.5703125 4.1835938,1.8945312 4.1835938,3.9726562 c0,1.1875 -0.41015625,2.1171875 -1.2304688,2.7890625 c-0.53125,0.4453125 -1.1367188,0.73828125 -1.8164062,0.87890625 c-0.6796875,0.1484375 -1.7734375,0.22265625 -3.28125,0.22265625 l-4.5351562,0 ZM4.4765625,-8.53125 l0.80859375,0 c3.109375,0 4.6640625,-0.8671875 4.6640625,-2.6015625 c0,-0.8515625 -0.30078125,-1.4257812 -0.90234375,-1.7226562 c-0.6015625,-0.296875 -1.765625,-0.4453125 -3.4921875,-0.4453125 l-1.078125,0 l0,4.7695312 ZM4.4765625,-1.734375 l2.0859375,0 c1.5234375,0 2.5742188,-0.15625 3.1523438,-0.46875 c0.5703125,-0.3125 0.85546875,-0.88671875 0.85546875,-1.7226562 c0,-0.96875 -0.46875,-1.7382812 -1.40625,-2.3085938 c-0.9453125,-0.5703125 -2.2265625,-0.85546875 -3.84375,-0.85546875 l-0.84375,0 l0,5.3554688 Z',  // 设置数据点图标形状
            	symbolSize: 10,    // 设置数据点图标的大小
            	showSymbol: true,
				lineStyle: {
                	width: 0      // 隐藏折线
            	},
				itemStyle: {
					color: 'rgba(206,130,250, 1)',
				},
				data: [5.99, 5.99, 5.99, 6.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 5.99, 6.99, 5.99, 6.99, 5.99, 5.99, 5.99, 5.99],
			},
			{
				name: '30天销量',
				type: 'line',
				step: 'middle',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(117,249,202, 1)',
				},
				data: [18, 0, 0, 20, 12, 15, 0, 10, 25, 18, 0, 0, 20, 12, 15, 0, 10, 25, 18],
			},
			{
				name: '大类排名',
				type: 'line',
				step: 'middle',
				symbol: 'none',
				yAxisIndex: 1,
				itemStyle: {
					color: 'rgba(255,151,169, 1)',
				},
				data: [185, 116, 116, 153, 153, 167, 167, 167, 116, 167, 153, 185, 116, 116, 153, 153, 167, 185, 116],
			},
			{
				name: '小类排名',
				type: 'line',
				step: 'end',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(196,234,172, 1)',
				},
				yAxisIndex: 2,
				data: [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			},
			
		],
	};
	myChart.setOption(option);
	window.onresize = function () {
		myChart.resize();
	};
};
const getHeadAmount = async () => {
	await getInventoryAmountByStockAge({ site: queryParams.value.site }).then((res) => {
		operationsObj.value = res.data.result;
		operationsObj.value.time = res.data.time;
	});
};

const getAllAmount = async () => {
	
};
const getAllInventory = async () => {
	loading.value = true;
	await getInventorySurplusByAmount({ site: queryParams.value.site }).then((res) => {
		// tableData.value = res.data.result;
		loading.value = false;
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

const handleQuery = () => {};

// 改变页面容量
const handleSkuInventoryAgeDetailsChange = (val: number) => {
	skuInventoryAgeDetailsParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentSkuInventoryAgeDetailsChange = (val: number) => {
	skuInventoryAgeDetailsParams.value.page = val;
	handleQuery();
};
// 改变页面容量
const handleinBountChange = (val: number) => {
	inBountParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentinBountChange = (val: number) => {
	inBountParams.value.page = val;
	handleQuery();
};

// 改变页面容量
const handleSkuOutBountVerificationRecordChange = (val: number) => {
	skuOutBountVerificationRecordParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentSkuOutBountVerificationRecordChange = (val: number) => {
	skuOutBountVerificationRecordParams.value.page = val;
	handleQuery();
};

// 初始值
onMounted(() => {
	changeInterface();
	getHistoryInventory();
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
