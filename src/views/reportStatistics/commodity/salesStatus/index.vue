<script lang="ts" setup name="sales_status">
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import moment from 'moment';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import other from '/@/utils/other.ts'
import { salesPage, salesExport } from '/@/api/modular/main/salesStatus.ts';

const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({ site: 'UAE',Time:[new Date(),new Date()] });
const radio = ref('日');
const radio1 = ref('销量');
const area = ref('CN');

const exportLoading = ref(false)
const exportData = async () => {
	exportLoading.value = true
	await salesExport(Object.assign(queryParams.value)).then((res: any) => {
		if (res.statusText === 'OK') {
			other.downloadfile(res)
			ElMessage.success('导出成功')
			exportLoading.value = false
		} else {
			ElMessage.error('导出失败')
			exportLoading.value = false
		}
	}).catch(err => {
		ElMessage.error(err)
		exportLoading.value = false
	})
}

const tableParams = ref<any>({
	page: 1,
	pageSize: 20,
});

const handleData = (list: any) => {
	if (list?.length) {
		TableData.value = list;
	}
};
const TableData = ref<any>([
	{
		titleCN: 'ERP-SKU',
		dataIndex: 'erpSku',
		titleEN: 'ERP-SKU',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '中文NAME',
		dataIndex: 'goodsName',
		titleEN: 'GoodsName',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '采购国',
		dataIndex: 'orgin',
		titleEN: 'Origin',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '库存数量',
		dataIndex: 'inventoryQuantity',
		titleEN: 'Inventory Quantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'AMZ销量',
		dataIndex: 'amzMonthlySales',
		titleEN: 'AMZ Monthly Sales',
		checked: true,
		fixed: false,
	},
	{
		titleCN: 'AMZ销售额',
		dataIndex: 'amzMonthlySalesAmount',
		titleEN: 'AMZ Monthly Sales Amount',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '销量增长率',
		dataIndex: 'salesGrowthRate',
		titleEN: 'Sales GrowthRate',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '销量占比',
		dataIndex: 'salesProportion',
		titleEN: 'Sales Proportion',
		checked: true,
		width: '75',
		fixed: false,
	},

	{
		titleCN: '累计采购数量',
		dataIndex: 'purchaseQuantity',
		titleEN: 'Purchase Quantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '出库数量',
		dataIndex: 'outboundQuantity',
		titleEN: 'Out Bound Quantity',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '出库金额',
		dataIndex: 'outboundAmount',
		titleEN: 'Out Bound Amount',
		width: '160',
		checked: true,
		fixed: false,
	},
	{
		titleCN: '毛利润',
		dataIndex: 'buyboxTow',
		titleEN: 'Buybox Update',
		checked: true,
		fixed: false,
	},
]);

const changeRange = (type: string)=>{
    let today = new Date();
    let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    let lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    switch (type) {
        case '日':
            queryParams.value.startTime =  moment(today).format('YYYY-MM-DD') ;
	        queryParams.value.endTime =  moment(today).format('YYYY-MM-DD') ;
            break;
        case '周':
            queryParams.value.startTime =  moment(today).format('YYYY-MM-DD') ;
	        queryParams.value.endTime =  moment(today.setDate(today.getDate() + 7)).format('YYYY-MM-DD') ;
            break;
        case '月':
            queryParams.value.startTime =  moment(firstDayOfMonth).format('YYYY-MM-DD') ;
	        queryParams.value.endTime =  moment(lastDayOfMonth).format('YYYY-MM-DD') ;
            break;
        case '年':
            queryParams.value.startTime =  moment(firstDayOfYear).format('YYYY-MM-DD') ;
	        queryParams.value.endTime =  moment(lastDayOfYear).format('YYYY-MM-DD') ;
            break;
        default:
            queryParams.value.startTime = queryParams.value.Time.length ? moment(queryParams.value.Time[0]).format('YYYY-MM-DD') : '';
	        queryParams.value.endTime = queryParams.value.Time.length ? moment(queryParams.value.Time[1]).format('YYYY-MM-DD') : '';
            break;
    }
    queryParams.value.Time = [queryParams.value.startTime,queryParams.value.endTime]
}
// 查询操作
const handleQuery = async () => {
    loading.value = true;   
    changeRange(radio.value)
    queryParams.value.timeRange = radio.value
    queryParams.value.field = radio1.value    
	var res = await salesPage(Object.assign(tableParams.value,queryParams.value));
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

handleQuery();
</script>

<template>
	<div class="aSINBasicDatel-container">
		<el-card class="full-table" shadow="hover">
			<div style="display: flex; justify-content: space-between">
				<div style="margin-bottom: 20px; display: flex; justify-content: space-between">
					<el-select @change="handleQuery()" v-model="queryParams.site" class="select">
						<el-option value="UAE" label="UAE"></el-option>
						<el-option value="SA" label="SA"></el-option>
					</el-select>
					<el-radio-group v-model="radio" size="large" class="radio-group">
						<el-radio-button label="日" @change="handleQuery()" />
						<el-radio-button label="周" @change="handleQuery()" />
						<el-radio-button label="月" @change="handleQuery()" />
						<el-radio-button label="年" @change="handleQuery()" />
					</el-radio-group>
					<el-date-picker style="width: 250px" v-model="queryParams.Time" type="daterange" range-separator="——"  start-placeholder="Start date" end-placeholder="End date" @change="radio=null;handleQuery()"/>
					<el-radio-group v-model="radio1" size="large" class="radio-group">
						<el-radio-button label="销量" @change="handleQuery()" />
						<el-radio-button label="销售额" @change="handleQuery()" />
						<el-radio-button label="出库数量" @change="handleQuery()" />
						<el-radio-button label="出库金额" @change="handleQuery()" />
						<el-radio-button label="库存数量" @change="handleQuery()" />
						<el-radio-button label="增长率" @change="handleQuery()" />
					</el-radio-group>
					<el-button type="primary" :loading="exportLoading" @click="exportData">导出</el-button>
				</div>
				<tabDragColum :data="TableData" :name="`salesStatus`" :area="area" @handleData="handleData" />
			</div>

			<el-table :data="tableData" style="height: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="" >
				<!-- <el-table-column type="selection" width="40" align="center" /> -->
				<el-table-column type="index" label="排名" align="center" width="50"/>
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex == 'salesProportion'"
						:fixed="item.fixed"
						:width="item.width"
						:prop="item.dataIndex"
						show-overflow-tooltip
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
					>
						<template #default="scope">
							{{(scope.row.salesProportion*100).toFixed(1)+'%'}}
						</template>
					</el-table-column>
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



<style lang="less" scoped>
.select {
	width: 100px;
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

:deep(.el-pagination) {
	margin: 22px 0 -10px 0 !important;
}

:deep(.cell) {
	white-space: nowrap;
}

:deep(.el-table td.el-table__cell div) {
	overflow: hidden;
}
</style>
