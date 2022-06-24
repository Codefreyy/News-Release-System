import React from 'react'
import './sidemenu.css'
import { Layout, Menu } from 'antd';
import {
  KeyOutlined,
  UserOutlined,
  HomeOutlined,
  FundOutlined,
  EditOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;

export default function SideMenu() {
  let navigate = useNavigate();
  const menuList = [
    {
      key: "/home",
      label: "首页",
      icon: <HomeOutlined />,

    },
    {
      key: "/use-manage",
      label: "用户管理",
      icon: <UserOutlined />,
      children: [{
        key: "/user-manage/list",
        icon: <UserOutlined />,
        label: "用户列表",
      }],
    },
    {
      key: "/right-manage",
      label: "权限管理",
      icon: <KeyOutlined />,
      children: [{
        key: "/right-manage/role/list",
        label: "权限列表",
        icon: <FundOutlined />
      },
      {
        key: "/right-manage/right/list",
        label: "角色列表",
        icon: <HomeOutlined />,
      }],
    },

  ]

  const items = menuList.map((item) => {
    return (
      {
        label: item.label,
        key: item.key,
        icon: item.icon,
        children: item.children ? item.children : ''
      }
    )
  })

  const onClick = (e) => {
    // console.log(e.keyPath[0])
    navigate(e.keyPath[0])
  }

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="logo" >全球新闻发布系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['/home']}
        items={items}
        onClick={onClick}
      />
    </Sider>
  )
}
