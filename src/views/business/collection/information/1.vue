<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryList" :inline="true">
				<el-form-item label="货代名称">
					<el-select v-model="queryList.forwarderName" filterable clearable>
						<el-option v-for="item in tableData" :key="item.forwarderName" :label="item.forwarderName" :value="item.forwarderName" />
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
				<el-button type="primary" icon="ele-Plus" @click="examines()" v-auth="'sysMenu:add'" style="margin-right: 20px"> 新增集货单信息 </el-button>
				<div class="setting">
					<el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom-end">
						<el-button type="primary" :icon="Refresh" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="密度" placement="bottom-end">
						<el-button type="primary" :icon="DCaret" />
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" content="列设置" placement="bottom-end">
						<el-button type="primary" :icon="Setting" />
					</el-tooltip>
				</div>
			</el-form-item>

			<el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light" @sort-change="sortfun">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="forwarderName" label="货代名称" align="center" width="150"  sortable="custom"/>
				<el-table-column prop="recipientName" label="收件人" align="center" sortable="custom" />
				<el-table-column prop="recipientPhone" label="收件联系电话" align="center" sortable="custom"/>
				<el-table-column prop="deliveryAddress" label="交仓地址" align="center" sortable="custom" />
				<el-table-column prop="notes" label="备注" align="center" sortable="custom" />
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="examines(scope)"> 编辑 </el-button>

						<el-popover placement="top" width="200" :disabled="visible" trigger="click">
							<p>确定删除吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button
									size="small"
									type="text"
									@click="
										visible = true;
									"
									>取消</el-button
								>
								<el-button type="primary" size="small" @click="deletes(scope)">确定</el-button>
							</div>
							<template #reference>
								<el-button size="small" :disabled="allCompiles" text type="primary" @click="visible = false"> 删除</el-button>
							</template>
						</el-popover>
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
			<editDialog ref="editDialogRef" :title="editCollectionOrderInfoTitle" @reloadTable="handleQuery" />
		</el-card>
	</div>
	<el-dialog v-model="dialogFormVisible" title="新增货代基础信息表">
		<el-form  label-width="120px">
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
</template>

<script lang="ts" setup >
import { ref, Ref, onMounted, reactive, computed } from 'vue';
import { service } from '/@/utils/request';
import { Refresh, Setting, DCaret } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { onBeforeRouteUpdate } from 'vue-router';
let tableData: any[] = reactive([]);
const queryParams = ref<any>({});
let dialogFormVisible = ref(false);
let visible = ref(false);
let v = ref<any>('add');
let tableParams = ref({
	page: 1,
	pageSize: 20,
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
		tableParams.value.page=data.data.result.page;
		tableParams.value.pageSize=data.data.result.pageSize;
		tableParams.value.total=data.data.result.total;
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
function sortfun(v:any){
    queryList.order=v.order
    queryList.field=v.prop
    getAppPage()
}
// 删除
function deletes(val:any){
	visible.value=!visible.value
	console.log(val)
    service({
		url: '/api/collectionGoodsInfo/detele',
		method:'post',
		data: {
            "id":val.row.id
		},
	}).then((data) => {

	});
}
function confirm() {
	if(v.value=="add"){
           service({
		url: '/api/collectionForwarderBaseInfo/add',
		method: 'post',
		data: {
        forwarderName :addqueryList.value.forwarderName,
		recipientName :addqueryList.value.recipientName,
		recipientPhone :addqueryList.value.recipientPhone,
		deliveryAddress :addqueryList.value.deliveryAddress,
		notes : addqueryList.value.notes,
        },
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
    }else{
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