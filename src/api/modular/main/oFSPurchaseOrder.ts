import request from '/@/utils/request';
enum Api {
  AddOFSPurchaseOrder = '/api/oFSPurchaseOrder/add',
  DeleteOFSPurchaseOrder = '/api/oFSPurchaseOrder/delete',
  UpdateOFSPurchaseOrder = '/api/oFSPurchaseOrder/update',
  PageOFSPurchaseOrder = '/api/oFSPurchaseOrder/page',
}

// 增加采购订单
export const addOFSPurchaseOrder = (params?: any) =>
	request({
		url: Api.AddOFSPurchaseOrder,
		method: 'post',
		data: params,
	});

// 删除采购订单
export const deleteOFSPurchaseOrder = (params?: any) => 
	request({
			url: Api.DeleteOFSPurchaseOrder,
			method: 'post',
			data: params,
		});

// 编辑采购订单
export const updateOFSPurchaseOrder = (params?: any) => 
	request({
			url: Api.UpdateOFSPurchaseOrder,
			method: 'post',
			data: params,
		});

// 分页查询采购订单
export const pageOFSPurchaseOrder = (params?: any) => 
	request({
			url: Api.PageOFSPurchaseOrder,
			method: 'post',
			data: params,
		});


