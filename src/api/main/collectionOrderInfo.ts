import request from '/@/utils/request';
enum Api {
	AddCollectionOrderInfo = '/api/collectionOrderInfo/add',
	DeleteCollectionOrderInfo = '/api/collectionOrderInfo/delete',
	UpdateCollectionOrderInfo = '/api/collectionOrderInfo/update',
	PageCollectionOrderInfo = '/api/collectionOrderInfo/page',
	getCusRecordList = '/api/collectionOrderInfo/getCusRecordList/',
	downCusRecordList = '/api/collectionOrderInfo/downCusRecord/',
	unlockCusRecord = '/api/collectionOrderInfo/unlockCusRecord/',
}

// 下载历史报关件
export const downHistoryCustoms = (params?: any, id?: any) =>
	request({
		url: Api.downCusRecordList + id,
		method: 'post',
		data: params,
		responseType: 'blob',
	});
// 获取报关件记录列表
export const getOriginalCustoms = (params?: any, documentNo?: any) =>
	request({
		url: Api.getCusRecordList + documentNo,
		method: 'post',
		data: params,
	});
// 解锁集货单修改状态
export const unlockCusRecord = (params?: any, documentNo?: any, notes?: any) =>
	request({
		url: Api.unlockCusRecord + documentNo + '/' + notes,
		method: 'post',
		data: params,
	});
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


