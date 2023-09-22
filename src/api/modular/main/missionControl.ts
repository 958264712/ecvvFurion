import request from '/@/utils/request';
enum Api {
	AddMissionControl = '/api/missionControl/add',
	DeleteMissionControl = '/api/missionControl/delete',
	UpdateMissionControl = '/api/missionControl/update',
	PageMissionControl = '/api/missionControl/page',
	AddMonitoringRecord = '/api/monitoringRecord/add',
	DeleteMonitoringRecord = '/api/monitoringRecord/delete',
	UpdateMonitoringRecord = '/api/monitoringRecord/update',
	PageMonitoringRecord = '/api/monitoringRecord/page',
	ListMonitoringRecord = '/api/monitoringRecord/getMissionControl',
}

// 增加任务监控表
export const addMissionControl = (params?: any) =>
	request({
		url: Api.AddMissionControl,
		method: 'post',
		data: params,
	});

// 删除任务监控表
export const deleteMissionControl = (params?: any) =>
	request({
		url: Api.DeleteMissionControl,
		method: 'post',
		data: params,
	});

// 编辑任务监控表
export const updateMissionControl = (params?: any) =>
	request({
		url: Api.UpdateMissionControl,
		method: 'post',
		data: params,
	});

// 分页查询任务监控表
export const pageMissionControl = (params?: any) =>
	request({
		url: Api.PageMissionControl,
		method: 'post',
		data: params,
	});

// 增加监控记录表
export const addMonitoringRecord = (params?: any) =>
	request({
		url: Api.AddMonitoringRecord,
		method: 'post',
		data: params,
	});

// 删除监控记录表
export const deleteMonitoringRecord = (params?: any) =>
	request({
		url: Api.DeleteMonitoringRecord,
		method: 'post',
		data: params,
	});

// 编辑监控记录表
export const updateMonitoringRecord = (params?: any) =>
	request({
		url: Api.UpdateMonitoringRecord,
		method: 'post',
		data: params,
	});

// 分页查询监控记录表
export const pageMonitoringRecord = (params?: any) =>
	request({
		url: Api.PageMonitoringRecord,
		method: 'post',
		data: params,
	});

// ListMonitoringRecord
export const ListMonitoringRecord = (params?: any) =>
	request({
		url: Api.ListMonitoringRecord,
		method: 'get',
		params: params,
	});
