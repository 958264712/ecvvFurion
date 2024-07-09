import request from '/@/utils/request';
enum Api {
    targetPage = '/api/performanceTargetManagement/page',
    targetAdd = '/api/performanceTargetManagement/add',
    targetUpdate = '/api/performanceTargetManagement/update',
    targetDel = '/api/performanceTargetManagement/delete',
    ratePage = '/api/exchangeRateStatistics/page',
    rateAdd = '/api/exchangeRateStatistics/add',
    rateUpdate = '/api/exchangeRateStatistics/update',
    performanceGetAccumulated = '/api/performanceSituation/getAccumulatedForThisMonth',
    performanceGetCompletion = '/api/performanceSituation/getCompletionStatus',
    performanceGetCompletionDetails = '/api/performanceSituation/getPerformanceCompletionDetails',
}
//获取目标管理数据
export const targetPage = (params?: any) =>
    request({
        url: Api.targetPage,
        method: 'post',
        data: params,
    });
//添加数据
export const targetAdd = (params?: any) =>
    request({
        url: Api.targetAdd,
        method: 'post',
        data: params,
    });
//修改数据
export const targetUpdate = (params?: any) =>
    request({
        url: Api.targetUpdate,
        method: 'post',
        data: params,
    });
//删除数据
export const targetDel = (params?: any) =>
    request({
        url: Api.targetDel,
        method: 'post',
        data: params,
    });
//获取业绩汇率数据
export const ratePage = (params?: any) =>
    request({
        url: Api.ratePage,
        method: 'get',
        params: params,
    });
//添加数据
export const rateAdd = (params?: any) =>
    request({
        url: Api.rateAdd,
        method: 'post',
        data: params,
    });
//修改数据
export const rateUpdate = (params?: any) =>
    request({
        url: Api.rateUpdate,
        method: 'post',
        data: params,
    });
//获取业绩情况本月累计
export const performanceGetAccumulated = (params?: any) =>
    request({
        url: Api.performanceGetAccumulated,
        method: 'get',
        params: params,
    });
//获取业绩情况完成情况
export const performanceGetCompletion = (params?: any) =>
    request({
        url: Api.performanceGetCompletion,
        method: 'get',
        params: params,
    });
//获取业绩情况完成详情
export const performanceGetCompletionDetails = (params?: any) =>
    request({
        url: Api.performanceGetCompletionDetails,
        method: 'post',
        data: params,
    });
