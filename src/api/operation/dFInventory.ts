import request from '/@/utils/request';
enum Api {
  AddDFInventory = '/api/dFInventory/add',
  DeleteDFInventory = '/api/dFInventory/delete',
  UpdateDFInventory = '/api/dFInventory/update',
  PageDFInventory = '/api/dFInventory/page',
}

// 增加DFInventory
export const addDFInventory = (params?: any) =>
	request({
		url: Api.AddDFInventory,
		method: 'post',
		data: params,
	});

// 删除DFInventory
export const deleteDFInventory = (params?: any) => 
	request({
			url: Api.DeleteDFInventory,
			method: 'post',
			data: params,
		});

// 编辑DFInventory
export const updateDFInventory = (params?: any) => 
	request({
			url: Api.UpdateDFInventory,
			method: 'post',
			data: params,
		});

// 分页查询DFInventory
export const pageDFInventory = (params?: any) => 
	request({
			url: Api.PageDFInventory,
			method: 'post',
			data: params,
		});


