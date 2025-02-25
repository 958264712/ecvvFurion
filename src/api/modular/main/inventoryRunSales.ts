import request from '/@/utils/request';
enum Api {
    getInventoryAmountByStockAge = '/api/inventoryDataDiagnosis/getInventoryAmountByStockAge',
    getInventoryAmountByloth = '/api/inventoryDataDiagnosis/getInventoryAmountByMoth',
    getInventorySurplusByAmount = '/api/inventoryDataDiagnosis/getInventorySurplusByAmount',
    getInventoryAmountByllonth = '/api/inventoryDataDiagnosis/getInventoryAmountByMonth',
}
// 获取全部，一年，半年的库存总金额
export const getInventoryAmountByStockAge = (params?: any) =>
    request({
        url: Api.getInventoryAmountByStockAge,
        method: 'get',
        params: params,
    });
// 总库存结余（可视图的）
export const getInventoryAmountByloth = (params?: any) =>
    request({
        url: Api.getInventoryAmountByloth,
        method: 'get',
        params: params,
    });
// 总库存结余（表的）
export const getInventorySurplusByAmount = (params?: any) =>
    request({
        url: Api.getInventorySurplusByAmount,
        method: 'get',
        params: params,
    });
// 库存健康图
export const getInventoryAmountByllonth = (params?: any) =>
    request({
        url: Api.getInventoryAmountByllonth,
        method: 'get',
        params: params,
    });