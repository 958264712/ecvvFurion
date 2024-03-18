import request from '/@/utils/request';
enum Api {
	AddMessageConfig = '/api/messageConfig/add',
	DeleteMessageConfig = '/api/messageConfig/delete',
	UpdateMessageConfig = '/api/messageConfig/update',
	pageMessageConfig = '/api/messageConfig/page',
	AddShopifySendNotice = '/api/shopifySendNotice/add',
	DeleteShopifySendNotice = '/api/shopifySendNotice/delete',
	UpdateShopifySendNotice = '/api/shopifySendNotice/update',
	PageShopifySendNotice = '/api/shopifySendNotice/page',
	AddReceiverInfo = '/api/receiverInfo/add',
	DeleteReceiverInfo = '/api/receiverInfo/delete',
	UpdateReceiverInfo = '/api/receiverInfo/update',
	pageReceiverInfo = '/api/receiverInfo/page',
	GetDingDingID = '/ReceiverInfo/GetDingDingID',
	listMessageConfig = '/api/ReceiverInfo/list',
}

// 增加通知配置
export const addMessageConfig = (params?: any) =>
	request({
		url: Api.AddMessageConfig,
		method: 'post',
		data: params,
	});

// 删除通知配置
export const deleteMessageConfig = (params?: any) =>
	request({
		url: Api.DeleteMessageConfig,
		method: 'post',
		data: params,
	});

// 编辑通知配置
export const updateMessageConfig = (params?: any) =>
	request({
		url: Api.UpdateMessageConfig,
		method: 'post',
		data: params,
	});
// pageMessageConfig
// 分页查询通知配置
export const pageMessageConfig = (params?: any) =>
	request({
		url: Api.pageMessageConfig,
		method: 'post',
		data: params,
	});
// listMessageConfig
export const listMessageConfig = (params?: any) =>
	request({
		url: Api.listMessageConfig,
		method: 'get',
		params: params,
	});

// 增加消息通知表
export const addShopifySendNotice = (params?: any) =>
	request({
		url: Api.AddShopifySendNotice,
		method: 'post',
		data: params,
	});

// 删除消息通知表
export const deleteShopifySendNotice = (params?: any) =>
	request({
		url: Api.DeleteShopifySendNotice,
		method: 'post',
		data: params,
	});

// 编辑消息通知表
export const updateShopifySendNotice = (params?: any) =>
	request({
		url: Api.UpdateShopifySendNotice,
		method: 'post',
		data: params,
	});

// 分页查询消息通知表
export const pageShopifySendNotice = (params?: any) =>
	request({
		url: Api.PageShopifySendNotice,
		method: 'post',
		data: params,
	});
// 增加接收人信息
export const addReceiverInfo = (params?: any) =>
	request({
		url: Api.AddReceiverInfo,
		method: 'post',
		data: params,
	});

// 删除接收人信息
export const deleteReceiverInfo = (params?: any) =>
	request({
		url: Api.DeleteReceiverInfo,
		method: 'post',
		data: params,
	});

// 编辑接收人信息
export const updateReceiverInfo = (params?: any) =>
	request({
		url: Api.UpdateReceiverInfo,
		method: 'post',
		data: params,
	});
// 分页查询接收人信息
export const pageReceiverInfo = (params?: any) =>
	request({
		url: Api.pageReceiverInfo,
		method: 'post',
		data: params,
	});
// GetDingDingID
export const GetDingDingID = (params?: any) =>
	request({
		url: Api.GetDingDingID,
		method: 'get',
		params: params,
	});