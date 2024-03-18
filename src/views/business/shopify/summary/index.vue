<template>
	<div class="container-chart">
		<el-container>
			<el-main>
				<div class="chart">
					<el-row class="roe-sort">
						<el-col :span="12">
							<div class="product-sort">
								<span :class="{ avt: avtType === 1 }" @click="product(1, '新增')">
									<a>新增产品数</a>
								</span>
								<span :class="{ avt: avtType === 2 }" @click="product(2, '修改')">
									<a>修改产品数</a>
								</span>
								<span :class="{ avt: avtType === 3 }" @click="product(3, '同步')">
									<a>同步产品数</a>
								</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="extra-item">
								<a @click="getData(1)">近7天</a>
								<a @click="getData(2)">近30天</a>
								<a @click="getData(3)">近60天</a>
							</div>
						</el-col>
					</el-row>
					<el-divider style="margin: 0" />
					<!-- 图表 -->

					<div class="bar-chart" id="conBar">11</div>
				</div>
				<div class="chart">
					<el-row class="roe-sort">
						<el-col :span="12">
							<div class="product-sort">
								<span>
									<a>产品ID列表</a>
								</span>
							</div>
						</el-col>
					</el-row>
					<el-divider style="margin: 0" />
					<!-- 表格 -->
					<el-table :row-key="(row) => row.id" :data="pagedTableData" :header-cell-style="headerCellStyle" :cell-class-name="cellClassName" :border="false" :show-header="true" :show-summary="false">
						<el-table-column label="Sku" prop="sku"></el-table-column>
						<el-table-column label="PID" prop="pid"></el-table-column>
						<el-table-column label="VID" prop="vid"></el-table-column>
						<el-table-column label="类型" prop="activeType"></el-table-column>
						<el-table-column label="时间" prop="acticeTime"></el-table-column>
					</el-table>
					<el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="tableData.length" layout="prev, pager, next" />
				</div>
			</el-main>
		</el-container>
	</div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, Ref, onMounted, reactive, computed } from 'vue';
import { getAPI } from '/@/utils/axios-utils';
import { service } from '/@/utils/request';
type Product = {
	title: string;
	activeType: number;
};
type PageSync = {
	sku: any;
	pid: number;
	vid: number;
	acticeTime: string;
	activeType: string;
};

const headerCellStyle = { fontWeight: 'bold' };
const cellClassName = 'no-border';
const pageSize = ref(7);
const total = 5;
const currentPage = ref(1);

let barData: number[] = reactive([]);
let title: Ref<string> = ref('');
let xAxisData: string[] = reactive([]);
let tableData: PageSync[] = reactive([]);
let barCharts: any;
let productListData: Product[] = reactive([
	{
		title: '新增',
		activeType: 2,
	},
	{
		title: '修改',
		activeType: 2,
	},
	{
		title: '同步',
		activeType: 2,
	},
]);
let avtType = ref<number>(1);

const pagedTableData = computed(() => {
	const startIndex = (currentPage.value - 1) * pageSize.value;
	const endIndex = startIndex + pageSize.value;
	return tableData.slice(startIndex, endIndex);
});

function handleCurrentChange(page: any) {
	currentPage.value = page;
}

async function getAppPage(dateTypes: any) {
	service({
		url: '/ShopifyProductStatistics/barData',
		method: 'get',
		params: {
			dateType: dateTypes.activeType,
			activeType: dateTypes.title,
		},
	}).then((data) => {
		barData.splice(0, barData.length);
		xAxisData.splice(0, xAxisData.length);
		data.data.result.forEach((element: any) => {
			barData.push(element.y);
			xAxisData.push(element.x);
		});
		bar(barData, xAxisData);
		barCharts.setOption({
			title: {
				text: `近${dateTypes.activeType == 1 ? 7 : dateTypes.activeType == 2 ? 30 : 60}天(${dateTypes.title})`,
			},
		});
	});

	service({
		url: '/ShopifyProductStatistics/PageSync',
		method: 'get',
		params: {
			dateType: dateTypes.activeType,
			activeType: dateTypes.title,
		},
	}).then((data) => {
		tableData.splice(0, barData.length);
		data.data.result.forEach((element: any) => {
			tableData.push(element);
		});
	});
}

// 图表
function bar(barData: any, xAxisData: any): void {
	type EChartsOption = echarts.EChartsOption;
	let conBar: HTMLElement | null = document.getElementById('conBar')!;
	let barChart = echarts.init(conBar);
	barCharts = barChart;
	let option: EChartsOption;
	option = {
		title: {
			text: `近30天(${title.value})`,
			textStyle: {
				color: '#333',
				fontWeight: 300,
			},
			left: 'center',
			top: 15,
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
		},
		series: [
			{
				name: 'Y',
				data: barData,
				type: 'bar',
				barGap: '10%', // 设置柱间距为 10%
				barCategoryGap: '20%', // 设置类目间柱形间距为 20%
				itemStyle: {
					color: '#3AA0FF',
				},
			},
		],
	};

	barChart.setOption(option);
}
// 获取统计数据
function getData(val: number): void {
	if (title.value === '新增') {
		productListData[0].activeType = val;
		getAppPage(productListData[0]);
	}
	if (title.value === '修改') {
		productListData[1].activeType = val;
		getAppPage(productListData[1]);
	}
	if (title.value === '同步') {
		productListData[2].activeType = val;
		getAppPage(productListData[2]);
	}
}
// 产品数类型切换
function product(val: number, ntitle: string): void {
	avtType.value = val;
	title.value = ntitle;
	if (ntitle === '新增') {
		getAppPage(productListData[0]);
	}
	if (ntitle === '修改') {
		getAppPage(productListData[1]);
	}
	if (ntitle === '同步') {
		getAppPage(productListData[2]);
	}
}
onMounted(() => {
	getAppPage(productListData[0]);
    window.addEventListener('resize', handleResize);
});
 function handleResize() {
      barCharts.resize();
    }
    // 集货单管理
// 表格 业务应用
</script>
<style lang="less" scoped>
.container-chart {
	// width: 100vw;
	.chart {
		background-color: #fff;
		padding: 30px 20px 50px 20px;
		margin-bottom: 30px;
		position: relative;
		
		.extra-item {
			display: inline-block;
			margin-right: 24px;
			line-height: 55px;
			padding-right: 24px;
			a {
				margin-left: 24px;
				color: #13c2c2;
			}

			a:hover {
				cursor: pointer;
			}
		}
		.product-sort {
			display: flex;
			font-size: 16px;
			color: rgba(0, 0, 0, 0.65);

			span {
				padding: 16px;
			}
			.avt {
				border-bottom: 2px solid #13c2c2;
			}
			span:hover {
				color: #13c2c2;
				cursor: pointer;
			}
		}
		#conBar {
			width: 100%;
			height: 350px;
			// background-color: blanchedalmond;
		}
		.elTable {
			margin-top: 30px;
			padding-bottom: 80px;
		}
		// .pagination {
		// 	position: absolute;
		// 	bottom: 20px;
		// 	right: 0;
		// }
	}
}
</style>