import request from '/@/utils/request';
enum Api {
	targetGetRate = '/api/targetGrossProfit/getRate',
	targetPage = '/api/targetGrossProfit/page',
	targetUpdate = '/api/targetGrossProfit/update',
}
// 获取初始利率
export const targetGetRate = (params?: any) =>
	request({
		url: Api.targetGetRate,
		method: 'get',
		params: params,
	});
// 亚马逊平台佣金利率修改历史记录表
export const targetPage = (params?: any) =>
	request({
		url: Api.targetPage,
		method: 'post',
		data: params,
	});
// 更新亚马逊平台佣金利率
export const targetUpdate = (params?: any) =>
	request({
		url: Api.targetUpdate,
		method: 'post',
		data: params,
	});
