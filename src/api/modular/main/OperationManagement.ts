import request from '/@/utils/request';
enum Api {
	amazonOrders = '/api/amazonOrders/page',
	Import = '/api/amazonOrders/import',
	puyuanCloudInventoryPage = '/api/puyuanCloudInventory/page',
	batchPuyuanCloudInventoryPage = '/api/batchPuyuanCloudInventory/page',
	puyuanCloudInventoryimport = '/api/puyuanCloudInventory/import'
}
export const batchPuyuanCloudInventoryPage = (params?: any) =>
	request({
		url: Api.batchPuyuanCloudInventoryPage,
		method: 'get',
		params: params,
	});
export const amazonOrdersPage = (params?: any) =>
	request({
		url: Api.amazonOrders,
		method: 'post',
		data: params,
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
export const puyuanCloudInventoryimport = (params?: any) =>
	request({
		url: Api.puyuanCloudInventoryimport,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});