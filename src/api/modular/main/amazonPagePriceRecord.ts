import request from '/@/utils/request';
enum Api {
	AddAmazonPagePriceRecord = '/api/amazonPagePriceRecord/add',
	DeleteAmazonPagePriceRecord = '/api/amazonPagePriceRecord/delete',
	UpdateAmazonPagePriceRecord = '/api/amazonPagePriceRecord/update',
	PageAmazonPagePriceRecord = '/api/amazonPagePriceRecord/page',
	AddAmazonPriceRecordSA = '/api/amazonPriceRecordSA/add',
	DeleteAmazonPriceRecordSA = '/api/amazonPriceRecordSA/delete',
	UpdateAmazonPriceRecordSA = '/api/amazonPriceRecordSA/update',
	PageAmazonPriceRecordSA = '/api/amazonPriceRecordSA/page',
	AddAmazonProductPricebase = '/api/amazonProductPricebase/add',
	DeleteAmazonProductPricebase = '/api/amazonProductPricebase/delete',
	UpdateAmazonProductPricebase = '/api/amazonProductPricebase/update',
	PageAmazonProductPricebase = '/api/amazonProductPricebase/page',
	Amazondataimport = '/api/amazonProductPricebase/import',
	AmazondataExport = '/api/amazonProductPricebase/export',
	AmazondataFollowExport = '/api/amazonProductPricebase/exportFollow',
	AmazonProductPricebaseAdjustPrice = '/api/amazonProductPricebase/adjustPrice',
	AmazonProductBatchDelete = '/api/amazonProductPricebase/batchdelete',
	AddAmazonProPricebaseSA = '/api/amazonProPricebaseSA/add',
	DeleteAmazonProPricebaseSA = '/api/amazonProPricebaseSA/delete',
	UpdateAmazonProPricebaseSA = '/api/amazonProPricebaseSA/update',
	PageAmazonProPricebaseSA = '/api/amazonProPricebaseSA/page',
	AmazondataimportSA = '/api/amazonProPricebaseSA/import',
	AmazondataExportSA = '/api/amazonProPricebaseSA/export',
	AmazonProductPricebaseAdjustPriceSA = '/api/amazonProPricebaseSA/adjustPrice',
	AmazonProductBatchDeleteSA = '/api/amazonProPricebaseSA/batchDelete',
	getAEAmazonState = '/api/amazonProductPricebase/getAEAmazonState',
	getSAAmazonState = '/api/amazonProPricebaseSA/getSAAmazonState',
	getScheduledFulfillmentList = '/api/newPoData/getScheduledFulfillmentList',
	getAppointmentList = '/api/newPoData/getAppointmentList',
}

// 获取ScheduledFulfillment列表 工作台
export const getScheduledFulfillmentList = (params?: any) =>
	request({
		url: Api.getScheduledFulfillmentList,
		method: 'post',
		data: params,
	});
// 获取Appointment列表 工作台
export const getAppointmentList = (params?: any) =>
	request({
		url: Api.getAppointmentList,
		method: 'post',
		data: params,
	});

// AE抓取数据信息
export const getAEAmazonState = (params?: any) =>
	request({
		url: Api.getAEAmazonState,
		method: 'get',
		params: params,
	});
// SA抓取数据信息
export const getSAAmazonState = (params?: any) =>
	request({
		url: Api.getSAAmazonState,
		method: 'get',
		params: params,
	});
// 增加价格抓取记录
export const addAmazonPagePriceRecord = (params?: any) =>
	request({
		url: Api.AddAmazonPagePriceRecord,
		method: 'post',
		data: params,
	});

// 删除价格抓取记录
export const deleteAmazonPagePriceRecord = (params?: any) =>
	request({
		url: Api.DeleteAmazonPagePriceRecord,
		method: 'post',
		data: params,
	});

// 编辑价格抓取记录
export const updateAmazonPagePriceRecord = (params?: any) =>
	request({
		url: Api.UpdateAmazonPagePriceRecord,
		method: 'post',
		data: params,
	});

// 分页查询价格抓取记录
export const pageAmazonPagePriceRecord = (params?: any) =>
	request({
		url: Api.PageAmazonPagePriceRecord,
		method: 'post',
		data: params,
	});
// 增加沙特站价格抓取记录
export const addAmazonPriceRecordSA = (params?: any) =>
	request({
		url: Api.AddAmazonPriceRecordSA,
		method: 'post',
		data: params,
	});

// 删除沙特站价格抓取记录
export const deleteAmazonPriceRecordSA = (params?: any) =>
	request({
		url: Api.DeleteAmazonPriceRecordSA,
		method: 'post',
		data: params,
	});

// 编辑沙特站价格抓取记录
export const updateAmazonPriceRecordSA = (params?: any) =>
	request({
		url: Api.UpdateAmazonPriceRecordSA,
		method: 'post',
		data: params,
	});

// 分页查询沙特站价格抓取记录
export const pageAmazonPriceRecordSA = (params?: any) =>
	request({
		url: Api.PageAmazonPriceRecordSA,
		method: 'post',
		data: params,
	});
// 增加产品价格基础表
export const addAmazonProductPricebase = (params?: any) =>
	request({
		url: Api.AddAmazonProductPricebase,
		method: 'post',
		data: params,
	});

// 删除产品价格基础表
export const deleteAmazonProductPricebase = (params?: any) =>
	request({
		url: Api.DeleteAmazonProductPricebase,
		method: 'post',
		data: params,
	});

// 编辑产品价格基础表
export const updateAmazonProductPricebase = (params?: any) =>
	request({
		url: Api.UpdateAmazonProductPricebase,
		method: 'post',
		data: params,
	});

// 分页查询产品价格基础表
export const pageAmazonProductPricebase = (params?: any) =>
	request({
		url: Api.PageAmazonProductPricebase,
		method: 'post',
		data: params,
	});

// import
export const Amazondataimport = (params?: any) =>
	request({
		url: Api.Amazondataimport,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

// export
export const AmazondataExport = (params?: any) =>
	request({
		url: Api.AmazondataExport,
		method: 'get',
		params: params,
		responseType: 'blob',
	});
// FollowExport
export const AmazondataFollowExport = (params?: any) =>
	request({
		url: Api.AmazondataFollowExport,
		method: 'get',
		params: params,
		responseType: 'blob',
	});
// AmazonProductPricebaseAdjustPrice
export const AmazonProductPricebaseAdjustPrice = (params?: any) =>
	request({
		url: Api.AmazonProductPricebaseAdjustPrice,
		method: 'post',
		data: params,
	});
// AmazonProductBatchDelete
export const AmazonProductBatchDelete = (params?: any) =>
	request({
		url: Api.AmazonProductBatchDelete,
		method: 'post',
		data: params,
	});
// 增加沙特站产品价格基础表
export const addAmazonProPricebaseSA = (params?: any) =>
	request({
		url: Api.AddAmazonProPricebaseSA,
		method: 'post',
		data: params,
	});

// 删除沙特站产品价格基础表
export const deleteAmazonProPricebaseSA = (params?: any) =>
	request({
		url: Api.DeleteAmazonProPricebaseSA,
		method: 'post',
		data: params,
	});

// 编辑沙特站产品价格基础表
export const updateAmazonProPricebaseSA = (params?: any) =>
	request({
		url: Api.UpdateAmazonProPricebaseSA,
		method: 'post',
		data: params,
	});

// 分页查询沙特站产品价格基础表
export const pageAmazonProPricebaseSA = (params?: any) =>
	request({
		url: Api.PageAmazonProPricebaseSA,
		method: 'post',
		data: params,
	});

// import
export const AmazondataimportSA = (params?: any) =>
	request({
		url: Api.AmazondataimportSA,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

// export
export const AmazondataExportSA = (params?: any) =>
	request({
		url: Api.AmazondataExportSA,
		method: 'get',
		params: params,
		responseType: 'blob',
	});

// AmazonProductPricebaseAdjustPrice
export const AmazonProductPricebaseAdjustPriceSA = (params?: any) =>
	request({
		url: Api.AmazonProductPricebaseAdjustPrice,
		method: 'post',
		data: params,
	});
// AmazonProductBatchDeleteSA
export const AmazonProductBatchDeleteSA = (params?: any) =>
	request({
		url: Api.AmazonProductBatchDeleteSA,
		method: 'post',
		data: params,
	});
