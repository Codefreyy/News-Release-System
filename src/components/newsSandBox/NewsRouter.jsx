import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { connect } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserList from '../../views/sandbox/user-manage/UserList';
import RoleList from '../../views/sandbox/right-manage/RoleList';
import RightList from '../../views/sandbox/right-manage/RightList';
import Home from '../../views/sandbox/home/Home';
import NoPermission from '../../views/sandbox/nopermission/NoPermission';
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd';
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft';
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory';
import Audit from '../../views/sandbox/audit-manage/Audit';
import AuditList from '../../views/sandbox/audit-manage/AuditList';
import Unpublished from '../../views/sandbox/publish-manage/Unpublished';
import Published from '../../views/sandbox/publish-manage/Published';
import Sunset from '../../views/sandbox/publish-manage/Sunset';
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate';
import axios from 'axios';

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,


}

const NewsRouter = (props) => {
    console.log('newRouterProps>>', props);
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
            console.log("路径列表>>>", [...res[0].data, ...res[1].data])

        })
    }, [])

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    console.log("currentrIGHT", rights)

    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }

    return (
        <>
            <Spin size='large' spinning={props.isLoading}>
                <Routes>
                    {
                        BackRouteList?.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} exact />
                            }
                            return null
                        }
                        )
                    }

                    {/*  <Route path="/home" element={<Home />} />
                <Route path="user-manage/list" element={<UserList />} />
                <Route path="right-manage/role/list" element={<RoleList />} />
                <Route path="right-manage/right/list" element={<RightList />} />
 */}

                    <Route path="/" element={<Navigate replace from="/" to="home" />} />
                    {BackRouteList.length > 0 && <Route path='*' element={<NoPermission />} />}

                </Routes>
            </Spin>
        </>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
    isLoading
})


export default connect(mapStateToProps)(NewsRouter)
