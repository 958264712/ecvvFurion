import request from '/@/utils/request';
enum Api {
	AsinDataPage = '/api/aSINData/page',
	GetNotImportedList = '/api/aSINData/getNotImportedList',
	ExportEnglish = '/api/aSINData/export_English',
	ExportChinese = '/api/aSINData/export_Chinese',
	GetASINDataExportRecord = '/api/aSINData/getASINDataExportRecord',
}
export const AsinDataPage = (params?: any) =>
	request({
		url: Api.AsinDataPage,
		method: 'post',
		data: params,
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
//获取导出记录
export const GetASINDataExportRecord = (params?: any) =>
	request({
		url: Api.GetASINDataExportRecord,
		method: 'post',
		data: params,
	});