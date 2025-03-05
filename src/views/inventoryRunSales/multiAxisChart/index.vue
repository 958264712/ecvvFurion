<script lang="ts" setup name="multiAxisChart">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import { getSummaryDataGraph } from '/@/api/modular/main/inventoryRunSales.ts';
import { useRoute } from 'vue-router';
import moment from 'moment';
import { NextLoading } from '/@/utils/loading';

const router = useRoute();
const multiAxisChartRef = ref();

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const d = new Date(year, month, 0);
const days = d.getDate();
const dayList = ref<any>([]);
for (let i = 1; i <= days; i++) {
	dayList.value.push(i);
}
const daysList = ref<any>([]);
const chartData = ref<any>({
	metrics: [
		{
            name: '销售价格',
            prop:'salePrice',
			data: [],
			yAxisIndex: 0,
			color: '#EE6666',
			generateYAxis: true,
		},
		{
			name: '核销采购价格',
            prop:'purchasingCost',
			data: [],
			yAxisIndex: 0,
			color: '#91cc75',
			generateYAxis: false,
		},
		{
			name: '核销运输成本',
            prop:'transportCost',
			data: [],
			yAxisIndex: 0,
			color: '#91CC75',
			generateYAxis: false,
		},
		{
			name: '核销利润',
            prop:'profit',
			data: [],
			yAxisIndex: 0,
			color: '#fac858',
			generateYAxis: false,
		},
		{
			name: '年化收益率',
            prop:'annualizedReturn',
			data: [],
			yAxisIndex: 1,
			color: '#BCBC10',
			formatter: '{value}%',
			generateYAxis: true,
		},
		{
			name: '销量',
            prop:'saleVolume',
			data: [],
			yAxisIndex: 2,
			color: '#EE320C',
			generateYAxis: true,
		},
		{
			name: '核销库龄',
            prop:'stockAge',
			data: [],
			yAxisIndex: 3,
			color: '#000000',
			generateYAxis: true,
		},
		{
			name: '库存',
            prop:'inventoryQuantity',
			data: [],
			yAxisIndex: 4,
			color: '#666666',
			generateYAxis: true,
		},
	],
});

const getMultiAxisChart = async () => {
    const myChart = echarts.init(multiAxisChartRef.value);
    // // 初始化所有metrics的data数组为0
    chartData.value.metrics.forEach((metric: any) => {
        metric.data = new Array(days).fill(0);
    });
    await getSummaryDataGraph(Object.assign(router.query)).then((res) => {
        if (res.data.result) {
            res.data.result.map((item: any) => {
                for (let i = 1; i <= days; i++){
                    const dates = new Date(year, month-1, i)
                    let dateTime = moment(dates).format('YYYY-MM-DD');
                    if (!daysList.value.includes(dateTime)) {
                        daysList.value.push(dateTime);
                        if (dateTime === item.yearMonth) {
                            for (const key in item.info) {
                                if (Object.prototype.hasOwnProperty.call(item.info, key)) {
                                    chartData.value.metrics.map((ite:any) => {
                                        if (ite.prop === key) {
                                            ite.data[i - 1] = item.info[key] !== null ? item.info[key] : 0;
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            });
        }
    });
	// 图表配置
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
			},
		},
		legend: {
			data: chartData.value.metrics.map((m:any) => m.name),
		},
		grid: {
			left: '15%',
			right: '25%',
		},
		xAxis: {
			type: 'category',
			data: daysList.value,
		},
		yAxis: (() => {
			const yAxisMetrics = chartData.value.metrics.filter((m:any) => m.generateYAxis);
			const totalYAxis = yAxisMetrics.length;
			const midPoint = Math.floor(totalYAxis / 2);

			return yAxisMetrics.map((metric:any, index:any) => {
				const isLeft = index < midPoint;
				const relativeIndex = isLeft ? index : index - midPoint;
				return {
					type: 'value',
					//name: metric.name,
					position: isLeft ? 'left' : 'right',
					offset: relativeIndex * 40,
					axisLabel: {
						formatter: metric.formatter,
						color: metric.color,
					},
					nameTextStyle: {
						color: metric.color,
					},
				};
			});
		})(),
		series: chartData.value.metrics.map((metric:any, index:any) => ({
			name: metric.name,
			type: 'line',
			yAxisIndex: metric.yAxisIndex,
			data: metric.data,
			itemStyle: {
				color: metric.color,
			},
			...(index === 0
				? {
						markArea: {
							data: [
								[
									{
										xAxis: '2025-2-21',
									},
									{
										xAxis: '2025-2-27',
									},
								],
							],
						},
				  }
				: {}),
		})),
    };
	myChart.setOption(option);
	window.onresize = function () {
		myChart.resize();
	};
};

onMounted(() => {
	getMultiAxisChart();
	NextLoading.done()
});
</script>

<template>
	<el-card style="height: 100%;">
		<h1 style="font-size: 46px">销量库存成本综合分析</h1>
		<el-card shadow="always" class="bottomdiv">
			<div style="height: 635px; background: #fff" ref="multiAxisChartRef"></div>
		</el-card>
	</el-card>
</template>

<style scoped>
.chart-container {
	width: 100vw;
	min-width: 100%;
	margin: 0;
	padding: 20px;
	box-sizing: border-box;
}

.chart {
	width: 100%;
	min-width: 1200px;
	height: 600px;
}

h1 {
	width: 100%;
	text-align: center;
	color: #2c3e50;
	margin-bottom: 20px;
}
</style>
