import request from '@/utils/request'
import type {Response} from '@/api/type'
import type {IndicatorData, AddIndicatorItemParams} from "@/api/modelType";
import type {DictItem} from '@/api/type'


//分配模版
export const getIndicatorData = (data: IndicatorData) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/manage/indicator/list',
        params: data
    })
}

export const getIndicatorType = () => {
    return request<DictItem[]>({
        method: 'GET',
        url: '/sys/api/getDictItems?dictCode=indicator_type',
    })
}

export const addIndicatorParams = (data: AddIndicatorItemParams) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/manage/indicator/add',
        data
    })
}

export const editIndicatorParams = (data: AddIndicatorItemParams) => {
    return request<Response>({
        method: 'POST',
        url: '/gisbim-business/manage/indicator/edit',
        data
    })
}

export const deleteIndicatorParams = (data: {id:string}) => {
    return request<Response>({
        method: 'delete',
        url: '/gisbim-business/manage/indicator/delete',
        params:data
    })
}


