<template>
	<div>
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryForm" ref="ruleFormRef" :rules="rules" :inline="true">
				<el-row>
					<el-col>
						<el-form-item label="ASIN" label-width="80" prop="asin">
							<el-input v-model="queryForm.asin" clearable="" placeholder="Please enter ASIN" />
						</el-form-item>
						<el-form-item label="ErpSku" label-width="80" prop="erpSku">
							<el-input v-model="queryForm.erpSku" clearable="" placeholder="Please enter ErpSku" />
						</el-form-item>
						<el-form-item label="SingleOrderQTY" label-width="80" prop="singleOrderQTY">
							<el-input v-model="queryForm.singleOrderQTY" clearable=""
								placeholder="Please enter SingleOrderQTY" />
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="Brand" label-width="80">
							<el-input v-model="queryForm.Brand" clearable="" placeholder="Please enter Brand" />
						</el-form-item>
						<el-form-item label="EAN-13" label-width="80" prop="EAN">
							<el-input v-model="queryForm.EAN" clearable="" placeholder="Please enter EAN-13" />
						</el-form-item>
						<el-form-item label="Creator" label-width="80">
							<el-input v-model="queryForm.Creator" clearable="" placeholder="Please enter Creator" />
						</el-form-item>
					</el-col>

				</el-row>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv">
				<div style="left: left;display: inline;">
					<el-button type="primary" @click="Previous" style="height: 28px;font-size: 14px;">Back</el-button>
				</div>
				<div style="float: right;margin-right: 50px;">
					<el-button type="primary" icon="ele-Refresh" :loading="loading" @click="Reset"
						style="height: 28px;font-size: 14px;">Reset</el-button>
					<el-button type="primary" icon="ele-Document" :loading="loading" @click="Saves(ruleFormRef)"
						style="height: 28px;font-size: 14px;">SAVE</el-button>
				</div>
			</div>
			<el-table ref="scrollContainer" :data="tableData" size="lagre" style="width: 100%" tooltip-effect="light"
				row-key="id" border="">
				<el-table-column type="selection" width="40" class="selection" />
				<el-table-column prop="storeSKU" label="StoreSKU" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<el-input class="custom-input" :class="{ 'sku-input': scope.row.IsSku }" type="text"
							v-model="scope.row.storeSKU" clearable="" @input="handleInpu" />
					</template>
				</el-table-column>
				<el-table-column prop="addASINAccount" label="Platform" align="center" show-overflow-tooltip="">
					<template #default="scope">
						<el-select class="custom-input" v-model="scope.row.addASINAccount" @change="handleInpu"
							placeholder="Please select" clearable>
							<el-option label="UAE Only" value="UAE Only"></el-option>
							<el-option label="SA Only" value="SA Only"></el-option>
							<el-option label="SC Only" value="SC Only"></el-option>
							<el-option label="Above All" value="Above All"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="Operation" width="160" align="center" fixed="right" show-overflow-tooltip="">
					<template #default="scope">
						<el-button v-if="!IsLast(scope.row)" icon="ele-DocumentCopy" size="small" text="" type="primary"
							@click="CopyAdd(scope.row)">
							COPE </el-button>
						<el-button v-if="!IsLast(scope.row)" icon="ele-Delete" size="small" text="" type="primary"
							@click="remove(scope.row)">
							DELETE </el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import router from '/@/router';
import { ElMessage, FormRules, FormInstance } from 'element-plus';
import { Save } from '/@/api/modular/main/SAINListingTable';
import { ASINListingTableStore } from '/@/stores/ASINListingTable';
import { useRoute } from 'vue-router'
const route = useRoute();
const store = ASINListingTableStore();
const tableData = ref<any>([]);
const IsSAVE = ref<any>(false);
const IsBack = ref<any>(false);
let Id = ref<any>(1);
let loading = ref<any>(false);
let selectedRows = ref<any>([]);
let SubmitData = ref<any>([]);
const ruleFormRef = ref<FormInstance>();
let queryForm = ref<any>({
	asin: "",
	erpSku: "",
	singleOrderQTY: "",
	Brand: "",
	EAN: "",
	Creator: ""
});
if (!store.IsClear) {
	queryForm.value = store.queryForm;
	tableData.value = store.tableData;
} else {
	tableData.value.push({
		id: Id.value++,
		asin: "",
		storeSKU: "",
		erpSku: "",
		singleOrderQTY: "",
		brand: "",
		ean: "",
		addASINAccount: "",
		creator: "",
	});
	store.$patch({ IsClear: false });
}

watch(() => route.path, () => {//监听路由是否跳转
	store.$patch({ queryForm: queryForm.value });
	store.$patch({ tableData: tableData.value });
}
);
//选中的数据
function handleSelectionChange(val: any) {

	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}
function IsLast(row: any) {
	const selectedIndex = tableData.value.findIndex(item => item.id === row.id);
	if (selectedIndex === tableData.value.length - 1) {
		return true;
	}
	return false;
}
function handleInpu() {
	if (tableData.value[tableData.value.length - 1].storeSKU !== "" || tableData.value[tableData.value.length - 1].addASINAccount !== "") {
		tableData.value.push({
			id: Id.value++,
			asin: "",
			storeSKU: "",
			erpSku: "",
			singleOrderQTY: "",
			brand: "",
			ean: "",
			addASINAccount: "",
			creator: "",
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
	const selectedIndex = tableData.value.findIndex(item => item.id === row.id);
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
const rules = ref<FormRules<typeof queryForm>>({
	asin: [{ required: true, message: 'Please enter 10 digit letters or numbers without spaces', trigger: 'blur' },
	{ min: 10, max: 10, message: 'Please enter 10 digit letters or numbers without spaces', trigger: 'blur' }],
	erpSku: [{ required: true, message: 'ErpSku cannot be empty', trigger: 'blur' }],
	singleOrderQTY: [{ required: true, message: 'SingleOrderQTY cannot be empty', trigger: 'blur' }],
	EAN: [{ required: true, message: 'EAN-13 cannot be empty', trigger: 'blur' }],
});
const scrollContainer = ref();
function CopyAdd(row: any) {
	if (tableData.value[tableData.value.length - 1].storeSKU == "" && tableData.value[tableData.value.length - 1].addASINAccount == "") {
		const selectedIndex = tableData.value.findIndex(item => item.id === tableData.value[tableData.value.length - 1].id);
		tableData.value.splice(selectedIndex, 1);
	}
	tableData.value.push({
		id: Id.value++,
		asin: "",
		storeSKU: row.storeSKU,
		erpSku: "",
		singleOrderQTY: "",
		brand: "",
		ean: "",
		addASINAccount: "",
		creator: "",
	});
	tableData.value.push({
		id: Id.value++,
		asin: "",
		storeSKU: "",
		erpSku: "",
		singleOrderQTY: "",
		brand: "",
		ean: "",
		addASINAccount: "",
		creator: "",
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
		asin: "",
		erpSku: "",
		singleOrderQTY: "",
		Brand: "",
		EAN: "",
		Creator: ""
	};
	tableData.value = [{
		id: Id.value++,
		asin: "",
		storeSKU: "",
		erpSku: "",
		singleOrderQTY: "",
		brand: "",
		ean: "",
		addASINAccount: "",
		creator: "",
	}];
}
const Saves = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			SubmitData.value = [];
			var IsSku = true;
			for (var i = 0; i < tableData.value.length - 1; i++) {
				if (tableData.value[i].storeSKU == '') {
					tableData.value[i].IsSku = true;
					IsSku = false;
					continue;
				}
				SubmitData.value.push({
					id: tableData.value[i].id,
					asin: queryForm.value.asin,
					erpSKU: queryForm.value.erpSku,
					singleOrderQTY: queryForm.value.singleOrderQTY,
					brand: queryForm.value.Brand,
					ean: queryForm.value.EAN,
					creator: queryForm.value.Creator,
					storeSKU: tableData.value[i].storeSKU,
					addASINAccount: tableData.value[i].addASINAccount
				});
				tableData.value[i].IsSku = false;
			}
			if (IsSku) {
				loading.value = true;
				Save(SubmitData.value)
					.then((res: any) => {
						ElMessage.success('Successfully saved');
						loading.value = false;
						IsSAVE.value = true;
					})
					.error((res: any) => {
						loading.value = false;
					})
			} else {
				return false
			}
		}
	})
}


function Previous() {
	IsBack.value = true;
	if (IsSAVE.value) {
		Reset();
	}
	router.push({ path: '/business/BasicDataManagement/ASINListingTableUAE' });
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
		box-shadow: 0 0 0 1px #DE2910 inset;
	}
}

:deep(.el-form-item__content) {
	width: 300px;
}
</style>