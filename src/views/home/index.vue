<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import { Loading, WarningFilled, Refresh } from '@element-plus/icons-vue';
import { getAEAmazonState, getSAAmazonState,getScheduledFulfillmentList,getAppointmentList } from '/@/api/modular/main/amazonPagePriceRecord';
import LateDelivery from './components/lateDeliveryLIst.vue';
import ExpectedDelivery from './components/expectedDeliveryLIst.vue';
// 定义变量内容

const queryParams = ref<any>({
	aThisWeek:'全部',
	sfNextWeek:'全部',
	aNextWeek:'全部',
	sfThisWeek:'全部',
});
const tableData = ref<any>([]);
const tableData1 = ref<any>([]);
const tableData2 = ref<any>([]);
const tableData3 = ref<any>([]);
const loading = ref<any>(false);
const loading1 = ref<any>(false);
const loading2 = ref<any>(false);
const loading3 = ref<any>(false);
const optionsList = ref<any>([
	{
		label: '全部',
		value: '全部',
	},
	{
		label: 'UAE',
		value: 'UAE',
	},
	{
		label: 'SA',
		value: 'SA',
	},
]);
const state = reactive({
	homeOne: [
		{
			name: 'AE今天抓取数量',
			num1: '125,12',
			num3: '最后抓取时间：',
			time: '',
			runState: false,
		},
		{
			name: 'SA今天抓取数量',
			num1: '653,33',
			num3: '最后抓取时间：',
			time: '',
			runState: false,
		},
	],
});
const TableList = ref<any>([
	{
		title_CN: 'PO',
		title_EN: 'PO',
		dataIndex: 'po',
	},
	{
		title_CN: 'Vendor',
		title_EN: 'Vendor',
		dataIndex: 'vendor',
	},
	{
		title_CN: '站点',
		title_EN: 'Site',
		dataIndex: 'site',
	},
	{
		title_CN: 'ShipToLocation',
		title_EN: 'ShipToLocation',
		dataIndex: 'shipToLocation',
	},
	{
		title_CN: 'OrderDate',
		title_EN: 'Order Date',
		dataIndex: 'orderDate',
	},
	{
		title_CN: '约仓日期',
		title_EN: '约仓日期',
		dataIndex: 'contractedWarehouseTime',
	},
	{
		title_CN: '最迟履单日期',
		title_EN: '最迟履单日期',
		dataIndex: 'latestDate',
	},
]);
// AE抓取数据信息
const AEAmazonState = async () => {
	loading.value = true
	await getAEAmazonState().then((res: any) => {
		if (res.data.type === 'success') {
			state.homeOne[0].runState = res.data.result.runState;
			state.homeOne[0].time = res.data.result.updateTime;
			state.homeOne[0].num1 = res.data.result.todayQuantity;
			loading.value = false
		}
	});
};
// SA抓取数据信息
const SAAmazonState = async () => {
	loading.value = true
	await getSAAmazonState().then((res: any) => {
		if (res.data.type === 'success') {
			state.homeOne[1].runState = res.data.result.runState;
			state.homeOne[1].time = res.data.result.updateTime;
			state.homeOne[1].num1 = res.data.result.todayQuantity;
			loading.value = false
		}
	});
};
const ScheduledFulfillmentList = async (site:string,type:number,item:any) => {
	if(type === 1){
		loading1.value = true
		site = queryParams.value.sfThisWeek
		if(queryParams.value.sfThisWeek === '全部'){
			site = null
		}
	}else{
		loading3.value = true
		site = queryParams.value.sfNextWeek
		if(queryParams.value.sfNextWeek === '全部'){
			site = null
		}
	}
	await getScheduledFulfillmentList({site,type}).then((res: any) => {
		if (res.data.type === 'success') {
			if(item === 'tableData1'){
				tableData1.value = res.data.result ?? []
				loading1.value = false
			}else{
				tableData3.value = res.data.result ?? []
				loading3.value = false
			}
		}
	});
}
const AppointmentList = async (site:string,type:number,item:any) => {
	if(type === 1){
		loading.value = true
		site = queryParams.value.aThisWeek
		if(queryParams.value.aThisWeek === '全部'){
			site = null
		}
	}else{
		loading2.value = true
		site = queryParams.value.aNextWeek
		if(queryParams.value.aNextWeek === '全部'){
			site = null
		}
	}
	await getAppointmentList({site,type}).then((res: any) => {
		if (res.data.type === 'success') {
			if(item === 'tableData'){
				tableData.value = res.data.result ?? []
				loading.value = false
			}else{
				tableData2.value = res.data.result ?? []
				loading2.value = false
			}
		}
	});
}
SAAmazonState();
AEAmazonState();
ScheduledFulfillmentList(null,1,'tableData1')
ScheduledFulfillmentList(null,2,'tableData3')
AppointmentList(null,1,'tableData')
AppointmentList(null,2,'tableData2')
</script>

<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in state.homeOne" :key="k" :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
				<div class="home-card-item flex">
					<div class="flex-margin flex w100" :class="` home-one-animation${k}`">
						<div class="flex-auto">
							<div class="mt10" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center">
								<p style="font-weight: bold; font-size: large">{{ v.name }}</p>
								<Refresh  style="width: 20px; margin-right:8px;cursor:pointer;" @click="v.name === 'AE今天抓取数量' ?AEAmazonState(): SAAmazonState()"/>
							</div>
							<div class="mt10" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center">
								<span class="font30">{{ v.num1 }}</span>
								<template v-if="v.runState">
									<Loading v-loading="true" style="animation: rotate 5s infinite linear; width: 40px; color: green" />
								</template>
								<template v-else>
									<WarningFilled style="width: 40px; color: red" />
								</template>
							</div>

							<div class="mt10" style="font-size:16px;color:#ccc">
								{{ v.num3 }}{{ v.time }}
							</div>
						</div>
						<!-- <template v-if="v.runState">
							<Loading v-loading="true" style="animation: rotate 5s infinite linear; width: 40px; color: green" />
						</template>
						<template v-else>
							<WarningFilled style="width: 40px; color: red" />
						</template> -->
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
				<div class="home-card-item">
					<h2>集货单预计送仓表</h2>
					<div style="height: 100%; margin-top: 20px">
						<ExpectedDelivery />
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="home-media">
				<div class="home-card-item">
					<h2>集货单逾期未送表</h2>
					<div style="height: 100%; margin-top: 20px">
						<LateDelivery />
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-three mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
				<div class="home-card-item">
					<div class="cardTop">
						<h2>Appointment This Week</h2>
						<el-select v-model="queryParams.aThisWeek" size="large" @change="AppointmentList(queryParams.aThisWeek,1,'tableData')">
							<el-option v-for="item in optionsList" :value="item.value" :label="item.label" />
						</el-select>
					</div>
					<div style="height: 350px; margin-top: 20px">
						<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border>
							<el-table-column v-for="(item, index) in TableList" :key="index" :prop="item.dataIndex" :label="item.title_CN"  align="center"  show-overflow-tooltip=""/>
						</el-table>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="home-media">
				<div class="home-card-item">
					<div class="cardTop">
						<h2>Scheduled Fulfillment This Week</h2>
						<el-select v-model="queryParams.sfThisWeek" size="large" @change="ScheduledFulfillmentList(queryParams.sfThisWeek,1,'tableData1')">
							<el-option v-for="item in optionsList" :value="item.value" :label="item.label" />
						</el-select>
					</div>
					<div style="height: 350px; margin-top: 20px">
						<el-table :data="tableData1" style="height: 100%" v-loading="loading1" border tooltip-effect="light" row-key="id">
							<el-table-column v-for="(item, index) in TableList" :key="index" :prop="item.dataIndex" :label="item.title_CN"  align="center"  show-overflow-tooltip=""/>
						</el-table>
					</div>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="15" class="home-card-three">
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
				<div class="home-card-item">
					<div class="cardTop">
						<h2>Appointment Next Week</h2>
						<el-select v-model="queryParams.aNextWeek" size="large" @change="AppointmentList(queryParams.aNextWeek,2,'tableData2')">
							<el-option v-for="item in optionsList" :value="item.value" :label="item.label" />
						</el-select>
					</div>
					<div style="height: 350px; margin-top: 20px">
						<el-table :data="tableData2" style="height: 100%" v-loading="loading2" border tooltip-effect="light" row-key="id">
							<el-table-column v-for="(item, index) in TableList" :key="index" :prop="item.dataIndex" :label="item.title_CN"  align="center"  show-overflow-tooltip=""/>
						</el-table>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="home-media">
				<div class="home-card-item">
					<div class="cardTop">
						<h2>Scheduled Fulfillment Next Week</h2>
						<el-select v-model="queryParams.sfNextWeek" size="large" @change="ScheduledFulfillmentList(queryParams.sfNextWeek,2,'tableData3')">
							<el-option v-for="item in optionsList" :value="item.value" :label="item.label" />
						</el-select>
					</div>
					<div style="height: 350px; margin-top: 20px">
						<el-table :data="tableData3" style="height: 100%" v-loading="loading3" border tooltip-effect="light" row-key="id">
							<el-table-column v-for="(item, index) in TableList" :key="index" :prop="item.dataIndex" :label="item.title_CN"  align="center"  show-overflow-tooltip=""/>
						</el-table>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

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
			.cardTop {
				display: flex;
				justify-content: space-between;
				align-items: center;
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
		.green {
			color: #eee;
		}
	}
	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 450px;
			width: 100%;
			overflow: hidden;
			padding: 20px;
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
