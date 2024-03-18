import request from '/@/utils/request';
enum Api {
    SKUOperationPage = '/api/inventorySKUOperation/page',
    SKUOperationBatchUpdate = '/api/inventorySKUOperation/batchUpdate',
    SKUOperationUpdate = '/api/inventorySKUOperation/update',
    SKUOperationExport = '/api/inventorySKUOperation/export',
}
//分页查询库存sku运营
export const SKUOperationPage = (params?: any) =>
    request({
        url: Api.SKUOperationPage,
        method: 'get',
        params: params,
    });
//修改
export const SKUOperationUpdate = (params?: any) =>
    request({
        url: Api.SKUOperationUpdate,
        method: 'post',
        data: params,
    });
//批量修改
export const SKUOperationBatchUpdate = (params?: any) =>
    request({
        url: Api.SKUOperationBatchUpdate,
        method: 'post',
        data: params,
    });
//导出SKUOperationTable
export const SKUOperationExport = (params?: any) =>
    request({
        url: Api.SKUOperationExport,
        method: 'post',
        responseType: 'blob',
        data: params,
    });