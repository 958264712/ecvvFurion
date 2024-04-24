<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="数据类型">
					<el-select v-model="queryParams.country" class="m-2" style="width: 240px" @change="getSite">
						<el-option label="UAE" value="UAE" />
						<el-option label="SA" value="SA" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="ERP-SKU/中文Name">
					<el-popover :visible="visibleTextarea1" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input
								v-model="queryParams.erpTextArea"
								style="width: 215px"
								:autosize="{ minRows: 1, maxRows: 200 }"
								type="textarea"
								placeholder="可输入多个ERP-SKU精确查询，每行一个，最多支持200个"
							/>
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.erpSkuList?.length ?? 0 }}/200</span>
							<el-button
								type="info"
								@click="
									() => {
										queryParams.erpTextArea = '';
									}
								"
								>重置</el-button
							>
							<el-button type="primary" @click="handleConfirm(1)">确定</el-button>
						</div>
						<template #reference>
							<el-input v-model="queryParams.erpAndGoodsName" clearable="" placeholder="请输入,点击展开可输多个" @clear="clearObj" @blur="clearObj">
								<template #suffix>
									<el-icon class="el-input__icon"
										><ArrowDownBold @click="showTextarea(1, visibleTextarea1)" v-if="!visibleTextarea1" /><ArrowUpBold @click="showTextarea(1, visibleTextarea1)" v-else
									/></el-icon>
								</template>
							</el-input>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item label="ASIN">
					<el-popover :visible="visibleTextarea2" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input
								v-model="queryParams.asinTextArea"
								style="width: 215px"
								:autosize="{ minRows: 1, maxRows: 200 }"
								type="textarea"
								placeholder="可输入多个ERP-SKU精确查询，每行一个，最多支持200个"
							/>
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.aSINList?.length ?? 0 }}/200</span>
							<el-button
								type="info"
								@click="
									() => {
										queryParams.asinTextArea = '';
									}
								"
								>重置</el-button
							>
							<el-button type="primary" @click="handleConfirm(2)">确定</el-button>
						</div>
						<template #reference>
							<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入,点击展开可输多个" @clear="clearObj" @blur="clearObj">
								<template #suffix>
									<el-icon class="el-input__icon"
										><ArrowDownBold @click="showTextarea(2, visibleTextarea2)" v-if="!visibleTextarea2" /><ArrowUpBold @click="showTextarea(2, visibleTextarea2)" v-else
									/></el-icon>
								</template>
							</el-input>
						</template>
					</el-popover>
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
				<el-form-item label="Buybox">
					<el-select v-model="queryParams.IsBuyBox" placeholder="全部" style="width: 240px">
						<el-option label="全部" value="" />
						<el-option label="True" value="True" />
						<el-option label="False" value="False" />
					</el-select>
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
				<div style="margin-bottom: 20px; display: flex; justify-content: space-between">
					<el-dropdown>
						<el-button type="primary" :loading="Exportloading">导出</el-button>
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
					<el-button type="primary" style="margin-left: 20px" :loading="exportDataLoading" @click="exportDataDialog">导出记录</el-button>
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
			<el-dialog v-model="exportVisible" title="导出历史记录" @close="close" width="1000px">
				<SvgIcon style="margin-bottom: 10px; display: flex; justify-content: flex-end; cursor: pointer" name="iconfont icon-shuaxin" :size="22" title="刷新" @click="multipleExport" />
				<el-table :data="exportData" style="height: 100%" v-loading="exportTableLoading" tooltip-effect="light" row-key="id" border="">
					<el-table-column prop="fileUrl" label="文件地址" align="center" width="280px" show-overflow-tooltip>
						<template #default="scope">
							<el-link type="success" :href="scope.row.fileUrl">{{ scope.row.fileUrl === null ? '无文件' : scope.row.fileUrl.split('http://192.168.1.81:5568/ASINData/')[1] }}</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="state" label="状态" width="130px" align="center">
						<template #default="scope">
							<el-tag type="primary" v-if="scope.row.state === 2">生成失败</el-tag>
							<el-tag type="success" v-else-if="scope.row.state === 1">生成成功</el-tag>
							<el-tag type="warning" v-else-if="scope.row.state === 0">文件生成中</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" width="130px" label="导出时间" align="center" />
					<el-table-column prop="exportedBy" width="135px" label="导出人" align="center" />
					<el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip />
				</el-table>
				<el-pagination
					v-model:currentPage="tableParams1.page"
					v-model:page-size="tableParams1.pageSize"
					:total="tableParams1.total"
					:page-sizes="[10, 20, 50, 100, 500, 1000]"
					small=""
					background=""
					@size-change="handleSizeChange1"
					@current-change="handleCurrentChange1"
					layout="total, sizes, prev, pager, next, jumper"
				/>
			</el-dialog>
		</el-card>
	</div>
</template>

<script lang="ts" setup name="asinData">
import { ref, watch, h } from 'vue';
import { ElMessageBox, ElMessage, ElNotification, ElTooltip } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import { AsinDataPage, GetNotImportedList, ExportEnglish, ExportChinese, GetASINDataExportRecord } from '/@/api/modular/main/ASINManagement.ts';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import axios from 'axios';
import router from '/@/router';
import other from '/@/utils/other.ts';
import { Session } from '/@/utils/storage';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import { useDebounce } from '/@/utils/debounce';

const loading = ref(false);
const Exportloading = ref(false);
const exportDataLoading = ref(false);
const exportTableLoading = ref(false);
const tableData = ref<any>([]);
const exportData = ref<any>([]);
const selectedRows = ref<any>([]);
const dialogFormVisible = ref(false);
const exportVisible = ref(false);
const ifClose = ref(false);
const visibleTextarea1 = ref(false);
const visibleTextarea2 = ref(false);
const Typevalue = ref<any>('UAE');
const timer = ref<any>();

let IsEdit = ref<any>(false);
const queryParams = ref<any>({ country: 'UAE' });

const tableParams = ref({
	page: 1,
	pageSize: 50,
});
const tableParams1 = ref({
	page: 1,
	pageSize: 20,
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
const English = useDebounce(async (obj: any) => {
	Exportloading.value = true;
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/aSINData/export_English`, obj)
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((data) => {
			if (data.data.code == 200) {
				ElMessage({
					type: 'success',
					message: '表格导出中，请到导出记录中下载表格',
					duration: 5000,
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
			Exportloading.value = false;
		});
}, 500);
const Chinese = useDebounce(async (obj: any) => {
	Exportloading.value = true;
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/aSINData/export_Chinese`, obj)
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
		.then((data) => {
			if (data.data.code == 200) {
				ElMessage({
					type: 'success',
					message: '表格导出中，请到导出记录中下载表格',
					duration: 5000,
				});
			}
			Exportloading.value = false;
		})
		.catch((arr) => {
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
			Exportloading.value = false;
		});
}, 500);

const exportDataDialog = () => {
	exportVisible.value = true;
	ifClose.value = true;
	multipleExport();
};
const close = () => {
	exportVisible.value = false;
	ifClose.value = false;
};
const inquireData = () => {
	clearTimeout(timer.value); // 清除定时器
	// 超过60s则停止轮询
	if (!exportVisible.value) {
		clearTimeout(timer.value);
		return;
	}
	//5s一次, 轮询中
	timer.value = setTimeout(() => {
		multipleExport(); // 调用轮询
	}, 5000);
};
const multipleExport = async () => {
	await GetASINDataExportRecord(Object.assign(tableParams1.value)).then((res) => {
		if (res.data.code !== 200) {
			exportTableLoading.value = false;
			ElMessage.error(res.message);
			return;
		} else {
			exportData.value = res.data.result?.items ?? [];
			tableParams1.value.total = res.data.result?.total;
			inquireData(); // 调用轮询接口,开始进行轮询
		}
	});
};
const handleSizeChange1 = (val: number) => {
	tableParams1.value.pageSize = val;
	multipleExport();
};

// 多行筛选
const showTextarea = (type, bol) => {
	if (type === 1) {
		visibleTextarea1.value = !bol;
	} else {
		visibleTextarea2.value = !bol;
	}
};
const handleConfirm = (type) => {
	let str_array = [];
	if (type === 1) {
		str_array = queryParams.value.erpTextArea?.split(/[(\r\n)\r\n]+/);
	} else {
		str_array = queryParams.value.asinTextArea?.split(/[(\r\n)\r\n]+/);
	}
	let arr = str_array?.map((item, index) => {
		if (item === '') {
			str_array.splice(index, 1);
		} else {
			return item.trim();
		}
	});
	if (type === 1) {
		queryParams.value.erpSkuList = arr;
		queryParams.value.erpAndGoodsName = arr + '';
		visibleTextarea1.value = false;
	} else {
		queryParams.value.aSINList = arr;
		queryParams.value.aSIN = arr + '';
		visibleTextarea2.value = false;
	}
	// handleQuery()
};

// 改变页码序号
const handleCurrentChange1 = (val: number) => {
	tableParams1.value.page = val;
	multipleExport();
};
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
	// 工作人员选中手动清除，所以注释
	// if (queryParams.value.erpSkuList?.length > 0) {
	// 	queryParams.value.erpTextArea = '';
	// 	queryParams.value.erpAndGoodsName = '';
	// }
	// if (queryParams.value.aSINList?.length > 0) {
	// 	queryParams.value.asinTextArea = '';
	// 	queryParams.value.aSIN = '';
	// }
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
watch(
	() => queryParams.value.erpTextArea,
	() => {
		let str_array = queryParams.value.erpTextArea?.split(/[(\r\n)\r\n]+/);
		let arr = str_array?.map((item, index) => {
			if (item === '') {
				str_array.splice(index, 1);
			} else {
				return item.trim();
			}
		});
		if (arr[0] !== undefined) {
			queryParams.value.erpSkuList = arr;
		} else {
			queryParams.value.erpSkuList = [];
		}
	}
);
watch(
	() => queryParams.value.asinTextArea,
	() => {
		let str_array = queryParams.value.asinTextArea?.split(/[(\r\n)\r\n]+/);
		let arr = str_array?.map((item, index) => {
			if (item === '') {
				str_array.splice(index, 1);
			} else {
				return item.trim();
			}
		});
		if (arr[0] !== undefined) {
			queryParams.value.aSINList = arr;
		} else {
			queryParams.value.aSINList = [];
		}
	}
);
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
/deep/ .el-textarea__inner {
	box-shadow: initial;
	padding: 0;
	margin: 4px 0 4px 3px;
	height: 142px !important;
}
</style>
