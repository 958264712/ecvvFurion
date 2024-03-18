import request from '/@/utils/request';
enum Api {
  AddOFSInventoryQuery = '/api/oFSInventoryQuery/add',
  DeleteOFSInventoryQuery = '/api/oFSInventoryQuery/delete',
  UpdateOFSInventoryQuery = '/api/oFSInventoryQuery/update',
  PageOFSInventoryQuery = '/api/oFSInventoryQuery/page',
}

// 增加库存查询
export const addOFSInventoryQuery = (params?: any) =>
	request({
		url: Api.AddOFSInventoryQuery,
		method: 'post',
		data: params,
	});

// 删除库存查询
export const deleteOFSInventoryQuery = (params?: any) => 
	request({
			url: Api.DeleteOFSInventoryQuery,
			method: 'post',
			data: params,
		});

// 编辑库存查询
export const updateOFSInventoryQuery = (params?: any) => 
	request({
			url: Api.UpdateOFSInventoryQuery,
			method: 'post',
			data: params,
		});

// 分页查询库存查询
export const pageOFSInventoryQuery = (params?: any) => 
	request({
			url: Api.PageOFSInventoryQuery,
			method: 'post',
			data: params,
		});


