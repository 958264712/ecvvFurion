import request from '/@/utils/request';
enum Api {
	AddAMZInventory_Batch = '/api/aMZInventory_Batch/add',
	DeleteAMZInventory_Batch = '/api/aMZInventory_Batch/delete',
	UpdateAMZInventory_Batch = '/api/aMZInventory_Batch/update',
	PageAMZInventory_Batch = '/api/aMZInventory_Batch/page',
	Import = '/api/aMZInventory_Batch/import/import',
}

// 增加AMZInventory_Batch
export const addAMZInventory_Batch = (params?: any) =>
	request({
		url: Api.AddAMZInventory_Batch,
		method: 'post',
		data: params,
	});

// 删除AMZInventory_Batch
export const deleteAMZInventory_Batch = (params?: any) =>
	request({
		url: Api.DeleteAMZInventory_Batch,
		method: 'post',
		data: params,
	});

// 编辑AMZInventory_Batch
export const updateAMZInventory_Batch = (params?: any) =>
	request({
		url: Api.UpdateAMZInventory_Batch,
		method: 'post',
		data: params,
	});

// 分页查询AMZInventory_Batch
export const pageAMZInventory_Batch = (params?: any) =>
	request({
		url: Api.PageAMZInventory_Batch,
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
