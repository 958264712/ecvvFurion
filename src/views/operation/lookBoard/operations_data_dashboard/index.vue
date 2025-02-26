<template>
	<el-card shadow="hover" :body-style="{ paddingLeft: '10px', paddingBottom: '60px', height: '100%' }">
		<el-form :model="queryParams" ref="queryForm" :inline="true">
			<el-form-item label="">
				<el-date-picker :clearable="false" style="width: 100px" v-model="queryParams.Time1"
					:disabled="changeBtn" type="month" placeholder="请选择月份" :disabled-date="disabledDate" />
			</el-form-item>
			<el-form-item label="">
				<el-select @change="handleQuery()" v-model="queryParams.Site" class="select" :disabled="changeBtn">
					<el-option value="UAE" label="UAE"></el-option>
					<el-option value="SA" label="SA"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="">
				<el-radio-group v-model="radio" size="large" class="radio-group" :disabled="changeBtn">
					<el-radio-button label="日" @change="changeInterface()" />
					<el-radio-button label="周" @change="changeInterface()" />
					<el-radio-button label="月" @change="changeInterface()" />
				</el-radio-group>
			</el-form-item>
		</el-form>
		<div class="common-layout">
			<div class="HeadBox">
				<el-divider style="margin: 0" />
				<el-row style="padding: 5px" :gutter="20" >
					<el-col class="HeadCol" :span="3" v-for="(item, index) in operationsList1">
						<el-card style="width: 200px" :body-style="{ height: radio === '月' ? '175px' : '145px' }"
							shadow="always"
							v-if="radio === '日' && item.name !== 'actualOutboundQuantity' && item.name !== 'outboundAmount' ? true : radio !== '日' ? true : false">
							<div class="topdiv">
								<div class="title" :title="item.title">{{ item.title }}</div>
								<div class="label">
									<span>{{ radio === '日' ? (item.name === 'amazonSales' || item.name === 'salesAmount' ? '大前天' : '今日') : radio === '周' ? '本周' : '本月' }}</span>
									<strong :title="item.quantity">{{ item.quantity ? item.quantity : 0 }}</strong>
								</div>
								<div class="label">
									<span>环比</span>
									<span :title="item.month"> <img :src="`${toNumber(item.month) > 0 ? up : down}`"
											style="margin-right: 10px" />{{ item.month ? item.month : 0 }} </span>
								</div>
								<div v-if="radio === '月'" class="label">
									<span>同比</span>
									<span :title="item.year"> <img :src="`${toNumber(item.year) > 0 ? up : down}`"
											style="margin-right: 10px" />{{ item.year ? item.year : 0 }} </span>
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
							<div class="topchange">
								<span>亚马逊销量({{ operationsData.amazonSalesUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="ymxMoneyRef"></div>
						</el-card>
					</el-col>
					<el-col class="MainCol rightcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>销售金额({{ operationsData.salesAmountUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="moneyCountRef"></div>
						</el-card>
					</el-col>
				</el-row>
				<el-row v-if="radio !== '日'">
					<el-col class="MainCol leftcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>实际出库数量({{ operationsData.actualOutboundQuantityUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="outCountRef"></div>
						</el-card>
					</el-col>
					<el-col class="MainCol rightcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>出库金额({{ operationsData.outboundAmountUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="outMoneyRef"></div>
						</el-card>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="MainCol leftcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>PO订单数量({{ operationsData.poOrderQuantityUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="POCountRef"></div>
						</el-card>
					</el-col>
					<el-col class="MainCol rightcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>PO订单金额({{ operationsData.poOrderAmountUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="POMoneyRef"></div>
						</el-card>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="MainCol leftcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>DF订单数量({{ operationsData.poOrderQuantityUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="DFCountRef"></div>
						</el-card>
					</el-col>
					<el-col class="MainCol rightcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>DF订单金额({{ operationsData.poOrderAmountUnit }})</span>
							</div>
							<div style="height: 435px; background: #fff" ref="DFMoneyRef"></div>
						</el-card>
					</el-col>
				</el-row>
			</div>
		</div>
	</el-card>
</template>
<script lang="ts" setup="" name="operations_data_dashboard">
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { accumulatedForThisMonth, amazonSales, actualOutboundQuantity, outboundAmount, pOOrderQuantity } from '/@/api/modular/main/operationsDataDashboard.ts';
import { Local } from '/@/utils/storage';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { ElMessage } from 'element-plus';
import down from '/@/assets/down.png';
import up from '/@/assets/up.png';

interface operationsList {
	title: string;
	quantity?: string;
	month?: string;
	year?: string;
	name: string;
	size: number;
}

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;

const queryParams = ref<any>({ Site: 'UAE', Time1: year + '-' + month });
const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};
const operationsData = ref<any>({});
const operationsList = ref<operationsList[]>([]);
const operationsList1 = ref<operationsList[]>([]);

const changeBtn = ref(false)
const changeBtnNum = ref(0)
const changeBtnQueryNum = ref(0)

const radio = ref('日');

const ymxMoneyRef = ref();
const moneyCountRef = ref();
const outCountRef = ref();
const outMoneyRef = ref();
const POCountRef = ref();
const POMoneyRef = ref();
const DFCountRef = ref();
const DFMoneyRef = ref();

const d = new Date(year, month, 0);
const days = d.getDate();
const dayList = ref<any>([]);
const weeksList = ref<any>(['第一周', '第二周', '第三周', '第四周', '第五周']);
const monthsList = ref<any>(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);
for (let i = 1; i <= days; i++) {
	dayList.value.push(i);
}
// 日

// 分析周
const changeWeeks = (data:any, week:any, item:any) => {
	switch (week) {
		case '第一周':
			data[0] = item;
			break;
		case '第二周':
			data[1] = item;
			break;
		case '第三周':
			data[2] = item;
			break;
		case '第四周':
			data[3] = item;
			break;
		case '第五周':
			data[4] = item;
			break;
	}
	return data;
};
// 分析月
const changeMonths = (data:any, month:any, item:any) => {
	switch (month) {
		case 1:
			data[0] = item;
			break;
		case 2:
			data[1] = item;
			break;
		case 3:
			data[2] = item;
			break;
		case 4:
			data[3] = item;
			break;
		case 5:
			data[4] = item;
			break;
		case 6:
			data[5] = item;
			break;
		case 7:
			data[6] = item;
			break;
		case 8:
			data[7] = item;
			break;
		case 9:
			data[8] = item;
			break;
		case 10:
			data[9] = item;
			break;
		case 11:
			data[10] = item;
			break;
		case 12:
			data[11] = item;
			break;
	}
	return data;
};
const dataymxMoney = async (face:any, echart:any, unit:any, type = 1, twoEcharts?:any, twoUnit?:any) => {
	const myChart = echarts.init(echart.value);
	let data = [0];
	let data1 = [0];
	let twodata = [0];
	let twodata1 = [0];
	queryParams.value.TimePeriod = radio.value;
	const date = new Date(queryParams.value.Time1);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	queryParams.value.Time = year + '-' + month;

	changeBtnNum.value++
	await face(Object.assign(queryParams.value)).then((res:any) => {
		if (res.data.code === 200 && res.data.type === 'success') {
			changeBtnQueryNum.value++
			if (radio.value === '日') {
				dayList.value.map((e:any, index:any) => {
					res.data.result.thisMonth.map((item:any) => {
						if (e === item.day) {
							data[index] = item[unit];
						}
					});
					res.data.result.lastMonth.map((item:any) => {
						if (e === item.day) {
							data1[index] = item[unit];
						}
					});
					if (type === 2) {
						res.data.result.thisMonthAmount.map((item:any) => {
							if (e === item.day) {
								twodata[index] = item[twoUnit];
							}
						});
						res.data.result.lastMonthAmount.map((item:any) => {
							if (e === item.day) {
								twodata1[index] = item[twoUnit];
							}
						});
					}
				});
			} else if (radio.value === '周') {
				res.data.result.thisMonth.map((item:any) => {
					changeWeeks(data, item.weeks, item[unit]);
				});
				res.data.result.lastMonth.map((item:any) => {
					changeWeeks(data1, item.weeks, item[unit]);
				});
				if (type === 2) {
					res.data.result.thisMonthAmount.map((item:any) => {
						changeWeeks(twodata, item.weeks, item[twoUnit]);
					});
					res.data.result.lastMonthAmount.map((item:any) => {
						changeWeeks(twodata1, item.weeks, item[twoUnit]);
					});
				}
			} else if (radio.value === '月') {
				res.data.result.thisYear?.map((item:any) => {
					changeMonths(data, item.month, item[unit]);
				});
				res.data.result.lastYear?.map((item:any) => {
					changeMonths(data1, item.month, item[unit]);
				});
				if (type === 2) {
					res.data.result.thisYearAmount?.map((item:any) => {
						changeMonths(twodata, item.month, item[twoUnit]);
					});
					res.data.result.lastYearAmount?.map((item:any) => {
						changeMonths(twodata1, item.month, item[twoUnit]);
					});
				}
			}
		} else {
			setTimeout(() => {
				changeBtn.value = false
				ElMessage({
					type: 'info',
					message: '网络超时，请刷新页面',
				})
			}, 30000);
		}
	});

	const options = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			left: '70%',
			top: '0%',
			data: [radio.value === '日' ? '今日' : radio.value === '周' ? '本周' : '本月', radio.value === '日' ? '上月今日' : radio.value === '周' ? '上月本周' : '去年本月'],
		},
		xAxis: {
			type: 'category',
			data: radio.value === '日' ? dayList.value : radio.value === '周' ? weeksList.value : monthsList.value,
			boundaryGap: false,
			axisLabel: {
				margin: 18,
			},
			axisPointer: {
				label: {
					show: true,
					formatter: function (params:any) {
						let date = queryParams.value.Time?.split('-');
						if (radio.value == '日') {
							params.value = date[0] + '年' + date[1] + '月' + params.value + '日';
							return params.value;
						} else if (radio.value == '周') {
							params.value = date[0] + '年' + date[1] + '月' + params.value;
							return params.value;
						} else {
							return date[0] + '年' + params.value;
						}
					},
				},
			},
		},
		grid: {
			containLabel: true,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: radio.value === '日' ? '今日' : radio.value === '周' ? '本周' : '本月',
				data: data,
				type: 'line',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(0,0,255, 1)',
				},
			},
			{
				name: radio.value === '日' ? '上月今日' : radio.value === '周' ? '上月本周' : '去年本月',
				data: data1,
				type: 'line',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(129,191,253, 1)',
				},
			},
		],
	};
	const options1 = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			left: '70%',
			top: '0%',
			data: [radio.value === '日' ? '今日' : radio.value === '周' ? '本周' : '本月', radio.value === '日' ? '上月今日' : radio.value === '周' ? '上月本周' : '去年本月'],
		},
		xAxis: {
			type: 'category',
			data: radio.value === '日' ? dayList.value : radio.value === '周' ? weeksList.value : monthsList.value,
			boundaryGap: false,
			axisLabel: {
				margin: 18,
			},
			axisPointer: {
				label: {
					show: true,
					formatter: function (params:any) {
						let date = queryParams.value.Time?.split('-');
						if (radio.value == '日') {
							params.value = date[0] + '年' + date[1] + '月' + params.value + '日';
							return params.value;
						} else if (radio.value == '周') {
							params.value = date[0] + '年' + date[1] + '月' + params.value;
							return params.value;
						} else {
							return date[0] + '年' + params.value;
						}
					},
				},
			},
		},
		grid: {
			containLabel: true,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: radio.value === '日' ? '今日' : radio.value === '周' ? '本周' : '本月',
				data: twodata,
				type: 'line',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(0,0,255, 1)',
				},
			},
			{
				name: radio.value === '日' ? '上月今日' : radio.value === '周' ? '上月本周' : '去年本月',
				data: twodata1,
				type: 'line',
				symbol: 'none',
				itemStyle: {
					color: 'rgba(129,191,253, 1)',
				},
			},
		],
	};
	myChart.setOption(options);
	if (type === 2) {
		const TwoChart = echarts.init(twoEcharts.value);
		TwoChart.setOption(options1);
	}
	window.onresize = function () {
		myChart.resize();
	};
};
const toNumber = (str:any) => {
	// 移除百分号并将字符串转换为浮点数
	let number = parseFloat(str?.replace('%', '')) / 100;
	return number;
};
// 获取数据
const handleQuery = async () => {
	operationsList.value = []
	queryParams.value.TimePeriod = radio.value;
	const date = new Date(queryParams.value.Time1);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	queryParams.value.Time = year + '-' + month;
	await accumulatedForThisMonth(Object.assign(queryParams.value)).then((res) => {
		if (res.data.code === 200 && res.data.type === 'success') {
			operationsData.value = res.data.result;
			for (let key in res.data.result) {
				switch (key) {
					case 'amazonSales':
						operationsList.value[0] = {
							title: `亚马逊销量(${res.data.result.amazonSalesUnit})`,
							quantity: res.data.result.amazonSales,
							month: res.data.result.amazonSalesMonthRatio,
							year: res.data.result.amazonSalesYearRatio,
							name: 'amazonSales',
							size: 30,
						};
						break;
					case 'salesAmount':
						operationsList.value[1] = {
							title: `亚马逊销售金额(${res.data.result.salesAmountUnit})`,
							quantity: res.data.result.salesAmount,
							month: res.data.result.salesAmountMonthRatio,
							year: res.data.result.salesAmountYearRatio,
							name: 'salesAmount',
							size: 30,
						};
						break;
					case 'actualOutboundQuantity':
						operationsList.value[2] = {
							title: `实际出库数量(${res.data.result.actualOutboundQuantityUnit})`,
							quantity: res.data.result.actualOutboundQuantity,
							month: res.data.result.actualOutboundQuantityMonthRatio,
							year: res.data.result.actualOutboundQuantityYearRatio,
							name: 'actualOutboundQuantity',
							size: 30,
						};
						break;
					case 'outboundAmount':
						operationsList.value[3] = {
							title: `出库金额(${res.data.result.outboundAmountUnit})`,
							quantity: res.data.result.outboundAmount,
							month: res.data.result.outboundAmountMonthRatio,
							year: res.data.result.outboundAmountYearRatio,
							name: 'outboundAmount',
							size: 30,
						};
						break;
					case 'poOrderQuantity':
						let poOrderQuantityUnit = 0
						if(radio.value === '日'){
							poOrderQuantityUnit = 2
						}else{
							poOrderQuantityUnit = 4
						}
						operationsList.value[poOrderQuantityUnit] = {
							title: `PO订单量(${res.data.result.poOrderQuantityUnit})`,
							quantity: res.data.result.poOrderQuantity,
							month: res.data.result.poOrderQuantityMonthRatio,
							year: res.data.result.poOrderQuantityYearRatio,
							name: 'poOrderQuantity',
							size: 30,
						};
						break;
					case 'poOrderAmount':
						let poOrderAmountUnit = 0
						if(radio.value === '日'){
							poOrderAmountUnit = 3
						}else{
							poOrderAmountUnit = 5
						}
						operationsList.value[poOrderAmountUnit] = {
							title: `PO订单金额(${res.data.result.poOrderAmountUnit})`,
							quantity: res.data.result.poOrderAmount,
							month: res.data.result.poOrderAmountMonthRatio,
							year: res.data.result.poOrderAmountYearRatio,
							name: 'poOrderAmount',
							size: 30,
						};
						break;
					case 'dfOrderQuantity':
						let dfOrderQuantityUnit = 0
						if(radio.value === '日'){
							dfOrderQuantityUnit = 4
						}else{
							dfOrderQuantityUnit = 6
						}
						operationsList.value[dfOrderQuantityUnit] = {
							title: `DF订单量(${res.data.result.dfOrderQuantityUnit})`,
							quantity: res.data.result.dfOrderQuantity,
							month: res.data.result.dfOrderQuantityMonthRatio,
							year: res.data.result.dfOrderQuantityYearRatio,
							name: 'dfOrderQuantity',
							size: 30,
						};
						break;
					case 'dfOrderAmount':
						let dfOrderAmountUnit = 0
						if(radio.value === '日'){
							dfOrderAmountUnit = 5
						}else{
							dfOrderAmountUnit = 7
						}
						operationsList.value[dfOrderAmountUnit] = {
							title: `DF订单金额(${res.data.result.dfOrderAmountUnit})`,
							quantity: res.data.result.dfOrderAmount,
							month: res.data.result.dfOrderAmountMonthRatio,
							year: res.data.result.dfOrderAmountYearRatio,
							name: 'dfOrderAmount',
							size: 30,
						};
						break;
				}
			}
			operationsList1.value = operationsList.value
		}
	});
};
const changeInterface = () => {
	changeBtn.value = true
	handleQuery();
	dataymxMoney(amazonSales, ymxMoneyRef, 'shippedUnits', 2, moneyCountRef, 'shippedCOGS');
	if (radio.value !== '日') {
		dataymxMoney(actualOutboundQuantity, outCountRef, 'actualOutboundQuantity');
		dataymxMoney(outboundAmount, outMoneyRef, 'outboundAmount');
	}
	dataymxMoney(pOOrderQuantity, POCountRef, 'poOrderAmount', 2, POMoneyRef, 'poOrderAmount');
	dataymxMoney(pOOrderQuantity, DFCountRef, 'poOrderAmount', 2, DFMoneyRef, 'poOrderAmount');

};
// 监听月份和站点
watch(
	() => queryParams.value.Site,
	() => {
		changeInterface();
	}
);

watch(
	() => queryParams.value.Time1,
	() => {
		changeInterface();
	}
);
watch(
	() => changeBtnQueryNum.value,
	() => {
		if (changeBtnQueryNum.value === changeBtnNum.value) {
			changeBtn.value = false
		} else {
			changeBtn.value = true
		}
	}
);

// 存储布局配置
const setLocalThemeConfig = () => {
	Local.remove('themeConfig');
	Local.set('themeConfig', themeConfig.value);
};
// 初始值
onMounted(() => {
	//themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
	setLocalThemeConfig();
	changeInterface();
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
		margin-bottom: 40px;

		span {
			font-size: 18px;
			color: #7f7f7ff3;
			font-weight: 700;
		}
	}
}

// 月份样式
.monthdata {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;

	.one {
		display: flex;
		justify-content: space-between;

		.icons {
			width: 150px;
			height: 150px;
			border: 2px solid #ccc;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.month {
			border-bottom: 2px solid #ccc;
			width: 338px;
			height: 100px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 50px;

			span {
				font-size: 18px;
			}

			strong {
				max-width: 200px;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 50px;
			}
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
