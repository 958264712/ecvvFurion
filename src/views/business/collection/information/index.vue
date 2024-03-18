<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryList" :inline="true">
				<el-form-item label="货代名称">
					<el-select v-model="queryList.forwarderName" filterable clearable>
						<el-option v-for="item in tableData" :key="item.forwarderName" :label="item.forwarderName"
							:value="item.forwarderName" />
					</el-select>
				</el-form-item>
				<el-form-item label="收件人">
					<el-input v-model="queryList.recipientName" clearable="" placeholder="请输入收件人" />
				</el-form-item>
				<el-form-item label="收件联系电话">
					<el-input v-model="queryList.recipientPhone" clearable="" placeholder="请输入收件联系电话" />
				</el-form-item>
				<el-form-item label="交仓地址">
					<el-input v-model="queryList.deliveryAddress" clearable="" placeholder="请输入交仓地址" />
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="queryList.notes" clearable="" placeholder="请输入备注" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="queryfun()"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun()"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<el-form-item class="settingf">
				<el-button type="primary" icon="ele-Plus" @click="examines()" style="margin-right: 20px"> 新增货代基础信息表
				</el-button>
				<div class="setting">
					<el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom-end">
						<el-button type="primary" :icon="Refresh" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="密度" placement="bottom-end">
						<el-button type="primary" :icon="DCaret" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="列设置" placement="bottom-end">
						<el-button type="primary" @click="ColumnSettingsShows = !ColumnSettingsShows" :icon="Setting" />
					</el-tooltip>
					<div v-if="ColumnSettingsShows" class="s-tool-column-header s-tool-column-item" style="
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
						">
						<div style="padding: 0px 10px">
							<el-checkbox v-model="checkAll" @change="onCheckAllChange"> 列展示 </el-checkbox>
							<el-button style="margin: -6px 0 0 70px" @click="ForwarderReset" type="primary"
								link>重置</el-button>
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

											<el-checkbox v-model="element.sorter"
												@change="ForwarderOnChange(element)">{{ element.title }}</el-checkbox>
										</div>
									</template>
								</draggable>
							</div>
						</div>
					</div>
				</div>
			</el-form-item>

			<el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light"
				@sort-change="sortfun">
				<el-table-column type="selection" width="55" />
				<template v-for="(item, index) in columns" :key="index">
					<el-table-column v-if="index !== columns.length - 1 && item.sorter === true" :prop="item.dataIndex"
						:label="item.title" :align="item.align" :width="item.width" sortable="custom" />
					<el-table-column v-if="index === columns.length - 1 && item.sorter === true" label="操作" align="center">
						<template #default="scope">
							<el-button size="small" text type="primary" @click="examines(scope)"> 编辑 </el-button>

							<el-popover placement="top" width="200" :disabled="visible" trigger="click">
								<p>确定删除吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="small" type="text" @click="
										visible = true;
									">取消</el-button>
									<el-button type="primary" size="small" @click="deletes(scope)">确定</el-button>
								</div>
								<template #reference>
									<el-button size="small" :disabled="allCompiles" text type="primary"
										@click="visible = false"> 删除</el-button>
								</template>
							</el-popover>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
			<editDialog ref="editDialogRef" :title="editCollectionOrderInfoTitle" @reloadTable="handleQuery" />
		</el-card>
		<el-dialog v-model="dialogFormVisible" title="新增货代基础信息表">
			<el-form label-width="120px">
				<el-form-item label="货代名称" :label-width="formLabelWidth" style="width: 80%;margin: 30px auto; ">
					<el-input v-model="addqueryList.forwarderName" />
				</el-form-item>
				<el-form-item label="收件人" :label-width="formLabelWidth" style="width: 80%;margin: 30px auto; ">
					<el-input v-model="addqueryList.recipientName" />
				</el-form-item>
				<el-form-item label="收件联系电话" :label-width="formLabelWidth" style="width: 80%;margin: 30px auto; ">
					<el-input v-model="addqueryList.recipientPhone" />
				</el-form-item>
				<el-form-item label="交仓地址" :label-width="formLabelWidth" style="width: 80%;margin: 30px auto; ">
					<el-input v-model="addqueryList.deliveryAddress" />
				</el-form-item>
				<el-form-item label="备注" :label-width="formLabelWidth" style="width: 80%;margin: 30px auto; ">
					<el-input v-model="addqueryList.notes" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogFormVisible = false">Cancel</el-button>
					<el-button type="primary" @click="confirm()"> OK </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>


<script lang="ts" setup name="basicinformation">
import { ref, Ref, onMounted, reactive, computed } from 'vue';
import { service } from '/@/utils/request';
import { Refresh, Setting, DCaret } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { onBeforeRouteUpdate } from 'vue-router';
let tableData: any[] = reactive([]);
const queryParams = ref<any>({});
let dialogFormVisible = ref(false);
let visible = ref(false);
let ColumnSettingsShows = ref<any>(false);
let checkAll = ref<any>(true);
let v = ref<any>('add');
let tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
});
let queryList = reactive<any>({
	field: '',
	order: '',
	descStr: '',
	forwarderName: '',
	shippingMethod: '',
	recipientName: '',
	recipientPhone: '',
	deliveryAddress: '',
	notes: '',
});
let addqueryList = ref<any>({
	id: '',
	forwarderName: '',
	recipientName: '',
	recipientPhone: '',
	shippingMethod: '',
	deliveryAddress: '',
	notes: '',
});
let columns = ref<any>([
	{
		title: '货代名称',
		align: 'center',
		sorter: true,
		width: 100,
		dataIndex: 'forwarderName'
	},
	{
		title: '收件人',
		align: 'center',
		sorter: true,
		dataIndex: 'recipientName'
	},
	{
		title: '收件联系电话',
		align: 'center',
		sorter: true,
		width: 120,
		dataIndex: 'recipientPhone'
	},
	{
		title: '交仓地址',
		align: 'center',
		sorter: true,
		dataIndex: 'deliveryAddress'
	},
	{
		title: '备注',
		align: 'center',
		sorter: true,
		dataIndex: 'notes'
	},
	{
		title: '操作',
		align: 'center',
		width: 150,
		sorter: true,
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
]);
function getAppPage() {
	service({
		url: '/api/collectionForwarderBaseInfo/page',
		method: 'post',
		data: {
			page: tableParams.value.page,
			pageSize: tableParams.value.pageSize,
			field: queryList.field,
			order: queryList.order,
			descStr: queryList.descStr,
			forwarderName: queryList.forwarderName,
			shippingMethod: queryList.shippingMethod,
			recipientName: queryList.recipientName,
			recipientPhone: queryList.recipientPhone,
			deliveryAddress: queryList.deliveryAddress,
		},
	}).then((data) => {
		tableData.splice(0, tableData.length);
		data.data.result.items.forEach((element: any) => {
			tableData.push(element);
		});
		tableParams.value.page = data.data.result.page;
		tableParams.value.pageSize = data.data.result.pageSize;
		tableParams.value.total = data.data.result.total;
	});
}

//查询
function queryfun(): void {
	getAppPage();
}
//重置
function resetfun(): void {
	(queryList.forwarderName = ''), (queryList.recipientName = ''), (queryList.recipientPhone = ''), (queryList.deliveryAddress = ''), (queryList.notes = '');
	getAppPage();
}

// 编辑
function examines(val?: any): void {
	dialogFormVisible.value = !dialogFormVisible.value;
	if (val) {
		v.value = 'edit';
		addqueryList.value.forwarderName = val.row.forwarderName;
		addqueryList.value.id = val.row.id;
		addqueryList.value.recipientName = val.row.recipientName;
		addqueryList.value.recipientPhone = val.row.recipientPhone;
		addqueryList.value.deliveryAddress = val.row.deliveryAddress;
		addqueryList.value.notes = val.row.notes;
	} else {
		v.value = 'add';
		addqueryList.value.forwarderName = '';
		addqueryList.value.id = '';
		addqueryList.value.recipientName = '';
		addqueryList.value.recipientPhone = '';
		addqueryList.value.deliveryAddress = '';
		addqueryList.value.notes = '';
	}
}
//排序
function sortfun(v: any) {
	queryList.order = v.order
	queryList.field = v.prop
	getAppPage()
}
// 删除
function deletes(val: any) {
	visible.value = !visible.value

	service({
		url: '/api/collectionForwarderBaseInfo/delete',
		method: 'post',
		data: {
			"id": val.row.id
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
function confirm() {
	if (v.value == "add") {
		service({
			url: '/api/collectionForwarderBaseInfo/add',
			method: 'post',
			data: {
				forwarderName: addqueryList.value.forwarderName,
				recipientName: addqueryList.value.recipientName,
				recipientPhone: addqueryList.value.recipientPhone,
				deliveryAddress: addqueryList.value.deliveryAddress,
				notes: addqueryList.value.notes,
			},
		}).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '添加成功',
				});
				dialogFormVisible.value = !dialogFormVisible.value;
				getAppPage();
			} else {
				ElMessage({
					type: 'info',
					message: '添加失败',
				});
			}
		});
	} else {
		service({
			url: '/api/collectionForwarderBaseInfo/update',
			method: 'post',
			data: addqueryList.value,
		}).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '修改成功',
				});
				dialogFormVisible.value = !dialogFormVisible.value;
				getAppPage();
			} else {
				ElMessage({
					type: 'info',
					message: '修改失败',
				});
			}
		});
	}
}
function onCheckAllChange() {
	if (checkAll.value) {
		columns.value.forEach((element: any) => {
			element.sorter = true;
		});
	} else {
		columns.value.forEach((element: any) => {
			element.sorter = false;
		});
	}
}
function ForwarderReset() {
	checkAll.value = false;
	columns.value.forEach((element: any) => {
		element.sorter = false;
	});
	console.log(columns);
}
function ForwarderOnChange(v: any) {
	checkAll.value = !columns.value.some((elemant: any) => {
		return elemant.checked == false;
	});
}
onMounted(() => {
	getAppPage();
});

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getAppPage();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	getAppPage();
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
</style>