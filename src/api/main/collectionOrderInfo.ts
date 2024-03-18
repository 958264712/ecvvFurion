import request from '/@/utils/request';
enum Api {
  AddCollectionOrderInfo = '/api/collectionOrderInfo/add',
  DeleteCollectionOrderInfo = '/api/collectionOrderInfo/delete',
  UpdateCollectionOrderInfo = '/api/collectionOrderInfo/update',
  PageCollectionOrderInfo = '/api/collectionOrderInfo/page',
}

// 增加集货信息
export const addCollectionOrderInfo = (params?: any) =>
	request({
		url: Api.AddCollectionOrderInfo,
		method: 'post',
		data: params,
	});

// 删除集货信息
export const deleteCollectionOrderInfo = (params?: any) => 
	request({
			url: Api.DeleteCollectionOrderInfo,
			method: 'post',
			data: params,
		});

// 编辑集货信息
export const updateCollectionOrderInfo = (params?: any) => 
	request({
			url: Api.UpdateCollectionOrderInfo,
			method: 'post',
			data: params,
		});

// 分页查询集货信息
export const pageCollectionOrderInfo = (params?: any) => 
	request({
			url: Api.PageCollectionOrderInfo,
			method: 'post',
			data: params,
		});


