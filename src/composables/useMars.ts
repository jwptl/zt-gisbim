import * as mars3d from 'mars3d'

type mapOptionsType = {
    basemaps?: (mars3d.Map.basemapOptions & {
        name: string,
        layer?: string,
        show?: boolean,
        type?: string,
        crs?: mars3d.CRS
    })[]
    control?: mars3d.Map.controlOptions
    scene?: mars3d.Map.sceneOptions
    terrain?: mars3d.Map.terrainOptions
}

const maps: Record<symbol, mars3d.Map> = {}
let map: mars3d.Map

export const useMars = (mapKey: symbol) => {

    const initMap = (id: string, mapOptions: mapOptionsType): mars3d.Map => {
        map = new mars3d.Map(id, mapOptions)
        maps[mapKey] = map
        return map
    }

    const getMap = () => {
        return maps[mapKey]
    }

    const initGraphicLayer = (id: string = ''): mars3d.layer.GraphicLayer => {
        const graphicLayer = new mars3d.layer.GraphicLayer({id})
        map?.addLayer(graphicLayer)
        return graphicLayer
    }

    const destroy = () => {
        map?.destroy()
        delete maps[mapKey]
    }

    return {
        getMap,
        initMap,
        initGraphicLayer,
        destroy,
        map
    }
}
