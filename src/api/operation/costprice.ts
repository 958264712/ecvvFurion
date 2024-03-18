import request from '/@/utils/request';
enum Api {
	AddCostpeice = '/api/costprice/add',
	DeleteCostpeice = '/api/costprice/delete',
	UpdateCostpeice = '/api/costprice/update',
	PageCostpeice = '/api/costprice/page',
}

// 增加Costpeice
export const addCostpeice = (params?: any) =>
	request({
		url: Api.AddCostpeice,
		method: 'post',
		data: params,
	});

// 删除Costpeice
export const deleteCostpeice = (params?: any) =>
	request({
		url: Api.DeleteCostpeice,
		method: 'post',
		data: params,
	});

// 编辑Costpeice
export const updateCostpeice = (params?: any) =>
	request({
		url: Api.UpdateCostpeice,
		method: 'post',
		data: params,
	});

// 分页查询Costpeice
export const pageCostpeice = (params?: any) =>
	request({
		url: Api.PageCostpeice,
		method: 'post',
		data: params,
	});
