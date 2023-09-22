import request from '/@/utils/request';
enum Api {
	collectionOrderInfoPage = '/api/collectionOrderInfo/page',
	getCollectionGoodsInfoCache = '/api/collectionGoodsInfoCache/getCollectionGoodsInfoCache',
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
