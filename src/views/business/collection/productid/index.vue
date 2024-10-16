<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryList" :inline="true">
				<el-form-item label="内部唯一识别码或内部品名">
					<el-input v-model="queryList.internalUniqueID" clearable="" placeholder="请输入内部唯一识别码或内部品名" />
				</el-form-item>
				<el-form-item label="采购员">
					<el-input v-model="queryList.purchaser" clearable="" placeholder="请输入采购员" />
				</el-form-item>
				<el-form-item label="采购合同号">
					<el-input v-model="queryList.purchaseContractNo" clearable="" placeholder="请输入采购合同号" />
				</el-form-item>
				<el-form-item label="ECVV箱单号">
					<el-input v-model="queryList.boxNo" clearable="" placeholder="请输入ECVV箱单号" />
				</el-form-item>
				<el-form-item label="供应商">
					<el-input v-model="queryList.supplier" clearable="" placeholder="请输入供应商" />
				</el-form-item>
				<el-form-item label="品牌">
					<el-input v-model="queryList.brand" clearable="" placeholder="请输入品牌" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="queryfun"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-form-item class="settingf">
				<el-button type="primary" icon="ele-Plus" @click="OpenAdd" style="margin-right: 20px"> 新增集货单商品基础信息 </el-button>

				<el-upload
					action="http://192.168.1.81:5568/api/collectionOrderInfo/collectionUploadAttachment"
					:on-success="successfun"
					:on-error="errorfun"
					:multiple="true"
					:show-file-list="false"
					name="file"
				>
					<el-button type="primary" :loading="loading1" icon="ele-Plus" style="margin: 20px"> 导入 </el-button>
				</el-upload>
				<div class="flex flex-wrap items-center">
					<el-dropdown>
						<el-button type="primary" :loading="cardLoading"> 导出 </el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item style="height: 24px" @click="AllExport">导出全部 </el-dropdown-item>
								<el-dropdown-item style="height: 24px" @click="SelectedExport" :disabled="!selectedRowKeys?.length">导出选中 </el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
				<div class="setting">
					<el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom-end">
						<el-button type="primary" :icon="Refresh" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="密度" placement="bottom-end">
						<el-button type="primary" :icon="DCaret" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="列设置" placement="bottom-end">
						<el-button type="primary" @click="CacheShows = !CacheShows" :icon="Setting" />
					</el-tooltip>
					<div
						v-if="CacheShows"
						class="s-tool-column-header s-tool-column-item"
						style="
							width: 230px;
							height: 500px;
							position: absolute;
							right: -25px;
							top: 30px;
							z-index: 10000;
							overflow-y: auto;
							background-color: #fff;
							padding: 10px 20px;
							box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.5);
						"
					>
						<div style="padding: 0px 10px">
							<el-checkbox v-model="checkAll" @change="onCheckAllChange"> 列展示 </el-checkbox>
							<el-button style="margin: -6px 0 0 70px" @click="CacheReset" type="primary" link>重置</el-button>
						</div>
						<el-divider />
						<div class="ant-checkbox-group">
							<div>
								<draggable :list="columns" itemKey="dataIndex">
									<template #item="{ element }">
										<div class="s-tool-column-item">
											<el-icon style="margin: 0 5px 0 0px">
												<Grid />
											</el-icon>

											<el-checkbox v-model="element.checked" @change="CacheOnChange(element)">{{ element.title }}</el-checkbox>
										</div>
									</template>
								</draggable>
							</div>
						</div>
					</div>
				</div>
			</el-form-item>

			<el-table
				:data="tableData"
				size="large"
				style="width: 100%"
				v-loading="loading"
				tooltip-effect="light"
				:cell-style="customCellStyle"
				@sort-change="sortfun"
				@selection-change="(selection: any) => selectChange(selection)"
			>
				<el-table-column type="selection" width="55" />
				<template v-for="el in columns" :key="el.dataIndex">
					<el-table-column v-if="el.checked && el.title == '标签'" :prop="el.dataIndex" :label="el.title" align="center" :width="el.width" sortable="custom">
						<template #default="scope">
							<div v-for="(item, index) in scope.row.warnTag" :key="index">
								<el-tag class="mx-1" :color="IsTag(item)" :hit="false" effect="dark">{{ item }}</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-else-if="el.checked" :prop="el.dataIndex" :label="el.title" align="center" show-overflow-tooltip="" :width="el.width" sortable="custom">
						<template #default="scope" v-if="el.title == '产品图'">
							<img :src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.internalUniqueID + '.jpg'" alt="" style="width: 80%" />
						</template>
					</el-table-column>
				</template>

				<el-table-column label="操作" align="center" fixed="right" width="180">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="OpenNotes(scope)"> 出货说明 </el-button>
						<el-button size="small" text type="primary" @click="OpenEdit(scope.row)"> 编辑 </el-button>

						<el-popover placement="top" width="200" :disabled="visible" trigger="click">
							<p>确定删除吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visible = true">取消</el-button>
								<el-button type="primary" size="small" @click="deletes(scope)">确定</el-button>
							</div>
							<template #reference>
								<el-button size="small" :disabled="allCompiles" text type="primary" @click="visible = false"> 删除</el-button>
							</template>
						</el-popover>

						<!-- <el-button size="small" text type="primary" @click="deletes(scope)"> 删除 </el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<!-- <editDialog ref="editDialogRef" :title="editCollectionOrderInfoTitle" @reloadTable="handleQuery" /> -->
		</el-card>
		<el-dialog v-model="dialogVisible" title="出货说明">
			<el-form label-width="130px">
				<div v-for="el in columns" :key="el.dataIndex">
					<el-form-item v-if="el.title == '备注'" label="说明">
						<el-input type="textarea" v-model="el.values" style="width: 100%" :rows="5" />
					</el-form-item>
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">Cancel</el-button>
					<el-button type="primary" @click="confirmNotes()"> OK </el-button>
				</span>
			</template>
		</el-dialog>
		<editDialog ref="editDialogRef" :title="editCollectionOrderInfoTitle" @reloadTable="getAppPage()" />
	</div>
</template>

<script lang="ts" setup name="cachetable">
import { ref, Ref, onMounted, reactive, computed } from 'vue';
import { service } from '/@/utils/request';
import { get } from 'http';
import { Refresh, Setting, DCaret } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { onBeforeRouteUpdate } from 'vue-router';
import { SysCodeGenConfigApi, SysConstApi, SysDictDataApi, SysDictTypeApi, SysEnumApi } from '/@/api-services/api';
import other from '/@/utils/other.ts';
import { getAPI } from '/@/utils/axios-utils';
import { ExportCollectionGoodsInfoCache } from '/@/api/modular/main/collections.ts';
import editDialog from './component/editDialog.vue';

const editDialogRef = ref();
let tableData: any[] = reactive([]);
const queryParams = ref<any>({});
let dialogFormVisible = ref(false);
let dialogVisible = ref(false);
let v = ref<any>('add');
let visible = ref(false);
let checkAll = ref<any>(true);
const editCollectionOrderInfoTitle = ref('');
let CacheShows = ref<any>(false);
const tagoptions = ref<any>([]);
const cardLoading = ref(false);
const selectedRows = ref([]);
const selectedRowKeys = ref([]);
let tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
let queryList = reactive<any>({
	field: '',
	order: '',
	descStr: '',
	internalUniqueID: '',
	purchaser: '',
	purchaseContractNo: '',
	boxNo: '',
	supplier: '',
	brand: '',
});
let columns = ref<any>([
	{
		title: '标签',
		align: 'center',
		width: 115,
		checked: true,
		dataIndex: 'warnTag',
		values: '',
	},
	{
		title: '内部唯一识别码',
		align: 'center',
		width: 180,
		checked: true,
		dataIndex: 'internalUniqueID',
		values: '',
	},

	{
		title: '采购员',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'purchaser',
		values: '',
	},
	{
		title: '供应商',
		align: 'center',
		width: 220,
		checked: true,
		dataIndex: 'supplier',
		values: '',
	},
	{
		title: '品牌',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'brand',
		values: '',
	},
	{
		title: '产品图',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'productPic',
		//   customRender: (val, row, index) => {
		//     if (row.internalUniqueID) {
		//       var imgsrc = 'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + row.internalUniqueID + '.jpg'
		//       return <img src={imgsrc} style="width:50px" />
		//     }
		//   }
		values: '',
	},
	{
		title: '备注',
		align: 'center',
		width: 110,
		checked: true,
		dataIndex: 'notes',
		values: '',
	},
	{
		title: '报关品名',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'customsName',
		values: '',
	},
	{
		title: '报关要素',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'customsElements',
		values: '',
	},
	{
		title: '内部品名',
		align: 'center',
		width: 180,
		checked: true,
		dataIndex: 'internalProductName',
		values: '',
	},
	{
		title: '英文名称',
		align: 'center',
		width: 180,
		checked: true,
		dataIndex: 'enProductName',
		values: '',
	},
	{
		title: '报关型号',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'customsDeclarationModel',
		values: '',
	},
	{
		title: '颜色',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'color',
		values: '',
	},
	{
		title: '规格',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'specification',
		values: '',
	},
	{
		title: '材质',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'material',
		values: '',
	},
	{
		title: '用途',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'use',
		values: '',
	},
	{
		title: '报关数量',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'plannedShipmentQuantity',
		values: '',
	},
	{
		title: '实际出货数量',
		align: 'center',
		width: 150,
		checked: true,
		dataIndex: 'actualShipmentQuantity',
		values: '',
	},
	{
		title: '集货单位',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'unit',
		values: '',
	},
	{
		title: '报关单位',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'cusUnit',
		values: '',
	},
	{
		title: '补充说明',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'unitInfo',
		values: '',
	},
	{
		title: '装箱个数',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'quantityInBoxes',
		values: '',
	},
	{
		title: '装箱数',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'packBoxesQuantity',
		values: '',
	},
	{
		title: '单个产品净重KG',
		align: 'center',
		width: 170,
		checked: true,
		dataIndex: 'singleProductNetWeightKG',
		values: '',
	},
	{
		title: '产品长(cm)',
		align: 'center',
		width: 130,
		checked: true,
		dataIndex: 'singleProductLength',
		values: '',
	},
	{
		title: '产品宽(cm)',
		align: 'center',
		width: 130,
		checked: true,
		dataIndex: 'singleProductWidth',
		values: '',
	},
	{
		title: '产品高(cm)',
		align: 'center',
		width: 130,
		checked: true,
		dataIndex: 'singleProductHeight',
		values: '',
	},
	{
		title: '整箱毛重KG',
		align: 'center',
		width: 150,
		checked: true,
		dataIndex: 'fclGrossWeightKG',
		values: '',
	},
	{
		title: '箱长(cm)',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'boxLength',
		values: '',
	},
	{
		title: '箱宽(cm)',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'boxWidth',
		values: '',
	},
	{
		title: '箱高(cm)',
		align: 'center',
		width: 120,
		checked: true,
		dataIndex: 'boxHeight',
		values: '',
	},
	{
		title: '总净重KG',
		align: 'center',
		width: 130,
		checked: true,
		dataIndex: 'totalNetWeightKG',
		values: '',
	},
	{
		title: '总毛重KG',
		align: 'center',
		width: 130,
		checked: true,
		dataIndex: 'totalGrossWeightKG',
		values: '',
	},
	{
		title: '总方数（立方米）',
		align: 'center',
		width: 170,
		checked: true,
		dataIndex: 'totalSquaresM3',
		values: '',
	},
	{
		title: '体积重',
		align: 'center',
		width: 100,
		checked: true,
		dataIndex: 'volumeWeight',
		values: '',
	},
	{
		title: '集货采购价含税',
		align: 'center',
		width: 150,
		checked: true,
		dataIndex: 'includingTaxPurchasePrice',
		values: '',
	},
	{
		title: '报关采购价含税',
		align: 'center',
		width: 150,
		checked: true,
		dataIndex: 'cusPurchasePrice',
		values: '',
	},
	{
		title: '采购价含税币种',
		align: 'center',
		width: 160,
		checked: true,
		dataIndex: 'includingTaxPurchasePriceCurrency',
		values: '',
	},
	{
		title: '出口单价（USD）',
		align: 'center',
		width: 170,
		checked: true,
		dataIndex: 'exportUnitPrice',
		values: '',
	},
	{
		title: '出口单价币种',
		align: 'center',
		width: 150,
		checked: true,
		dataIndex: 'exportUnitPriceCurrency',
		values: '',
	},
	{
		title: '商检费（RMB）个',
		align: 'center',
		width: 180,
		checked: true,
		dataIndex: 'commodityInspectionFee',
		values: '',
	},
	{
		title: '商检费币种',
		align: 'center',
		width: 130,
		checked: true,
		dataIndex: 'commodityInspectionFeeCurrency',
		values: '',
	},
	{
		title: 'FOB供货价(AED/SAR)',
		align: 'center',
		width: 210,
		checked: true,
		dataIndex: 'FOBSupplyPrice',
		values: '',
	},
]);
async function getAppPage() {
	var res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('warn_tag');
	tagoptions.value = res.data.result;
	service({
		url: '/api/collectionGoodsInfoCache/page',
		method: 'post',
		data: {
			page: tableParams.value.page,
			pageSize: tableParams.value.pageSize,
			field: queryList.field,
			order: queryList.order,
			descStr: queryList.descStr,
			internalUniqueID: queryList.internalUniqueID,
			purchaser: queryList.purchaser,
			purchaseContractNo: queryList.purchaseContractNo,
			boxNo: queryList.boxNo,
			supplier: queryList.supplier,
			brand: queryList.brand,
		},
	}).then((data) => {
		tableData.splice(0, tableData.length);
		data.data.result.items.forEach((element: any) => {
			if (element.warnTag != null && element.warnTag != '') {
				element.warnTag = element.warnTag.split(',');
			}
			tableData.push(element);
		});

		tableParams.value.page = data.data.result.page;
		tableParams.value.pageSize = data.data.result.pageSize;
		tableParams.value.total = data.data.result.total;
	});
}
//判断标签是否存在于集合中
function IsTag(tag: any) {
	const element = tagoptions.value.find((item) => item.value === tag);
	if (element) {
		return element.code;
	}
	return '#DE2910';
}
//导入
function successfun(data: any, res: any) {
	ElMessage({
		type: 'success',
		message: '上传成功',
	});
}
function errorfun(error: Error, uploadFile: any, uploadFiles: any) {
	ElMessage({
		type: 'error',
		message: '上传失败',
	});
}
//查询
function queryfun(): void {
	getAppPage();
}
//重置
function resetfun(): void {
	(queryList.internalUniqueID = ''), (queryList.purchaser = ''), (queryList.purchaseContractNo = ''), (queryList.boxNo = ''), (queryList.supplier = ''), (queryList.brand = '');
	getAppPage();
}
function OpenAdd() {
	editCollectionOrderInfoTitle.value = '新增集货单商品基础信息';
	editDialogRef.value.openDialog({});
}
function OpenEdit(row: any) {
	editCollectionOrderInfoTitle.value = '编辑集货单商品基础信息';
	editDialogRef.value.openDialog(row);
}
// 编辑
function examines(val?: any): void {
	dialogFormVisible.value = !dialogFormVisible.value;

	if (val) {
		v.value = 'edit';
		columns.value.forEach((element: any) => {
			element.values = val.row[element.dataIndex];
		});
		if (JSON.stringify(columns.value).indexOf(val.row['id']) == -1) {
			columns.value.push({ dataIndex: 'id', values: val.row['id'] });
		}
	} else {
		v.value = 'add';
		columns.value.forEach((element: any) => {
			element.values = '';
		});
	}
}
//出货说明
function OpenNotes(val?: any): void {
	dialogVisible.value = !dialogVisible.value;
	if (val) {
		columns.value.forEach((element: any) => {
			element.values = val.row[element.dataIndex];
		});
		if (JSON.stringify(columns.value).indexOf(val.row['id']) == -1) {
			columns.value.push({ dataIndex: 'id', values: val.row['id'] });
		}
	} else {
		columns.value.forEach((element: any) => {
			element.values = '';
		});
	}
}

// 删除
function deletes(val: any) {
	visible.value = !visible.value;

	service({
		url: '/api/collectionGoodsInfoCache/delete',
		method: 'post',
		data: {
			id: val.row.id,
		},
	}).then((data) => {
		if (data.data.type == 'success') {
			ElMessage({
				type: 'success',
				message: '删除成功',
			});
			getAppPage();
		} else {
			ElMessage({
				type: 'info',
				message: '删除失败',
			});
		}
	});
}

function confirmNotes() {
	let atv: any = {};
	columns.value.forEach((element: any) => {
		atv[element.dataIndex] = element.values;
	});
	service({
		url: '/api/collectionGoodsInfoCache/update',
		method: 'post',
		data: atv,
	}).then((data) => {
		if (data.data.type == 'success') {
			ElMessage({
				type: 'success',
				message: '更新成功',
			});
			dialogVisible.value = !dialogVisible.value;
			getAppPage();
		} else {
			ElMessage({
				type: 'info',
				message: '更新失败',
			});
		}
	});
}
onMounted(() => {
	getAppPage();
});
function CacheReset() {
	columns.value.forEach((element: any) => {
		element.checked = false;
	});
	checkAll.value = false;
}
function CacheOnChange(v: any) {
	checkAll.value = !columns.value.some((elemant: any) => {
		return elemant.checked == false;
	});
}
function onCheckAllChange() {
	if (checkAll.value) {
		columns.value.forEach((element: any) => {
			element.checked = true;
		});
	} else {
		columns.value.forEach((element: any) => {
			element.checked = false;
		});
	}
}
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getAppPage();
};
//排序
function sortfun(v: any) {
	queryList.order = v.order;
	queryList.field = v.prop;
	getAppPage();
}
// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	getAppPage();
};
const loading1 = ref(false);
//文件上传
function Imports(data: any) {
	loading1.value = true;
	const formData = new FormData();
	formData.append('file', data.file);
	service({
		url: '/api/collectionGoodsInfoCache/import',
		method: 'post',
		data: formData,
	}).then((data) => {});
}

//底色
function customCellStyle({ row, column, rowIndex, columnIndex }) {
	if (row.warnTag != null && row.warnTag != '') {
		return { backgroundColor: '#FEF0F0' };
	}
	// 返回一个包含自定义样式的对象
	return null;
}

const selectChange = (selection: any) => {
	selectedRowKeys.value = [];
	selectedRows.value = [];
	selectedRows.value = selection;
	selection.map((item: any) => {
		selectedRowKeys.value.push(item.id);
	});
};
// 导出选中
const SelectedExport = async () => {
	cardLoading.value = true;
	await ExportCollectionGoodsInfoCache(Object.assign({ type: 0, idList: selectedRowKeys.value }, queryList, tableParams.value)).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
	});
};
// 导出所有
const AllExport = async () => {
	cardLoading.value = true;
	await ExportCollectionGoodsInfoCache(
		Object.assign({
			type: 1,
			internalUniqueID: queryList.internalUniqueID,
			purchaser: queryList.purchaser,
			purchaseContractNo: queryList.purchaseContractNo,
			boxNo: queryList.boxNo,
			supplier: queryList.supplier,
			brand: queryList.brand,
		})
	).then((res) => {
		cardLoading.value = false;
		other.downloadfile(res);
		selectedRows.value = [];
	});
};
</script>
<style lang="less" scoped>
.settingf {
	position: relative;

	.setting {
		position: absolute;
		right: 0;
	}
}

:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}
</style>
