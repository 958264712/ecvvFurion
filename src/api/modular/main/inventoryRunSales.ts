import request from '/@/utils/request';
enum Api {
    getInventoryAmountByStockAge = '/api/inventoryDataDiagnosis/getInventoryAmountByStockAge',
    getInventoryAmountByloth = '/api/inventoryDataDiagnosis/getInventoryAmountByMoth',
    getInventorySurplusByAmount = '/api/inventoryDataDiagnosis/getInventorySurplusByAmount',
    getInventoryAmountByllonth = '/api/inventoryDataDiagnosis/getInventoryAmountByMonth',
    getInitialInventoryInfo = '/api/inventoryOverview/getInitialInventoryInfo',
    setInventoryQuantity = '/api/inventoryOverview/setInventoryQuantity',
    getCollectionOrderInfo = '/api/inventoryOverview/getCollectionOrderInfo',
    getStorageRecord = '/api/inventoryOverview/getStorageRecord',
    getOrderRecord = '/api/inventoryOverview/getOrderRecord',
    getVerificationRecord = '/api/inventoryOverview/getVerificationRecord',
    getSummaryDataGraph = '/api/inventoryOverview/getSummaryDataGraph',
    getInventoryAgeDetails = '/api/inventoryHealthReport/getInventoryAgeDetails',
    getHighInventoryAgeWarning = '/api/inventoryHealthReport/getHighInventoryAgeWarning',
    setHighInventoryAgeWarning = '/api/inventoryHealthReport/setHighInventoryAgeWarning',
    getInventoryHealthMap = '/api/inventoryHealthReport/getInventoryHealthMap',
}
// 获取当前库存健康图
export const getInventoryHealthMap = (params?: any) =>
    request({
        url: Api.getInventoryHealthMap,
        method: 'get',
        params: params,
    });
// 获取库龄详情
export const getInventoryAgeDetails = (params?: any) =>
    request({
        url: Api.getInventoryAgeDetails,
        method: 'get',
        params: params,
    });
// 获取高库龄预警值
export const getHighInventoryAgeWarning = (params?: any) =>
    request({
        url: Api.getHighInventoryAgeWarning,
        method: 'get',
        params: params,
    });
// 设置库龄过高预警值
export const setHighInventoryAgeWarning = (params?: any) =>
    request({
        url: Api.setHighInventoryAgeWarning,
        method: 'post',
        data: params,
    });
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
// 获取库存信息
export const getInitialInventoryInfo = (params?: any) =>
    request({
        url: Api.getInitialInventoryInfo,
        method: 'get',
        params: params,
    });
// 盘点商品的库存数量
export const setInventoryQuantity = (params?: any) =>
    request({
        url: Api.setInventoryQuantity,
        method: 'post',
        data: params,
    });
// 获取集货单信息
export const getCollectionOrderInfo = (params?: any) =>
    request({
        url: Api.getCollectionOrderInfo,
        method: 'get',
        params: params,
    });
// 获取入库记录
export const getStorageRecord = (params?: any) =>
    request({
        url: Api.getStorageRecord,
        method: 'get',
        params: params,
    });
// 获取订单记录
export const getOrderRecord = (params?: any) =>
    request({
        url: Api.getOrderRecord,
        method: 'get',
        params: params,
    });
// 获取核销记录
export const getVerificationRecord = (params?: any) =>
    request({
        url: Api.getVerificationRecord,
        method: 'get',
        params: params,
    });
// 销量库存采购综合分析数据|
export const getSummaryDataGraph = (params?: any) =>
    request({
        url: Api.getSummaryDataGraph,
        method: 'get',
        params: params,
    });
