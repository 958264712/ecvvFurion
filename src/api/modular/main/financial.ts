import request from '/@/utils/request';
enum Api {
	returnedGoods = '/api/returnedGoods/returnedGoods',
	exportReturnedGoods = '/api/returnedGoods/exportReturnedGoods',
}
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
