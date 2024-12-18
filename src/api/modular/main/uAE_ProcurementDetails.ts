import request from '/@/utils/request';
enum Api {
	AddUAE_ProcurementDetails = '/api/procurementDetails/add',
	DeleteUAE_ProcurementDetails = '/api/procurementDetails/delete',
	UpdateUAE_ProcurementDetails = '/api/procurementDetails/update',
	PageUAE_ProcurementDetails = '/api/procurementDetails/page',
	PageSA_ProcurementDetails = '/api/procurementDetails/sAPage',
	UAEgetInventorySKUBasicInfo = '/api/procurementDetails/uAEGetInventorySKUBasicInfo',
	uSAGetInventorySKUBasicInfo = '/api/procurementDetails/uSAGetInventorySKUBasicInfo',
	eGGetInventorySKUBasicInfo = '/api/procurementDetails/eGGetInventorySKUBasicInfo',
	SAgetInventorySKUBasicInfo = '/api/procurementDetails/sAGetInventorySKUBasicInfo',
	UAEExportInventorySKUBasicInfo = '/api/procurementDetails/uAEExportInventorySKUBasicInfo',
	uSAExportInventorySKUBasicInfo = '/api/procurementDetails/uSAExportInventorySKUBasicInfo',
	eGExportInventorySKUBasicInfo = '/api/procurementDetails/eGExportInventorySKUBasicInfo',
	SAExportInventorySKUBasicInfo = '/api/procurementDetails/sAExportInventorySKUBasicInfo',
	AddCN_OperationalProductAttributes = '/api/cN_OperationalProductAttributes/add',
	DeleteCN_OperationalProductAttributes = '/api/cN_OperationalProductAttributes/delete',
	UpdateCN_OperationalProductAttributes = '/api/cN_OperationalProductAttributes/update',
	PageCN_OperationalProductAttributes = '/api/cN_OperationalProductAttributes/page',
	getBarCodesDownloadPath = '/api/cN_OperationalProductAttributes/getBarCodesDownloadPath',
	Import = '/api/CN_OperationalProductAttributes/import',
	DataImport = '/api/procurementDetails/import',
	InventoryManagementInfo = '/api/inventoryManagement/getInventoryManagementInfo',
	ImportInventoryManagement = '/api/inventoryManagement/Imports',
	getInterestRate = '/api/procurementDetails/getInterestRate',
	updateConfig = '/api/procurementDetails/updateConfig'
}
// 轮询获取zip地址
export const getBarCodesDownloadPath = (params?: any) =>
	request({
		url: Api.getBarCodesDownloadPath,
		method: 'get',
		params: params,
	});

// 增加UAE采购明细表
export const addUAE_ProcurementDetails = (params?: any) =>
	request({
		url: Api.AddUAE_ProcurementDetails,
		method: 'post',
		data: params,
	});

// 删除UAE采购明细表
export const deleteUAE_ProcurementDetails = (params?: any) =>
	request({
		url: Api.DeleteUAE_ProcurementDetails,
		method: 'post',
		data: params,
	});

// 编辑UAE采购明细表
export const updateUAE_ProcurementDetails = (params?: any) =>
	request({
		url: Api.UpdateUAE_ProcurementDetails,
		method: 'post',
		data: params,
	});

// 分页查询UAE采购明细表 -- UAE
export const pageUAE_ProcurementDetails = (params?: any) =>
	request({
		url: Api.PageUAE_ProcurementDetails,
		method: 'post',
		data: params,
	});

// 分页查询UAE采购明细表 -- SA
export const pageSA_ProcurementDetails = (params?: any) =>
	request({
		url: Api.PageSA_ProcurementDetails,
		method: 'post',
		data: params,
	});

// 库存sku基础信息 --UAE
export const uAEgetInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.UAEgetInventorySKUBasicInfo,
		method: 'get',
		params: params,
	});
// 库存sku基础信息 --USA
export const uSAGetInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.uSAGetInventorySKUBasicInfo,
		method: 'get',
		params: params,
	});
// 库存sku基础信息 --EG
export const eGGetInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.eGGetInventorySKUBasicInfo,
		method: 'get',
		params: params,
	});
// 库存sku基础信息 --SA
export const sAgetInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.SAgetInventorySKUBasicInfo,
		method: 'get',
		params: params,
	});

// 导出库存sku基础信息 -- UAE
export const uAEExportInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.UAEExportInventorySKUBasicInfo,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 导出库存sku基础信息 -- USA
export const uSAExportInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.uSAExportInventorySKUBasicInfo,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 导出库存sku基础信息 -- EG
export const eGExportInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.eGExportInventorySKUBasicInfo,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 导出库存sku基础信息 -- SA
export const sAExportInventorySKUBasicInfo = (params?: any) =>
	request({
		url: Api.SAExportInventorySKUBasicInfo,
		method: 'post',
		data: params,
		responseType: 'blob',
	});

// 增加CN运营产品属性表
export const addCN_OperationalProductAttributes = (params?: any) =>
	request({
		url: Api.AddCN_OperationalProductAttributes,
		method: 'post',
		data: params,
	});

// 删除CN运营产品属性表
export const deleteCN_OperationalProductAttributes = (params?: any) =>
	request({
		url: Api.DeleteCN_OperationalProductAttributes,
		method: 'post',
		data: params,
	});

// 编辑CN运营产品属性表
export const updateCN_OperationalProductAttributes = (params?: any) =>
	request({
		url: Api.UpdateCN_OperationalProductAttributes,
		method: 'post',
		data: params,
	});

// 分页查询CN运营产品属性表
export const pageCN_OperationalProductAttributes = (params?: any) =>
	request({
		url: Api.PageCN_OperationalProductAttributes,
		method: 'post',
		data: params,
	});

// 导入CN运营产品属性
export const Import = (params?: any) =>
	request({
		url: Api.Import,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

// 导入采购明细
export const DataImport = (params?: any) =>
	request({
		url: Api.DataImport,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
// 分页查询库存管理
export const InventoryManagementInfo = (params?: any) =>
	request({
		url: Api.InventoryManagementInfo,
		method: 'get',
		data: params,
	});
export const ImportInventoryManagement = (params?: any,obj?:any) =>
	request({
		url: Api.ImportInventoryManagement + '/' + obj.table + '/' + obj.Type,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});

export const getInterestRate = (params?: any) =>
	request({
		url: Api.getInterestRate,
		method: 'post',
		data: params,
	});
export const updateConfig = (params?: any) =>
	request({
		url: Api.updateConfig,
		method: 'post',
		data: params,
	});