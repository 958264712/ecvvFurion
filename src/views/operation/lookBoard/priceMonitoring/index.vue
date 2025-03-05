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
				<el-input v-model="queryParams.asin" placeholder="请输入ASIN" clearable />
			</el-form-item>
			<el-form-item label="日期">
				<el-date-picker v-model="queryParams.time" type="daterange" clearable range-separator="—" start-placeholder="Start date" end-placeholder="End date" />
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
					<el-button icon="ele-Refresh" @click="queryParams = { site: 'UAE',time: [new Date(year, month - 1, 1), new Date(year, month - 1, days)]  }"> 重置 </el-button>
				</el-button-group>
			</el-form-item>
		</el-form>
		<div class="HeadBox" v-if="queryParams.head">
				<el-card style="width: 220px;margin-right:10px" :body-style="{ height: '125px' }" shadow="always">
					<div class="topdiv">
						<div class="title" title="大类排名">大类排名</div>
						<div class="label">
							<span>最好：</span>
							<span :title="queryParams.head.categoryRankBest">{{ queryParams.head.categoryRankBest }}</span>
						</div>
						<div class="label">
							<span>最差：</span>
							<span :title="queryParams.head.categoryRankWorst"> {{ queryParams.head.categoryRankWorst }} </span>
						</div>
						<div class="label">
							<span>平均：</span>
							<span :title="queryParams.head.categoryRankAvg"> {{ queryParams.head.categoryRankAvg }} </span>
						</div>
					</div>
				</el-card>
				<el-card style="width: 220px;margin-right:10px" :body-style="{ height: '125px' }" shadow="always">
					<div class="topdiv">
						<div class="title" title="小类排名">小类排名</div>
						<div class="label">
							<span>最好：</span>
							<span :title="queryParams.head.subclassRankBest">{{ queryParams.head.subclassRankBest }}</span>
						</div>
						<div class="label">
							<span>最差：</span>
							<span :title="queryParams.head.subclassRankWorst"> {{ queryParams.head.subclassRankWorst }} </span>
						</div>
						<div  class="label">
							<span>平均：</span>
							<span :title="queryParams.head.subclassRankAvg"> {{ queryParams.head.subclassRankAvg }} </span>
						</div>
					</div>
				</el-card>
				<el-card style="width: 220px;margin-right:10px" :body-style="{ height: '125px' }" shadow="always">
					<div class="topdiv">
						<div class="title" title="Boybox价格">Boybox价格</div>
						<div class="label">
							<span>最好：</span>
							<span :title="queryParams.head.buyboxPriceBest">{{ queryParams.head.buyboxPriceBest }}</span>
						</div>
						<div class="label">
							<span>最差：</span>
							<span :title="queryParams.head.buyboxPriceWorst"> {{ queryParams.head.buyboxPriceWorst }} </span>
						</div>
						<div  class="label">
							<span>平均：</span>
							<span :title="queryParams.head.buyboxPriceAvg"> {{ queryParams.head.buyboxPriceAvg }} </span>
						</div>
					</div>
				</el-card>
				<el-card style="width: 220px;margin-right:10px" :body-style="{ height: '125px' }" shadow="always">
					<div class="topdiv">
						<div class="title" title="Boybox价格变更">Boybox价格变更</div>
						<div class="label">
							<span>累计次数：</span>
							<span :title="queryParams.head.buyboxPriceChangeNumber">{{ queryParams.head.buyboxPriceChangeNumber }}</span>
						</div>
						<div class="label">
							<span>最近变更：</span>
							<span :title="queryParams.head.buyboxPriceRecentChange"> {{ queryParams.head.buyboxPriceRecentChange }} </span>
						</div>
						<div class="label">
							<span>最近变更时间：</span>
							<span :title="queryParams.head.buyboxPriceChangeTime"> {{ queryParams.head.buyboxPriceChangeTime }} </span>
						</div>
					</div>
				</el-card>
			</div>
		<el-row>
			<el-col class="MainCol leftcard" :span="24">
				<el-card shadow="always" class="bottomdiv" :loading="loading">
					<div style="height: 505px; background: #fff" ref="historyInventoryHealthRef"></div>
				</el-card>
			</el-col>
		</el-row>
	</el-card>
</template>
<script lang="ts" setup="" name="priceMonitoring">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { getCompetitorDetails } from '/@/api/modular/main/competitorDetails.ts';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const d = new Date(year, month, 0);
const days = d.getDate();
const dayList = ref<any>([]);
const queryParams = ref<any>({ unit: 'AED', site: 'UAE', time: [new Date(new Date().setDate(new Date().getDate() - 30)),new Date() ] });
for (let i = 1; i <= days; i++) {
	dayList.value.push(i);
}

const radio = ref('阿联酋');

const loading = ref(false);
const historyInventoryHealthRef = ref();

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
};

const handleQuery = async () => {
	loading.value = true
	const myChart = echarts.init(historyInventoryHealthRef.value);
	let dataList = [] as any;
	let objData = {
		bestDeal: [],
		buyboxPrice: [],
		categoryRank: [],
		listPrice: [],
		subclassRank: [],
	} as any;

	queryParams.value.dateStartTime = queryParams.value?.time ? moment(queryParams.value?.time[0]).format('YYYY-MM-DD') : null;
	queryParams.value.dateEndTime = queryParams.value?.time ? moment(queryParams.value?.time[1]).format('YYYY-MM-DD') : null;
	await getCompetitorDetails(Object.assign(queryParams.value)).then((res: any) => {
		if (res.data.result) {
			for (const key in res.data.result.chart) {
				if (Object.prototype.hasOwnProperty.call(res.data.result.chart, key)) {
					for (const itemKey in objData) {
						if (itemKey === key) {
							objData[itemKey] = res.data.result.chart[key];
							let data = [] as any;
							dataList = [];
							const startDate = moment(queryParams.value.time[0]);
							const endDate = moment(queryParams.value.time[1]);
							let index = 0;
							for (let date = startDate; date <= endDate; date = date.add(1, 'days')) {
								let dateTime = date.format('YYYY-MM-DD');
								if (!dataList.includes(dateTime)) {
									dataList.push(dateTime);
								}
								data[index] = 0;
								objData[itemKey].map((item: any) => {
									if (dateTime === item.time) {
										data[index] = item.value;
									}
								});
								index++;
							}
							objData[itemKey] = data;
						}
					}
				}
			}
			queryParams.value.head = res.data.result.head;
		}
		loading.value = false
	});
	const option = {
		tooltip: {
			trigger: 'axis',
			// formatter: function (params: any) {
			// 	var result = `<div><p>${params[0].axisValue}</p>`;
			// 	params.forEach(function (param: any) {
			// 		if (param.seriesName === 'Buybox价格' || param.seriesName === 'List Price') {
			// 			result +=
			// 				`
			// 				<div style="display:flex;justify-content:space-between;align-items:center;">
			// 					<div style="display:flex;justify-content:space-between;align-items:center;">
			// 	 					<span style="display:block;width:7px;height:7px;margin-right:2px;border-radius:50%;background:${param.color}"></span>
			// 	 					<span>${param.seriesName}</span>
			// 	 				</div> ` +
			// 				'<div style="color:#000;margin-left:20px"">$' +
			// 				param.value.toFixed(2) +
			// 				'</div></div>';
			// 		} else if (param.seriesName === 'Best Deal') {
			// 			result +=
			// 				`
			// 				<div style="display:flex;justify-content:space-between;align-items:center;">
			// 					<div style="display:flex;justify-content:space-between;align-items:center;">
			// 	 					<span style="display:block;width:7px;height:7px;margin-right:2px;border-radius:50%;background:${param.color}"></span>
			// 	 					<span>${param.seriesName}</span>
			// 	 				</div> ` +
			// 				'<div style="color:#000;margin-left:20px">促销价格$' +
			// 				param.value.toFixed(2) +
			// 				'</div></div>';
			// 		} else if (param.seriesName === '大类排名' || param.seriesName === '小类排名') {
			// 			result +=
			// 				`
			// 				<div style="display:flex;justify-content:space-between;align-items:center;">
			// 					<div style="display:flex;justify-content:space-between;align-items:center;">
			// 	 					<span style="display:block;width:7px;height:7px;margin-right:2px;border-radius:50%;background:${param.color}"></span>
			// 	 					<span>${param.seriesName}</span>
			// 					</div>
			// 	 				<div style="color:#000;margin-left:20px"> ` +
			// 				param.value +
			// 				'</div></div>';
			// 		}
			// 	});
			// 	result += '</div>';
			// 	return result;
			// },
		},
		legend: {
			lineStyle: {
				type: 'solid',
			},
			data: ['大类排名', '小类排名', 'Buybox价格', 'List Price', 'Best Deal'],
			formatter: (name: any) => {
				return name;
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
			data: dataList,
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
				min: 1,
				offset: 40, // 调整与右侧的距离
				minInterval: 1,
				axisLabel: {
					formatter: '{value}',
					color: 'rgba(255,151,169, 1)',
				},
			},
			{
				type: 'value',
				position: 'right',
				inverse: true,
				min: 1,
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
				data: objData['buyboxPrice'],
			},
			{
				name: 'List Price',
				type: 'line',
				yAxisIndex: 0,
				symbol: 'none',
				itemStyle: {
					color: 'rgba(206,130,250, 1)',
				},
				step: 'middle',
				data: objData['listPrice'],
			},
			{
				name: 'Best Deal',
				type: 'line',
				step: 'start',
				symbol:
					'path://M2.1679688,0 l0,-15.035156 l4.8515625,0 c3.515625,0 5.2734375,1.1640625 5.2734375,3.4921875 c0,0.890625 -0.3046875,1.65625 -0.9140625,2.296875 c-0.6015625,0.6484375 -1.4453125,1.109375 -2.53125,1.3828125 c2.7890625,0.5703125 4.1835938,1.8945312 4.1835938,3.9726562 c0,1.1875 -0.41015625,2.1171875 -1.2304688,2.7890625 c-0.53125,0.4453125 -1.1367188,0.73828125 -1.8164062,0.87890625 c-0.6796875,0.1484375 -1.7734375,0.22265625 -3.28125,0.22265625 l-4.5351562,0 ZM4.4765625,-8.53125 l0.80859375,0 c3.109375,0 4.6640625,-0.8671875 4.6640625,-2.6015625 c0,-0.8515625 -0.30078125,-1.4257812 -0.90234375,-1.7226562 c-0.6015625,-0.296875 -1.765625,-0.4453125 -3.4921875,-0.4453125 l-1.078125,0 l0,4.7695312 ZM4.4765625,-1.734375 l2.0859375,0 c1.5234375,0 2.5742188,-0.15625 3.1523438,-0.46875 c0.5703125,-0.3125 0.85546875,-0.88671875 0.85546875,-1.7226562 c0,-0.96875 -0.46875,-1.7382812 -1.40625,-2.3085938 c-0.9453125,-0.5703125 -2.2265625,-0.85546875 -3.84375,-0.85546875 l-0.84375,0 l0,5.3554688 Z', // 设置数据点图标形状
				symbolSize: 10, // 设置数据点图标的大小
				showSymbol: true,
				lineStyle: {
					width: 0, // 隐藏折线
				},
				itemStyle: {
					color: 'rgba(206,130,250, 1)',
				},
				data: objData['bestDeal'],
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
				data: objData['categoryRank'],
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
				data: objData['subclassRank'],
			},
		],
	};
	myChart.setOption(option);
	window.onresize = function () {
		myChart.resize();
	};
};

// 初始值
onMounted(() => {
	changeInterface();
	// handleQuery();
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
		font-weight: bolder;
		margin-bottom: 10px;
		max-width: 90px;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	.label {
		display: flex;
		align-items: center;
		span{
			font-size:12px;
		}
		span:first-child {
       	 color: #8d8b8b;
    	}
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
	border: 1px solid #d7d7d7;
	padding:10px;
	display: flex;
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
