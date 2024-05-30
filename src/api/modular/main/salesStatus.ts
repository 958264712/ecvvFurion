import request from '/@/utils/request';
enum Api {
    salesPage = '/api/salesSituation/page',
}
//获取数据
export const salesPage = (params?: any) =>
    request({
        url: Api.salesPage,
        method: 'get',
        params: params,
    });