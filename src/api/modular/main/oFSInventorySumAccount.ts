import request from '/@/utils/request';
enum Api {
  AddOFSInventorySumAccount = '/api/oFSInventorySumAccount/add',
  DeleteOFSInventorySumAccount = '/api/oFSInventorySumAccount/delete',
  UpdateOFSInventorySumAccount = '/api/oFSInventorySumAccount/update',
  PageOFSInventorySumAccount = '/api/oFSInventorySumAccount/page',
}

// 增加库存汇总账
export const addOFSInventorySumAccount = (params?: any) =>
	request({
		url: Api.AddOFSInventorySumAccount,
		method: 'post',
		data: params,
	});

// 删除库存汇总账
export const deleteOFSInventorySumAccount = (params?: any) => 
	request({
			url: Api.DeleteOFSInventorySumAccount,
			method: 'post',
			data: params,
		});

// 编辑库存汇总账
export const updateOFSInventorySumAccount = (params?: any) => 
	request({
			url: Api.UpdateOFSInventorySumAccount,
			method: 'post',
			data: params,
		});

// 分页查询库存汇总账
export const pageOFSInventorySumAccount = (params?: any) => 
	request({
			url: Api.PageOFSInventorySumAccount,
			method: 'post',
			data: params,
		});


