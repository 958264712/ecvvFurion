import request from '/@/utils/request';
enum Api {
  AddSevenDaysSales = '/api/sevenDaysSales/add',
  DeleteSevenDaysSales = '/api/sevenDaysSales/delete',
  UpdateSevenDaysSales = '/api/sevenDaysSales/update',
  PageSevenDaysSales = '/api/sevenDaysSales/page',
}

// 增加SevenDaysSales
export const addSevenDaysSales = (params?: any) =>
	request({
		url: Api.AddSevenDaysSales,
		method: 'post',
		data: params,
	});

// 删除SevenDaysSales
export const deleteSevenDaysSales = (params?: any) => 
	request({
			url: Api.DeleteSevenDaysSales,
			method: 'post',
			data: params,
		});

// 编辑SevenDaysSales
export const updateSevenDaysSales = (params?: any) => 
	request({
			url: Api.UpdateSevenDaysSales,
			method: 'post',
			data: params,
		});

// 分页查询SevenDaysSales
export const pageSevenDaysSales = (params?: any) => 
	request({
			url: Api.PageSevenDaysSales,
			method: 'post',
			data: params,
		});


