<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryForm" ref="ruleFormRef" :inline="true" :rules="rules">
				<el-row>
					<el-col>
						<el-form-item label="ASIN" label-width="80" prop="asin">
							<el-input v-model="queryForm.asin" clearable=""
								:placeholder="area == 'CN' ? '请输入ASIN' : 'Please enter ASIN'" />
						</el-form-item>
						<el-form-item label="ErpSku" label-width="80" prop="erpSku">
							<el-input v-model="queryForm.erpSku" clearable=""
								:placeholder="area == 'CN' ? '请输入ErpSku' : 'Please enter ErpSku'" />
						</el-form-item>
						<el-form-item label="SingleOrderQTY" label-width="80" prop="singleOrderQTY">
							<el-input v-model="queryForm.singleOrderQTY" clearable=""
								:placeholder="area == 'CN' ? '请输入SingleOrderQTY' : 'Please enter SingleOrderQTY'" />
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="Brand" label-width="80">
							<el-input v-model="queryForm.Brand" clearable=""
								:placeholder="area == 'CN' ? '请输入Brand' : 'Please enter Brand'" />
						</el-form-item>
						<el-form-item label="EAN-13" label-width="80" prop="EAN">
							<el-input v-model="queryForm.EAN" clearable=""
								:placeholder="area == 'CN' ? '请输入EAN-13' : 'Please enter EAN-13'" />
						</el-form-item>
						<el-form-item label="Creator" label-width="80">
							<el-input v-model="queryForm.Creator" clearable=""
								:placeholder="area == 'CN' ? '请输入Creator' : 'Please enter Creator'" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv">
				<div style="left: left; display: inline">
					<el-button type="primary" @click="Previous"
						style="height: 28px; font-size: 14px">{{ area == 'CN' ? '返回' : 'Back' }}</el-button>
				</div>
				<div style="float: right; margin-right: 50px">
					<el-button type="primary" icon="ele-Refresh" :loading="loading" @click="Reset"
						style="height: 28px; font-size: 14px">{{ area == 'CN' ? '重置' : 'Reset' }}</el-button>
					<el-button type="primary" icon="ele-Document" :loading="loading" @click="Saves(ruleFormRef)"
						style="height: 28px; font-size: 14px">{{ area == 'CN' ? '保存' : 'SAVE' }}</el-button>
				</div>
			</div>
			<el-table ref="scrollContainer" :data="tableData" size="lagre" style="width: 100%" tooltip-effect="light"
				row-key="id" border="">
				<el-table-column type="selection" width="40" class="selection" />
				<el-table-column prop="storeSKU" :label="area == 'CN' ? '店铺SKU' : 'StoreSKU'" align="center"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-input class="custom-input" :class="{ 'sku-input': scope.row.IsSku }" type="text"
							v-model="scope.row.storeSKU" clearable="" @input="handleInpu" />
					</template>
				</el-table-column>
				<el-table-column prop="addASINAccount" :label="area == 'CN' ? '上架平台' : 'Platform'" align="center"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-select class="custom-input" :class="{ 'sku-input': scope.row.IsSku1 }"
							v-model="scope.row.addASINAccount" @change="handleInpu"
							:placeholder="area == 'CN' ? '请选择' : 'Please select'" clearable>
							<el-option label="UAE-SC " value="UAE-SC "></el-option>
							<el-option label="UAE-SHOWAY " value="UAE-SHOWAY "></el-option>
							<el-option label="SA-DDP AE" value="SA-DDP AE"></el-option>
							<el-option label="Above All" value="Above All"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column :label="area == 'CN' ? '操作' : 'Operation'" width="160" align="center" fixed="right"
					show-overflow-tooltip="">
					<template #default="scope">
						<el-button v-if="!IsLast(scope.row)" icon="ele-DocumentCopy" size="small" text="" type="primary"
							@click="CopyAdd(scope.row)"> {{ area == 'CN' ? '复制' : 'COPE' }} </el-button>
						<el-button v-if="!IsLast(scope.row)" icon="ele-Delete" size="small" text="" type="primary"
							@click="remove(scope.row)"> {{ area == 'CN' ? '删除' : 'DELETE' }} </el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="ASINListingTableCNAdd">
import { ref, reactive, watch, onMounted } from 'vue';
import router from '/@/router';
import { ElMessage, FormRules, FormInstance } from 'element-plus';
import { Save } from '/@/api/modular/main/SAINListingTable';
import { ASINListingTableStore } from '/@/stores/ASINListingTable';
import { useRoute } from 'vue-router';
import { error } from 'console';
const route = useRoute();
const store = ASINListingTableStore();
const tableData = ref<any>([]);
let Id = ref<any>(1);
let loading = ref<any>(false);
let selectedRows = ref<any>([]);
const IsSAVE = ref<any>(false);
const IsBack = ref<any>(false);
let SubmitData = ref<any>([]);
const ruleFormRef = ref<FormInstance>();
const area = ref<any>(route.query.area);
let queryForm = ref<any>({
	asin: '',
	erpSku: '',
	singleOrderQTY: '',
	Brand: '',
	EAN: '',
	Creator: '',
});
onMounted(() => {
	if (store.IsClear) {
		queryForm.value = store.queryForm;
		tableData.value = store.tableData;
	} else {
		tableData.value.push({
			id: 1,
			asin: '',
			storeSKU: '',
			erpSku: '',
			singleOrderQTY: '',
			brand: '',
			ean: '',
			addASINAccount: '',
			creator: '',
		});
		store.$patch({ IsClear: true });
	}
});

watch(
	() => route.path,
	() => {
		//监听路由是否跳转
		store.$patch({ queryForm: queryForm.value });
		store.$patch({ tableData: tableData.value });
	}
);
// // 规则
// const validateASIN = (rule: any, value: any, callback: any) => {
// 	const reg = /^[A-Za-z0-9]{10}$/;
// 	if (reg.test(queryForm.value.asin)) {
// 		if (!ruleFormRef.value) return;
// 		ruleFormRef.value.validateField('asin', () => null);
// 		ElMessage.error('请输入10位数的字母或者数字，并且不包含空格');
// 	}
// };
//自行添加其他规则
const validateNumber = (rule, value, callback) => {
	if (!value) {
		return callback(new Error('SingleOrderQTY不能为空'));
	}
	if (isNaN(value)) {
		return callback(new Error('SingleOrderQTY只能输入数字'));
	}
	callback();
};
const rules = ref<FormRules<typeof queryForm>>({
	asin: [
		{ required: true, message: area.value == 'CN' ? '请输入10位数的字母或者数字，并且不包含空格' : 'Please enter 10 digit letters or numbers without spaces', trigger: 'blur' },
		{ min: 10, max: 10, message: area.value == 'CN' ? '请输入10位数的字母或者数字，并且不包含空格' : 'Please enter 10 digit letters or numbers without spaces', trigger: 'blur' },
	],
	erpSku: [{ required: true, message: area.value == 'CN' ? 'erpSku不能为空' : 'ErpSku cannot be empty', trigger: 'blur' }],
	singleOrderQTY: [{ validator: validateNumber, trigger: 'blur' }],
	// EAN: [{ required: true, message: area.value == 'CN' ? 'EAN- 13不能为空' : 'EAN-13 cannot be empty', trigger: 'blur' }],
});
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}
function IsLast(row: any) {
	const selectedIndex = tableData.value.findIndex((item) => item.id === row.id);
	if (selectedIndex === tableData.value.length - 1) {
		return true;
	}
	return false;
}
function handleInpu() {
	let index = tableData.value?.length === 0 ? 0 : tableData.value.length - 1;
	if (tableData.value[index].storeSKU !== '' && tableData.value[index].addASINAccount !== '') {
		tableData.value.push({
			id: Id.value++,
			asin: '',
			storeSKU: '',
			erpSku: '',
			singleOrderQTY: '',
			brand: '',
			ean: '',
			addASINAccount: '',
			creator: '',
		});
		setTimeout(() => {
			let table = scrollContainer.value.layout.table.refs;
			// 获取表格滚动元素
			let tableScrollEle = table.bodyWrapper.firstElementChild.firstElementChild;
			// 设置表格滚动的位置
			tableScrollEle.scrollTop = tableScrollEle.clientHeight;
		}, 100);
	}
}
function remove(row: any) {
	const selectedIndex = tableData.value.findIndex((item) => item.id === row.id);
	tableData.value.splice(selectedIndex, 1);
	// // 遍历选中状态数组，移除对应选中的元素
	// for (let i = selectedRows.value.length - 1; i >= 0; i--) {
	// 	if (selectedRows.value[i]) {
	// 		// 找到选中元素的索引，并在 tableData 中移除对应元素
	// 		const selectedId = selectedRows.value[i];
	// 		const selectedIndex = tableData.value.findIndex(item => item.id === selectedId);
	// 		if (selectedIndex !== -1) {
	// 			tableData.value.splice(selectedIndex, 1);
	// 			selectedRows.value.splice(i, 1);
	// 		}
	// 	}
	// }
}
const scrollContainer = ref();
function CopyAdd(row: any) {
	if (tableData.value[tableData.value.length - 1].storeSKU == '' && tableData.value[tableData.value.length - 1].addASINAccount == '') {
		const selectedIndex = tableData.value.findIndex((item) => item.id === tableData.value[tableData.value.length - 1].id);
		tableData.value.splice(selectedIndex, 1);
	}
	tableData.value.push({
		id: Id.value++,
		asin: '',
		storeSKU: row.storeSKU,
		erpSku: '',
		singleOrderQTY: '',
		brand: '',
		ean: '',
		addASINAccount: '',
		creator: '',
	});
	tableData.value.push({
		id: Id.value++,
		asin: '',
		storeSKU: '',
		erpSku: '',
		singleOrderQTY: '',
		brand: '',
		ean: '',
		addASINAccount: '',
		creator: '',
	});
	setTimeout(() => {
		let table = scrollContainer.value.layout.table.refs;
		// 获取表格滚动元素
		let tableScrollEle = table.bodyWrapper.firstElementChild.firstElementChild;
		// 设置表格滚动的位置
		tableScrollEle.scrollTop = tableScrollEle.clientHeight;
	}, 100);
}
function Reset() {
	queryForm.value = {
		asin: '',
		erpSku: '',
		singleOrderQTY: '',
		Brand: '',
		EAN: '',
		Creator: '',
	};
	tableData.value = [
		{
			id: Id.value++,
			asin: '',
			storeSKU: '',
			erpSku: '',
			singleOrderQTY: '',
			brand: '',
			ean: '',
			addASINAccount: '',
			creator: '',
		},
	];
}

const Saves = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			SubmitData.value = [];
			var IsSku = true;
			var IsSku1 = true;
			if (tableData.value.length == 1) {
				if (tableData.value[0].storeSKU === '') {
					tableData.value[0].IsSku = true;
					ElMessage.error(area.value == 'CN' ? '店铺SKU不能为空' : 'The Store SKU cannot be empty');
				}
				if (tableData.value[0].addASINAccount === '') {
					tableData.value[0].IsSku1 = true;
					ElMessage.error(area.value == 'CN' ? '上架平台不能为空' : 'The platform cannot be empty');
				}
				return false;
			}
			for (var i = 0; i < tableData.value.length - 1; i++) {
				if (tableData.value[i].storeSKU == '' || tableData.value[i].addASINAccount == '') {
					if (tableData.value[i].storeSKU === '') {
						tableData.value[i].IsSku = true;
						IsSku = false;
						ElMessage.error(area.value == 'CN' ? '店铺SKU不能为空' : 'The Store SKU cannot be empty');
					}
					if (tableData.value[i].addASINAccount === '') {
						tableData.value[i].IsSku1 = true;
						IsSku1 = false;
						ElMessage.error(area.value == 'CN' ? '上架平台不能为空' : 'The platform cannot be empty');
					}
					continue;
				}
				SubmitData.value.push({
					id: tableData.value[i].id,
					Site: area.value,
					asin: queryForm.value.asin,
					erpSKU: queryForm.value.erpSku,
					singleOrderQTY: queryForm.value.singleOrderQTY,
					brand: queryForm.value.Brand,
					ean: queryForm.value.EAN,
					creator: queryForm.value.Creator,
					storeSKU: tableData.value[i].storeSKU,
					addASINAccount: tableData.value[i].addASINAccount,
				});
				tableData.value[i].IsSku = false;
			}
			if (IsSku && IsSku1 && SubmitData.value.length > 0) {
				loading.value = true;
				Save(SubmitData.value)
					.then((res: any) => {
						console.log(res);
						if (res.data.result < 0) {
							ElMessage.success(area.value == 'CN' ? '保存成功' : 'success');
							loading.value = false;
							Reset();
						} else {
							tableData.value.find((obj: any) => obj.id === res.data.result).IsSku = true;
							ElMessage.error(area.value == 'CN' ? '该数据已存在' : 'Change data already exists');
							loading.value = false;
						}
					})
					.error((res: any) => {
						loading.value = false;
					});
			} else {
				return false;
			}
		}
	});
};

function Previous() {
	IsBack.value = true;
	if (IsSAVE.value) {
		Reset();
	}
	router.push({ path: '/business/basicdatamanagement/asinlistingtable' });
}
</script>
<style lang="less" scoped>
:deep(.el-tooltip) {
	padding: 0;
}

.custom-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
	}
}

.sku-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 1px #de2910 inset;
	}
}

:deep(.el-form-item__content) {
	width: 300px;
}
</style>
