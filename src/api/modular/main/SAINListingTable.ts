import request from '/@/utils/request';
enum Api {
	SAINListingTablePage = '/api/aSINListingTable/page',
	Add = '/api/aSINListingTable/add',
	Update = '/api/aSINListingTable/update',
	Delete = '/api/aSINListingTable/delete',
	ImportCN = '/api/aSINListingTable/importCN',
	ImportUAE = '/api/aSINListingTable/importUAE',
	Eexport = '/api/aSINListingTable/export',
	GetUserRole = '/api/aSINListingTable/getUserRole'
}
//获取角色信息
export const GetUserRole = (params?: any) =>
	request({
		url: Api.GetUserRole,
		method: 'get',
		params: params,
	});
//获取SAINListingTable信息
export const SAINListingTablePage = (params?: any) =>
	request({
		url: Api.SAINListingTablePage,
		method: 'post',
		data: params,
	});
export const ImportCN = (params?: any) =>
	request({
		url: Api.ImportCN + '/' + params.Site,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
//添加SAINListingTable
export const Save = (params?: any) =>
	request({
		url: Api.Add,
		method: 'post',
		data: params,
	});
//修改SAINListingTable
export const Update = (params?: any) =>
	request({
		url: Api.Update,
		method: 'post',
		data: params,
	});
//删除SAINListingTable
export const Delete = (params?: any) =>
	request({
		url: Api.Delete,
		method: 'post',
		data: params,
	});
export const ImportUAE = (params?: any) =>
	request({
		url: Api.ImportUAE + '/' + params.Site,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
//导出SAINListingTable
export const Eexport = (params?: any) =>
	request({
		url: Api.Eexport,
		method: 'post',
		data: params,
	});