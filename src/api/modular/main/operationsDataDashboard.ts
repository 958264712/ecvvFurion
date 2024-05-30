import request from '/@/utils/request';
enum Api {
    accumulatedForThisMonth = '/api/operationsDataDashboard/getAccumulatedHeaderInfo',
    amazonSales = '/api/operationsDataDashboard/getAmazonSalesWeek',
    salesAmount = '/api/operationsDataDashboard/getSalesAmount',
    actualOutboundQuantity = '/api/operationsDataDashboard/getActualOutboundQuantity',
    outboundAmount = '/api/operationsDataDashboard/getOutboundAmount',
    pOOrderQuantity = '/api/operationsDataDashboard/getPOOrderQuantity',
    pOOrderAmount = '/api/operationsDataDashboard/getPOOrderAmount',
}
export const accumulatedForThisMonth = (params?: any) =>
    request({
        url: Api.accumulatedForThisMonth,
        method: 'get',
        params: params,
    });

export const amazonSales = (params?: any) =>
    request({
        url: Api.amazonSales,
        method: 'get',
        params: params,
    });

export const salesAmount = (params?: any) =>
    request({
        url: Api.salesAmount,
        method: 'get',
        params: params,
    });

export const actualOutboundQuantity = (params?: any) =>
    request({
        url: Api.actualOutboundQuantity,
        method: 'get',
        params: params,
    });

export const outboundAmount = (params?: any) =>
    request({
        url: Api.outboundAmount,
        method: 'get',
        params: params,
    });

export const pOOrderQuantity = (params?: any) =>
    request({
        url: Api.pOOrderQuantity,
        method: 'get',
        params: params,
    });

export const pOOrderAmount = (params?: any) =>
    request({
        url: Api.pOOrderAmount,
        method: 'get',
        params: params,
    });