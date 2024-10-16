import request from '/@/utils/request';
enum Api {
    poFulfillingPage = '/api/poFulfillingOrders_Batch/page',
    Import = '/api/poFulfillingOrders_Batch/import',
    ImportPos = '/api/poFulfillingOrders_Batch/importPolfillingOrders',
    ImportFolfillingOrdersNoId = '/api/poFulfillingOrders_Batch/ImportFolfillingOrdersNoId',
    getPoFulfillingOrdersList = '/api/poFulfillingOrders_Batch/getPoFulfillingOrdersList',
    getConfirmedNewPOsPage = '/api/poFulfillingOrders_Batch/getConfirmedNewPOsPage',
    exportPoFulfillingOrders = '/api/poFulfillingOrders_Batch/exportPoFulfillingOrders',
    exportConfirmedNewPOs = '/api/poFulfillingOrders_Batch/exportConfirmedNewPOs',
}
// 导入ImportFolfillingOrdersNoId
export const ImportFolfillingOrdersNoId = (params?: any) =>
    request({
        url: Api.ImportFolfillingOrdersNoId,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
        },
    });
// 导入Pos
export const ImportPos = (params?: any, poFulfillingOrderBatchId?: string) =>
    request({
        url: Api.ImportPos + '/' + poFulfillingOrderBatchId,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
        },
    });
// 导入
export const Import = (params?: any,site?:string) =>
    request({
        url: Api.Import + '/' + site,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
        },
    });
//po履单
export const poFulfillingPage = (params?: any) =>
    request({
        url: Api.poFulfillingPage,
        method: 'post',
        data: params,
    });
//POS PANEL详情
export const getPoFulfillingOrdersList = (params?: any) =>
    request({
        url: Api.getPoFulfillingOrdersList,
        method: 'post',
        data: params,
    });
//ConfirmedNewPOs详情
export const getConfirmedNewPOsPage = (params?: any) =>
    request({
        url: Api.getConfirmedNewPOsPage,
        method: 'post',
        data: params,
    });
//导出pos
export const exportPoFulfillingOrders = (params?: any, id?: string, isHasImg?: string) =>
    request({
        url: Api.exportPoFulfillingOrders + '/' + id + ('/' + isHasImg),
        method: 'post',
        responseType: 'blob',
        data: params,
    });
//导出new pos
export const exportConfirmedNewPOs = (params?: any, id?: string) =>
    request({
        url: Api.exportConfirmedNewPOs + '/' + id,
        method: 'post',
        responseType: 'blob',
        data: params,
    });