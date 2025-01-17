<script lang="ts" setup name="receiptWarehouse">
import { ref, onMounted, reactive, h, nextTick, watch } from 'vue';
import {
	receiptAndWarehousingPage,
	receiptAndWarehousingUpdate,
	receiptAndWarehousingExport,
	receiptAndWarehousingDelete,
	receiptDetailDelete,
	getShipmentDetails,
	getAssociationList,
	confirmAssociation,
	getCollOrderList,
	scanReceiptBoxNo,
	updateBoxNumber,
} from '/@/api/modular/main/receiptAndWarehousing.ts';
import { ElMessage, ElButton, ElTable, ElLink, ElText, ElTag, ElProgress, ElMessageBox, ElInput, ElInputNumber } from 'element-plus';
import other from '/@/utils/other.ts';
import moment from 'moment';
import { SysDictDataApi } from '/@/api-services/api';
import { auth } from '/@/utils/authFunction';
import { useRouter } from 'vue-router';
import { Session, Local } from '/@/utils/storage';
import { getAPI } from '/@/utils/axios-utils';
import { useDebounce } from '/@/utils/debounce';
import infoDataDialog from '/@/components/infoDataDialog/index.vue';
import openBatchDialog from '/@/components/newInfoDataDialog/index.vue';
import changeWareHouseNoDialog from './componet/changeWareHouseNo.vue';
import codeReceiptDialog from './componet/codeReceiptDialog.vue';

const router = useRouter();
const singleTableRef = ref<InstanceType<typeof ElTable>>();
const tableData = ref<any>([]);
const destinationList = ref<any>([]);
const currentRowId = ref<any>(undefined);
const queryParams = reactive<any>({
	time: [],
});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

let now = new Date(); // 获取当前日期和时间
let todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 获取当天零点
// 计算时间差（以毫秒为单位）
const diffMilliseconds = now.getTime() - todayMidnight.getTime();
const defaultValuesParams = ref<any>({
	state: [],
	inWareHouseNos: [],
});
const infoDefaultValuesParams = ref<any>({
	inWareHouseNos: [],
	itemNos: {},
});
const dialogKey = ref(0);
const visible = ref(false);
const visible1 = ref(false);
const title = ref('');
const title1 = ref('');
const fileName = ref<string>('');
const infoWareHouseNo = ref('');
const receiptId = ref('');
const openBatchId = ref('');
const openBatchDialogRef = ref();
const infoDataDialogRef = ref();
const infoFormList = ref<any>([
	{
		label: '绑定入仓号',
		prop: 'inWareHouseNos',
		select: false,
		render: ({ queryParams, item }: { queryParams: any; item: any }) => {
			return h(
				'div',
				{
					style: { border: '1px solid #ccc', padding: '2px', minHeight: '20px', minWidth: '100px', display: 'flex', flexWrap: 'wrap' },
				},
				[
					queryParams[item.prop]?.map((tag: string) =>
						h(
							ElTag,
							{
								key: tag,
								closable: true,
								disableTransitions: false,
								onClose: () => handleClose(tag),
							},
							() => tag
						)
					),
					h(
						'div',
						{
							style: { marginLeft: '8px' },
						},
						[h(ElButton, { type: 'primary', onClick: () => openAndEditWareHouseNo() }, '编辑')]
					),
				]
			);
		},
	},
	{
		label: '扫码收货',
		prop: 'barcodeReceipt',
		select: false,
		render: ({ queryParams, item }: { queryParams: any; item: any }) => {
			return h(ElInput, {
				modelValue: queryParams[item.prop],
				placeholder: '请输入箱号或SKU',
				onChange: () => {
					scanReceiptBoxNo({ boxNo: queryParams[item.prop], inWareHouseNos: queryParams[item.inWareHouseNos], jnid: receiptId.value })
						.then((res: any) => {
							if (res.data.result.includes('扫码成功')) {
								ElMessage.success(res.data.result);
							} else {
								ElMessage.error(res.data.result);
							}
							infoDataDialogRef.value.handleQuery();
							queryParams[item.prop] = '';
						})
						.catch((err: any) => {
							ElMessage.error(err.message);
						});
				},
			});
		},
	},
]);
const formList = ref<any>([
	{
		label: '绑定入仓号',
		prop: 'inWareHouseNos',
		select: false,
		render: ({ queryParams, item }: { queryParams: any; item: any }) => {
			return h(
				'div',
				{
					style: { border: '1px solid #ccc', padding: '2px', minHeight: '20px', minWidth: '100px', display: 'flex', flexWrap: 'wrap' },
				},
				[
					queryParams[item.prop]?.map((tag: string) =>
						h(
							ElTag,
							{
								key: tag,
								closable: true,
								disableTransitions: false,
								onClose: () => handleClose(tag),
							},
							() => tag
						)
					),
					h(
						'div',
						{
							style: { marginLeft: '8px' },
						},
						[h(ElButton, { type: 'primary', onClick: () => openAndEditWareHouseNo() }, '编辑')]
					),
				]
			);
		},
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
	},
	{
		label: 'ERPSKU',
		prop: 'erpsku',
	},
	{
		label: '箱号',
		prop: 'boxNo',
	},
	{
		label: '目的地',
		prop: 'destination',
		select: true,
		options: destinationList,
	},
	{
		label: '状态',
		prop: 'state',
		select: true,
		multiple: true,
		options: [
			{
				label: '集货',
				value: '集货',
			},
			{
				label: '在途中',
				value: '在途中',
			},
			{
				label: '部分入仓',
				value: '部分入仓',
			},
			{
				label: '已入仓',
				value: '已入仓',
			},
		],
	},
]);
const dataList = ref<any>([
	{
		label: '箱号',
		prop: 'documentNo',
		width: 150,
		render: ({ row }: { row: any }) => {
			if (row.status === '不确定') {
				return h(
					ElLink,
					{
						onClick: () => openBoxMatch(row.boxNo, row.id, fileName.value, infoWareHouseNo.value),
						style: { color: 'blue' },
						disabled: !auth('receiptWarehouse:confirmReceipt'),
					},
					'关联'
				);
			} else if (row.status === '预匹配') {
				return h('div', [
					h('div', [h(ElText, { type: 'danger' }, row.documentNo)]),
					h('div', [
						h(
							ElLink,
							{
								onClick: () => confirmReceipt(row.id, row.correlationId),
								disabled: !auth('receiptWarehouse:confirmReceipt'),
								style: { marginLeft: '8px' },
							},
							'确定'
						),
					]),
				]);
			} else {
				if (row.isMixedBox) {
					return h('div', [h(ElText, row.documentNo), h(ElText, { type: 'danger' }, '（拼）')]);
				} else {
					return h('span', row.documentNo);
				}
			}
		},
	},
	{
		label: '收货箱号',
		prop: 'boxNo',
		width: 120,
	},
	{
		label: 'ERPSKU',
		prop: 'erpsku',
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
		width: 120,
	},
	{
		label: '装箱个数',
		prop: 'quantityInBoxes',
	},
	{
		label: '集货箱数',
		prop: 'packBoxesQuantity',
	},
	{
		label: '集货总数',
		prop: 'actualShipmentQuantity',
	},
	{
		label: '本次箱数',
		prop: 'thisBoxNumber',
		width: 100,
		render: ({ row }: { row: any }) => {
			return h(ElInputNumber, {
				modelValue: row.thisBoxNumber,
				controlsPosition: 'right',
				size: 'small',
				style: { width: '80px' },
				onChange: (currentValue, oldValue) => updateNumber(row, currentValue, oldValue),
			});
		},
	},
	{
		label: '本次数量',
		prop: 'thisQuantity',
	},
	{
		label: '已收箱数',
		prop: 'actualBoxesQuantity',
	},
	{
		label: '已收数量',
		prop: 'actualQuantityInBoxes',
		width: 80,
		fixed: 'right',
		render: ({ row }: { row: any }) => {
			return h(ElProgress, {
				type: 'line',
				'text-inside': true,
				'stroke-width': '24',
				percentage: (row.actualQuantityInBoxes / row.actualShipmentQuantity) * 100,
				format: () => {
					return `${row.actualQuantityInBoxes}/${row.actualShipmentQuantity}`;
				},
				status: row.actualQuantityInBoxes / row.actualShipmentQuantity > 1 ? 'exception' : row.actualQuantityInBoxes / row.actualShipmentQuantity === 1 ? 'success' : 'warning',
			});
		},
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
				h(
					ElButton,
					{
						onClick: () => openBoxMatch(row.boxNo, row.id, fileName.value, infoWareHouseNo.value),
						type: 'primary',
						disabled: row.status === '锁定' || !auth('receiptWarehouse:confirmReceipt'),
					},
					'关联'
				),
				h(
					ElButton,
					{
						onClick: () => delItemReceipt(row.id),
						type: 'primary',
						disabled: !auth('receiptWarehouse:deleteReceipt'),
					},
					'删除'
				),
			]);
		},
	},
]);
const dataList1 = ref<any>([
	{
		label: '制单时间',
		prop: 'productionTime',
		width: 130,
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
		width: 135,
		render: ({ row }: { row: any }) => {
			if (row.isHigh) {
				return h('div', [h(ElText, { type: 'danger' }, row.inWareHouseNo)]);
			} else {
				return h('span', row.inWareHouseNo);
			}
		},
	},
	{
		label: 'ERPSKU',
		prop: 'erpsku',
		width: 125,
	},
	{
		label: '箱号',
		prop: 'boxNo',
		width: 120,
	},
	{
		label: '集货箱数',
		prop: 'packBoxesQuantity',
	},
	{
		label: '已收箱数',
		prop: 'actualQuantityInBoxes',
	},
	{
		label: '目的地',
		prop: 'destination',
	},
	{
		label: '状态',
		prop: 'state',
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => confirmReceipt(openBatchId.value, row.correlationId),
					type: 'primary',
					disabled: !auth('receiptWarehouse:confirmReceipt'),
				},
				'确定关联'
			);
		},
	},
]);

const title2 = ref('选择货代入仓号 （1、绑定货代入仓号，');
const changeWareHouseNoDialogRef = ref();
const defaultValuesWareHouseParams = ref<any>({
	state: [],
	inWareHouseNos: [],
	showFooter: true,
});
const wareHouseformList = ref<any>([
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
	},
	{
		label: '目的地',
		prop: 'destination',
		select: true,
		options: destinationList,
	},
	{
		label: '制单日期',
		prop: 'productionTime',
		select: false,
		date: true,
		type: 'daterange',
	},
	{
		label: '状态',
		prop: 'state',
		select: true,
		multiple: true,
		options: [
			{
				label: '集货',
				value: '集货',
			},
			{
				label: '在途中',
				value: '在途中',
			},
			{
				label: '部分入仓',
				value: '部分入仓',
			},
			{
				label: '已入仓',
				value: '已入仓',
			},
		],
	},
]);
const dataList2 = ref<any>([
	{
		label: '制单时间',
		prop: 'productionTime',
		width: 120,
	},
	{
		label: '货代入仓号',
		prop: 'inWareHouseNo',
		width: 140,
	},
	{
		label: '集货箱数',
		prop: 'packBoxesQuantity',
		width: 70,
	},
	{
		label: '已收箱数',
		prop: 'actualQuantityInBoxes',
		width: 65,
	},
	{
		label: '目的地',
		prop: 'destination',
		width: 65,
	},
	{
		label: '状态',
		prop: 'state',
		width: 65,
	},
	{
		label: '操作',
		prop: 'operation',
		render: ({ row }: { row: any }) => {
			return h(
				ElButton,
				{
					onClick: () => editWareHouseNo(row.inWareHouseNo),
					type: 'primary',
				},
				'选择'
			);
		},
	},
]);

const openCodeReceiptDialogRef = ref();
const codeReceiptDefaultValuesParams = ref<any>({
	inWareHouseNos: [],
	tableData: JSON.parse(Local.getLocalStorageItemWithExpiry('codeReceiptTableData')) ?? [],
});
const codeReceiptTitle = () => {
	return h('div', [
		h('span', { style: { color: '#fff', fontSize: 'large', fontWeight: 'bold' } }, '扫码入库（'),
		h('span', { style: { color: '#ec808d', fontSize: 'large', fontWeight: 'bold' } }, '1、绑定货代入仓号，'),
		h('span', { style: { color: '#fff', fontSize: 'large', fontWeight: 'bold' } }, '2、扫码入库）'),
	]);
};
const codeReceiptFooter = () => {
	return h(
		'div',
		{
			style: {
				textAlign: 'start !important',
			},
		},
		[
			h(
				ElButton,
				{
					type: 'primary',
					size: 'default',
					onClick: () => {
						openCodeReceiptDialogRef.value.closeDialog();
						codeReceiptDefaultValuesParams.value.tableData = [];
						codeReceiptDefaultValuesParams.value.inWareHouseNos = [];
						Local.setLocalStorageItemWithExpiry('codeReceiptTableData', JSON.stringify(codeReceiptDefaultValuesParams.value.tableData), 1000 * 60 * 60 * 24 - diffMilliseconds);
						handleQuery();
					},
				},
				'提交'
			),
			h(ElButton, { size: 'default', onClick: () => openCodeReceiptDialogRef.value.closeDialog() }, '取消'),
		]
	);
};
const codeReceiptFormList = ref<any>([
	{
		label: '绑定入仓号',
		prop: 'inWareHouseNos',
		select: false,
		render: ({ queryParams, item }: { queryParams: any; item: any }) => {
			return h(
				'div',
				{
					style: { border: '1px solid #ccc', padding: '2px', minHeight: '20px', minWidth: '100px', display: 'flex', flexWrap: 'wrap' },
				},
				[
					queryParams[item.prop]?.map((tag: string) =>
						h(
							ElTag,
							{
								key: tag,
								closable: true,
								disableTransitions: false,
								onClose: () => handleClose(tag, 'codeReceipt'),
							},
							() => tag
						)
					),
					h(
						'div',
						{
							style: { marginLeft: '8px' },
						},
						[h(ElButton, { type: 'primary', onClick: () => openAndEditWareHouseNo('codeReceipt') }, '编辑')]
					),
				]
			);
		},
	},
	{
		label: '箱号或SKU',
		prop: 'boxNo',
		render: ({ queryParams, item }: { queryParams: any; item: any }) => {
			return h(ElInput, {
				modelValue: queryParams[item.prop],
				placeholder: '请输入箱号或SKU',
				onChange: () => {
					scanReceiptBoxNo({ boxNo: queryParams[item.prop], inWareHouseNos: codeReceiptDefaultValuesParams.value.inWareHouseNos })
						.then((res: any) => {
							if (res.data.result) {
								codeReceiptDefaultValuesParams.value.tableData.unshift(res.data.result);
								Local.setLocalStorageItemWithExpiry('codeReceiptTableData', JSON.stringify(codeReceiptDefaultValuesParams.value.tableData), 1000 * 60 * 60 * 24 - diffMilliseconds);
							}
							if (res.data.result.includes('扫码成功')) {
								ElMessage.success(res.data.result);
							} else {
								ElMessage.error(res.data.result);
							}
							queryParams[item.prop] = '';
						})
						.catch((err: any) => {
							ElMessage.error(err.message);
						});
				},
			});
		},
	},
	{
		label: '',
		prop: 'site',
		render: ({ queryParams, item }: { queryParams: any; item: any }) => {
			return h(ElInput, {
				style: { display: 'none' },
				modelValue: queryParams[item.prop],
				placeholder: '修改elinput enter bug',
			});
		},
	},
]);
const codeReceiptDataList = ref<any>([]);

const loading = ref(false);
const exportLoading = ref(false);
const selectedRowKeys = ref<any>([]);
const disabledList = ref<any>([]);

const area = ref('CN');
const TableData = ref<any>([
	{
		titleCN: '目的地',
		dataIndex: 'destination',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '实际收货日期',
		dataIndex: 'actualDeliveryTime',
		width: 120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '货代入仓号',
		dataIndex: 'inWareHouseNo',
		width: 180,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货箱数',
		dataIndex: 'documentNumber',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '集货总数',
		dataIndex: 'documentTotalNumber',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '箱数',
		dataIndex: 'boxNumber',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '收货总数',
		dataIndex: 'takeOverTotal',
		width: 100,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '未匹配条数',
		dataIndex: 'unmatchedBoxes',
		width: 120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '操作人',
		dataIndex: 'operator',
		width: 120,
		checked: true,
		fixed: false,
	},
	{
		titleCN: '备注',
		dataIndex: 'remarks',
		width: 310,
		checked: true,
		fixed: false,
	},
]);

// 查询
const handleQuery = async (): Promise<void> => {
	loading.value = true;
	queryParams.startActualDeliveryTime = queryParams.time?.length ? moment(queryParams.time[0]).format('YYYY-MM-DD') : '';
	queryParams.endActualDeliveryTime = queryParams.time?.length ? moment(queryParams.time[1]).format('YYYY-MM-DD') : '';
	await receiptAndWarehousingPage(Object.assign(queryParams, tableParams.value)).then((res) => {
		tableData.value = res.data.result.items;
		tableParams.value.total = res.data.result?.total;
		res.data.result?.items.map((item: { id: any; thisBoxNumber: any }) => {
			disabledList.value.push(item.id);
		});
	});
	loading.value = false;
};
//重置
const resetfun = (): void => {
	Object.keys(queryParams).forEach((key: any) => {
		queryParams[key] = '';
	});
	handleQuery();
};

const handleRouter = (inWareHouseNo: string) => {
	Session.set('queryObj', { documentNo: inWareHouseNo, ifquery: false });
	router.push({ path: '/business/collection/packingInformation' });
};

// 打开收货明细
const openReceiptInfo = (id: any, name: string, inWareHouseNo: string, inWareHouseNos: any) => {
	fileName.value = name;
	receiptId.value = id;
	infoWareHouseNo.value = inWareHouseNo;
	title.value = `收货明细（货代入仓号：${inWareHouseNo} 文件名称：${name}）`;
	if (infoDefaultValuesParams.value.itemNos.hasOwnProperty(id)) {
		infoDefaultValuesParams.value.inWareHouseNos = infoDefaultValuesParams.value.itemNos[id];
	} else {
		infoDefaultValuesParams.value.itemNos[id] = inWareHouseNos;
		infoDefaultValuesParams.value.inWareHouseNos = inWareHouseNos;
	}
	visible.value = true;
};
// 打开箱号匹配
const openBoxMatch = async (sku: string, id: any, name: string, inWareHouseNo: string) => {
	openBatchId.value = id;
	defaultValuesParams.value.erpsku = sku;
	defaultValuesParams.value.inWareHouseNos = infoDefaultValuesParams.value.inWareHouseNos ? [...infoDefaultValuesParams.value.inWareHouseNos] : [];
	watch(
		() => infoDefaultValuesParams.value.inWareHouseNos,
		(newVal) => {
			defaultValuesParams.value.inWareHouseNos = newVal ? [...newVal] : [];
		},
		{ deep: true }
	);
	await nextTick();
	title1.value = `箱号匹配（SKU：${sku} 货代入仓号：${inWareHouseNo} 文件名称：${name}）`;
	openBatchDialogRef.value.openDialog();
};
// 打开扫码收货
const openCodeReceipt = () => {
	receiptId.value = '0001';
	openCodeReceiptDialogRef.value.openDialog();
};
// 打开导入收货箱单号
const openWhareHouseNo = () => {
	defaultValuesWareHouseParams.value = {
		state: [],
		inWareHouseNos: [],
		showFooter: true,
	};
	changeWareHouseNoDialogRef.value.openDialog();
};
const editWareHouseNo = (inWareHouseNo: string) => {
	if (!defaultValuesWareHouseParams.value.inWareHouseNos?.includes(inWareHouseNo)) {
		defaultValuesWareHouseParams.value.inWareHouseNos = defaultValuesWareHouseParams.value.inWareHouseNos === null ? [] : defaultValuesWareHouseParams.value.inWareHouseNos;
		defaultValuesWareHouseParams.value.inWareHouseNos.push(inWareHouseNo);
	}
};
// 确定关联
const confirmReceipt = (id: any, correlationId: any) => {
	confirmAssociation({ id, correlationId }).then((res) => {
		ElMessage.success('操作成功!');
		handleQuery();
		infoDataDialogRef.value.handleQuery();
	});
};
// 删除
const delItemReceipt = (id: any) => {
	ElMessageBox.confirm(`确定要删除吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await receiptDetailDelete({ id }).then(() => {
				infoDataDialogRef.value.handleQuery();
				handleQuery();
				ElMessage.success('删除成功');
			});
		})
		.catch(() => {});
};
// 修改箱数
const updateNumber =(row: any, currentValue: any, oldValue: any) => {
	ElMessageBox.confirm(`确定修改此条数据吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await updateBoxNumber({ id: row.id, newNumber: currentValue, oldNumber:oldValue })
			.then((res: any) => {
				ElMessage.success('修改成功');
				infoDataDialogRef.value.handleQuery();
			})
			.catch((err) => {
				ElMessage.error(err);
			});
	}).catch(() => {})
}
// 添加关闭对话框的处理函数
const handleDialogClose = () => {
	visible.value = false;
	dialogKey.value++; // 更新key强制重新渲染
	if (infoDataDialogRef.value) {
		infoDataDialogRef.value.resetData?.(); // 如果组件提供了重置方法就调用
	}
};
const handleClose = (tag: string, type?: string) => {
	const index = !type ? infoDefaultValuesParams.value.inWareHouseNos.indexOf(tag) : codeReceiptDefaultValuesParams.value.inWareHouseNos.indexOf(tag);
	if (index > -1) {
		// 确保同步更新
		infoDefaultValuesParams.value.itemNos[receiptId.value].splice(index, 1);
		if (!type) {
			infoDefaultValuesParams.value.inWareHouseNos.splice(index, 1);
			defaultValuesParams.value.inWareHouseNos = [...infoDefaultValuesParams.value.inWareHouseNos];
		} else {
			codeReceiptDefaultValuesParams.value.inWareHouseNos.splice(index, 1);
		}
	}
};
const openAndEditWareHouseNo = (type?: string) => {
	changeWareHouseNoDialogRef.value.openDialog(receiptId.value);
	if (!type) {
		defaultValuesWareHouseParams.value = infoDefaultValuesParams.value;
	} else {
		defaultValuesWareHouseParams.value = codeReceiptDefaultValuesParams.value;
	}
};
const handleReturnValues = (arr?: any, id?: any) => {
	if (+id) {
		infoDefaultValuesParams.value.itemNos[id] = arr ? [...arr] : [];
		infoDefaultValuesParams.value.inWareHouseNos = arr ? [...arr] : [];
	} else {
		infoDefaultValuesParams.value.inWareHouseNos = arr ? [...arr] : [];
	}
	defaultValuesParams.value.inWareHouseNos = [...infoDefaultValuesParams.value.inWareHouseNos];
};

onMounted(async () => {
	const res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('destination');
	destinationList.value = res.data.result;
	handleQuery();
	if (Local.getLocalStorageItemWithExpiry('codeReceiptTableData')) {
		codeReceiptDefaultValuesParams.value.tableData = JSON.parse(Local.getLocalStorageItemWithExpiry('codeReceiptTableData'));
	} else {
		Local.setLocalStorageItemWithExpiry('codeReceiptTableData', JSON.stringify(codeReceiptDefaultValuesParams.value.tableData), 1000 * 60 * 60 * 24 - diffMilliseconds);
	}
});

// 改变页面容量
const handleSizeChange = (val: number): void => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number): void => {
	tableParams.value.page = val;
	handleQuery();
};

// 获取keys
const currentChange = (currentRow: any) => {
	if (currentRow.id != undefined) {
		if (currentRow.id !== currentRowId.value) {
			selectedRowKeys.value = [currentRow.id];
			currentRowId.value = currentRow.id;
		} else {
			singleTableRef.value!.setCurrentRow({});
			currentRowId.value = undefined;
			selectedRowKeys.value = [];
		}
	}
};
const disabledfun = async (val: any): Promise<void> => {
	if (disabledList.value.some((item: any) => item === val.row.id)) {
		const index = disabledList.value.findIndex((item: any) => item === val.row.id);
		disabledList.value.splice(index, 1);
	} else {
		disabledList.value.push(val.row.id);
		var res = await receiptAndWarehousingUpdate(Object.assign({ id: val.row.id, remarks: val.row.remarks }));
		res.data?.type === 'success' ? ElMessage.success('修改成功!') : null;
	}
};
const disabledAuto = (scope: any): boolean => {
	return disabledList.value.some((item: any) => item === scope.row.id) ? true : false;
};
const deletefun = useDebounce((row?: any): void => {
	ElMessageBox.confirm(`确定删除此条数据吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await receiptAndWarehousingDelete({ id: row.id });
			handleQuery();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
}, 500);
// 导出
const exportReceiptWarehouse = useDebounce((row?: any): void => {
	if (row?.id != undefined) {
		receiptAndWarehousingExport(Object.assign({ id: row.id })).then((res) => {
			other.downloadfile(res);
			ElMessage.success('导出成功!');
		});
	} else {
		exportLoading.value = true;
		receiptAndWarehousingExport(Object.assign({ id: currentRowId.value })).then((res) => {
			other.downloadfile(res);
			ElMessage.success('导出成功!');
			exportLoading.value = false;
		});
	}
}, 500);
</script>
<template>
	<div class="collectionOrderInfo-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" :inline="true">
				<el-form-item label="目的地">
					<el-select v-model="queryParams.destination" clearable placeholder="请选择目的地" @change="handleQuery">
						<el-option v-for="item in destinationList" :label="item.value" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="箱单号">
					<el-input v-model="queryParams.boxNo" clearable placeholder="请输入箱单号" />
				</el-form-item>
				<el-form-item label="内部唯一识别码或内部品名">
					<el-input v-model="queryParams.SKUOrGoodsName" clearable placeholder="请输入内部唯一识别码或内部品名" />
				</el-form-item>
				<el-form-item label="收货日期">
					<el-date-picker v-model="queryParams.time" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button v-auth="'shippingDetails:page'" type="primary" icon="ele-Search" @click="handleQuery()" style="width: 70px; margin-right: 2px"> 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetfun()" style="width: 70px; margin-right: 2px"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="importDiv">
				<el-button type="primary" @click="openWhareHouseNo">导入收货箱单号</el-button>
				<el-button type="primary" :disabled="!selectedRowKeys?.length" :loading="exportLoading" @click="exportReceiptWarehouse()">导出普源云入库单</el-button>
				<el-button type="primary" @click="openCodeReceipt">扫码收货</el-button>
			</div>
			<el-table :data="tableData" ref="singleTableRef" size="large" style="width: 100%" highlight-current-row @row-click="(row:any) => currentChange(row)" v-loading="loading" tooltip-effect="light">
				<el-table-column type="index" width="50" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex === 'remarks'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					>
						<template #default="scope">
							<el-input v-model="scope.row.remarks" :disabled="disabledAuto(scope)" />
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex === 'unmatchedBoxes'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					>
						<template #default="scope">
							<el-link :style="{ color: scope.row.unmatchedBoxes === 0 ? 'blue' : 'red' }" @click="openReceiptInfo(scope.row.id, scope.row.fileName, scope.row.inWareHouseNo, scope.row.inWareHouseNos)"
								>{{ scope.row.unmatchedBoxes }}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex === 'inWareHouseNo'"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					>
						<template #default="scope">
							<el-link style="color: red" @click="handleRouter(scope.row.inWareHouseNo)">{{ scope.row.inWareHouseNo }} </el-link>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip
						:width="item.width"
					/>
				</template>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button type="primary" text @click="disabledfun(scope)">{{ disabledList.some((item: any) => item === scope.row.id) ? '编辑' : '保存' }}</el-button>
						<el-dropdown>
							<el-button icon="ele-MoreFilled" size="small" text type="primary" style="padding-left: 12px" />
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="deletefun(scope.row)">删除</el-dropdown-item>
									<el-dropdown-item @click="exportReceiptWarehouse(scope.row)">导出普源云入库单</el-dropdown-item>
									<el-dropdown-item><el-link type="primary" :href="scope.row.filePath"> 附件下载 </el-link></el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
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
		</el-card>
		<changeWareHouseNoDialog
			ref="changeWareHouseNoDialogRef"
			:title="title2"
			:formList="wareHouseformList"
			:dataList="dataList2"
			:pointerface="getCollOrderList"
			:defaultValues="defaultValuesWareHouseParams"
			@returnValues="handleReturnValues"
		/>
		<el-dialog v-model="visible" :title="title" @close="handleDialogClose" width="1000px" draggable>
			<infoDataDialog
				ref="infoDataDialogRef"
				:query="true"
				:id="receiptId"
				idName="id"
				:dataList="dataList"
				:ifClose="visible"
				:pointerface="getShipmentDetails"
				:key="dialogKey"
				:formList="infoFormList"
				:defaultValues="infoDefaultValuesParams"
			/>
		</el-dialog>
		<openBatchDialog
			ref="openBatchDialogRef"
			:title="title1"
			idName="id"
			:id="openBatchId"
			:dataList="dataList1"
			:ifClose="visible1"
			:pointerface="getAssociationList"
			:formList="formList"
			:defaultValues="defaultValuesParams"
		/>
		<codeReceiptDialog
			ref="openCodeReceiptDialogRef"
			:titleRender="codeReceiptTitle"
			:footerRender="codeReceiptFooter"
			:dataList="codeReceiptDataList"
			:query="true"
			:formList="codeReceiptFormList"
			:defaultValues="codeReceiptDefaultValuesParams"
		/>
	</div>
</template>
<style lang="scss" scoped>
:deep(.el-tag--dark) {
	--el-tag-border-color: none;
}

// 添加媒体查询以适应小屏幕
@media screen and (max-height: 768px) {
	:deep(.el-overlay .el-overlay-dialog .el-dialog) {
		height: 100vh; // 在小屏幕上占据更多空间

		.el-dialog__body {
			max-height: calc(100% - 100px) !important; // 减小头部和底部空间
			padding: 8px !important;
		}

		.el-dialog__header,
		.el-dialog__footer {
			padding: 10px; // 减小内边距
		}
	}
}
</style>
