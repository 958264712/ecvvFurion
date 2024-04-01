<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="数据类型">
					<el-select v-model="queryParams.country" class="m-2" style="width: 240px" @change="getSite">
						<el-option label="UAE" value="UAE" />
						<el-option label="SA" value="SA" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="ERP-SKU/中文Name">
					<el-input v-model="queryParams.erpAndGoodsName" clearable="" placeholder="请输入ERP-SKU/中文Name" @clear="clearObj" @blur="clearObj" />
				</el-form-item>
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" @clear="clearObj" @blur="clearObj" />
				</el-form-item>
				<el-form-item label="是否下架">
					<el-select v-model="queryParams.list_Unlist" class="m-2" style="width: 240px" @change="handleQuery">
						<el-option label="List" value="List" />
						<el-option label="UnList" value="UnList" />
					</el-select>
				</el-form-item>
				<el-form-item label="采购国">
					<el-select v-model="queryParams.purchasingCountry" class="m-2" style="width: 240px" @change="handleQuery">
						<el-option label="UAE" value="UAE" />
						<el-option label="SA" value="SA" />
						<el-option label="CN" value="CN" />
					</el-select>
				</el-form-item>
				<el-form-item label="Offer是否存在">
					<el-select v-model="queryParams.offerExist" class="m-2" style="width: 240px" @change="handleQuery">
						<el-option label="YES" value="YES" />
						<el-option label="NO" value="NO" />
					</el-select>
				</el-form-item>
				<el-form-item label="页面是否存在">
					<el-select v-model="queryParams.pageExist" class="m-2" style="width: 240px" @change="handleQuery">
						<el-option label="YES" value="YES" />
						<el-option label="NO" value="NO" />
					</el-select>
				</el-form-item>
				<el-form-item label="负责人">
					<el-input v-model="queryParams.creator" clearable="" placeholder="请输入负责人" @clear="clearObj" @blur="clearObj" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = { country: 'UAE' };
									Session.set('queryObj', {});
									handleQuery();
								}
							"
						>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover">
			<div style="display: flex; justify-content: space-between">
				<div style="margin-bottom: 20px">
					<el-dropdown>
						<el-button type="primary">导出</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="Export"> 导出全部 </el-dropdown-item>
								<el-dropdown-item @click="SelectedExport"> 导出选中 </el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-radio-group v-model="area1" style="margin-left: 20px">
						<el-radio-button label="中文表头" value="中文表头" @change="changeArea('CN')" />
						<el-radio-button label="English header" value="English header" @change="changeArea('EN')" />
					</el-radio-group>
				</div>
				<tabDragColum :data="TableData" :name="`newasinmanagementData`" :area="area" @handleData="handleData" />
			</div>
			<el-tabs v-model="selectcountry" type="card" style="height: 85%" @tab-click="handleClick">
				<el-tab-pane :label="item.label" :name="item.name" style="height: 100%" v-for="item in tabsList">
					<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center" />
						<!-- <el-table-column prop="no" label="序号" align="center" /> -->
						<template v-for="(item, index) in TableData" :key="index">
							<el-table-column
								v-if="item.dataIndex === 'rank' && item.checked"
								:width="item.width"
								:fixed="item.fixed"
								:prop="item.dataIndex"
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								align="center"
								:formatter="splitRank"
							/>
							<el-table-column
								v-else-if="item.checked"
								:fixed="item.fixed"
								:width="item.width"
								:prop="item.dataIndex"
								show-overflow-tooltip
								:label="area == 'CN' ? item.titleCN : item.titleEN"
								align="center"
							/>
						</template>
					</el-table>
				</el-tab-pane>
			</el-tabs>
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
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, h } from 'vue';
import { ElMessageBox, ElMessage, ElNotification, ElTooltip } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import { AsinDataPage, GetNotImportedList, ExportEnglish, ExportChinese } from '/@/api/modular/main/ASINManagement.ts';
import axios from 'axios';
import router from '/@/router';
import other from '/@/utils/other.ts';
import { Session } from '/@/utils/storage';
import tabDragColum from '/@/components/tabDragColum/index.vue';

const loading = ref(false);
const tableData = ref<any>([]);
let selectedRows = ref<any>([]);
const dialogFormVisible = ref(false);
const Typevalue = ref<any>('UAE');

let IsEdit = ref<any>(false);
const queryParams = ref<any>({ country: 'UAE' });

const tableParams = ref({
	page: 1,
	pageSize: 50,
});
const tabsList = ref([
	{
		label: 'UAE',
		name: 'UAE',
	},
	{
		label: 'SA',
		name: 'SA',
	},
]);
const area = ref('CN');
const area1 = ref('中文表头');
const changeArea = (val) => {
	area.value = val;
	if (area.value === 'CN') {
		area1.value = '中文表头';
	} else {
		area1.value = 'English header';
	}
};
const TableData = ref<any>([
	{
		titleCN: 'ERP-SKU',
		dataIndex: 'erpSku',
		titleEN: 'ERP-SKU',
		checked: true,
		fixed: true,
		width: '120',
	},
	{
		titleCN: '中文NAME',
		dataIndex: 'goodsName',
		titleEN: 'GoodsName',
		checked: true,
		width: '145',
		fixed: true,
	},
	{
		titleCN: 'ASIN',
		dataIndex: 'asin',
		titleEN: 'ASIN',
		width: '110',
		checked: true,
		fixed: true,
	},
	{
		titleCN: '品牌',
		dataIndex: 'brand',
		titleEN: 'Brand',
		checked: true,
		width: '90',
		fixed: true,
	},
	{
		titleCN: '发货数量',
		dataIndex: 'singleOrderQTY',
		titleEN: 'SingleOrderQTY',
		checked: true,
		width: '130',
		fixed: true,
	},
	{
		titleCN: '包装规格',
		dataIndex: 'specsUnit',
		titleEN: 'SpecsUnit',
		checked: true,
		width: '75',
		fixed: true,
	},
	{
		titleCN: '是否下架',
		dataIndex: 'list_Unlist',
		titleEN: 'List/Unlist',
		checked: true,
		width: '75',
		fixed: true,
	},
	{
		titleCN: '采购国',
		dataIndex: 'purchasingCountry',
		titleEN: 'Origin',
		checked: true,
		width: '100',
		fixed: true,
	},
	{
		titleCN: '上架站点',
		dataIndex: 'listingPlatform',
		titleEN: 'Platform',
		checked: true,
		width: '100',
		fixed: true,
	},
	{
		titleCN: 'Buybox',
		dataIndex: 'buyboxOne',
		titleEN: 'Buybox Last Check',
		checked: true,
		width: '150',
		fixed: false,
	},
	{
		titleCN: 'Update date',
		dataIndex: 'updateDateOne',
		titleEN: 'Update date Last Check',
		width: '160',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Buybox',
		dataIndex: 'buyboxTow',
		titleEN: 'Buybox Update',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Update date',
		dataIndex: 'updateDateTow',
		titleEN: 'Update date',
		width: '85',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'SELLER',
		dataIndex: 'seller',
		titleEN: 'SELLER',
		width: '85',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '占有率',
		dataIndex: 'buyboxSharePercentage',
		titleEN: 'Buybox Share Percentage',
		width: '85',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '总箱数(共多少箱)',
		dataIndex: 'packBoxesQuantity',
		width: '85',
		titleEN: 'Pack Boxes Quantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'RANK',
		dataIndex: 'rank',
		width: '250',
		titleEN: 'RANK',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '评论',
		dataIndex: 'reviewStar',
		checked: true,
		titleEN: 'Review Star',
		width: '120',
		fixed: false,
	},
	{
		titleCN: '评论数量',
		dataIndex: 'reviews',
		checked: true,
		titleEN: 'Reviews',
		width: '100',
		fixed: false,
	},
	{
		titleCN: '跟卖数量',
		dataIndex: 'numberOfSellers',
		titleEN: 'Number of Sellers',
		checked: true,
		width: '140',
		fixed: false,
	},
	{
		titleCN: '视频',
		dataIndex: 'videoStr',
		width: '120',
		titleEN: 'Video',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'A+',
		dataIndex: 'aStr',
		width: '85',
		titleEN: 'A+',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '活动',
		dataIndex: 'discount',
		titleEN: 'Discount',
		width: '85',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Coupon',
		titleEN: 'Coupon',
		dataIndex: 'coupon',
		width: '85',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '历史销量',
		titleEN: 'History Sales',
		dataIndex: 'historySales',
		width: '110',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '亚马逊周销量',
		titleEN: '7 Days Sales',
		dataIndex: 'days7Sales',
		width: '110',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '亚马逊月销量',
		titleEN: '30 Days Sales',
		dataIndex: 'days30Sales',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '亚马逊仓库存',
		titleEN: 'AMZ Inventory',
		dataIndex: 'amzInventory',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'ERP库存',
		titleEN: 'ERP Inventory',
		dataIndex: 'erpInventory',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'DF库存SHOWAY',
		titleEN: 'DF Inventory',
		dataIndex: 'dfInventory',
		width: '145',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Listing Inventory Status',
		titleEN: 'Listing Inventory Status',
		dataIndex: 'listingInventoryStatus',
		width: '155',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '最低COST',
		titleEN: 'Lowest Cost Price',
		dataIndex: 'lowestCostStr',
		width: '150',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '最低COST利润率',
		titleEN: 'Lowest Cost Price Rate',
		dataIndex: 'lowestCostProfitRateStr',
		width: '150',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '当前Cost Price',
		titleEN: 'Current Cost Price',
		dataIndex: 'currentCost',
		width: '150',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '货币单位',
		titleEN: 'Currency',
		dataIndex: 'currency',
		width: '110',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Our List Price',
		titleEN: 'Our List Price',
		dataIndex: 'ourListPriceStr',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Buybox price',
		titleEN: 'Buybox price',
		dataIndex: 'buyBoxPriceStr',
		width: '110',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Cost Profit',
		titleEN: 'Cost Profit',
		dataIndex: 'costProfit',
		width: '110',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '亚马逊佣金',
		titleEN: 'Commission Rate',
		dataIndex: 'commissionRateStr',
		width: '125',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Cost Profit Rate',
		titleEN: 'Cost Profit Rate',
		dataIndex: 'costProfitRateStr',
		width: '125',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'Offer是否存在',
		titleEN: 'Offer Exist',
		dataIndex: 'offerExist',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '页面是否存在',
		titleEN: 'Page Exist',
		dataIndex: 'pageExist',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '页面高价预警',
		titleEN: 'High List Alert',
		dataIndex: 'highListAlert',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '页面低价预警',
		titleEN: 'Low List Price Alert',
		dataIndex: 'lowListPriceAlert',
		width: '120',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '负责人',
		titleEN: 'Creator',
		dataIndex: 'creator',
		width: '100',
		checked: true,
		fixed: false,
	},
]);

const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list;
	}
};
const splitRank = (row, column) => {
	if (row.rank) {
		let list = row.rank.split('#');
		let content = `<div>`;
		let hArr = [];
		list.map((item, index) => {
			let iArr = item.split('\n');
			if (iArr?.length > 2) {
				let arr = [];
				iArr.map((item, index) => {
					let str = '';
					if (index !== iArr?.length - 1) {
						if (index % 2 === 0) {
							// str += `<div><span>#${item}</span>`;
							// arr.push(h('span', null, '#'+item));
						} else {
							str += `<a href="${item}" target="_blank">#${iArr[index - 1]}</a></div>`;
							arr.push(h('a', { href: item, target: '_blank' }, '#' + iArr[index - 1]));
							let countArr = h('div', null, arr);
							hArr.push(countArr);
							arr = [];
						}
						content += str;
					}
				});
			} else {
				let arr = [];
				iArr.map((item, index) => {
					let str = '';
					if (index % 2 === 0 && item?.length) {
						str += `<div>#${item}</div>`;
						arr.push(h('span', null, '#' + item));
						let countArr = h('div', null, arr);
						hArr.push(countArr);
						arr = [];
					}
					content += str;
				});
			}
		});
		content += '</div>';
		return h(ElTooltip, { content, placement: 'top', rawContent: true, effect: 'light' }, [h('div', null, [...hArr])]);
	}
};
const selectcountry = ref<string>('UAE');
// 切换站点
const handleClick = (tab, event): void => {
	selectcountry.value = tab.props.name;
	queryParams.value.country = tab.props.name;
	Session.set('queryObj', { ifquery: true });
	handleQuery();
};

const Export = () => {
	loading.value = true;
	const input = {
		country: selectcountry.value,
	};
	if (area.value === 'CN') {
		Chinese(input);
	} else {
		English(input);
	}
	loading.value = false;
};

const SelectedExport = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('请至少选中一条数据');
		return;
	}
	loading.value = true;
	const formData = {
		country: selectcountry.value,
		idLists: selectedRows.value,
	};
	if (area.value === 'CN') {
		Chinese(formData);
	} else {
		English(formData);
	}
	loading.value = false;
};
const English = async (obj: any) => {
	await ExportEnglish(obj)
		.then((data) => {
			other.downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
};
const Chinese = async (obj: any) => {
	await ExportChinese(obj)
		.then((data) => {
			other.downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
};
// const downloadfile = (res: any) => {
// 	var blob = new Blob([res.data], {
// 		type: 'application/octet-stream;charset=UTF-8',
// 	});
// 	var contentDisposition = res.headers['content-disposition'];
// 	var patt = new RegExp("filename\\*=(UTF-8['']*[''])([^';]+)(?:.*)");
// 	var result = patt.exec(contentDisposition);
// 	var filename = result[2];
// 	var downloadElement = document.createElement('a');
// 	var href = window.URL.createObjectURL(blob); // 创建下载的链接
// 	var reg = /^["](.*)["]$/g;
// 	downloadElement.style.display = 'none';
// 	downloadElement.href = href;
// 	downloadElement.download = decodeURIComponent(filename.replace(reg, '$1')); // 下载后文件名
// 	document.body.appendChild(downloadElement);
// 	downloadElement.click(); // 点击下载
// 	document.body.removeChild(downloadElement); // 下载完成移除元素
// 	window.URL.revokeObjectURL(href);
// };

const clearObj = () => {
	Session.set('queryObj', { ifquery: true });
};
// 查询操作
const handleQuery = async () => {
	if (!Session.get('queryObj')?.ifquery) {
		queryParams.value.country = Session.get('queryObj')?.country ?? 'UAE';
		queryParams.value.erpAndGoodsName = Session.get('queryObj')?.erpAndGoodsName ?? '';
		selectcountry.value = Session.get('queryObj')?.country ?? 'UAE';
	}

	var getNotImportedList = await GetNotImportedList({ site: selectcountry.value });
	if (getNotImportedList.data.result !== '') {
		tableData.value = [];
		ElMessage.warning(getNotImportedList.data.result);
		return;
	}
	loading.value = true;

	var res = await AsinDataPage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};

//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}
handleQuery();
</script>

<style lang="less" scoped>
.settingf {
	position: relative;

	.importDiv {
		position: absolute;
		left: 0;
	}

	.setting {
		display: inline;
		position: absolute;
		right: 30px;
	}

	.custom {
		position: relative;
	}
}

.custom-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
	}
}

:deep(.el-tooltip) {
	padding: 0;
}
/deep/ .el-tabs--card {
	.el-tabs__header {
		margin: 0;
	}

	.el-tabs__content {
		height: 93%;
	}
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
</style>
