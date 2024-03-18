import request from '/@/utils/request';
enum Api {
	AddDFInventory_Batch = '/api/dFInventory_Batch/add',
	DeleteDFInventory_Batch = '/api/dFInventory_Batch/delete',
	UpdateDFInventory_Batch = '/api/dFInventory_Batch/update',
	PageDFInventory_Batch = '/api/dFInventory_Batch/page',
	Import = '/api/dFInventory_Batch/import/import',
}

// 增加 DF Inventory导入数据
export const addDFInventory_Batch = (params?: any) =>
	request({
		url: Api.AddDFInventory_Batch,
		method: 'post',
		data: params,
	});

// 删除 DF Inventory导入数据
export const deleteDFInventory_Batch = (params?: any) =>
	request({
		url: Api.DeleteDFInventory_Batch,
		method: 'post',
		data: params,
	});

// 编辑 DF Inventory导入数据
export const updateDFInventory_Batch = (params?: any) =>
	request({
		url: Api.UpdateDFInventory_Batch,
		method: 'post',
		data: params,
	});

// 分页查询 DF Inventory导入数据
export const pageDFInventory_Batch = (params?: any) =>
	request({
		url: Api.PageDFInventory_Batch,
		method: 'post',
		data: params,
	});

// 导入
export const Import = (params?: any) =>
	request({
		url: Api.Import,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
