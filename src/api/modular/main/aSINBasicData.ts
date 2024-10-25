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
	newPage = '/api/newPoData/page',
	newSaudiPage = '/api/newPoData/saudiPage',
	getConfirmedNewPOsPage = '/api/newPoData/getConfirmedNewPOsPage',
	getBarCode = '/api/newPoData/getBarCode',
	exportNewPoData = '/api/newPoData/exportNewPoData',
	upLoadNewPoData = '/api/newPoData/upLoadNewPoData',
	upLoadNewPoDataDownBarCode = '/api/newPoData/upLoadNewPoDataDownBarCode',
	newUpdate = '/api/newPoData/update',
	newMultipleExportByTemplate = '/api/newPoData/multipleExportByTemplate',
	newMultipleExportByTemplateListBin = '/api/newPoData/multipleExportByTemplate2',
	newDownLoadPOZip = '/api/newPoData/downLoadPOZip',
	downLoadPODataTemplate = '/api/newPoData/downLoadPODataTemplate',
	getNewPoDataExportHistory = '/api/newPoData/getNewPoDataExportHistory',
	exprotShipmentConfrmationPage = '/api/exprotShipmentConfrmation/page',
	exprotShipmentConfrmationDeliveryList = '/api/exprotShipmentConfrmation/exportDeliveryList',
}
// 根据导入的NewPoData，导出条形码
export const upLoadNewPoDataDownBarCode = (params?: any,checkbox?:boolean) =>
	request({
		url: Api.upLoadNewPoDataDownBarCode+'/'+checkbox,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
// 导出出货清单列表
export const exprotShipmentConfrmationDeliveryList = (params?: any) =>
	request({
		url: Api.exprotShipmentConfrmationDeliveryList,
		method: 'post',
		data: params,
		responseType:'blob'
	});
// 获取导出发货确认单
export const exprotShipmentConfrmationPage = (params?: any) =>
	request({
		url: Api.exprotShipmentConfrmationPage,
		method: 'post',
		data: params,
	});
// 获取导出历史记录
export const getNewPoDataExportHistory = (params?: any) =>
	request({
		url: Api.getNewPoDataExportHistory + '/' + params.page + '/' + params.pageSize,
		method: 'get',
		// params: params,
	});

// 查询迪拜PO单数据源
export const newPage = (params?: any) =>
	request({
		url: Api.newPage,
		method: 'post',
		data: params,
	});

// newSaudiPage单表
export const newSaudiPage = (params?: any) =>
	request({
		url: Api.newSaudiPage,
		method: 'post',
		data: params,
	});

// 获取ConfirmedNewPOs详情
export const getConfirmedNewPOsPage = (params?: any) =>
	request({
		url: Api.getConfirmedNewPOsPage,
		method: 'post',
		data: params,
	});
// 导入newpodata修改数据的状态
export const upLoadNewPoData = (params?: any) =>
	request({
		url: Api.upLoadNewPoData,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
// 导出选中的NewPoData列表
export const exportNewPoData = (params?: any) =>
	request({
		url: Api.exportNewPoData,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 导出getBarCode
export const getBarCode = (params?: any) =>
	request({
		url: Api.getBarCode,
		method: 'post',
		data: params,
		responseType: 'blob',
		timeout:120000
	});
// 编辑newUpdate单表
export const newUpdate = (params?: any) =>
	request({
		url: Api.newUpdate,
		method: 'post',
		data: params,
	});
// 更新PO订单 newMultipleExportByTemplate
export const newMultipleExportByTemplate = (params?: any) =>
	request({
		url: Api.newMultipleExportByTemplate,
		method: 'post',
		data: params,
	});
// 更新PO订单 newMultipleExportByTemplateListBin
export const newMultipleExportByTemplateListBin = (params?: any) =>
	request({
		url: Api.newMultipleExportByTemplateListBin,
		method: 'post',
		data: params,
	});
// 下载拣货单模板 downLoadPODataTemplate
export const downLoadPODataTemplate = (params?: any) =>
	request({
		url: Api.downLoadPODataTemplate,
		method: 'post',
		data: params,
		responseType:'blob'
	});
// 更新PO订单 newDownLoadPOZip
export const newDownLoadPOZip = (params?: any) =>
	request({
		url: Api.newDownLoadPOZip,
		method: 'post',
		data: params,
	});
// 更新PO订单 Imports
export const ImportPO = (params?: any,cover?:string) =>
	request({
		url: Api.importPO + '/' + cover,
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
		url: Api.Import + '/' + params.Site,
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
