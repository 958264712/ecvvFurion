<template>
	<div class="costpeice_Batch-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="文件名">
					<el-input v-model="queryParams.fileName" clearable="" placeholder="请输入文件名" />
				</el-form-item>
				<el-form-item label="批次号">
					<el-input v-model="queryParams.batchId" clearable="" placeholder="请输入批次号" />
				</el-form-item>
				<el-form-item label="站点">
					<el-select clearable="" v-model="queryParams.site" placeholder="请选择站点">
						<el-option v-for="(item, index) in getsiteData" :key="index" :value="item.value" :label="item.label" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'costpeice_Batch:page'"> 查询 </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									queryParams = {};
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
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div>
				<el-button @click="opendialog" type="primary"> 导入 </el-button>
				<el-button @click="exportdialog" type="primary"> 导出 </el-button>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="index" label="序号" width="55" align="center" />
				<el-table-column prop="site" align="center" label="站点" />
				<el-table-column prop="fileName" align="center" label="文件名" show-overflow-tooltip="" />
				<el-table-column prop="batchId" align="center" label="批次号" />
				<el-table-column prop="createTime" label="导入时间 " align="center" />
				<el-table-column prop="creator" label="操作人 " align="center" />
				<el-table-column label="操作" width="140" align="center" fixed="right" v-if="auth('costpeice_Batch:edit') || auth('costpeice_Batch:delete')">
					<template #default="scope">
						<el-button icon="ele-Document" size="small" text="" type="primary" @click="showModal(scope.row.id)"> 详情 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
		<el-dialog v-model="visible" title="Costpeice List" @close="close" width="1000px">
			<InfoDataDialog :id="costpriceBatchId" idName="costpriceBatchId" :dataList="dataList" :ifClose="ifClose" :pointerface="pageCostpeice" :formList="formList" />
		</el-dialog>
		<el-dialog v-model="dialogFormVisible" title="CostpriceBatch导入" width="600px" center>
			<importDialog
				:type="importType"
				text="选择站点，点击'确定'后，选择需要导入的文件，将导入该数据"
				:formList="importFormList"
				:importsInterface="Import"
				@close="importClose"
				@importQuery="importQuery"
			/>
		</el-dialog>
		<el-dialog v-model="exportVisible" title="导出Cost Price" width="600px" @close="exportClose" draggable>
			<el-form :model="exportParams" ref="exportForm">
				<el-form-item label="站点">
					<el-radio-group v-model="exportParams.site">
						<el-radio label="所有" :value="null"/>
						<el-radio label="UAE" value="UAE"/>
						<el-radio label="SA" value="SA"/>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="日期">
					<el-date-picker type="daterange" v-model="exportParams.time"  start-placeholder="Start date" end-placeholder="End date" style="width:200px !important;flex-grow:0"/>
				</el-form-item>
				<el-form-item label="范围">
					<el-radio-group v-model="exportParams.hasChanges">
						<el-radio label="所有" :value="null"/>
						<el-radio label="有变化" :value="1"/>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<div style="text-align:start !important">
					<el-button type="primary" size="default" :loading="exportLoading" @click="exportConfirm">确定</el-button>
					<el-button size="default" @click="exportClose">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup="" name="costpeice_Batch">
import { ref } from 'vue';
import { auth } from '/@/utils/authFunction';
import {ElMessage} from 'element-plus'
import { pageCostpeice_Batch, exportCostPrice,getExportCostPriceFileStream, Import } from '/@/api/operation/costprice_Batch';
import { pageCostpeice } from '/@/api/operation/costprice';
import { getDictDataList } from '/@/api/system/admin';
import importDialog from '/@/components/importDialog/index.vue';
import InfoDataDialog from '/@/components/infoDataDialog/index.vue';
import moment from 'moment'

const ifClose = ref(false);
const timer = ref<NodeJS.Timeout | null>(null);
const startTime = ref(0);
const exportVisible = ref(false);
const exportLoading = ref(false)
const exportParams = ref<any>({
	site:'所有',
	hasChanges:'有变化',
	time:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24 * 30),new Date()]
});
const exportForm = ref();
const exportdialog = () => {
	exportVisible.value = true;
};
const exportClose = () => {
	exportParams.value = {
	site:'所有',
	hasChanges:'有变化',
	time:[new Date().setTime(new Date().getTime()-3600 * 1000 * 24 * 30),new Date()]
	};
	exportVisible.value = false;
};
//打开弹窗
function showModal(id: any) {
	costpriceBatchId.value = id;
	ifClose.value = true;
	visible.value = true;
}

//关闭弹窗
function close() {
	visible.value = false;
	ifClose.value = false;
}
// infoDataDialog 配套参数
const formList = ref<any>([
	{
		label: 'ASIN',
		prop: 'aSIN',
	},
]);
const dataList = ref<any>([
	{
		label: 'Vendor',
		prop: 'vendor',
	},
	{
		label: 'ASIN',
		prop: 'asin',
	},
	{
		label: 'EAN_UPC',
		prop: 'eaN_UPC',
	},
	{
		label: 'ERP-SKU',
		prop: 'erpSku',
	},
	{
		label: 'Model',
		prop: 'model',
	},
	{
		label: 'ProductDescription',
		prop: 'productDescription',
	},
	{
		label: 'ReplenishmentStatus',
		prop: 'replenishmentStatus',
	},
	{
		label: 'EffectiveDate',
		prop: 'effectiveDate',
	},
	{
		label: 'CurrentCost',
		prop: 'currentCost',
	},
	{
		label: 'NewCost',
		prop: 'newCost',
	},
	{
		label: 'CurrentCostCurrency',
		prop: 'currentCostCurrency',
	},
	{
		label: 'NewCostCurrency',
		prop: 'newCostCurrency',
	},
]);
var costpriceBatchId = ref<number>(0);
const visible = ref(false); //列表弹窗
const site = ref<any>(''); //站点
const options = ref([
	{
		value: 'UAE',
		label: 'UAE',
	},
	{
		value: 'SA',
		label: 'SA',
	},
]);

const getsiteData = ref<any>([]);
const dialogFormVisible = ref(false);
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const importType = ref('costprice_batch');
const importFormList = ref<any>([
	{
		label: '站点',
		prop: 'Site',
		type: 'select',
		select: 'Site',
		selectList: options.value,
	},
]);
const importClose = (bol: boolean) => {
	dialogFormVisible.value = bol;
};
const importQuery = () => {
	handleQuery();
};
const inquireData = (id: any) => {
	const reload = () => {
		clearTimeout(timer.value as NodeJS.Timeout); // 清除定时器
		// 超过3分钟则停止轮询
		if (new Date().getTime() - startTime.value > 10 * 60 * 1000) {
			clearTimeout(timer.value as NodeJS.Timeout);
			return;
		}
		timer.value = setTimeout(() => {
			inquireData(id); // 调用轮询
		}, 3000);
	};
	getExportCostPriceFileStream({id}).then((res: any) => {
		if (res.data.result === '') {
			// 没成功,调用轮询
			reload();
		} else {
			window.open(res.data.result, '_blank');
			exportLoading.value = false;
			exportVisible.value = false;
			ElMessage.success('Export Success!');
			handleQuery();
		}
	}).catch(err => {
		exportLoading.value = false;
		ElMessage.error(err);
	})
};
// 导出
const exportConfirm = async () => {
	exportLoading.value = true
	if (exportParams.value.time?.length) {
		exportParams.value.startDate = moment(exportParams.value.time[0]).format('YYYY-MM-DD')
		exportParams.value.endDate = moment(exportParams.value.time[1]).format('YYYY-MM-DD')
	}else{
		ElMessage.error('请选择日期')
		return
	}
	if (exportParams.value.site === '所有') {
		exportParams.value.site = null
	}
	if (exportParams.value.hasChanges === '所有') {
		exportParams.value.hasChanges = null
	} else {
		exportParams.value.hasChanges = 1
	}
	await exportCostPrice(Object.assign(exportParams.value)).then((res:any) => {
		if (res.data.code !== 200) {
			exportLoading.value = false;
			ElMessage.error(res.message);
			return;
		} else {
			inquireData(res.data.result); // 调用轮询接口,开始进行轮询
			startTime.value = new Date().getTime();
		}
	}).catch(err => {
		exportLoading.value = false;
		ElMessage.error(err);
	})
	if (exportParams.value.site === null) {
		exportParams.value.site = '所有'
	}
	if (exportParams.value.hasChanges === null) {
		exportParams.value.hasChanges = '所有'
	} else {
		exportParams.value.hasChanges = '有变化'
	}
}

const opendialog = () => {
	dialogFormVisible.value = true;
	site.value = '';
};

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageCostpeice_Batch(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
	getsiteData.value = await dictTypeDataList('zhandian');
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

const dictTypeDataList = async (val: any) => {
	let list = await getDictDataList(val);
	return list.data.result ?? [];
};
handleQuery();
</script>
<style lang="less" scoped>
	:deep(.el-radio){
		margin-right:12px;
	}
</style>