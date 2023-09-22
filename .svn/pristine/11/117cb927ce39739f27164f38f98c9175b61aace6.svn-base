import request from '/@/utils/request';
enum Api {
  AddOFSStockWarning = '/api/oFSStockWarning/add',
  DeleteOFSStockWarning = '/api/oFSStockWarning/delete',
  UpdateOFSStockWarning = '/api/oFSStockWarning/update',
  PageOFSStockWarning = '/api/oFSStockWarning/page',
}

// 增加库存预警表
export const addOFSStockWarning = (params?: any) =>
	request({
		url: Api.AddOFSStockWarning,
		method: 'post',
		data: params,
	});

// 删除库存预警表
export const deleteOFSStockWarning = (params?: any) => 
	request({
			url: Api.DeleteOFSStockWarning,
			method: 'post',
			data: params,
		});

// 编辑库存预警表
export const updateOFSStockWarning = (params?: any) => 
	request({
			url: Api.UpdateOFSStockWarning,
			method: 'post',
			data: params,
		});

// 分页查询库存预警表
export const pageOFSStockWarning = (params?: any) => 
	request({
			url: Api.PageOFSStockWarning,
			method: 'post',
			data: params,
		});


