export const asyncRoutes = [
    {
        path: '/situation',
        name: 'situation',
        meta: {
            isMenu: true,
            title: '综合态势',
            isFullscreen: true,
        },
        redirect: '/situation/org',
        children: [
            {
                path: '/situation/org',
                name: 'situation-org',
                meta: {
                    isMenu: false,
                    title: '综合决策',
                    isFullscreen: true,
                },
                component: () => import('@/views/situation/org.vue')
            },
            {
                path: '/situation/project',
                name: 'situation-project',
                meta: {
                    isMenu: false,
                    title: '综合决策',
                    isFullscreen: true,
                },
                component: () => import('@/views/situation/project.vue')
            },
        ]
    },
    {
        path: '/config',
        name: 'config',
        meta: {
            isMenu: true,
            title: '综合配置'
        },
        redirect: '/config/indicator',
        children: [
            {
                path: '/config/indicator',
                name: 'config-indicator',
                component: () => import('@/views/config/indicator/index.vue'),
                meta: {
                    title: '应用指标库',
                    isSide: true
                }
            },
            {
                path: '/config/manage',
                name: 'config-manage',
                component: () => import('@/views/config/manage/index.vue'),
                meta: {
                    title: '管理指标库',
                    isSide: true
                }
            },
            {
                path: '/config/template',
                name: 'config-template',
                component: () => import('@/views/config/template/index.vue'),
                meta: {
                    title: '指标模板管理',
                    isSide: true
                }
            },
            {
                path: '/config/allocation',
                name: 'config-allocation',
                component: () => import('@/views/config/allocation/index.vue'),
                meta: {
                    title: '指标分配管理',
                    isSide: true
                }
            },
            {
                path: '/config/modelmanage',
                name: 'config-modelmanage',
                component: () => import('@/views/config/modelmanage/index.vue'),
                meta: {
                    title: '系统模型管理',
                    isSide: true
                }
            },
        ]
    },
    {
        path: '/safety',
        name: 'safety',
        meta: {
            isMenu: true,
            title: '安全管理',
            isFullscreen: false,
        },
        redirect: '/safety/man-machine/risk',
        children: [
            {
                path: '/safety/man-machine',
                name: 'safety-man-machine',
                meta: {
                    title: '人机协同安全管理',
                    isSide: true,
                },
                children: [
                    {
                        path: '/safety/man-machine/risk',
                        name: 'safety-man-machine-risk',
                        component: () => import('@/views/safety/man-machine/risk.vue'),
                        meta: {
                            title: '人机协同风险管理',
                        }
                    },
                    {
                        path: '/safety/man-machine/disposition',
                        name: 'safety-man-machine-disposition',
                        component: () => import('@/views/safety/man-machine/disposition/index.vue'),
                        meta: {
                            title: '人机协同处置设置',
                        }
                    },
                ]
            },
            {
                path: '/safety/environment',
                name: 'safety-environment',
                meta: {
                    title: '环境安全管理',
                    isSide: true,
                },
                children: [
                    {
                        path: '/safety/environment/work-area',
                        name: 'safety-environment-work-area',
                        component: () => import('@/views/safety/environment/work-area/index.vue'),
                        meta: {
                            title: '作业区域管理',
                        }
                    },
                    {
                        path: '/safety/environment/warning-handle',
                        name: 'safety-environment-warning-handle',
                        component: () => import('@/views/safety/environment/warning-handle/index.vue'),
                        meta: {
                            title: '警情处置管理',
                        }
                    },
                    {
                        path: '/safety/environment/warning-record',
                        name: 'safety-environment-warning-record',
                        component: () => import('@/views/safety/environment/warning-record/index.vue'),
                        meta: {
                            title: '警情记录',
                            isSide: false,
                        }
                    },
                    {
                        path: '/safety/environment/warning-approve',
                        name: 'safety-environment-warning-approve',
                        component: () => import('@/views/safety/environment/warning-approve/index.vue'),
                        meta: {
                            title: '警情处置审批',
                        }
                    },
                ]
            },
        ]
    },
    {
        path: '/report',
        name: 'report',
        redirect: '/report/index',
        meta: {
            isMenu: true,
            title: '智能报告',
        },
        children: [
            {
                path: '/report/index',
                name: 'report-index',
                component: () => import('@/views/report/index.vue'),
                meta: {
                    title: '智能报告',
                }
            },
            {
                path: '/report/list',
                name: 'report-list',
                component: () => import('@/views/report/list.vue'),
                meta: {
                    title: '查看报告',
                }
            },
        ]
    },
]

// 后端获取菜单路由与前端路由匹配
export const mapMenusToRoutes = function (routerList: any[], getRouter: any[] = asyncRoutes) {
    const matchArray: any[] = []
    routerList.forEach((item) => {
        getRouter.forEach((val) => {
            if (val.path === item.path) {
                if (val['children'] && val.children.length > 0) {
                    mapMenusToRoutes(val.children, item.children)
                }
                matchArray.push(val)
            }
        })
    })
    return matchArray
}

//优化后的路由权限
// export const mapMenusToRoutes = (routerList: any[], getRouter: any[] = asyncRoutes): any[] => {
//     const matchArray: any[] = [];
//     routerList.forEach((item) => {
//         const foundRoute = getRouter.find((route) => route.path === item.path);
//         if (foundRoute) {
//             if (foundRoute.children && foundRoute.children.length > 0) {
//                 const childRoutes = mapMenusToRoutes(item.children ?? [], foundRoute.children);
//                 foundRoute.children = childRoutes;
//             }
//             matchArray.push(foundRoute);
//         }
//     });
//     return matchArray;
// };
