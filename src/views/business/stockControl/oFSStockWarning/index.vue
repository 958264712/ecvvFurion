<style scoped>
.demo-image__error .image-slot {
	font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
	font-size: 30px;
}

.demo-image__error .el-image {
	width: 100%;
	height: 200px;
}
</style>

<script lang="ts" setup="" name="oFSStockWarning">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import editDialog from './component/editDialog.vue';
import { pageOFSStockWarning, deleteOFSStockWarning } from '/@/api/modular/main/oFSStockWarning';
import { Import } from '/@/api/modular/main/OutOfStockKanBan.ts';
const editDialogRef = ref();
const loading = ref(false);
const advanced = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<warningParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 20,
	total: 0,
});
const editOFSStockWarningTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageOFSStockWarning(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddOFSStockWarning = () => {
	editOFSStockWarningTitle.value = '添加库存预警表';
	editDialogRef.value.openDialog({});
};

// 打开编辑页面
const openEditOFSStockWarning = (row: any) => {
	editOFSStockWarningTitle.value = '编辑库存预警表';
	editDialogRef.value.openDialog(row);
};

// 删除
const delOFSStockWarning = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteOFSStockWarning(row);
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
//导入列表
function Imports(file: any) {
	loading.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('type', 'OFSStockWarning');
	Import(formData).then((res: any) => {
		loading.value = false;
		if (res.data.code == 200) {
			if (res.data.result.indexOf('导入成功') > -1) {
				ElMessage.success(res.data.result);
				handleQuery();
			} else {
				ElMessage.error(res.data.result);
			}
		} else {
			ElMessage.error('导入失败' + res.data.result);
		}
	});
}
const srcList = [
	'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
	'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
	'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
	'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
	'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
];

handleQuery();
</script>

<template>
	<div class="oFSStockWarning-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="库存SKU">
					<el-input v-model="queryParams.inventorySKU" clearable="" placeholder="请输入库存SKU" />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="queryParams.goodsName" clearable="" placeholder="请输入商品名称" />
				</el-form-item>
				<el-form-item label="发货仓库">
					<el-input v-model="queryParams.deliveryWarehouse" clearable="" placeholder="请输入发货仓库" />
				</el-form-item>
				<!-- <template v-if="advanced">
          <el-form-item label="库存数量">
            <el-input v-model="queryParams.inventoryQuantity" clearable="" placeholder="请输入库存数量" />

          </el-form-item>
          <el-form-item label="占用数量">
            <el-input v-model="queryParams.occupiedQuantity" clearable="" placeholder="请输入占用数量" />

          </el-form-item>
          <el-form-item label="可用数量">
            <el-input v-model="queryParams.availableQuantity" clearable="" placeholder="请输入可用数量" />

          </el-form-item>
          <el-form-item label="缺货占用数">
            <el-input v-model="queryParams.out_of_stock_occupation" clearable="" placeholder="请输入缺货占用数" />

          </el-form-item>
          <el-form-item label="采购未入库">
            <el-input v-model="queryParams.purchaseNotWarehoused" clearable="" placeholder="请输入采购未入库" />

          </el-form-item>
          <el-form-item label="缺货及待派单数量">
            <el-input v-model="queryParams.quantity_of_out_of_stock_and_waiting_list" clearable=""
              placeholder="请输入缺货及待派单数量" />

          </el-form-item>
          <el-form-item label="预计可用库存">
            <el-input v-model="queryParams.estimated_available_inventory" clearable="" placeholder="请输入预计可用库存" />

          </el-form-item>
          <el-form-item label="上次采购价">
            <el-input v-model="queryParams.last_purchase_price" clearable="" placeholder="请输入上次采购价" />

          </el-form-item>
          <el-form-item label="库存单价">
            <el-input v-model="queryParams.inventory_unit_price" clearable="" placeholder="请输入库存单价" />

          </el-form-item>
          <el-form-item label="库存金额">
            <el-input v-model="queryParams.inventory_amount" clearable="" placeholder="请输入库存金额" />

          </el-form-item>
          <el-form-item label="最低采购价格">
            <el-input v-model="queryParams.minimum_purchase_price" clearable="" placeholder="请输入最低采购价格" />

          </el-form-item>
          <el-form-item label="商品重量(g)">
            <el-input v-model="queryParams.commodity_weight_g" clearable="" placeholder="请输入商品重量(g)" />

          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="queryParams.brand" clearable="" placeholder="请输入品牌" />

          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="queryParams.specifications" clearable="" placeholder="请输入规格" />

          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="queryParams.model" clearable="" placeholder="请输入型号" />

          </el-form-item>
          <el-form-item label="材质">
            <el-input v-model="queryParams.texture_of_material" clearable="" placeholder="请输入材质" />

          </el-form-item>
          <el-form-item label="款式1">
            <el-input v-model="queryParams.style1" clearable="" placeholder="请输入款式1" />

          </el-form-item>
          <el-form-item label="款式2">
            <el-input v-model="queryParams.style2" clearable="" placeholder="请输入款式2" />

          </el-form-item>
          <el-form-item label="款式3">
            <el-input v-model="queryParams.style3" clearable="" placeholder="请输入款式3" />

          </el-form-item>
          <el-form-item label="库位">
            <el-input v-model="queryParams.location" clearable="" placeholder="请输入库位" />

          </el-form-item>
        </template> -->
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
						<!-- <el-button :icon="advanced ? 'ele-ArrowUp' : 'ele-ArrowDown'" @click="() => (advanced = !advanced)">{{ advanced ? '收起' : '展开' }} </el-button> -->
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddOFSStockWarning"
						v-auth="'oFSStockWarning:add'"> 新增 </el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div>
				<el-upload style="float: left;" :on-change="Imports" :multiple="false" action="#" :show-file-list="false"
					:auto-upload="false" name="file">
					<el-button :loading="loading" type="primary">导入</el-button>
				</el-upload>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light"
				row-key="id" border="">
				<el-table-column type="index" label="序号" width="150px" align="center" />
				<el-table-column prop="imageUrl" label="图片" width="150px" align="center">
					<template #default="scope">
						<div class="demo-image__preview">
							<el-image style="width: 60px; height: 60px" :src="scope.row.imageUrl" :zoom-rate="1.2"
								:initial-index="1" :preview-src-list="[scope.row.imageUrl]" fit="cover" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="inventorySKU" label="库存SKU" width="150px" align="center" show-overflow-tooltip="" />
				<el-table-column prop="goodsName" label="商品名称" width="150px" align="center" show-overflow-tooltip="" />
				<el-table-column prop="commodityCategory" label="商品类别" width="150px" align="center"
					show-overflow-tooltip="" />
				<el-table-column prop="commodityStatus" label="商品状态" width="150px" align="center"
					show-overflow-tooltip="" />
				<el-table-column prop="deliveryWarehouse" label="发货仓库" width="150px" align="center"
					show-overflow-tooltip="" />
				<el-table-column prop="inventoryQuantity" label="库存数量" width="150px" align="center" />
				<el-table-column prop="occupiedQuantity" label="占用数量" width="150px" align="center" />
				<el-table-column prop="availableQuantity" label="可用数量" width="150px" align="center" />
				<el-table-column prop="out_of_stock_occupation" label="缺货占用数" width="150px" align="center" />
				<el-table-column prop="purchaseNotWarehoused" label="采购未入库" width="150px" align="center" />
				<el-table-column prop="quantity_of_out_of_stock_and_waiting_list" label="缺货及待派单数量" width="150px"
					align="center" />
				<el-table-column prop="estimated_available_inventory" label="预计可用库存" width="150px" align="center" />
				<el-table-column prop="last_purchase_price" label="上次采购价" width="150px" align="center" />
				<el-table-column prop="inventory_unit_price" label="库存单价" width="150px" align="center" />
				<el-table-column prop="inventory_amount" label="库存金额" width="150px" align="center" />
				<el-table-column prop="minimum_purchase_price" label="最低采购价格" width="150px" align="center" />
				<el-table-column prop="commodity_weight_g" label="商品重量(g)" width="150px" align="center" />
				<el-table-column prop="brand" label="品牌" width="150px" align="center" />
				<el-table-column prop="specifications" label="规格" width="150px" align="center" />
				<el-table-column prop="model" label="型号" width="150px" align="center" sortable />
				<el-table-column prop="texture_of_material" label="材质" width="150px" align="center" sortable
					show-overflow-tooltip="" />
				<el-table-column prop="style1" label="款式1" width="150px" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="style2" label="款式2" width="150px" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="style3" label="款式3" width="150px" align="center" sortable show-overflow-tooltip="" />
				<el-table-column prop="location" label="库位" width="150px" align="center" sortable
					show-overflow-tooltip="" />
				<el-table-column label="操作" width="140" align="center" sortable fixed="right" show-overflow-tooltip=""
					v-if="auth('oFSStockWarning:delete')">
					<template #default="scope">
						<!-- <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditOFSStockWarning(scope.row)"
              v-auth="'oFSStockWarning:edit'"> 编辑 </el-button> -->
						<el-button icon="ele-Delete" size="small" text="" type="primary"
							@click="delOFSStockWarning(scope.row)" v-auth="'oFSStockWarning:delete'"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editOFSStockWarningTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>
<style scoped lang="less">
/deep/.el-table__cell {
	z-index: auto !important;
}
</style>