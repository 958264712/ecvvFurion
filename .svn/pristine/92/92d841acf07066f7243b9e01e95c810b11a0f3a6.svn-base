import request from '/@/utils/request';
enum Api {
	Import = '/api/oFSDubaiShipmentDetails/import/import',
}
/**
 * 首页数据
 *
 */
export function getData() {
	return request({
		url: '/api/oFSDubaiShipmentDetails/getHomeData',
		method: 'get',
	});
}

/**
 * 多表导入
 *
 */
export const Import = (params?: any) =>
	request({
		url: Api.Import,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
			// multipart/form-data; boundary=----WebKitFormBoundarysuWWu6g9Xb57TSu1
		},
	});

// export const Import = (params?: any) =>
// 	request({
// 		url: Api.Import,
// 		method: 'get',
// 		params: params,
// 		headers: {
// 			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
// 		},
// 	});
