import request from '/@/utils/request';
enum Api {
    siteManagementPage = '/api/comm_SiteManagement/page',
    siteManagementAdd = '/api/comm_SiteManagement/add',
    siteManagementUpdate = '/api/comm_SiteManagement/update',
    siteManagementDelete = '/api/comm_SiteManagement/delete',
    getSitesListPlatform = '/api/comm_ListingPlatform/getSiteAndListngPlatfroms',
    listPlatformManagementPage = '/api/comm_ListingPlatform/page',
    listPlatformManagementAdd = '/api/comm_ListingPlatform/add',
    listPlatformManagementUpdate = '/api/comm_ListingPlatform/update',
    listPlatformManagementDelete = '/api/comm_ListingPlatform/delete',
    getSitesWareHouse = '/api/comm_SiteManagement/getSites',
    wareHouseManagementPage = '/api/comm_WarehouseManagement/page',
    wareHouseManagementAdd = '/api/comm_WarehouseManagement/add',
    wareHouseManagementUpdate = '/api/comm_WarehouseManagement/update',
    wareHouseManagementDelete = '/api/comm_WarehouseManagement/delete',
}
// 获取站点管理页面内容
export const siteManagementPage = (params?: any) =>
    request({
        url: Api.siteManagementPage,
        method: 'get',
        params: params,
    });
// 添加站点管理页面内容
export const siteManagementAdd = (params?: any) =>
    request({
        url: Api.siteManagementAdd,
        method: 'post',
        data: params,
    });
// 修改站点管理页面内容
export const siteManagementUpdate = (params?: any) =>
    request({
        url: Api.siteManagementUpdate,
        method: 'post',
        data: params,
    });
// 删除站点管理页面内容
export const siteManagementDelete = (params?: any) =>
    request({
        url: Api.siteManagementDelete,
        method: 'post',
        data: params,
    });
// 获取上架平台页面关联站点和上架平台列表
export const getSitesListPlatform = (params?: any) =>
    request({
        url: Api.getSitesListPlatform,
        method: 'get',
        params: params,
    });
// 获取上架平台页面内容
export const listPlatformManagementPage = (params?: any) =>
    request({
        url: Api.listPlatformManagementPage,
        method: 'get',
        params: params,
    });
// 添加上架平台页面内容
export const listPlatformManagementAdd = (params?: any) =>
    request({
        url: Api.listPlatformManagementAdd,
        method: 'post',
        data: params,
    });
// 修改上架平台页面内容
export const listPlatformManagementUpdate = (params?: any) =>
    request({
        url: Api.listPlatformManagementUpdate,
        method: 'post',
        data: params,
    });
// 删除上架平台页面内容
export const listPlatformManagementDelete = (params?: any) =>
    request({
        url: Api.listPlatformManagementDelete,
        method: 'post',
        data: params,
    });
// 获取仓库管理页面关联站点列表
export const getSitesWareHouse = (params?: any) =>
    request({
        url: Api.getSitesWareHouse,
        method: 'get',
        params: params,
    });
// 获取仓库管理页面内容
export const wareHouseManagementPage = (params?: any) =>
    request({
        url: Api.wareHouseManagementPage,
        method: 'get',
        params: params,
    });
// 添加仓库管理页面内容
export const wareHouseManagementAdd = (params?: any) =>
    request({
        url: Api.wareHouseManagementAdd,
        method: 'post',
        data: params,
    });
// 修改仓库管理页面内容
export const wareHouseManagementUpdate = (params?: any) =>
    request({
        url: Api.wareHouseManagementUpdate,
        method: 'post',
        data: params,
    });
// 删除仓库管理页面内容
export const wareHouseManagementDelete = (params?: any) =>
    request({
        url: Api.wareHouseManagementDelete,
        method: 'post',
        data: params,
    });
