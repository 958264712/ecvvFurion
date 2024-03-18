<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { Loading, WarningFilled } from '@element-plus/icons-vue';
import { getAEAmazonState, getSAAmazonState } from '/@/api/modular/main/amazonPagePriceRecord'
import LateDelivery from './components/lateDeliveryLIst.vue'
import ExpectedDelivery from './components/expectedDeliveryLIst.vue'
// 定义变量内容
const homeLineRef = ref();
const homePieRef = ref();
const homeBarRef = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive({
	global: {
		homeChartOne: null,
		homeChartTwo: null,
		homeCharThree: null,
		dispose: [null, '', undefined],
	} as any,
	homeOne: [
		{
			name:'AE今天抓取数量',
			num1: '125,12',
			num3: '最后抓取时间：',
			time: '',
			runState:false,
		},
		{
			name: 'SA今天抓取数量',
			num1: '653,33',
			num3: '最后抓取时间：',
			time: '',
			runState: false,
		},
		
	],
	homeThree: [
		{
			icon: 'iconfont icon-yangan',
			label: '浅粉红',
			value: '2.1%OBS/M',
			iconColor: '#F72B3F',
		},
		{
			icon: 'iconfont icon-wendu',
			label: '深红(猩红)',
			value: '30℃',
			iconColor: '#91BFF8',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '淡紫红',
			value: '57%RH',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '弱紫罗兰红',
			value: '107w',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '中紫罗兰红',
			value: '57DB',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '紫罗兰',
			value: '57PV',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '暗紫罗兰',
			value: '517Cpd',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '幽灵白',
			value: '12kg',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '海军蓝',
			value: '64fm',
			iconColor: '#FBD4A0',
		},
	],
	myCharts: [] as EmptyArrayType,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});

// AE抓取数据信息
const AEAmazonState =async () => {
	await getAEAmazonState().then((res: any) => {
		if (res.data.type === 'success') {
			state.homeOne[0].runState = res.data.result.runState
			state.homeOne[0].time = res.data.result.updateTime
			state.homeOne[0].num1 = res.data.result.todayQuantity
		}
	})
}
// SA抓取数据信息
const SAAmazonState = async () => {
	await getSAAmazonState().then((res: any) => {
		if (res.data.type === 'success') {
			state.homeOne[1].runState = res.data.result.runState
			state.homeOne[1].time = res.data.result.updateTime
			state.homeOne[1].num1 = res.data.result.todayQuantity
		}
	})
}
SAAmazonState()
AEAmazonState()

// // 柱状图
const initBarChart = () => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeCharThree)) state.global.homeCharThree.dispose();
	state.global.homeCharThree = markRaw(echarts.init(homeBarRef.value, state.charts.theme));
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: '地热开发利用',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		tooltip: { trigger: 'axis' },
		legend: { data: ['供温', '回温', '压力值(Mpa)'], right: 0 },
		grid: { top: 70, right: 80, bottom: 30, left: 80 },
		xAxis: [
			{
				type: 'category',
				data: ['1km', '2km', '3km', '4km', '5km', '6km'],
				boundaryGap: true,
				axisTick: { show: false },
			},
		],
		yAxis: [
			{
				name: '供回温度(℃）',
				nameLocation: 'middle',
				nameTextStyle: { padding: [3, 4, 50, 6] },
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
			{
				name: '压力值(Mpa)',
				nameLocation: 'middle',
				nameTextStyle: { padding: [50, 4, 5, 6] },
				splitLine: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: state.charts.color, formatter: '{value} ' },
			},
		],
		series: [
			{
				name: '供温',
				type: 'line',
				smooth: true,
				showSymbol: true,
				// 矢量画五角星
				symbol: 'path://M150 0 L80 175 L250 75 L50 75 L220 175 Z',
				symbolSize: 12,
				yAxisIndex: 0,
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(250,180,101,0.3)' },
						{ offset: 1, color: 'rgba(250,180,101,0)' },
					]),
					shadowColor: 'rgba(250,180,101,0.2)',
					shadowBlur: 20,
				},
				itemStyle: { color: '#FF8000' },
				// data中可以使用对象，value代表相应的值，另外可加入自定义的属性
				data: [
					{ value: 1, stationName: 's1' },
					{ value: 3, stationName: 's2' },
					{ value: 4, stationName: 's3' },
					{ value: 9, stationName: 's4' },
					{ value: 3, stationName: 's5' },
					{ value: 2, stationName: 's6' },
				],
			},
			{
				name: '回温',
				type: 'line',
				smooth: true,
				showSymbol: true,
				symbol: 'emptyCircle',
				symbolSize: 12,
				yAxisIndex: 0,
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{ offset: 0, color: 'rgba(199, 237, 250,0.5)' },
							{ offset: 1, color: 'rgba(199, 237, 250,0.2)' },
						],
						false
					),
				},
				itemStyle: {
					color: '#3bbc86',
				},
				data: [
					{ value: 31, stationName: 's1' },
					{ value: 36, stationName: 's2' },
					{ value: 54, stationName: 's3' },
					{ value: 24, stationName: 's4' },
					{ value: 73, stationName: 's5' },
					{ value: 22, stationName: 's6' },
				],
			},
			{
				name: '压力值(Mpa)',
				type: 'bar',
				barWidth: 30,
				yAxisIndex: 1,
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(108,80,243,0.3)' },
						{ offset: 1, color: 'rgba(108,80,243,0)' },
					]),
					//柱状图圆角
					borderRadius: [30, 30, 0, 0],
				},
				data: [
					{ value: 11, stationName: 's1' },
					{ value: 34, stationName: 's2' },
					{ value: 54, stationName: 's3' },
					{ value: 39, stationName: 's4' },
					{ value: 63, stationName: 's5' },
					{ value: 24, stationName: 's6' },
				],
			},
		],
	};
	state.global.homeCharThree.setOption(option);
	state.myCharts.push(state.global.homeCharThree);
};
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			setTimeout(() => {
				state.myCharts[i].resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
	initEchartsResize();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 pinia 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				initBarChart();
			}, 1000);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>


<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in state.homeOne" :key="k"
				:class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
				<div class="home-card-item flex">
					<div class="flex-margin flex w100" :class="` home-one-animation${k}`">
						<div class="flex-auto">
							<div class="mt10" style="margin-bottom: 10px;font-weight: bold;font-size: large;">{{ v.name }}
							</div>
							<span class="font30">{{ v.num1 }}</span>
							<div class="mt10">{{ v.num3 }}<span :class="v.runState ? 'green' : 'red'">{{ v.time }}</span>
							</div>
						</div>
						<template v-if="v.runState">
							<Loading v-loading="true"
								style=" animation: rotate 5s infinite linear;width: 40px;color:green" />
						</template>
						<template v-else>
							<WarningFilled style="width: 40px;color: red;" />
						</template>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
				<div class="home-card-item">
					<h2>集货单预计送仓表</h2>
					<div style="height: 100%;margin-top: 5px;" ref="homeLineRef">
						<ExpectedDelivery />
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="home-media">
				<div class="home-card-item">
					<h2>集货单逾期未送表</h2>
					<div style="height: 100%;margin-top: 5px;" ref="homePieRef">
						<LateDelivery />
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-three">
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8">
				<div class="home-card-item">
					<div class="home-card-item-title">快捷导航工具</div>
					<div class="home-monitor">
						<div class="flex-warp">
							<div class="flex-warp-item" v-for="(v, k) in state.homeThree" :key="k">
								<div class="flex-warp-item-box" :class="`home-animation${k}`">
									<div class="flex-margin">
										<i :class="v.icon" :style="{ color: v.iconColor }"></i>
										<span class="pl5">{{ v.label }}</span>
										<div class="mt10">{{ v.value }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBarRef"></div>
				</div>
			</el-col>
	</el-row>
</div></template>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
	overflow: hidden;
	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 5px 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}
	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				align-items: center;
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/4) + s;
			}
		}
		.green{
			color: green;
		}
		.red{
			color: red;
		}
	}
	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;
			.home-monitor {
				height: 100%;
				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;
					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;
						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
</style>
