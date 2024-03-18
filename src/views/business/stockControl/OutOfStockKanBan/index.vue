<script setup lang="ts">
import { ref } from 'vue';
import moment from 'moment';
// import infiniteScroll from 'vue-infinite-scroll'
import { ElMessage } from 'element-plus';
import { getData, Import } from '/@/api/modular/main/OutOfStockKanBan.ts';
import * as XLSX from 'xlsx';
const loading = ref(false);
// 搜索用户数
// 调用接口回去真实数据
const statisticsData = ref<statisticsDataType>({});

getData().then((res) => {
	statisticsData.value = res.data.result;
});
const optionsValue = ref();
const num = ref();
const options = ref<OptionsType>([
	{ label: '商品名称明细超级表', value: 'OFSProductNameDetail' },
	{ label: '2022年迪拜出货明细', value: 'OFSDubaiShipmentDetails' },
	{ label: '库存查询表', value: 'OFSInventoryQuery' },
	{ label: '库存预警报表', value: 'OFSStockWarning' },
	{ label: '引出列表-采购订单', value: 'OFSPurchaseOrder' },
	{ label: '7天库存汇总账', value: 'OFSInventorySumAccount7' },
	{ label: '30天库存汇总账', value: 'OFSInventorySumAccount30' },
]);

const selectNum = (val: number) => {
	num.value = val;
};
//改变标题
const Changelabel = (val: number, item: string | number | undefined) => {
	if (val == 1) return 'Almost out of stock SKU(' + item + ')';
	if (val == 2) return 'Need to be restocked(' + item + ')';
	if (val == 3) return 'Sellable more than 180 days(' + item + ')';
};

//返回新的数组,（操作新数组不会改变之前的数组）
const returnNewList = (data: any) => {
	var list = JSON.parse(JSON.stringify(data));
	list = Array.from(list);
	list.forEach((element: { state: any }) => {
		delete element.state;
	});
	return list;
};

// //合并数组2
const spliceIntoChunks2 = (arr: any, chunkSize: any, title: string[]) => {
	const res = [];
	res.push(title);
	while (arr.length > 0) {
		const chunk = arr.splice(0, chunkSize);
		res.push([chunk[0].productName, chunk[0].availableQuantity, chunk[0].inventorySKU]);
	}
	return res;
};

//导入列表
function Imports(file: any) {
	loading.value = true;
	if (num.value === '') {
		ElMessage.error('请选择导入报表类型 10');
		loading.value = false;
		return;
	}
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('type', num.value);
	Import(formData).then((res: any) => {
		loading.value = false;
		if (res.data.code == 200) {
			if (res.data.result.indexOf('导入成功') > -1) {
				ElMessage.success(res.data.result);
				getData();
			} else {
				ElMessage.error(res.data.result);
			}
		} else {
			ElMessage.error('导入失败' + res.data.result);
		}
	});
}

//导出列表
const exportData = (val: number) => {
	var list = [];
	var title: string[] = [];
	var tableName = '';
	if (val == 1) {
		list = returnNewList(statisticsData.value.outOfStockSKU);
		// outOfStockSKU
		title = ['Almost out of stock SKU', 'ERP Inventory', 'SKU'];
		tableName = 'Almost out of stock SKU' + Date.now() + '.xlsx';
	} else if (val == 2) {
		list = returnNewList(statisticsData.value.purchaseReturnSKU);
		// purchaseReturnSKU
		title = ['Need to be restocked', 'ERP Inventory', 'SKU'];
		tableName = 'Need to be restocked' + Date.now() + '.xlsx';
	} else if (val == 3) {
		list = returnNewList(statisticsData.value.canSale300DaysName);
		// canSale300DaysName
		title = ['Sellable more than 180 days', 'ERP Inventory', 'SKU'];
		tableName = 'Sellable more than 180 days' + Date.now() + '.xlsx';
	} else {
		list = returnNewList(statisticsData.value.sevenDayProductNameAndNum);
		// sevenDayProductNameAndNum
		title = ['No orders within 7 days', 'ERP Inventory', 'SKU'];
		tableName = 'No orders within 7 days' + Date.now() + '.xlsx';
	}
	const tableData = spliceIntoChunks2(list, 1, title);
	// 将一组 JS 数据数组转换为工作表
	const ws = XLSX.utils.aoa_to_sheet(tableData);
	// 创建 workbook
	const wb = XLSX.utils.book_new();
	// 将 工作表 添加到 workbook
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
	// 将 workbook 写入文件
	XLSX.writeFile(wb, tableName);
};
</script>
<template>
	<div class="page-header-index-wide">
		<el-card class="head" shadow="hover" style="overflow:visible" :body-style="{ paddingBottom: '0px' }">
			<el-form inline="true">
				<el-form-item label="选择报表:">
					<el-select v-model="optionsValue" placeholder="请选择" style="width: 220px" @change="selectNum">
						<el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
					</el-select>
					<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
						<el-button :loading="loading" type="primary" class="upbtn">导入</el-button>
					</el-upload>
				</el-form-item>
				<span style="color: #e86a58; font-size: 30px; text-align: center; display: inline-block; margin-left: 150px">防断货库存看板</span>
			</el-form>
		</el-card>
		<br />
		<br />
		<el-card id="full-table" shadow="hover" :body-style="{height:'100%'}">
			<el-row :style="{ height: '100%' }">
				<el-col :sm="4" :md="4" :xl="4" :style="{ marginBottom: '24px', overflowY: 'auto' ,height:'100%'}">
					<el-card :body-style="{ padding: '15px' }">
						<el-descriptions title="💹大盘监控" :column="1" :border="true" size="medium">
							<el-descriptions-item label="近7日总销量" align="center">
								{{ statisticsData.weekTotalSales }}
							</el-descriptions-item>
							<el-descriptions-item label="近30日总销量" align="center">
								{{ statisticsData.monthTotalSales }}
							</el-descriptions-item>
							<el-descriptions-item label="7日动销sku计数" align="center">
								{{ statisticsData.weekSKUQuantity }}
							</el-descriptions-item>
							<el-descriptions-item label="30日动销sku计数" align="center">
								{{ statisticsData.monthSKUQuantity }}
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
					<br />
					<el-card :body-style="{ padding: '15px' }">
						<el-descriptions title="⚠销售预警" :column="1" :border="true" size="medium" layout="horizontal">
							<el-descriptions-item label="在库即将断货sku总数" align="center">
								{{ statisticsData.soonOutOfStockSKUQuantity }}
							</el-descriptions-item>
							<el-descriptions-item label="近7日未出单sku总数" align="center">
								{{ statisticsData.weekUnsoldSKUQuantity }}
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
					<br />

					<el-card :body-style="{ padding: '15px' }">
						<el-descriptions title="⚠采购预警返单" :column="1" :border="true" size="medium" layout="horizontal">
							<el-descriptions-item label="需要采购返单SKU" id="skuName2" align="center">
								{{ statisticsData.purchaseReturnSKUNum }}
							</el-descriptions-item>
							<el-descriptions-item label="SKU综合库存周转天数不足75" align="center">
								{{ statisticsData.cycleLack75Days }}
							</el-descriptions-item>
							<el-descriptions-item label="SKU综合可售天数超过180天数量" align="center">
								{{ statisticsData.canSale300Days }}
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
				</el-col>
				<!-- sku等待接口，接收list -->
				<el-col :sm="5" :md="5" :xl="5" :style="{ marginBottom: '24px', overflowY: 'auto', height: '100%' }">
					<el-card :body-style="{ padding: '10px' }">
						<div>
							<el-row>
								<el-col :span="18">
									<span style="text-align: center; font-size: 17px; display: block"
										><b>{{ Changelabel(1, statisticsData.soonOutOfStockSKUQuantity) }}</b></span
									>
								</el-col>
								<el-col :span="6">
									<el-button :loading="loading" type="primary" size="small" class="upbtn" @click="exportData(1)">导出</el-button>
								</el-col>
							</el-row>
						</div>

						<div style="margin-top: 10px">
							<div class="demo-infinite-container">
								<div v-for="(item, index) in statisticsData.outOfStockSKU" :key="index" class="listItem">
									<div class="ant-list-item-meta-avatar">
										<span class="ant-avatar ant-avatar-circle ant-avatar-image"
											><img
												src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51miz.com%2FElement%2F00%2F37%2F04%2F84%2F504d3581_E370484_1b42143h.png%21%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue%2Fformat%2Fpng&amp;refer=http%3A%2F%2Fimg.51miz.com&amp;app=2002&amp;size=f9999,10000&amp;q=a80&amp;n=0&amp;g=0n&amp;fmt=auto?sec=1658905515&amp;t=6060fb9b9905bc2e872006dd6e5b319d"
										/></span>
									</div>
									<div class="ant-list-item-meta-content">
										<h4 class="ant-list-item-meta-title">
											<a>{{ item.productName }}</a>
										</h4>
										<div class="ant-list-item-meta-description">{{ item.state }}</div>
									</div>
								</div>
							</div>
						</div>
						<br />
						<el-descriptions style="text-align: center" :column="1" :border="true" direction="vertical">
							<el-descriptions-item label="批注" align="center">
								<div class="color-red">以上sku，请注意及时调整销售策略：广告投放、售价、可售库存等</div>
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
				</el-col>
				<el-col :sm="5" :md="5" :xl="5" :style="{ marginBottom: '24px', overflowY: 'auto', height: '100%' }">
					<el-card :body-style="{ padding: '15px' }">
						<div>
							<el-row>
								<el-col :span="18">
									<span style="text-align: center; font-size: 17px; display: block"
										><b>{{ Changelabel(2, statisticsData.purchaseReturnSKUNum) }}</b></span
									>
								</el-col>
								<el-col :span="6">
									<el-button :loading="loading" type="primary" size="small" class="upbtn" @click="exportData(2)">导出</el-button>
								</el-col>
							</el-row>
						</div>

						<div style="margin-top: 10px">
							<div class="demo-infinite-container">
								<div v-for="(item, index) in statisticsData.purchaseReturnSKU" :key="index" class="listItem">
									<div class="ant-list-item-meta-avatar">
										<span class="ant-avatar ant-avatar-circle ant-avatar-image"
											><img
												src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51miz.com%2FElement%2F00%2F37%2F04%2F84%2F504d3581_E370484_1b42143h.png%21%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue%2Fformat%2Fpng&amp;refer=http%3A%2F%2Fimg.51miz.com&amp;app=2002&amp;size=f9999,10000&amp;q=a80&amp;n=0&amp;g=0n&amp;fmt=auto?sec=1658905515&amp;t=6060fb9b9905bc2e872006dd6e5b319d"
										/></span>
									</div>
									<div class="ant-list-item-meta-content">
										<h4 class="ant-list-item-meta-title">
											<a>{{ item.productName }}</a>
										</h4>
										<div class="ant-list-item-meta-description">{{ item.state }}</div>
									</div>
								</div>
							</div>
						</div>
						<br />
						<el-descriptions style="text-align: center" :column="1" :border="true" direction="vertical">
							<el-descriptions-item label="批注" align="center">
								<div class="color-red">以上sku，请注意及时与采购沟通返单计划；</div>
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
				</el-col>

				<el-col :sm="5" :md="5" :xl="5" :style="{ marginBottom: '24px', overflowY: 'auto', height: '100%' }">
					<el-card :loading="loading" :bordered="false" :body-style="{ padding: '10px' }">
						<div>
							<el-row>
								<el-col :span="18">
									<span style="text-align: center; font-size: 17px; display: block"
										><b>{{ Changelabel(3, statisticsData.canSale300Days) }}</b></span
									>
								</el-col>
								<el-col :span="6">
									<el-button :loading="loading" type="primary" size="small" class="upbtn" @click="exportData(3)">导出</el-button>
								</el-col>
							</el-row>
						</div>

						<div style="margin-top: 10px">
							<div class="demo-infinite-container">
								<div v-for="(item, index) in statisticsData.canSale300DaysName" :key="index" class="listItem">
									<div class="ant-list-item-meta-avatar">
										<span class="ant-avatar ant-avatar-circle ant-avatar-image"
											><img
												src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51miz.com%2FElement%2F00%2F37%2F04%2F84%2F504d3581_E370484_1b42143h.png%21%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue%2Fformat%2Fpng&amp;refer=http%3A%2F%2Fimg.51miz.com&amp;app=2002&amp;size=f9999,10000&amp;q=a80&amp;n=0&amp;g=0n&amp;fmt=auto?sec=1658905515&amp;t=6060fb9b9905bc2e872006dd6e5b319d"
										/></span>
									</div>
									<div class="ant-list-item-meta-content">
										<h4 class="ant-list-item-meta-title">
											<a>{{ item.productName }}</a>
										</h4>
										<div class="ant-list-item-meta-description">{{ item.state }}</div>
									</div>
								</div>
							</div>
						</div>
						<br />
						<el-descriptions style="text-align: center" :column="1" :border="true" direction="vertical">
							<!-- <el-descriptions-item :label="Changelabel(3)">
                {{ this.statisticsData.canSale300DaysName }}
              </el-descriptions-item>   -->
							<el-descriptions-item label="批注" align="center">
								<div class="color-red">以上sku,请注意及时清仓</div>
							</el-descriptions-item>
						</el-descriptions>
					</el-card>
				</el-col>

				<el-col :sm="5" :md="5" :xl="5" :style="{ marginBottom: '24px' }">
					<el-card :loading="loading" :bordered="false" :body-style="{ padding: '10px' }">
						<div>
							<el-row>
								<el-col :span="18">
									<span style="text-align: center; font-size: 17px; display: block"><b>No orders within 7 days</b></span>
								</el-col>
								<el-col :span="6">
									<el-button :loading="loading" type="primary" size="small" class="upbtn" @click="exportData(4)">导出</el-button>
								</el-col>
							</el-row>
						</div>

						<div style="margin-top: 10px">
							<div class="demo-infinite-container">
								<div v-for="(item, index) in statisticsData.sevenDayProductNameAndNum" :key="index" class="listItem">
									<div class="ant-list-item-meta-avatar">
										<span class="ant-avatar ant-avatar-circle ant-avatar-image"
											><img
												src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.51miz.com%2FElement%2F00%2F37%2F04%2F84%2F504d3581_E370484_1b42143h.png%21%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue%2Fformat%2Fpng&amp;refer=http%3A%2F%2Fimg.51miz.com&amp;app=2002&amp;size=f9999,10000&amp;q=a80&amp;n=0&amp;g=0n&amp;fmt=auto?sec=1658905515&amp;t=6060fb9b9905bc2e872006dd6e5b319d"
										/></span>
									</div>
									<div class="ant-list-item-meta-content">
										<h4 class="ant-list-item-meta-title">
											<a
												>{{ item.productName }}<span data-v-ce5c61de="" style="color: red">{{ item.availableQuantity }}</span></a
											>
										</h4>
									</div>
								</div>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>
<style lang="less" scoped>

.el-form {
	.el-form-item {
		/deep/ .el-form-item__label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
		}

		/deep/ .el-form-item__content {
			.el-input__wrapper {
				width: 220px;
				height: 30px;
				margin-right: 20px;
			}

			.el-button {
				height: 30px;
				min-width: 80px;
			}
		}
	}
}

.head {
	/deep/ .el-card__body {
		padding: 5px;
		.el-row {
			align-items: center;
		}
	}
}

.demo-infinite-container {
	border: 1px solid #e8e8e8;
	border-radius: 4px;
	overflow: auto;
	padding: 8px 24px;
	height: 500px;
}

.listItem {
	border-bottom: 1px solid #e8e8e8;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
}

.ant-list-item-meta-avatar {
	margin-right: 16px;
}

.ant-list-item-meta-content {
	-webkit-box-flex: 1;
	-ms-flex: 1 0;
	flex: 1 0;
}

.ant-avatar {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	color: rgba(0, 0, 0, 0.65);
	font-size: 14px;
	font-variant: tabular-nums;
	line-height: 1.5;
	list-style: none;
	-webkit-font-feature-settings: 'tnum';
	font-feature-settings: 'tnum';
	position: relative;
	display: inline-block;
	overflow: hidden;
	color: #fff;
	white-space: nowrap;
	text-align: center;
	vertical-align: middle;
	background: #ccc;
	width: 32px;
	height: 32px;
	line-height: 32px;
	border-radius: 50%;
}

.ant-avatar > img {
	display: block;
	width: 100%;
	height: 100%;
	-o-object-fit: cover;
	object-fit: cover;
}

.ant-list-item-meta-title {
	margin-bottom: 4px;
	color: rgba(0, 0, 0, 0.65);
	font-size: 14px;
	line-height: 22px;
}

.ant-list-item-meta-description {
	color: rgba(0, 0, 0, 0.45);
	font-size: 14px;
	line-height: 22px;
}

.ant-list-item-meta-title > a {
	color: rgba(0, 0, 0, 0.65);
	-webkit-transition: all 0.3s;
	transition: all 0.3s;
}

.color-red {
	color: red;
}
</style>
