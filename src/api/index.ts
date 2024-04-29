import request from '@/utils/request'
import type {BimModel, ChartData, DeviceList, OrgInfo, OrgMap, Response} from '@/api/type'

export const queryOrgMapList = (params: { type: string, orgId?: string }) => {
    return request<Response<{ orgMapList: OrgMap[] }>>({
        method: 'GET',
        url: '/gisbim-business/manage/screen/queryOrgMapList',
        params
    })
}

//组织树接口
export const getOrgListTree = () => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/zk/ztOrgInfo/orgTree'
    })
}

// 组织详情接口
export const getOrgInfo = (orgId: string) => {
    return request<Response<OrgInfo>>({
        method: 'GET',
        url: '/gisbim-business/manage/screen/queryOrgMapDetail',
        params: {
            orgId
        }
    })
}

// 获取BIM模型
export const getBimModel = (orgId?: string) => {
    return request<Response<BimModel[]>>({
        method: 'POST',
        url: '/gisbim-business/bim/model/queryModelByOrgId',
        data: {
            orgId
        }
    })
}

// 获取设备信息
export const getDeviceList = (orgId?: string) => {
    return request<Response<DeviceList>>({
        method: 'POST',
        url: '/gisbim-business/screen/project/list',
        data: {
            orgId: orgId || ''
        }
    })
}

// 获取应用场景
export const getSceneList = (orgId: string) => {
    return request<Response<Array<{ name: string, sId: string }>>>({
        method: 'POST',
        url: '/gisbim-business/screen/project/getProductList',
        data: {
            orgId
        }
    })
}

// 获取组织大屏指标列表
export const getOrgIndicatorList = (orgId?: string) => {
    return request<Response<{ list: ChartData[] }>>({
        method: 'GET',
        url: '/gisbim-business/manage/screen/statistics',
        params: {
            orgId: orgId || ''
        }
    })
}

// 获取项目大屏指标列表
export const getIndicatorList = (data: { orgId: string, sId: string }) => {
    return request<Response<ChartData[]>>({
        method: 'POST',
        url: '/gisbim-business/screen/project/statistics',
        data
    })
}

// 获取菜单按钮权限
export const getPermissionList = () => {
    return request<Response>({
        method: 'get',
        url: '/gisbim-system/sys/permission/getUserPermissionByToken'
    })
}
