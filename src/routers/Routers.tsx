import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { DashBoard } from '../component/layout/DashBoard/DashBoard';
import { NotFound } from '../component/common/NotFound/NotFound';
import { Notice } from '../pages/Notice'; 
import {Notice2} from '../pages/Notice2';
import {ComnCodMgr} from '../pages/ComnCodMgr';
import { ComnCodeMgrDetailMain } from '../component/page/ComnCodMgr/ComnCodMgrDetailMain/ComnCodeMgrDetailMain';
import { Supply } from '../pages/Supply';
import { Product } from '../pages/Product';
import { Warehouse } from '../pages/Warehouse';

const routers: RouteObject[] = [
    { path: '*', element: <NotFound /> },
    { path: '/', element: <Login /> },
    {
        path: '/react',
        element: <DashBoard />,
        children: [
            {path: 'board', 
                children : [
                    {
                        path : 'notice.do',
                         element: <Notice />
                    }
                ]
            },
            {
                path: 'management',
                children : [
                    {
                        path : 'supplyInfo.do',
                        element: <Supply/>
                    },
                    {
                        path : 'productInfo.do',
                        element: <Product/>
                    },
                    {
                        path : 'warehouseInfo.do',
                        element: <Warehouse/>
                    }
                ]
            },
            {
                path : 'system',
                children : [
                    {
                        path : 'notice.do',
                        element: <Notice2/>
                    },
                    {
                        path : 'comnCodMgr.do',
                        element: <ComnCodMgr/>
                    },
                    {
                        path : 'comnCodMgr.do/:grpCod',//dynamic router 동적 라우터 연결 : 재사용성 증가 , 
                        //불필요한 렌더링 발생 가능, 보안 취약
                        element: <ComnCodeMgrDetailMain/>
                    }
                ]
            }
        ],
    },
];

export const Routers = createBrowserRouter(routers);