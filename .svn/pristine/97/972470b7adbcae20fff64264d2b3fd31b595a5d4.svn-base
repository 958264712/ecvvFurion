<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import editDialog from './component/editDialog.vue';
import { pageASINBasicData, Import, ExportASIN, deleteASINBasicData } from '/@/api/modular/main/aSINBasicData.ts';

const editDialogRef = ref();
const loading = ref(false);
const loading1 = ref(false);
const loading3 = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<AsinParamsType>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const editASINBasicDataTitle = ref('');

// 查询操作
const handleQuery = async () => {
	loading.value = true;
	var res = await pageASINBasicData(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];

	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddASINBasicData = () => {
	editASINBasicDataTitle.value = '添加ASIN基础数据';
	editDialogRef.value.openDialog({});
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

// 导入ASIN
function Imports(file: any) {
	loading3.value = true;
	const formData = new FormData();
	formData.append('file', file.raw);
	Import(formData).then((res: any) => {
		loading3.value = false;
		if (res.data.code == 200) {
			ElMessage.success('Import succeeded');
			handleQuery();
		} else {
			ElMessage.error(res.message); // + res.message
		}
	});
}

// 导出ASIN
function Export() {
	loading1.value = true;
	ExportASIN().then((res: any) => {
		loading1.value = false;
		downloadfile(res);
		handleQuery();
	});
}

// 打开编辑页面
const openEditASINBasicData = (row: any) => {
	editASINBasicDataTitle.value = '编辑ASIN基础数据';
	editDialogRef.value.openDialog(row);
};

// 删除
const delASINBasicData = (row: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteASINBasicData(row);
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

//下载文件
function downloadfile(res: any) {
	var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' });
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
	var result = patt.exec(contentDisposition);
	var filename = result[1];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURI(filename.replace(reg, '$1')); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
}
handleQuery();
</script>
<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-input v-model="queryParams.aSIN" clearable="" placeholder="请输入ASIN" />
				</el-form-item>
				<el-form-item label="StoreSKU">
					<el-input v-model="queryParams.storeSKU" clearable="" placeholder="请输入StoreSKU" />
				</el-form-item>
				<el-form-item label="ItemName">
					<el-input v-model="queryParams.goodsName" clearable="" placeholder="请输入ItemName" />
				</el-form-item>
				<el-form-item label="ERP-SKU">
					<el-input v-model="queryParams.erpSku" clearable="" placeholder="请输入ERP-SKU" />
				</el-form-item>
				<el-form-item label="Origin">
					<el-input v-model="queryParams.origin" clearable="" placeholder="请输入Origin" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery"> 查询 </el-button>
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
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddASINBasicData" v-auth="'aSINBasicData:add'"> 新增 </el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv">
				<el-upload :on-change="Imports" :multiple="false" action="#" :show-file-list="false" :auto-upload="false" name="file">
					<el-button :loading="loading3" type="primary">ASIN基础数据导入</el-button>
				</el-upload>
				<el-button @click="Export" :loading="loading1" type="primary">导出全部ASIN</el-button>
				<el-link href="https://sa1api.ecvv.com/ExcelTemplate/ASIN.xlsx"> 下载ASIN上传模板</el-link>
			</div>
			<el-table :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id" border="">
				<el-table-column type="selection" width="40" />
				<el-table-column prop="asin" label="ASIN" align="center" show-overflow-tooltip="" width="120" />
				<el-table-column prop="storeSKU" label="StoreSKU" align="center" show-overflow-tooltip="" width="140" />
				<el-table-column prop="goodsName" label="ItemName" align="center" width="90" show-overflow-tooltip="" />
				<el-table-column prop="erpSku" label="ERP-SKU" align="center" width="95" show-overflow-tooltip="" />
				<el-table-column prop="origin" label="Origin" align="center" show-overflow-tooltip="" />
				<el-table-column prop="costPrice" label="LowestPrice" align="center" width="105" show-overflow-tooltip="" />
				<el-table-column prop="saudiBottomPrice_R96EP" align="center" label="SaudiBottomPrice_R96EP" width="190" show-overflow-tooltip="" />
				<el-table-column prop="saudiBottomPrice_63FV3" align="center" label="SaudiBottomPrice_63FV3" width="190" show-overflow-tooltip="" />
				<el-table-column prop="saudiBottomPrice_YZ6VH" align="center" label="SaudiBottomPrice_YZ6VH" width="190" show-overflow-tooltip="" />
				<el-table-column prop="unit" label="Single Order QTY" align="center" width="140" show-overflow-tooltip="" />
				<el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditASINBasicData(scope.row)">编辑 </el-button>
						<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delASINBasicData(scope.row)"> 删除 </el-button>
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
			<editDialog ref="editDialogRef" :title="editASINBasicDataTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<style lang="less" scoped>
.importDiv {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	width: 400px;
}
</style>
