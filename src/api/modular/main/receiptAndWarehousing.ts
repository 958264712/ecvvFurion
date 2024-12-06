import request from '/@/utils/request';
enum Api {
	receiptAndWarehousingPage = '/api/receiptAndWarehousing/page',
	getShipmentDetails = '/api/receiptAndWarehousing/getShipmentDetails',
	getAssociationList = '/api/receiptAndWarehousing/getAssociationList',
	getCollOrderList = '/api/receiptAndWarehousing/getCollOrderList',
	confirmAssociation = '/api/receiptAndWarehousing/confirmAssociation',
	receiptAndWarehousingUpdate = '/api/receiptAndWarehousing/update',
	receiptAndWarehousingImport = '/api/receiptAndWarehousing/import',
	receiptAndWarehousingExport = '/api/receiptAndWarehousing/export',
}

// 获取集货列表
export const getCollOrderList = (params?: any) =>
	request({
		url: Api.getCollOrderList,
		method: 'post',
		data: params,
	});
// 获取批次的收货明细
export const getShipmentDetails = (params?: any) =>
	request({
		url: Api.getShipmentDetails,
		method: 'get',
		params: params,
	});
// 获取关联列表
export const getAssociationList = (params?: any) =>
	request({
		url: Api.getAssociationList,
		method: 'post',
		data: params,
	});
// 分页查询收货入仓页面
export const receiptAndWarehousingPage = (params?: any) =>
	request({
		url: Api.receiptAndWarehousingPage,
		method: 'get',
		params: params,
	});
// 确认关联
export const confirmAssociation = (params?: any) =>
	request({
		url: Api.confirmAssociation,
		method: 'post',
		data: params,
	});
// 修改
export const receiptAndWarehousingUpdate = (params?: any) =>
	request({
		url: Api.receiptAndWarehousingUpdate,
		method: 'post',
		data: params,
	});
// 导入
export const receiptAndWarehousingImport = (params?: any) =>
	request({
		url: Api.receiptAndWarehousingImport,
		method: 'post',
		data: params,
	});
// 导出
export const receiptAndWarehousingExport = (params?: any) =>
	request({
		url: Api.receiptAndWarehousingExport,
		method: 'post',
		data: params,
		responseType: 'blob',
	});

