import request from '/@/utils/request';
enum Api {
	AsinDataPage = '/api/aSINData/page',
	GetNotImportedList = '/api/aSINData/getNotImportedList',
	ExportEnglish = '/api/aSINData/export_English',
	ExportChinese = '/api/aSINData/export_Chinese',
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
//导出English
export const ExportEnglish = (params?: any) =>
	request({
		url: Api.ExportEnglish,
		method: 'post',
		responseType: 'blob',
		data: params,
	});
//导出Chinese
export const ExportChinese = (params?: any) =>
	request({
		url: Api.ExportChinese,
		method: 'post',
		responseType: 'blob',
		data: params,
	});
