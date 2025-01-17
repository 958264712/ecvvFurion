import request from '/@/utils/request';
enum Api {
    salesPage = '/api/salesSituation/page',
    salesExport = '/api/salesSituation/export',
}
//导出数据
export const salesExport = (params?: any) =>
    request({
        url: Api.salesExport,
        method: 'post',
        data: params,
        responseType:"blob"
    });
//获取数据
export const salesPage = (params?: any) =>
    request({
        url: Api.salesPage,
        method: 'get',
        params: params,
    });