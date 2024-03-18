import request from '/@/utils/request';
enum Api {
  AddOFSProductNameDetail = '/api/oFSProductNameDetail/add',
  DeleteOFSProductNameDetail = '/api/oFSProductNameDetail/delete',
  UpdateOFSProductNameDetail = '/api/oFSProductNameDetail/update',
  PageOFSProductNameDetail = '/api/oFSProductNameDetail/page',
}

// 增加商品名称明细表
export const addOFSProductNameDetail = (params?: any) =>
	request({
		url: Api.AddOFSProductNameDetail,
		method: 'post',
		data: params,
	});

// 删除商品名称明细表
export const deleteOFSProductNameDetail = (params?: any) => 
	request({
			url: Api.DeleteOFSProductNameDetail,
			method: 'post',
			data: params,
		});

// 编辑商品名称明细表
export const updateOFSProductNameDetail = (params?: any) => 
	request({
			url: Api.UpdateOFSProductNameDetail,
			method: 'post',
			data: params,
		});

// 分页查询商品名称明细表
export const pageOFSProductNameDetail = (params?: any) => 
	request({
			url: Api.PageOFSProductNameDetail,
			method: 'post',
			data: params,
		});


