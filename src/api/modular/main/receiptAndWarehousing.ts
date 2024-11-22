import request from '/@/utils/request';
enum Api {
	receiptAndWarehousingPage = '/api/receiptAndWarehousing/page',
	receiptAndWarehousingUpdate = '/api/receiptAndWarehousing/update',
	receiptAndWarehousingImport = '/api/receiptAndWarehousing/import',
	receiptAndWarehousingExport = '/api/receiptAndWarehousing/export',
}

// 分页查询收货入仓页面
export const receiptAndWarehousingPage = (params?: any) =>
	request({
		url: Api.receiptAndWarehousingPage,
		method: 'get',
		params: params,
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

