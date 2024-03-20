<script lang="ts" setup>
import { ref } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { service } from '/@/utils/request';

const props = defineProps(['data', 'name', 'area', 'handleData']);
const emit = defineEmits(['handleData']);
const checkOrderAll = ref<any>(true);
const BaoguanShows = ref<any>(false);


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

const handleQuery = () => {
	CollectionOrderUpdate()
	service({
		url: `/api/tableShowColumnConfig/getColumn/${props.name}`,
		method: 'get',
		data: { tableName: props.name },
	}).then((data) => {
		if (data.data.type == 'success') {
			emit('handleData', data.data.result);
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
			style="
				width: 301px;
				position: absolute;
				max-height: 500px;
				display: inline-block;
				overflow: hidden;
				right: 0px;
				top: 28px;
				z-index: 10000;
				background-color: #fff;
				box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.5);
			"
		>
			<thead>
				<!-- <el-link style="margin-left: 250px;" type="primary" @click="CollectionOrderUpdate">重置</el-link> -->
				<tr>
					<th class="checkbox"><el-checkbox v-model="checkOrderAll" @change="CollectionOrder"> </el-checkbox></th>
					<th>列名称</th>
					<th class="switch">是否冻结</th>
				</tr>
			</thead>
			<tbody class="ant-checkbox-group">
				<draggable @update="CollectionOrderUpdate" :list="props.data">
					<template #item="{ element }">
						<tr>
							<td class="checkbox"><el-checkbox v-model="element.checked" @change="CollectionOrderOnChange(element, 1)"></el-checkbox></td>
							<td>{{ props?.area !== 'CN' ? element.titleEN : element.titleCN }}</td>
							<td class="switch"><el-switch v-model="element.fixed" @change="CollectionOrderOnChange(element, 2)"></el-switch></td>
						</tr>
					</template>
				</draggable>
			</tbody>
		</table>
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
		max-height: 475px;
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
		height:35px;
		td,
		th {
			padding: 0;
			display: inline-block;
			text-align: center;
			width: 160px;
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
		.switch{
			width:80px;
		}
	}
}
</style>
