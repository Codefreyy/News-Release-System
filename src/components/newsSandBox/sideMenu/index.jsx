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




/* todo：为什么setPath设置了，但是每次刷新后 defaultselect的不是之前的path */
// 本地图标映射数组
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <KeyOutlined />,
  "/right-manage/role/list": <KeyOutlined />,
  "/right-manage/right/list": <KeyOutlined />,
  "/news-manage": <FundOutlined />,
  "/audit-manage": <ControlOutlined />,
  "/publish-manage": <EditOutlined />

}

// 侧边栏
export default function SideMenu(props) {
  const [menu, setmenu] = useState([])
  const [path, setPath] = useState([])
  const [openPath, setOpenPath] = useState([])
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
    navigate(e.keyPath[0])
    const selectedPath = [`${e.keyPath[0]}`]
    const openPath = ["/" + `${e.keyPath[0].split("/")[1]}`];
    console.log(openPath);
    setPath(selectedPath);
    setOpenPath(openPath)
  }

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={path}
            items={items}
            onClick={onClick}
            defaultOpenKeys={openPath}
          />
        </div>
      </div>
    </Sider>
  )
}
