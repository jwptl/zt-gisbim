import request from '@/utils/request'
import type {DictItem, Response} from '@/api/type'
import type {ModalParams, AddModalParams} from '@/api/modelType'

//获取模型列表
export const getModelList = (data: ModalParams) => {
    return request<Response>({
        method: 'GET',
        url: '/bim/model/list',
        params: data
    })
}

//通用模型列表
export const getCurrentModelList = () => {
    return request<DictItem[]>({
        method: 'GET',
        url: '/sys/api/getDictItems?dictCode=service_scene',
    })
}

//展示对象列表
export const getDisplayList = () => {
    return request<DictItem[]>({
        method: 'GET',
        url: 'sys/api/getDictItems?dictCode=model_type',
    })
}

//新增
export const addModelItem = (data: AddModalParams) => {
    return request<Response>({
        method: 'POST',
        url: '/bim/model/add',
        data
    })
}

//编辑
export const editModelItem = (data: AddModalParams) => {
    return request<Response>({
        method: 'POST',
        url: '/bim/model/edit',
        data
    })
}


//删除
export const deleteModelItem = (data:{id: string}) => {
    return request<Response>({
        method: 'delete',
        url: '/bim/model/delete',
        params:data
    })
}


