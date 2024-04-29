export interface ModalParams {
    name?: string
    pageNo: number
    pageSize: number
    sId?: string
    orgId?: string
}

export interface AddModalParams {
    name: string
    id?: string
    category?: number
    modelUrl?: string
    sId?: string
    image?: string
    modelType?: string
    orgId?: string
    dataUrl?: string
    lng?: string
    lat?: string
    alt?: string
    direction?: string
    scale:number
    status: number
}

export interface AddNormParams {
    indicatorTemplateId?: string
    pageNo: number
    pageSize: number
    scene?: number | string
}

export interface IndicatorParams {
    name?: string
    pageNo: number
    pageSize: number
    scene?: number | string
    status?:number
}

export interface IndicatorResponse {
    records:Array<{
        id: string;
        indicatorTemplateId: string;
        indicatorId: string;
        sort: number;
        scene: string;
        delFlag: number;
        createBy: string;
        createTime: string;
        updateBy?: any;
        updateTime?: any;
        indicatorName: string;
        scene_dictText: string;
    }>
    total:number
}

export interface AddIndicatorParams {
    indicatorTemplateId: string
    sort: string
    indicatorId: string
    scene?: string | number
}

export interface UserListParams {
    pageNo: number
    pageSize: number
    fullname?: string
    organizationId: string
}

export interface AddTemplateIds {
    ids: string
    indicatorTemplateId: string
}

export interface IndicatorData {
    name: string
  
    scene: string | number
    pageNo: number
    pageSize: number
}


export interface AddIndicatorItemParams {
    id?: string
    code?: string
    name: string
  
    scene: number | string
    status?: number
    type?: string
    url?: string
}
