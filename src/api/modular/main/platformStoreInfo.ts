import request from '/@/utils/request';
enum Api {
    platformStoreGetList = '/api/platformStoreInfo/getList',
    platformStorePage = '/api/platformStoreInfo/page',
    platformStoreAdd = '/api/platformStoreInfo/add',
    platformStoreUpdate = '/api/platformStoreInfo/update',
    platformStoreDelete = '/api/platformStoreInfo/delete',
}
//获取数据
export const platformStorePage = (params?: any) =>
    request({
        url: Api.platformStorePage,
        method: 'get',
        params: params,
    });
// 获取列表
export const platformStoreGetList = (params?: any) =>
    request({
        url: Api.platformStoreGetList,
        method: 'get',
        params: params,
    });
//新增平台
export const platformStoreAdd = (params?: any) =>
    request({
        url: Api.platformStoreAdd,
        method: 'post',
        data: params,
    });
//修改平台
export const platformStoreUpdate = (params?: any) =>
    request({
        url: Api.platformStoreUpdate,
        method: 'post',
        data: params,
    });
//删除平台
export const platformStoreDelete = (params?: any) =>
    request({
        url: Api.platformStoreDelete,
        method: 'post',
        data: params,
    });