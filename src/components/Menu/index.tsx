import React, { useState } from 'react';

import {
    PieChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    click?: (path: string) => {
       
    }
): MenuItem => {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Dashboard', '/', <PieChartOutlined />),
    getItem('前端抢购', '2', <UserOutlined />, [
        getItem('浏览器抢购Test', '/frontendNewTest'),
        getItem('浏览器抢购', '/frontendNew'),
    ]),
    getItem('脚本抢购', '3', <UserOutlined />, [
        getItem('服务列表', '/serverList'),
        getItem('服务新增', '/serverNew'),
    ]),
];

export default items