<script lang="ts" setup>
import { ref } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { service } from '/@/utils/request';
import { auth } from '/@/utils/authFunction';
import { getAPI } from '/@/utils/axios-utils';
import { SysAuthApi } from '/@/api-services/api';
import { ElMessage } from 'element-plus';
import { getInterestRate } from '/@/api/modular/main/uAE_ProcurementDetails.ts';

const props = defineProps(['data', 'name', 'area', 'handleData','handleRemarkData']);
const emit = defineEmits(['handleData','handleRemarkData']);
const checkOrderAll = ref<any>(true);
const BaoguanShows = ref<any>(false);
const centerDialogVisible = ref<any>(false);
const ifSuper = ref<any>(false);
// const disabled = ref<any>(true);
const desc = ref<any>('');
const name = ref<any>('');

const CollectionOrder = () => {
	if (checkOrderAll.value) {
		props.data.forEach((element: any) => {
			element.checked = true;
		});
	} else {
		props.data.forEach((element: any) => {
			element.checked = false;
		});
	}
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: props.data,
			TableName: props.name,
		},
	});
};
const CollectionOrderOnChange = (item, type) => {
	checkOrderAll.value = !props.data.some((elemant: any) => {
		if (type === 1) {
			elemant.checked == false;
		} else if (type === 3) {
			elemant.remark == false;
		} else {
			elemant.fixed == false;
		}
	});
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: props.data,
			TableName: props.name,
		},
	});
	if (type === 3) {
		service({
			url: `/api/tableShowColumnConfig/SaveDesc`,
			method: 'post',
			data: {
				JsonConfig: props.data,
				TableName: props.name,
			},
		});
	}
};

const CollectionOrderUpdate = (e: any) => {
	service({
		url: `/api/tableShowColumnConfig/save`,
		method: 'post',
		data: {
			JsonConfig: props.data,
			TableName: props.name,
		},
	});
};

const openSetModel = (item) => {
	centerDialogVisible.value = true
	// disabled.value = true
	desc.value = item.desc?.replaceAll('<br/>','\n')
	name.value = item.dataIndex
}

const apply = () => {
	// disabled.value = !disabled.value
	// if(disabled.value){
		props.data?.map(item=>{
			if( item.dataIndex === name.value ){
				item.desc = desc.value.replaceAll('\n','<br/>')
			}
		})
		service({
			url: `/api/tableShowColumnConfig/SaveDesc`,
			method: 'post',
			data: {
				JsonConfig: props.data,
				TableName: props.name,
			},
		}).then((res)=>{
			ElMessage.success('设置成功！')
			centerDialogVisible.value = false
		})
	// }
}

const close = () => {
	centerDialogVisible.value = false
	// disabled.value = true
	desc.value = ''
}
const handleAuth = async () => {
	const param = {
		code: 'tag_drag_colum_auth',
		page: 1,
		pageSize: 1,
	};
	var result = await getAPI(SysAuthApi).apiSysAuthUserInfoGet();
	var res = await getInterestRate(param).then((res) => {
		if (res.data.type === 'success') {
			if (res.data.result.items[0].value === result.data.result.account) {
				ifSuper.value = true;
			} 
		}
	});
};
const handleQuery = () => {
	handleAuth()
	// CollectionOrderUpdate();
	service({
		url: `/api/tableShowColumnConfig/getColumn/${props.name}`,
		method: 'get',
		data: { tableName: props.name },
	}).then((data) => {
		if (data.data.type == 'success') {
			emit('handleData',data.data.result);
		}
	});
	service({
		url: `/api/tableShowColumnConfig/GetColumnDesc/${props.name}`,
		method: 'get',
		data: { tableName: props.name },
	}).then((data) => {
		if (data.data.type == 'success') {
			emit('handleRemarkData',data.data.result);
		}
	});
};
handleQuery();
// console.log(props.data);
</script>
<template>
	<div style="position: relative; display: flex; justify-content: end">
		<el-tooltip class="box-item" effect="dark" content="列设置" placement="bottom-end">
			<el-button type="primary" @click="BaoguanShows = !BaoguanShows" :icon="Setting" />
		</el-tooltip>
		<table
			v-if="BaoguanShows"
			class="s-tool-column-header s-tool-column-item"
			id="columnDiv"
			:style="{
				width:ifSuper ? '401px' : '231px',
				position: 'absolute',
				maxHeight: '540px',
				display: 'inline-block',
				overflow: 'hidden',
				right: '0px',
				top: '28px',
				zIndex: '10000',
				backgroundColor: '#fff',
				boxShadow: '0px 0px 9px 0px rgba(0, 0, 0, 0.5)'}
			"
		>
			<thead>
				<!-- <el-link style="margin-left: 250px;" type="primary" @click="CollectionOrderUpdate">重置</el-link> -->
				<tr>
					<th class="checkbox"><el-checkbox v-model="checkOrderAll" @change="CollectionOrder"> </el-checkbox></th>
					<th>列名称</th>
					<th class="switch">是否冻结</th>
					<th v-if="ifSuper">列提示信息</th>
					<th v-if="ifSuper" class="switch">是否开启</th>
				</tr>
			</thead>
			<tbody class="ant-checkbox-group">
				<draggable @update="CollectionOrderUpdate" :list="props.data">
					<template #item="{ element }">
						<tr>
							<td class="checkbox"><el-checkbox v-model="element.checked" @change="CollectionOrderOnChange(element, 1)"></el-checkbox></td>
							<td>{{ props?.area !== 'CN' ? element.titleEN : element.titleCN }}</td>
							<td class="switch"><el-switch v-model="element.fixed" @change="CollectionOrderOnChange(element, 2)"></el-switch></td>
							<td v-if="ifSuper" ><el-button style="background:#fff;color:red" color="red" type="danger"  @click="openSetModel(element)" >设置</el-button></td>
							<td v-if="ifSuper" class="switch"><el-switch v-model="element.remark" @change="CollectionOrderOnChange(element, 3)"></el-switch></td>
						</tr>
					</template>
				</draggable>
			</tbody>
		</table>
		<el-dialog v-model="centerDialogVisible" draggable title="列提示信息" width="500" align-center >
			<el-input v-model="desc" style="width: 460px;border:1px solid #ccc"  :autosize="{ minRows: 1, maxRows: 200 }" type="textarea" placeholder="请输入" />
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="close">取消</el-button>
					<el-button type="primary" @click="apply">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
#columnDiv {
	border-collapse: collapse;
	border-spacing: 0;
	empty-cells: show;
	border: 1px solid #cbcbcb;
	.ant-checkbox-group {
		display: inline-block;
		max-height: 500px;
		width: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	thead {
		background-color: #e0e0e0;
		color: #000;
		text-align: left;
		vertical-align: bottom;
	}
	tr {
		border-bottom: 1px solid #cbcbcb;
		border-left: 1px solid #cbcbcb;
		border-right: 1px solid #cbcbcb;
		display: flex;
		align-items: center;
		height: 35px;
		td,
		th {
			padding: 0;
			display: inline-block;
			text-align: center;
			width: 90px;
			height: 100%;
			border-left: 1px solid #cbcbcb;
			border-width: 0 0 0 1px;
			font-size: inherit;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			word-break: break-all;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			line-height: 2em;
		}
		td {
			background-color: transparent;
		}
		.checkbox {
			width: 50px;
		}
		.switch {
			width: 80px;
		}
	}
}

</style>
