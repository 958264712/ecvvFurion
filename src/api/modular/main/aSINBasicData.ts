import request from '/@/utils/request';
enum Api {
	AddASINBasicData = '/api/aSINBasicData/add',
	DeleteASINBasicData = '/api/aSINBasicData/delete',
	UpdateASINBasicData = '/api/aSINBasicData/update',
	BatchDeleteASINBasicData = '/api/aSINBasicData/BatchDelete',
	PageASINBasicData = '/api/aSINBasicData/page',
	Import = '/api/aSINBasicData/import',
	ExportASIN = '/api/aSINBasicData/exportASIN',
	AddPoData = '/api/poData/add',
	DeletePoData = '/api/poData/delete',
	UpdatePoData = '/api/poData/update',
	saudiPagePoData = '/api/poData/saudiPage',
	PagePoData = '/api/poData/page',
	poDataSourcePage = '/api/poData/poDataSourcePage',
	updateOrderDate = '/api/poData/updateOrderDate',
	bulkImportOrderDate = '/api/poData/bulkImportOrderDate',
	multipleExportByTemplate = '/api/poData/multipleExportByTemplate',
	importPO = '/api/poData/import',
	downLoadPOZip = '/api/poData/downLoadPOZip',
}

// 更新PO订单 Imports
export const ImportPO = (params?: any) =>
	request({
		url: Api.importPO,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

// 更新PO订单 bulkImportOrderDate
export const bulkImportOrderDate = (params?: any) =>
	request({
		url: Api.bulkImportOrderDate,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

// 更新PO订单 multipleExportByTemplate
export const multipleExportByTemplate = (params?: any) =>
	request({
		url: Api.multipleExportByTemplate,
		method: 'post',
		data: params,
	});

// 更新PO订单 downLoadPOZip
export const downLoadPOZip = (params?: any) =>
	request({
		url: Api.downLoadPOZip,
		method: 'post',
		data: params,
	});

// 更新PO订单 orderdate字段
export const updateOrderDate = (params?: any) =>
	request({
		url: Api.updateOrderDate,
		method: 'get',
		params: params,
	});

// 查询迪拜，沙特PO单数据源
export const poDataSourcePage = (params?: any) =>
	request({
		url: Api.poDataSourcePage,
		method: 'post',
		data: params,
	});

// 增加PO单表
export const addPoData = (params?: any) =>
	request({
		url: Api.AddPoData,
		method: 'post',
		data: params,
	});

// 删除PO单表
export const deletePoData = (params?: any) =>
	request({
		url: Api.DeletePoData,
		method: 'post',
		data: params,
	});

// 编辑PO单表
export const updatePoData = (params?: any) =>
	request({
		url: Api.UpdatePoData,
		method: 'post',
		data: params,
	});

// 分页查询PO单表
export const pagePoData = (params?: any) =>
	request({
		url: Api.PagePoData,
		method: 'post',
		data: params,
	});
// 分页查询saudiPO单表
export const saudiPagePoData = (params?: any) =>
	request({
		url: Api.saudiPagePoData,
		method: 'post',
		data: params,
	});
// 导入ASIN
export const Import = (params?: any) =>
	request({
		url: Api.Import,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
// 导出ASIN
export const ExportASIN = (params?: any) =>
	request({
		url: Api.ExportASIN,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 增加ASIN基础数据
export const addASINBasicData = (params?: any) =>
	request({
		url: Api.AddASINBasicData,
		method: 'post',
		data: params,
	});
// 批量删除ASIN基础数据
export const deleteASINBasicData = (params?: any) =>
	request({
		url: Api.DeleteASINBasicData,
		method: 'post',
		data: params,
	});
// 删除ASIN基础数据
export const batchDeleteASINBasicData = (params?: any) =>
	request({
		url: Api.BatchDeleteASINBasicData,
		method: 'post',
		data: params,
	});

// 编辑ASIN基础数据
export const updateASINBasicData = (params?: any) =>
	request({
		url: Api.UpdateASINBasicData,
		method: 'post',
		data: params,
	});

// 分页查询ASIN基础数据
export const pageASINBasicData = (params?: any) =>
	request({
		url: Api.PageASINBasicData,
		method: 'post',
		data: params,
	});
