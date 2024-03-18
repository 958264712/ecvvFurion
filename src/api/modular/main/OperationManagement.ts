import request from '/@/utils/request';
enum Api {
	amazonOrders = '/api/amazonOrders/page',
	Import = '/api/amazonOrders/import',
	puyuanCloudInventoryPage = '/api/puyuanCloudInventory/page'
}
export const amazonOrdersPage = (params?: any) =>
	request({
		url: Api.amazonOrders,
		method: 'get',
		params: params,
	});

export const Import = (params?: any) =>
	request({
		url: Api.Import,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

export const puyuanCloudInventoryPage = (params?: any) =>
	request({
		url: Api.puyuanCloudInventoryPage,
		method: 'get',
		params: params,
	});