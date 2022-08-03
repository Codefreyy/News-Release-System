import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
const { Header } = Layout;

//store中state的每次改变都会调用mapStateToProps, mapStateToProps接受整个store，并返回组件需要的数据对象
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}


const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}

function TopHeader(props) {
    const changeCollapsed = () => {
        // console.log("dispatch", props);
        props.changeCollapsed()
    }

    console.log("props>>>", props);
    let navigate = useNavigate()

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))


    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a href="/#">
                            {roleName}
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
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: "right" }}>
                <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来！  </span>
                <Dropdown overlay={menu}>
                    <Avatar size={24} icon={<UserOutlined />} />
                </Dropdown>

            </div>


        </Header>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
