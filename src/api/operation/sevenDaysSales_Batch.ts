import request from '/@/utils/request';
enum Api {
	AddSevenDaysSales_Batch = '/api/sevenDaysSales_Batch/add',
	DeleteSevenDaysSales_Batch = '/api/sevenDaysSales_Batch/delete',
	UpdateSevenDaysSales_Batch = '/api/sevenDaysSales_Batch/update',
	PageSevenDaysSales_Batch = '/api/sevenDaysSales_Batch/page',
	Import = '/api/sevenDaysSales_Batch/import/import',
}

// 增加 7 Days Sales
export const addSevenDaysSales_Batch = (params?: any) =>
	request({
		url: Api.AddSevenDaysSales_Batch,
		method: 'post',
		data: params,
	});

// 删除 7 Days Sales
export const deleteSevenDaysSales_Batch = (params?: any) =>
	request({
		url: Api.DeleteSevenDaysSales_Batch,
		method: 'post',
		data: params,
	});

// 编辑 7 Days Sales
export const updateSevenDaysSales_Batch = (params?: any) =>
	request({
		url: Api.UpdateSevenDaysSales_Batch,
		method: 'post',
		data: params,
	});

// 分页查询 7 Days Sales
export const pageSevenDaysSales_Batch = (params?: any) =>
	request({
		url: Api.PageSevenDaysSales_Batch,
		method: 'post',
		data: params,
	});

// 导入
export const Import = (params?: any) =>
	request({
		url: Api.Import,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
