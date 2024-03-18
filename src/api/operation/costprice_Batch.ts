import request from '/@/utils/request';
enum Api {
	AddCostpeice_Batch = '/api/costprice_Batch/add',
	DeleteCostpeice_Batch = '/api/costprice_Batch/delete',
	UpdateCostpeice_Batch = '/api/costprice_Batch/update',
	PageCostpeice_Batch = '/api/costprice_Batch/page',
	Import = '/api/costprice_Batch/import/import',
}

// 增加Costpeice
export const addCostpeice_Batch = (params?: any) =>
	request({
		url: Api.AddCostpeice_Batch,
		method: 'post',
		data: params,
	});

// 删除Costpeice
export const deleteCostpeice_Batch = (params?: any) =>
	request({
		url: Api.DeleteCostpeice_Batch,
		method: 'post',
		data: params,
	});

// 编辑Costpeice
export const updateCostpeice_Batch = (params?: any) =>
	request({
		url: Api.UpdateCostpeice_Batch,
		method: 'post',
		data: params,
	});

// 分页查询Costpeice
export const pageCostpeice_Batch = (params?: any) =>
	request({
		url: Api.PageCostpeice_Batch,
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
