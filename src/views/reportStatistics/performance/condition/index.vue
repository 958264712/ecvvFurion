<script lang="ts" setup name="performance_condition">
import * as echarts from 'echarts';
import moment from 'moment';
import { ref } from 'vue';
import router from '/@/router';
import { service } from '/@/utils/request';
import { auth } from '/@/utils/authFunction';
import { getAPI } from '/@/utils/axios-utils';
import { SysAuthApi } from '/@/api-services/api';
import { WarningFilled } from '@element-plus/icons-vue';
import { performanceGetAccumulated, performanceGetCompletion,performanceGetCompletionDetails } from '/@/api/modular/main/performance.ts';

const loading = ref(false);
const centerDialogVisible = ref(false);
const ifshow = ref(false);
const tableData = ref<any>([]);
const tableData1 = ref<any>([]);
const queryParams = ref<any>({ site: '全部', time:new Date() });//'2024-5'
const radio = ref('月');
const area = ref('CN');

const overPieRef = ref();
const overObjectivesRef = ref();

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const d = new Date(year, month, 0);
const days = d.getDate();
const dayList = ref<any>([]);
const dayList1 = ref<any>([]);
const monthsList = ref<any>(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);

for (let i = 1; i <= days; i++) {
	dayList1.value.push(i);
}
const tableParams = ref({
	page: 1,
	pageSize: 20,
});
const tabsList = ref([
	{ label: '全部', name: null },
	{ label: 'UAE', name: 'UAE' },
	{ label: 'SA', name: 'SA' },
]);

// 获取ecvv全体人员id，进行鉴权
const nameList = ref<any>([{ label: '全部', value: null }]);
const queryName = async (id: number) => {
	await service({
		url: '/api/sysUser/page',
		method: 'post',
		data: {
			orgId: id,
			page: 1,
			pageSize: 50,
		},
	}).then((res) => {
		if (res.data.type == 'success') {
			res.data.result.items?.map((item) => {
				nameList.value?.push({ value: item.realName, label: item.realName });
			});
		}
	});
};
const handleAuth = async () => {
	var res = await getAPI(SysAuthApi).apiSysAuthUserInfoGet();
	if (res.data.type === 'success') {
		if (res.data.result.account === 'superadmin') {
			queryParams.value.name="全部"
			queryName();
			handleQuery();
		} else {
			queryParams.value.name=res.data.result.realName
			nameList.value = [{ value: res.data.result.realName, label: res.data.result.realName }];
			handleQuery();
		}
	}
};
handleAuth()
const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};
const TableData = ref<any>([
	{ label: '姓名', dataIndex: 'name' },
	{ label: '排名', dataIndex: 'no' },
	{ label: '站点', dataIndex: 'site' },
	{ label: '目标销售额', dataIndex: 'target', width: 105 },
	{ label: '完成销售额', dataIndex: 'shippedCOGS', width: 105 },
	{ label: '完成率', dataIndex: 'completionRate' },
	{ label: '未完成', dataIndex: 'incomplete' },
	{ label: '超出目标销售额', dataIndex: 'exceedingTargetSalesRevenue', width: 125 },
]);
const TableData1 = ref<any>([]);
const TableData2 = ref<any>([{ label: '', dataIndex: '',width:80 },{ label: '', dataIndex:  '' ,width:80}]);
const TableData3 = ref<any>([]);
const changeRadio = (type: string) => {
	let num = 0;
	if (type === '月') {
		for (let i = 1; i <= days; i++) {
			if (i % 7 === 0) {
				num++;
				dayList.value.push({ label: i, dataIndex:  `day${i}` });
				dayList.value.push({ label: `第${num}周合计`, dataIndex: `week${num}`, width: 105 });
			} else {
				dayList.value.push({ label: i, dataIndex:  `day${i}` });
				if (num === 4 && i == days) {
					dayList.value.push({ label: `第${num + 1}周合计`, dataIndex: `week${num + 1}` });
				}
			}
		}
	} else {
		for (let i = 1; i <= monthsList.value.length; i++) {
			if (i % 3 === 0) {
				num++;
				dayList.value.push({ label: monthsList.value[i - 1], dataIndex:`month${i - 1}` });
				dayList.value.push({ label: `Q${num}合计`, dataIndex: `q${num}`, width: 100 });
			} else {
				dayList.value.push({ label: monthsList.value[i - 1], dataIndex:`month${i - 1}` });
			}
		}
	}
	TableData1.value = [...TableData.value, ...dayList.value];
	TableData2.value = [{ label: '', dataIndex: '',width:80 },{ label: '', dataIndex:  '' ,width:80}];
	TableData3.value = [...TableData.value, ...dayList.value];
	dayList.value = [];
	
	TableData3.value.map(item=>{
		if(item.dataIndex !== 'name' && item.dataIndex !== 'no'&& item.dataIndex !== 'site'){
			TableData2.value.push({label:item.label,dataIndex:'total' + item.dataIndex,width:item.width})
		}
	})
};
const changeMonths = (data, month, item) => {
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
const dataymxMoney = async (face, unit) => {
	const myChart = echarts.init(overObjectivesRef.value);
	let data = [0];
	let data1 = [0];
	await face(Object.assign(queryParams.value)).then((res) => {
		if (res.data.code === 200 && res.data.type === 'success') {
			if (radio.value === '月') {
				dayList1.value.map((e, index) => {
					res.data.result.thisMonth.map((item) => {
						if (e === item.day) {
							data[index] = item[unit];
						}
					});
					res.data.result.lastMonth.map((item) => {
						if (e === item.day) {
							data1[index] = item[unit];
						}
					});
				});
				
			} else if (radio.value === '年') {
				res.data.result.thisYear?.map((item) => {
					changeMonths(data, item.month, item[unit]);
				});
				res.data.result.lastYear?.map((item) => {
					changeMonths(data1, item.month, item[unit]);
				});
			}
		}
	});
	const options = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			left: '70%',
			top: '0%',
			data: [radio.value === '月' ? '今日' : '本月', radio.value === '月' ? '上月今日' : '去年本月'],
		},
		xAxis: {
			type: 'category',
			data: radio.value === '月' ? dayList1.value : monthsList.value,
			boundaryGap: false,
			axisLabel: {
				margin: 18,
			},
			axisPointer: {
				label: {
					show: true,
					formatter: function (params) {
						let date = queryParams.value.time?.split('-');
						if (radio.value == '月') {
							params.value = date[0] + '年' + date[1] + '月' + params.value + '日';
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
				name: radio.value === '月' ? '今日' : '本月',
				data: data,
				type: 'line',
				symbol: 'none',
				stack: 'x',
				itemStyle: {
					color: 'rgba(0,0,255, 1)',
				},
			},
			{
				name: radio.value === '月' ? '上月今日' : '去年本月',
				data: data1,
				type: 'line',
				symbol: 'none',
				stack: 'x',
				itemStyle: {
					color: 'rgba(129,191,253, 1)',
				},
			},
		],
	};
	myChart.setOption(options);
	window.onresize = function () {
		myChart.resize();
	};
};
const initEcharts = async () => {
	const myChart = echarts.init(overPieRef.value);
	let targetAmount,completeAmount;
	await performanceGetAccumulated(Object.assign(queryParams.value)).then((res) => {
		if (res.data.code === 200 && res.data.type === 'success') {
			if (radio.value === '月') {
				targetAmount = res.data.result.targetAmount 
				completeAmount = res.data.result.completeAmount 
			} else if (radio.value === '年') {
				targetAmount = res.data.result.targetAmount 
				completeAmount = res.data.result.completeAmount 
			}
		}
	});
	const options = {
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'vertical',
			right: 10,
			bottom: 0,
			pieces: [{ label: '目标销售额' }, { label: radio.value === '月' ? '完成销售额' : '累计完成' }],
		},
		series: [
			{
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					formatter: '{b}: {c}',
				},
				data: [
					{ value: targetAmount, name: '目标销售额' },
					{ value: completeAmount, name: radio.value === '月' ? '完成销售额' : '累计完成', label: { show: true, position: 'center', fontSize: '12', formatter: '完成度：{d}%', fontWeight: 'bold' } },
				],
				itemStyle: {
					normal: {
						color: function (colors) {
							var colorList = ['#1a26ff', '#81bffd'];
							return colorList[colors.dataIndex];
						},
					},
				},
			},
		],
	};
	myChart.setOption(options);
	window.onresize = function () {
		myChart.resize();
	};
};

// 查询操作
const handleQuery =  () => {
	changeRadio(radio.value);
	if(queryParams.value.site === '全部'){
		queryParams.value.site = null
	}
	if(queryParams.value.name && queryParams.value.name!=='全部'){
		ifshow.value = true
		setTimeout(() => {
			dataymxMoney(performanceGetCompletion, 'shippedCOGS');
			initEcharts();
		}, 100);
	}else{
		ifshow.value = false
	}
	if(queryParams.value.name==='全部'){
		queryParams.value.name=null
	}
	queryParams.value.time = moment(queryParams.value.time).format('YYYY-MM')
	queryParams.value.TimePeriod = radio.value;
	loading.value = true;
	 performanceGetCompletionDetails(Object.assign(tableParams.value, queryParams.value)).then(res=>{
		tableData.value = res.data.result?.detailslist;
		tableData1.value[0] = res.data.result?.total;
		if(res.data.result?.isShow<=0){
			centerDialogVisible.value = true
		}else{
			centerDialogVisible.value = false
		}
	})
	setTimeout(() => {
		if(queryParams.value.site ===null ){
			queryParams.value.site = '全部'
		}
	}, 100);
	
	loading.value = false;
};
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};
const getColumnLabel = (column) => {
	return tableData1.value[0][column]
}

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};


</script>

<template>
	<div class="aSINBasicDatel-container">
		<el-card class="full-table" shadow="hover">
			<div style="display: flex; justify-content: space-between">
				<div style="margin-bottom: 20px; display: flex; justify-content: space-between">
					<el-date-picker @change="handleQuery()" :clearable="false" v-model="queryParams.time" type="month" style="width: 100px" placeholder="请选择月份"  />
					<el-select @change="handleQuery()" v-model="queryParams.site" class="select">
						<el-option value="null" label="全部"></el-option>
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
					<el-select v-model="queryParams.name" @change="handleQuery()" clearable="" placeholder="请选择" class="select">
						<el-option v-for="(item, index) in nameList" :key="index" :value="item.value" :label="item.label" />
					</el-select>
					<el-radio-group v-model="radio" size="large" class="radio-group">
						<el-radio-button label="月" @change="handleQuery()" />
						<el-radio-button label="年" @change="handleQuery()" />
					</el-radio-group>
				</div>
			</div>
			<div class="common-layout">
				<el-row v-if="ifshow">
					<el-col class="MainCol leftcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>{{ radio === '月' ? '本月' : '今年' }}累计完成({{ queryParams.site === '全部' ? 'RMB' : queryParams.site }})</span>
							</div>
							<div style="height: 335px; background: #fff" ref="overPieRef"></div>
						</el-card>
					</el-col>
					<el-col class="MainCol rightcard" :span="12">
						<el-card shadow="always" class="bottomdiv">
							<div class="topchange">
								<span>{{ radio === '月' ? '本月' : '今年' }}完成情况({{ queryParams.site === '全部' ? 'RMB' : queryParams.site }})</span>
							</div>
							<div style="height: 335px; background: #fff" ref="overObjectivesRef"></div>
						</el-card>
					</el-col>
				</el-row>
				<el-table  :data="tableData"  v-loading="loading" tooltip-effect="light" row-key="id" border="">
					<template v-for="(item, index) in TableData1" :key="index">
						<el-table-column v-if="item.dataIndex === 'target'" :width="item.width" sortable :prop="item.dataIndex" show-overflow-tooltip :label="item.label" align="center" >
							<template #default="scope">
								{{scope.row.target}}({{scope.row.unit}})
							</template>
						</el-table-column>
						<el-table-column v-else-if="item.dataIndex === 'shippedCOGS'" :width="item.width" sortable :prop="item.dataIndex" show-overflow-tooltip :label="item.label" align="center" >
							<template #default="scope">
								{{scope.row.shippedCOGS}}({{scope.row.unit}})
							</template>
						</el-table-column>
						<el-table-column v-else-if="item.dataIndex === 'exceedingTargetSalesRevenue'" :width="item.width" sortable :prop="item.dataIndex" show-overflow-tooltip :label="item.label" align="center" >
							<template #default="scope">
								{{scope.row.exceedingTargetSalesRevenue}}({{scope.row.unit}})
							</template>
						</el-table-column>
						<el-table-column v-else-if="item.dataIndex" :width="item.width" sortable :prop="item.dataIndex" show-overflow-tooltip :label="item.label" align="center" />
					</template>
				</el-table>
				<el-table v-if="tableData1.length>0" :data="tableData1" style="height: 45px; overflow-x: scroll" v-loading="loading" tooltip-effect="light" row-key="id" border="">
					<el-table-column label="总计" align="center" />
					<template v-for="(item, index) in TableData2" :key="index">
						<el-table-column :width="item.width" :label="getColumnLabel(item.dataIndex)"  :prop="item.dataIndex" show-overflow-tooltip align="center" />
					</template>
				</el-table>
				<el-pagination
					v-model:currentPage="tableParams.page"
					v-model:page-size="tableParams.pageSize"
					:total="tableParams.total"
					:page-sizes="[10, 20, 50, 100, 500, 1000]"
					small=""
					background=""
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper"
				/>
			</div>
		</el-card>
		<el-dialog v-model="centerDialogVisible" title="提示" width="500">
			<span
				><el-icon><WarningFilled /></el-icon> 当前月份业绩汇率未设置，部分数据将无法查看，请先设置业绩汇率
			</span>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="centerDialogVisible = false">取消</el-button>
					<el-button
						type="primary"
						@click="
							centerDialogVisible = false;
							router.push('/reportStatistics/performance/rate');
						"
					>
						去设置
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="less" scoped>
.select {
	width: 100px;
	margin-left: 10px;
	:deep(.el-input) {
		width: 100%;
	}
}
.radio-group {
	height: 24px;
	margin: 0 10px;
	:deep(.el-radio-button__inner) {
		padding: 4px 13px;
	}
}
:deep(.el-row) {
	margin: 0 !important;
}
.el-col {
	border-radius: 4px;
}

/deep/ .el-pagination {
	margin: 22px 0 -10px 0 !important;
}

/deep/ .cell {
	white-space: nowrap;
}

/deep/ .el-table td.el-table__cell div {
	overflow: hidden;
}
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
.common-layout {
	height: 100%;
	overflow-x: scroll;
	overflow-y: scroll;
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
