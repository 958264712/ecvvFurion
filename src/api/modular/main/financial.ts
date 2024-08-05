import request from '/@/utils/request';
enum Api {
	returnedGoods = '/api/returnedGoods/GetreturnedGoods',
	exportReturnedGoods = '/api/returnedGoods/exportReturnedGoods',
	dFOutboundOrderpage = '/api/dFOutboundOrder/page',
	dFOutboundOrderexport = '/api/dFOutboundOrder/export',
	purchaseReceiptFormPage = '/api/purchaseReceiptForm/page',
	pYYOtherOutboundOrdersPage = '/api/pYYOtherOutboundOrders/page',
	pYYOtherWarehouseReceiptsPage = '/api/pYYOtherWarehouseReceipts/page',
	pYYPurchaseOrderPage = '/api/pYYPurchaseOrder/page',
	pYYPurchaseOrderupdate = '/api/pYYPurchaseOrder/update',
	importPurchaseUnitPrice = '/api/pYYPurchaseOrder/importPurchaseUnitPrice',
	initialInventoryDataPage = '/api/initialInventoryData/page',
	importInitialInventoryData = '/api/initialInventoryData/import',
}
// 期初库存数据导入
export const importInitialInventoryData = (params?: any) =>
	request({
		url: Api.importInitialInventoryData,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 期初库存数据
export const initialInventoryDataPage = (params?: any) =>
	request({
		url: Api.initialInventoryDataPage,
		method: 'get',
		data: params,
	});
// 亚马逊平台佣金利率修改历史记录表
export const returnedGoods = (params?: any) =>
	request({
		url: Api.returnedGoods,
		method: 'get',
		data: params,
	});
// 更新亚马逊平台佣金利率
export const exportReturnedGoods = (params?: any) =>
	request({
		url: Api.exportReturnedGoods,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// DF出库单
export const dFOutboundOrderpage = (params?: any) =>
	request({
		url: Api.dFOutboundOrderpage,
		method: 'get',
		data: params,
	});
// 导出df出库单
export const dFOutboundOrderexport = (params?: any) =>
	request({
		url: Api.dFOutboundOrderexport,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 普源云采购入库单查询
export const purchaseReceiptFormPage = (params?: any) =>
	request({
		url: Api.purchaseReceiptFormPage,
		method: 'get',
		data: params,
	});
// 普源云其他出库单查询
export const pYYOtherOutboundOrdersPage = (params?: any) =>
	request({
		url: Api.pYYOtherOutboundOrdersPage,
		method: 'get',
		data: params,
	});

// 普源云其他入库单查询
export const pYYOtherWarehouseReceiptsPage = (params?: any) =>
	request({
		url: Api.pYYOtherWarehouseReceiptsPage,
		method: 'get',
		data: params,
	});

// 普源云其他入库单查询
export const pYYPurchaseOrderPage = (params?: any) =>
	request({
		url: Api.pYYPurchaseOrderPage,
		method: 'post',
		data: params,
	});
// 普源云其他入库单修改
export const pYYPurchaseOrderupdate = (params?: any) =>
	request({
		url: Api.pYYPurchaseOrderupdate,
		method: 'post',
		data: params,
	});
export const importPurchaseUnitPrice = (params?: any) =>
	request({
		url: Api.importPurchaseUnitPrice,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});