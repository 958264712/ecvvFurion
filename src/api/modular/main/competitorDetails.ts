import request from '/@/utils/request';
enum Api {
    getCompetitorDetails = '/api/competitorDetails/getCompetitorDetails',
}
// 获取amazon抓取历史图表内容
export const getCompetitorDetails = (params?: any) =>
    request({
        url: Api.getCompetitorDetails,
        method: 'get',
        params: params,
    });
