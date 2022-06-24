import React, { useEffect, useState } from 'react'
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
import axios from 'axios';
const { Sider } = Layout;

// 本地图标映射数组
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />
  //.......
}

// 侧边栏
export default function SideMenu() {
  const [menu, setmenu] = useState([])
  // 获取菜单数据
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      console.log(res.data);
      setmenu(res.data);
    })
  }, [])

  let navigate = useNavigate();

  //遍历后端数据，形成菜单结构
  const items = menu.map((item) => {
    return (
      item.pagepermisson ?
        {
          label: item.title,
          key: item.key,
          icon: iconList[item.key],
          children: item.children?.length !== 0 ? item.children.map((el) => {
            return (el.pagepermisson === 1) ? {
              label: el.title,
              key: el.key,
              icon: iconList[el.key]
            } : null
          }) : null,
        } : ''
    )
  })

  // 点击菜单栏获取对应组件路径
  const onClick = (e) => {
    // console.log(e.keyPath[0])
    navigate(e.keyPath[0])
  }

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/home']}
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
    </Sider>
  )
}
