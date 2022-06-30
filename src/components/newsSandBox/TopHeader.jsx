import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
const { Header } = Layout;


export default function TopHeader() {
    let navigate = useNavigate()
    const [collapsed, setcollapsed] = useState(false)
    const changeCollapsed = () => {
        setcollapsed(!collapsed)
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a href="/#">
                            个人资料
                        </a>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <a onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/login")
                        }} >
                            退出
                        </a>
                    ),
                    danger: true,
                },
            ]}
        />
    );
    return (
        <Header className="site-layout-background" style={{ padding: "0 16px" }}>

            {
                collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: "right" }}>
                <span>欢迎彭郁洁回来！  </span>
                <Dropdown overlay={menu}>
                    <Avatar size={24} icon={<UserOutlined />} />
                </Dropdown>

            </div>


        </Header>
    )
}
