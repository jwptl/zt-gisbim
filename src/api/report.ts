import request from '@/utils/request'
import type {getReportListParams, getReportListResponse, ResponseList, Response} from '@/api/type'

// 获取智能报告列表
export const getReportList = (data: getReportListParams) => {
    return request<ResponseList<getReportListResponse>>({
        method: 'GET',
        url: '/gisbim-business/intelligent/report/list',
        params: data
    })
}

// 获取智能报告列表
export const getProjectList = () => {
    return request<Response<string[]>>({
        method: 'GET',
        url: '/gisbim-business/intelligent/report/selectProjectName'
    })
}

// 添加智能报告
export const addReport = (data: {path: string, reportName: string, projectName: string, projectId: number, id:number}) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/intelligent/report/addDiyReport',
        data: {...data, type: 4}
    })
}
