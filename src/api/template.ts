import request from '@/utils/request'
import type {Response} from '@/api/type'
import type {AddNormParams, IndicatorParams, AddIndicatorParams, UserListParams, AddTemplateIds,IndicatorResponse} from "@/api/modelType";
import type {DictItem} from '@/api/type'


//获取模型列表
export const getTemplateList = (data: {
    pageNo?: number,
    pageSize?: number
}) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/manage/indicatorTemplate/list',
        params: data
    })
}

//新增模板
export const addTemplateItem = (data: { name: string }) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/manage/indicatorTemplate/add',
        data
    })
}

//模板指标列表
export const getNormList = (data: AddNormParams) => {
    return request<Response<IndicatorResponse>>({
        method: 'get',
        url: '/gisbim-business/manage/indicatorTemplateCfg/list',
        params: data
    })
}

//场景列表
export const getSceneList = () => {
    return request<DictItem[]>({
        method: 'GET',
        url: '/sys/api/getDictItems?dictCode=indicator_scene',
    })
}
//场景列表
export const getSceneInfoList = () => {
    return request<Response>({
        method: 'GET',
        url: '/sys/api/getDictItems?dictCode=indicator_app_scene',
    })
}


//指标库列表
export const getIndicatorList = (data: IndicatorParams) => {
    return request<Response>({
        method: 'get',
        url: '/gisbim-business/manage/indicator/list',
        params: data
    })
}

//新增场景指标
export const addIndicatorItem = (data: AddIndicatorParams) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/manage/indicatorTemplateCfg/add',
        data
    })
}
//删除场景指标
export const deleteIndicatorItem = (data: { id: string }) => {
    return request<Response>({
        method: 'delete',
        url: '/gisbim-business/manage/indicatorTemplateCfg/delete',
        params: data
    })
}

//分配用户列表
export const userInfoList = (data: UserListParams) => {
    return request<Response>({
        method: 'get',
        url: '/gisbim-business/zk/ztUserInfo/list',
        params: data
    })
}

//分配模版
export const addTemplateIds = (data: AddTemplateIds) => {
    return request<Response>({
        method: 'get',
        url: '/gisbim-business/zk/ztUserInfo/bindBatch',
        params: data
    })
}




