import request from '@/utils/request'
import type {
    AlarmApproveListParams,
    AlarmApproveListResponse,
    Response,
    ResponseList,
    WorkAreaParams,
    getApproveUserListResponse,
    AddAlarmApproveParams,
    workAreaListResponse,
    getAlarmManageListParams,
    getAlarmManageListResponse,
    WorkAreaAddEditParams,
    riskAlarmListParams,
    publishInstructionParams,
    actionLogsResponse,
    getAlarmDetailListResponse,
    getAlarmDetailListParams, getAlarmDealParams
} from '@/api/type'


// 获取警情处置审批列表
export const getAlarmApproveList = (data: AlarmApproveListParams) => {
    return request<ResponseList<AlarmApproveListResponse>>({
        method: 'GET',
        url: '/gisbim-business/safety/alarmApprove/list',
        params: data
    })
}

export const getAlarmApproveDetail = (id: number) => {
    return request<Response<AlarmApproveListResponse>>({
        method: 'GET',
        url: '/gisbim-business/safety/alarmApprove/queryById',
        params: {id}
    })
}

export const addAlarmApprove = (data: AddAlarmApproveParams) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/safety/alarmApprove/add',
        data
    })
}

export const alarmApprove = (data: { id: number, approveReason: string, approveStatus: AlarmApproveListParams['approveStatus'] }) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/safety/alarmApprove/approve',
        data
    })
}

export const alarmApproveCancel = (id: number) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/safety/alarmApprove/cancel',
        params: {id}
    })
}

export const alarmApproveDelete = (id: number) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/safety/alarmApprove/delete',
        params: {id}
    })
}

export const getApproveUserList = (workAreaId: number) => {
    return request<Response<getApproveUserListResponse[]>>({
        method: 'GET',
        url: '/gisbim-business/safety/alarmApprove/queryApproveUserListPageList',
        params: {workAreaId, pageNo: 1, pageSize: 1000000000}
    })
}

//作业区域列表
export const workAreaList = (data: WorkAreaParams) => {
    return request<ResponseList<workAreaListResponse>>({
        method: 'GET',
        url: '/gisbim-business/bim/work/area/pageList',
        params: data
    })
}

//作业区域设备列表
export const workAreaDeviceList = () => {
    return request<Response>({
        method: 'GET',
        url: '/bim/env/device/list'
    })
}

//新增作业区域
export const addWorkArea = (data: WorkAreaAddEditParams) => {
    return request<Response>({
        method: 'POST',
        url: '/bim/work/area/add',
        data
    })
}

// 获取警情处置管理列表
export const getAlarmManageList = (data: getAlarmManageListParams) => {
    return request<ResponseList<getAlarmManageListResponse>>({
        method: 'GET',
        url: '/gisbim-business/safety/bimAlarmManage/list',
        params: data
    })
}

// 发布指令
export const publishInstruction = (data: publishInstructionParams) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/safety/bimAlarmManage/publishOrder',
        data
    })
}

// 恢复施工
export const recoverWork = (data: Exclude<publishInstructionParams, 'isEvacuate'>) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/safety/bimAlarmManage/recoverWork',
        data
    })
}

// 通过id查询操作日志
export const actionLogs = (id: number) => {
    return request<Response<actionLogsResponse[]>>({
        method: 'GET',
        url: '/gisbim-business/safety/bimAlarmManage/logById',
        params: {id}
    })
}

//删除作业区域
export const deleteWorkArea = (id: number) => {
    return request<Response>({
        method: 'GET',
        url: '/bim/work/area/delete',
        params: {id}
    })
}

//作业区域详情
export const getWorkAreaDetail = (id: number) => {
    return request<Response>({
        method: 'GET',
        url: '/bim/work/area/detail',
        params: {id}
    })
}

//作业区域编辑
export const editWorkArea = (data: WorkAreaAddEditParams) => {
    return request<Response>({
        method: 'POST',
        url: '/bim/work/area/edit',
        data
    })
}

// 警情详情列表
export const getAlarmDetailList = (params: getAlarmDetailListParams) => {
    return request<ResponseList<getAlarmDetailListResponse>>({
        method: 'GET',
        url: '/gisbim-business/safety/bimAlarm/list',
        params
    })
}

// 警情处理
export const alarmDeal = (data: getAlarmDealParams) => {
    return request<ResponseList<getAlarmDetailListParams>>({
        method: 'POST',
        url: '/gisbim-business/safety/bimAlarm/deal',
        data
    })
}

//人机协同风险项目下拉
export const getProjectList = (data: {
    pageSize: number
    pageNo: number
}) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/risk/config/queryProjectList',
        params: data
    })
}


//人机协同风险项目列表
export const riskAlarmList = (data: riskAlarmListParams) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/risk/alarm/list',
        params: data
    })
}


// 人机系统风险项目处理
export const riskUpdateStatus = (id: string) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/risk/alarm/updateStatus',
        params: {id}
    })
}

//人机风险配置-生效对象
export const queryMachineInfo = () => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/risk/config/queryMachineInfo',
    })
}


// 人机风险配置-详情
export const queryRiskConfig = () => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/risk/config/queryRiskConfig',
    })
}


export const addRiskConfig = (data: {
    effectiveObject?: string
    radius?: number
    notifyType?: number
    notifyObject?: number
    notifyTimes?: number
}) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/risk/config/add',
        data
    })
}



