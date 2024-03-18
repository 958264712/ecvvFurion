import request from '/@/utils/request';
enum Api {
    accumulatedForThisMonth = '/api/operationsDataDashboard/accumulatedForThisMonth',
    amazonSales = '/api/operationsDataDashboard/amazonSales',
    salesAmount = '/api/operationsDataDashboard/salesAmount',
    actualOutboundQuantity = '/api/operationsDataDashboard/actualOutboundQuantity',
    outboundAmount = '/api/operationsDataDashboard/outboundAmount',
    pOOrderQuantity = '/api/operationsDataDashboard/pOOrderQuantity',
    pOOrderAmount = '/api/operationsDataDashboard/pOOrderAmount',
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