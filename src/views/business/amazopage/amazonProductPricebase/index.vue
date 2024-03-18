<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
// import editDialog from './component/editDialog.vue'
import {
	pageAmazonProductPricebase,
	deleteAmazonProductPricebase,
	updateAmazonProductPricebase,
	Amazondataimport,
	AmazondataFollowExport,
	AmazondataExport,
	AmazonProductPricebaseAdjustPrice,
	AmazonProductBatchDelete,
} from '/@/api/modular/main/amazonPagePriceRecord';

// const editDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<baseParamsType>({});
const advanced = ref(false);

const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
// const editAmazonProductPricebaseTitle = ref("");

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageAmazonProductPricebase(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 删除
const delAmazonProductPricebase = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteAmazonProductPricebase(row);
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => { });
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

// 监控状态
const monitorChange = (value: string, record: any) => {
	record.monitorState = parseInt(value);
	updateAmazonProductPricebase(record).then((res) => {
		if (res.data.type === 'success') {
			handleQuery();
			ElMessageBox.alert('更新成功！', '系统提示', { autofocus: false });
		} else {
			ElMessageBox.alert('更新失败！', '系统提示', { autofocus: false });
		}
	});
};
//调价
const AmazonProductPricebaseAdjustPrices = (record: any) => {
	AmazonProductPricebaseAdjustPrice(record).then((res) => {
		if (res.data.type === 'success') {
			ElMessage.success('调价成功');
			handleQuery();
		} else {
			ElMessage.error('调价失败'); // + res.message
		}
	});
};
const loadingUp = ref(false);
const loading1 = ref(false);
const loading2 = ref(false);
const selectedRowKeys = ref([]);
//导入
const Amazonimport = (file: any) => {
	loadingUp.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	Amazondataimport(formData).then((res) => {
		loadingUp.value = false;
		if (res.data.type === 'success') {
			ElMessage.success('上传成功');
			handleQuery();
		} else {
			ElMessage.error('上传失败：' + res.message);
		}
	});
};
// 导出用户文件
const AmazonExport = () => {
	loading1.value = true;
	AmazondataExport(switchingDate())
		.then((res) => {
			loading1.value = false;
			downloadfile(res);
			ElMessageBox.alert('导出成功', '系统提示', { autofocus: false });
			ElMessage.success('导出成功');
			// eslint-disable-next-line handle-callback-err
		})
		.catch((err) => {
			loading1.value = false;
			ElMessageBox.alert('下载错误：获取文件流错误', '系统提示', { autofocus: false });
			ElMessage.error('下载错误：获取文件流错误');
		});
};
/**
 * 查询参数组装
 */
const switchingDate = () => {
	const obj = JSON.parse(JSON.stringify(queryParams));
	return obj;
};
const downloadfile = (res: any) => {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp("filename\\*=(UTF-8['']*[''])([^';]+)(?:.*)");
	//decodeURIComponent()
	var result = patt.exec(contentDisposition);
	var filename = result[2];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURIComponent(filename.replace(reg, '$1')); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
};
// 导出跟卖列表
const AmazonExportFollow = () => {
	loading2.value = true;
	AmazondataFollowExport(switchingDate())
		.then((res) => {
			loading2.value = false;
			downloadfile(res);
			ElMessageBox.alert('导出成功', '系统提示', { autofocus: false });
			ElMessage.success('导出成功');
		})
		.catch((err) => {
			loading1.value = false;
			ElMessageBox.alert('下载错误：获取文件流错误', '系统提示', { autofocus: false });
			ElMessage.error('下载错误：获取文件流错误');
		});
};

// 批量删除
const AmazonBatchDelete = () => {
	ElMessageBox.confirm(`您确定要删除这${selectedRowKeys.value.length + 1}条数据吗？`, 'Danger', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning',
	}).then(() => {
		AmazonProductBatchDelete(selectedRowKeys.value).then((res) => {
			if (res.data.type === 'success') {
				ElMessage.success('删除成功');
				selectedRowKeys.value = [];
				handleQuery();
			} else {
				ElMessage.error('删除失败');
			}
		});
	});
};
// 获取keys
const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selection.map((item: any) => {
		selectedRowKeys.value.push(item.id);
	});
};
handleQuery();
</script>
<template>
	<div class="amazonProductPricebase-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.asin" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item label="Sku">
					<el-input v-model="queryParams.sku" clearable="" placeholder="请输入Sku" />
				</el-form-item>
				<template v-if="advanced">
					<el-form-item label="Title">
						<el-input v-model="queryParams.title" clearable="" placeholder="请输入Title" />
					</el-form-item>
					<el-form-item label="是否占有Buybox">
						<el-select v-model="queryParams.isBuybox" placeholder="请选择">
							<el-option :value="null">全部</el-option>
							<el-option :value="true">True</el-option>
							<el-option :value="false">False</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="建议的售价">
						<el-input v-model="queryParams.listPrice" allow-clear placeholder="大于建议的售价" />
					</el-form-item>
					<el-form-item label="Warning">
						<el-select v-model="queryParams.warning" placeholder="请选择">
							<el-option :value="1">正常</el-option>
							<el-option :value="2">上架预警</el-option>
							<el-option :value="3">下架预警</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Remark">
						<el-input v-model="queryParams.remark" clearable="" placeholder="请输入Remark" />
					</el-form-item>
					<el-form-item label="BuyBoxOwner">
						<el-input v-model="queryParams.buyBoxOwner" clearable="" placeholder="请输入BuyBoxOwner" />
					</el-form-item>
					<el-form-item label="Currency">
						<el-input v-model="queryParams.currency" clearable="" placeholder="请输入Currency" />
					</el-form-item>
					<el-form-item label="BuyboxPrice">
						<el-input v-model="queryParams.buyboxPrice" clearable="" placeholder="请输入BuyboxPrice" />
					</el-form-item>
					<el-form-item label="ShippingDesc">
						<el-input v-model="queryParams.shippingDesc" clearable="" placeholder="请输入ShippingDesc" />
					</el-form-item>
					<el-form-item label="ShippingValue">
						<el-input v-model="queryParams.shippingValue" clearable="" placeholder="请输入ShippingValue" />
					</el-form-item>
					<el-form-item label="BuyboxSum">
						<el-input v-model="queryParams.buyboxSum" clearable="" placeholder="请输入BuyboxSum" />
					</el-form-item>
					<el-form-item label="SalePrice">
						<el-input v-model="queryParams.salePrice" clearable="" placeholder="请输入SalePrice" />
					</el-form-item>
					<el-form-item label="MyShippingValue">
						<el-input v-model="queryParams.myShippingValue" clearable="" placeholder="请输入MyShippingValue" />
					</el-form-item>
					<el-form-item label="MyShippingDesc">
						<el-input v-model="queryParams.myShippingDesc" clearable="" placeholder="请输入MyShippingDesc" />
					</el-form-item>
					<el-form-item label="MyBuyboxSum">
						<el-input v-model="queryParams.myBuyboxSum" clearable="" placeholder="请输入MyBuyboxSum" />
					</el-form-item>
					<el-form-item label="MaxItemCost">
						<el-input v-model="queryParams.maxItemCost" clearable="" placeholder="请输入MaxItemCost" />
					</el-form-item>
					<el-form-item label="MinItemCost">
						<el-input v-model="queryParams.minItemCost" clearable="" placeholder="请输入MinItemCost" />
					</el-form-item>
					<el-form-item label="ItemCost">
						<el-input v-model="queryParams.itemCost" clearable="" placeholder="请输入ItemCost" />
					</el-form-item>
					<el-form-item label="AdjustMoney">
						<el-input v-model="queryParams.adjustMoney" clearable="" placeholder="请输入AdjustMoney" />
					</el-form-item>
					<el-form-item label="AdjustedPercentage">
						<el-input v-model="queryParams.adjustedPercentage" clearable=""
							placeholder="请输入AdjustedPercentage" />
					</el-form-item>
					<el-form-item label="AdjusPriceUpperLimit">
						<el-input v-model="queryParams.adjusPriceUpperLimit" clearable=""
							placeholder="请输入AdjusPriceUpperLimit" />
					</el-form-item>
					<el-form-item label="BuyboxRate">
						<el-input v-model="queryParams.buyboxRate" clearable="" placeholder="请输入BuyboxRate" />
					</el-form-item>
					<el-form-item label="BuyboxPer">
						<el-input v-model="queryParams.buyboxPer" clearable="" placeholder="请输入BuyboxPer" />
					</el-form-item>
					<el-form-item label="ImgUrl">
						<el-input v-model="queryParams.imgUrl" clearable="" placeholder="请输入ImgUrl" />
					</el-form-item>
					<el-form-item label="Brand">
						<el-input v-model="queryParams.brand" clearable="" placeholder="请输入Brand" />
					</el-form-item>
					<el-form-item label="Rank">
						<el-input v-model="queryParams.rank" clearable="" placeholder="请输入Rank" />
					</el-form-item>
					<el-form-item label="MonitorState">
						<el-input-number v-model="queryParams.monitorState" clearable="" placeholder="请输入MonitorState" />
					</el-form-item>
					<el-form-item label="Reviews">
						<el-input v-model="queryParams.reviews" clearable="" placeholder="请输入Reviews" />
					</el-form-item>
					<el-form-item label="Stars">
						<el-input v-model="queryParams.stars" clearable="" placeholder="请输入Stars" />
					</el-form-item>
					<el-form-item label="StockStatus">
						<el-input v-model="queryParams.stockStatus" clearable="" placeholder="请输入StockStatus" />
					</el-form-item>
					<el-form-item label="SkuType">
						<el-input v-model="queryParams.skuType" clearable="" placeholder="请输入SkuType" />
					</el-form-item>
					<el-form-item label="SellerCount">
						<el-input v-model="queryParams.sellerCount" clearable="" placeholder="请输入SellerCount" />
					</el-form-item>
				</template>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="() => {
							queryParams = {};
							handleQuery();
						}
							">
							重置
						</el-button>
						<el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'"
							@click="() => (advanced = !advanced)">{{ advanced ? '收起' : '展开' }} </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="divTop">
				<el-popconfirm title="确认调价" @confirm="AmazonProductPricebaseAdjustPrices">
					<template #reference>
						<el-button type="primary">调价(所有)</el-button>
					</template>
				</el-popconfirm>
				<el-upload :on-change="Amazonimport" :multiple="false" action="#" :show-file-list="false"
					:auto-upload="false" name="file">
					<el-button :loading="loadingUp" type="primary">导入</el-button>
				</el-upload>
				<el-button @click="AmazonExport" :loading="loading1" type="primary">导出</el-button>
				<el-button @click="AmazonExportFollow" :loading="loading2" type="primary">导出ECVV跟卖</el-button>
				<el-button type="danger" @click="AmazonBatchDelete">批量删除</el-button>
			</div>
			<el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light"
				row-key="id" border="" @selection-change="(selection: any) => selectChange(selection)">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="asin" label="ASIN" fixed="left" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="imgUrl" label="Picture" fixed="left" align="center" width="150"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-image style="width: 100px; height: 100px" :src="scope.row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="Remark" fixed="left" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="monitorState" label="Price Alarm" fixed="left" align="center" sortable width="150"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-select v-if="scope.row.monitorState === 0" placeholder="已下架"
							@change="monitorChange('1', scope.row)">
							<el-option :value="0">已下架</el-option>
							<el-option :value="1">正常</el-option>
						</el-select>
						<el-select v-else placeholder="正常" @change="monitorChange('0', scope.row)">
							<el-option :value="0">已下架</el-option>
							<el-option :value="1">正常</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="warning" fixed="left" label="Warning" align="center" sortable width="150"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-tag v-if="scope.row.warning === 1" type="success"> 正常 </el-tag>
						<el-tag v-else-if="scope.row.warning === 2" type="warning"> 上架提醒 </el-tag>
						<el-tag v-else type="danger"> 下架预警 </el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="isBuybox" label="IsBuybox" align="center" sortable width="150"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-tag v-if="scope.row.isBuybox"> True </el-tag>
						<el-tag type="danger" v-else=""> False </el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sku" label="Sku" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="title" label="Title" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="buyBoxOwner" label="BuyBoxOwner" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="currency" label="Currency" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="buyboxPrice" label="BuyboxPrice" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="shippingDesc" label="ShippingDesc" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="shippingValue" label="ShippingValue" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="buyboxSum" label="BuyboxSum" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="salePrice" label="SalePrice" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="myShippingValue" label="MyShippingValue" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="myShippingDesc" label="MyShippingDesc" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="myBuyboxSum" label="MyBuyboxSum" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="maxItemCost" label="MaxItemCost" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="minItemCost" label="MinItemCost" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="listPrice" label="ListPrice" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="itemCost" label="ItemCost" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="adjustMoney" label="AdjustMoney" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="adjustedPercentage" label="AdjustedPercentage" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="adjusPriceUpperLimit" label="AdjusPriceUpperLimit" align="center" sortable
					width="150" show-overflow-tooltip="" />
				<el-table-column prop="buyboxRate" label="BuyboxRate" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="buyboxPer" label="BuyboxPer" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="brand" label="Brand" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="rank" label="Rank" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="reviews" label="Reviews" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="stars" label="Stars" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="vCtosellState" label="VCtosellState" align="center" width="150"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-tag v-if="scope.row.vCtosellState"> 是 </el-tag>
						<el-tag type="danger" v-else=""> 否 </el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="stockStatus" label="StockStatus" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="skuType" label="SkuType" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="sellerCount" label="SellerCount" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="followInfo" label="FollowInfo" align="center" width="150" show-overflow-tooltip="" />
				<el-table-column prop="existDesc" label="ExistDesc" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="existVideo" label="ExistVideo" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="discountPercentage" label="DiscountPercentage" align="center" sortable width="200"
					show-overflow-tooltip="" />
				<el-table-column prop="promotionEvent" label="PromotionEvent" align="center" width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="coupon" label="Coupon" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column prop="historySales" label="HistorySales" align="center" sortable width="150"
					show-overflow-tooltip="" />
				<el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button icon="ele-Delete" size="small" text="" type="primary"
							@click="delAmazonProductPricebase(scope.row)"> 删除 </el-button>
						<el-popconfirm title="确定调价?" @confirm="AmazonProductPricebaseAdjustPrice(scope.row)">
							<template #reference>
								<el-button icon="ele-Edit" size="small" text="" type="primary"> 调价 </el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<!-- <editDialog
			    ref="editDialogRef"
			    :title="editAmazonProductPricebaseTitle"
			    @reloadTable="handleQuery"
      /> -->
		</el-card>
	</div>
</template>

<style lang="less">
.divTop {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 500px;
	margin-bottom: 20px;
}
</style>
