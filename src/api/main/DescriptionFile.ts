import request from '/@/utils/request';
enum Api {
	AddTableImport = '/api/descriptionFile/add',
	DeleteTableImport = '/api/descriptionFile/delete',
	UpdateTableImport = '/api/descriptionFile/update',
	PageTableImport = '/api/descriptionFile/page',
	uploadDescriptionFile = '/api/descriptionFile/uploadDescriptionFile',
}

// 增加上传表格管理
export const addTableImport = (params?: any) =>
	request({
		url: Api.AddTableImport,
		method: 'post',
		data: params,
	});

// 删除上传表格管理
export const deleteTableImport = (params?: any) =>
	request({
		url: Api.DeleteTableImport,
		method: 'post',
		data: params,
	});

// 编辑上传表格管理
export const updateTableImport = (params?: any) =>
	request({
		url: Api.UpdateTableImport,
		method: 'post',
		data: params,
	});

// 分页查询上传表格管理
export const pageTableImport = (params?: any) =>
	request({
		url: Api.PageTableImport,
		method: 'post',
		data: params,
	});
export const uploadDescriptionFile = (params?: any) => {
	return request({
		url: Api.uploadDescriptionFile,
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
		},
	});
}
/**
* 上传表格地址
*/
// export const uploadTableAddress = (params: any) =>
// 	uploadFileHandle(params, Api.UploadTableAddress)

// export const uploadFileHandle = (params: any, url: string) => {
// 	const formData = new window.FormData();
// 	formData.append('file', params.file);
// 	//自定义参数
// 	if (params.data) {
// 		Object.keys(params.data).forEach((key) => {
// 			const value = params.data![key];
// 			if (Array.isArray(value)) {
// 				value.forEach((item) => {
// 					formData.append(`${key}[]`, item);
// 				});
// 				return;
// 			}
// 			formData.append(key, params.data![key]);
// 		});
// 	}
// 	return request({
// 		url: url,
// 		method: 'POST',
// 		data: formData,
// 		headers: {
// 			'Content-type': 'multipart/form-data;charset=UTF-8',
// 			// ts-ignore
// 			ignoreCancelToken: true,
// 		},
// 	});
// };
