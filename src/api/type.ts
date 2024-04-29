import type {Component} from 'vue'

export interface Response<T = any> {
    code: number
    message: string
    success: boolean
    result: T
}

export interface ResponseList<T = any> {
    code: number
    message: string
    success: boolean
    result: {
        size: number
        total: number
        records: T[]
    }
}

export interface OrgMap {
    isCenter: boolean
    latitude: number
    longitude: number
    name: string
    orgId: string
    type: 'org' | 'project'
}

export interface OrgInfo {
    projectNum: number
    sonOrgNum: number
    deviceNum: number
    deviceOnlineNum: number
    orgName: string
    projectProperty: string
    projectStateName: string
}

export interface BimModel {
    alt: number
    category: number
    createBy: string
    createTime: string
    dataUrl: string
    delFlag: number
    direction: number
    id: string
    image: string
    lat: number
    lng: number
    modelType: string
    modelUrl: string
    name: string
    orgId: string
    sId: string
    status: number
    updateBy: string
    updateTime: string
}

export interface DeviceList {
    [key: string]: Array<{
        sid: string
        modelUrl: string
        objectId: string
        scale: number
        devices: Array<{
            bindObjectId: string
            bindObjectName: string
            deviceId: string
            deviceName: string
            deviceType: string
            id: string
            lat: number
            lng: number
            onlineStatus: number
            orgId: string
            orgName: string
            sid: string
            tenantId: string
        }>
    }>
}

export interface DictItem {
    value: string
    text: string
    title: string
    label: string
}

export interface ChartData<T = any> {
    code: string
    name: string
    scene: string
    type: string
    url: string
    data: {
        record: T
    }
    component?: Component
}

export interface AlarmApproveListParams {
    approveStatus: 0 | 1 | 2 | 3 | ''
    cancelTimeStart: string
    cancelTimeEnd: string
    pageNo?: number
    pageSize?: number
    workAreaId: number | ''
}

export interface AlarmApproveListResponse {
    applicant: string
    applyTime: string
    approveReason: string
    approveStatus: 0 | 1 | 2 | 3
    approveTime: string
    approverUserId: string
    cancelTime: string
    cancelTimeEnd: string
    cancelTimeStart: string
    createBy: string
    createTime: string
    delFlag: number
    disposeDesc: string
    id: number
    isDispose: number
    orgId: number
    projectId: number
    updateBy: string
    updateTime: string
    applicantName: string
    approverUserName: string
    workAreaName: string
    workAreaId: number
    images: string[]
}

export interface AddAlarmApproveParams {
    approverUserId: string
    disposeDesc: string
    images: string[]
    isDispose: 0 | 1
    workAreaId: number | ''
}

export interface getApproveUserListResponse {
    id: string
    name: string
}

export interface WorkAreaParams {
    orgId?: number
    areaName?: string
    pageNo?: number
    pageSize?: number
    total?: number
}

export interface workAreaListResponse {
    id: number
    orgId: number
    areaName: string
    projectName: string
    projectId: string
    deviceList: string[]
}

export interface getAlarmManageListParams {
    areaStatus: 1 | 2 | ''
    alarmTimeStart: string
    alarmTimeEnd: string
    pageNo?: number
    pageSize?: number
    orgId: number | ''
}

export interface getAlarmManageListResponse {
    alarmCountBlue: number
    alarmCountOrange: number
    alarmCountRed: number
    alarmCountTotal: number
    alarmCountYellow: number
    alarmTime: string
    areaPeopleCountTotal: number
    areaStatus: 1 | 2
    areaStatusName: string
    id: number
    orgId: string
    orgName: string
    projectId: string
    projectName: string
    workAreaId: number
    workAreaName: string
}

export interface WorkAreaAddEditParams {
    id?: number
    areaName: string
    area: string
    bindDevices: Array<string>
}

export interface publishInstructionParams {
    content: string,
    isEvacuate?: 2 | 3,
    noticeFrequency: number
    noticeNum: number
    noticeType: number[]
    noticeUserIdList: string[]
    workAreaId?: number
}

export interface actionLogsResponse {
    id: number
    content: string
    type: 2 | 3
    typeName: string
    users: string
    workAreaId: string
    createTime: string
}

export interface getAlarmDetailListParams {
    workAreaId: number
    alarmLevel: string
    alarmTimeEnd: string
    alarmTimeStart: string
    alarmStatus: 1 | 2 | ''
    pageNo?: number
    pageSize?: number
}

export interface getAlarmDetailListResponse {
    alarmLevel: string
    alarmLevelName: string
    alarmMsg: string
    alarmStatus: 1 | 2
    alarmStatusName: string
    alarmTime: string
    alarmType: number
    createTime: string
    dealResult: 1 | 2 | 3
    dealResultName: string
    dealSuggestion: string
    dealTime: string
    dealUser: string
    deviceCode: string
    deviceName: string
    id: string
}

export interface getAlarmDealParams {
    id: string
    dealSuggestion: string
    dealResult: 1 | 2 | 3
}

export interface riskAlarmListParams {
    projectId?: string
    memberDeviceId?: string
    machineId?: string
    status?: number
    total?: number
    pageSize?: number
    pageNo?: number
}

export interface getReportListParams {
    createTimeStart?: string
    createTimeEnd?: string
    pageNo?: number
    pageSize?: number
    projectName?: string
    projectId: string
    type?: 1 | 2 | 3 | 4
}

export interface getReportListResponse {
    createBy: string,
    createTime: string
    delFlag: number
    departId: string
    id: number
    path: string
    reportDate: string
    reportName: string
    tenantId: string
    type: number
    updateBy: string
    updateTime: string
    projectName: string
    projectId: string
    projectDepartmentName: string
    belongingToArea: string
    detailedAddress: string
    reportTotal: number
}
