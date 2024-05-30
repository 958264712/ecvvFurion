import request from '/@/utils/request';
enum Api {
	KingdeeHasPlacedAnOrderInfo = '/api/kingdeeHasPlacedAnOrder/page',
	ImportKingdeeHasPlacedAnOrder = '/api/kingdeeHasPlacedAnOrder/import',
	InventorySummaryLedgerInfo = '/api/inventorySummaryLedger/page',
	ImportInventorySummaryLedger = '/api/inventorySummaryLedger/import',
	BatchDFPicking = '/api/dFPickingList/page',
	DFPickingListInfo = '/api/dFPickingList/PageDFPickingList',
	ImportDFPickingList = '/api/dFPickingList/import',
	DFShippingListInfo = '/api/dFShippingList/page',
	ImportDFShippingList = '/api/dFShippingList/imports',
	GetHistoryList = '/api/dFShippingList/getHistoryList',
	ExportHistory = '/api/dFShippingList/exportHistory',
	downLoadPOZip = '/api/dFPickingList/downLoadPOZip',
	delete = '/api/dFPickingList/delete',
	GetUserRole = '/api/dFPickingList/getUserRole',
	updateTrackingID = '/api/dFShippingList/updateTrackingID'
}
//获取DF用户的角色信息
export const GetUserRole = (params?: any) =>
	request({
		url: Api.GetUserRole,
		method: 'get',
		params: params,
	});
// DF批次条数删除
export const Delete = (params?: any) =>
	request({
		url: Api.delete,
		method: 'post',
		data: params,
	});
// 更新DF订单 downLoadPOZip
export const downLoadPOZip = (params?: any) =>
	request({
		url: Api.downLoadPOZip,
		method: 'post',
		data: params,
	});
//获取金蝶已下单信息
export const KingdeeHasPlacedAnOrderInfo = (params?: any) =>
	request({
		url: Api.KingdeeHasPlacedAnOrderInfo,
		method: 'get',
		params: params,
	});
///金蝶已下单导入
export const ImportKingdeeHasPlacedAnOrder = (params?: any) =>
	request({
		url: Api.ImportKingdeeHasPlacedAnOrder,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
//获取库存信息
export const InventorySummaryLedgerInfo = (params?: any) =>
	request({
		url: Api.InventorySummaryLedgerInfo,
		method: 'get',
		params: params,
	});
///库存信息导入
export const ImportInventorySummaryLedger = (params?: any) =>
	request({
		url: Api.ImportInventorySummaryLedger,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

//获取批次上传的DFPickingList条数
export const BatchDFPicking = (params?: any) =>
	request({
		url: Api.BatchDFPicking,
		method: 'get',
		params: params,
	});
//获取DFPickingList
export const DFPickingListInfo = (params?: any) =>
	request({
		url: Api.DFPickingListInfo,
		method: 'get',
		params: params,
	});
///DFPickingList导入
export const ImportDFPickingList = (params?: any) =>
	request({
		url: Api.ImportDFPickingList + '/' + params.Country,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
//DFShippingListInfo
export const DFShippingListInfo = (params?: any) =>
	request({
		url: Api.DFShippingListInfo,
		method: 'get',
		params: params,
	});
///ImportDFShippingList
export const ImportDFShippingList = (params?: any) =>
	request({
		url: Api.ImportDFShippingList + '/' + params.BatchId,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

//GetHistoryList
export const GetHistoryList = (params?: any) =>
	request({
		url: Api.GetHistoryList,
		method: 'get',
		params: params,
	});
///ExportHistory
export const ExportHistory = (params?: any) =>
	request({
		url: Api.ExportHistory,
		method: 'post',
		data: params,
	});
//updateTrackingID
export const updateTrackingID = (params?: any) =>
	request({
		url: Api.updateTrackingID,
		method: 'post',
		data: params,
	});