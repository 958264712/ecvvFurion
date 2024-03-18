import request from '/@/utils/request';
enum Api {
  AddAMZInventory = '/api/aMZInventory/add',
  DeleteAMZInventory = '/api/aMZInventory/delete',
  UpdateAMZInventory = '/api/aMZInventory/update',
  PageAMZInventory = '/api/aMZInventory/page',
}

// 增加AMZInventory
export const addAMZInventory = (params?: any) =>
	request({
		url: Api.AddAMZInventory,
		method: 'post',
		data: params,
	});

// 删除AMZInventory
export const deleteAMZInventory = (params?: any) => 
	request({
			url: Api.DeleteAMZInventory,
			method: 'post',
			data: params,
		});

// 编辑AMZInventory
export const updateAMZInventory = (params?: any) => 
	request({
			url: Api.UpdateAMZInventory,
			method: 'post',
			data: params,
		});

// 分页查询AMZInventory
export const pageAMZInventory = (params?: any) => 
	request({
			url: Api.PageAMZInventory,
			method: 'post',
			data: params,
		});


