import request from '/@/utils/request';
enum Api {
	amazonGetRate = '/api/amazonPlatformCommission/getRate',
	amazonPage = '/api/amazonPlatformCommission/page',
	amazonUpdate = '/api/amazonPlatformCommission/update',
}
// 获取初始利率
export const amazonGetRate = (params?: any) =>
	request({
		url: Api.amazonGetRate,
		method: 'get',
		params: params,
	});
// 亚马逊平台佣金利率修改历史记录表
export const amazonPage = (params?: any) =>
	request({
		url: Api.amazonPage,
		method: 'post',
		data: params,
	});
// 更新亚马逊平台佣金利率
export const amazonUpdate = (params?: any) =>
	request({
		url: Api.amazonUpdate,
		method: 'post',
		data: params,
	});
