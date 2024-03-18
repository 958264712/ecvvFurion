import request from '/@/utils/request';
enum Api {
	AsinDataPage = '/api/aSINData/page',
	GetNotImportedList = '/api/aSINData/getNotImportedList',
}
export const AsinDataPage = (params?: any) =>
	request({
		url: Api.AsinDataPage,
		method: 'get',
		params: params,
	});

export const GetNotImportedList = (params?: any) =>
	request({
		url: Api.GetNotImportedList,
		method: 'get',
		params: params,
	});
