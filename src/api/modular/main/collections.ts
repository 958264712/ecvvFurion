import request from '/@/utils/request';
enum Api {
	collectionOrderInfoPage = '/api/collectionOrderInfo/page',
	getLateDeliveryList = '/api/collectionOrderInfo/getLateDeliveryList',
	getExpectedDeliveryList = '/api/collectionOrderInfo/getExpectedDeliveryList',
	getCollectionGoodsInfoCache = '/api/collectionGoodsInfoCache/getCollectionGoodsInfoCache',
	getShipmentDetails = '/api/collectionOrderInfo/getShipmentDetails',
	ExportShipmentDetails = '/api/collectionOrderInfo/exportShipmentDetails',
}

// 分页查询集货单页面
export const collectionOrderInfoPage = (params?: any) =>
	request({
		url: Api.collectionOrderInfoPage,
		method: 'get',
		params: params,
	});

// 根据内部唯一识别码获取集货单商品缓存表
export const getCollectionGoodsInfoCache = (params?: any) =>
	request({
		url: Api.getCollectionGoodsInfoCache,
		method: 'get',
		params: params,
	});
// 获取逾期未送列表
export const getLateDeliveryList = (params?: any) =>
	request({
		url: Api.getLateDeliveryList,
		method: 'get',
		params: params,
	});
// 获取预计送仓列表
export const getExpectedDeliveryList = (params?: any) =>
	request({
		url: Api.getExpectedDeliveryList,
		method: 'get',
		params: params,
	});
// 获取出货明细表
export const getShipmentDetails = (params?: any) =>
	request({
		url: Api.getShipmentDetails,
		method: 'get',
		params: params,
	});
// 导出A出货明细总表
export const ExportShipmentDetails = (params?: any) =>
	request({
		url: Api.ExportShipmentDetails,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
