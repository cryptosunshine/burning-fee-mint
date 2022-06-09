import React, { useEffect, useState, lazy } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import { createBrowserHistory } from 'history'
import { Layout, Menu, Breadcrumb } from 'antd';
import Home from '../../views/Home'
import Admin from '../../views/Admin'
import ServerList from '../../views/Server/List'
import ServerNew from '../../views/Server/New'
import FrontendNew from '../../views/Frontend/New'
import FrontendNewTest from '../../views/FrontendTest/New'
import Items from '../Menu'

const { Header, Content, Footer, Sider } = Layout;


const Layouts = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const click = (e: any) => {
        navigate(e.key)
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={Items} onClick={click} />
            </Sider>
            <Layout className="site-layout">
                <Content>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb> */}

                    <Routes>
                        <Route path="/" element={<Home></Home>} />
                        <Route path="/admin" element={<Admin></Admin>} />
                        <Route path="/serverList" element={<ServerList></ServerList>} />
                        <Route path="/serverNew" element={<ServerNew></ServerNew>} />
                        <Route path="/frontendNew" element={<FrontendNew></FrontendNew>} />
                        <Route path="/frontendNewTest" element={<FrontendNewTest></FrontendNewTest>} />
                    </Routes>

                </Content>
                <Footer style={{ textAlign: 'center' }}>Burning fee mint ©2022 Created by Burning Labs</Footer>
            </Layout>
        </Layout>

    );
}

export default Layouts;