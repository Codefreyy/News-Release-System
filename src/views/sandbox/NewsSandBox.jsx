import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
// import SideMenu from '../../components/newsSandBox/SideMenu'
// import TopHeader from '../../components/newsSandBox/TopHeader'
import UserList from './user-manage/UserList';
import RoleList from './role-manage/RoleList';
import RightList from './right-manage/RightList';
import Home from './home/Home';
import NoPermission from './nopermission/NoPermission';
import SideMenu from '../../components/newsSandBox/SideMenu';
import TopHeader from '../../components/newsSandBox/TopHeader'

const NewsSandBox = () => {
    return (
        <>
            <SideMenu />
            <TopHeader />
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="user-manage/list" element={<UserList />} />
                <Route path="right-manage/role/list" element={<RoleList />} />
                <Route path="right-manage/right/list" element={<RightList />} />
                <Route path="/" element={<Navigate replace from="/" to="home" />} />
                <Route path='*' element={<NoPermission />} />

            </Routes>

        </>



    )
}

export default NewsSandBox
