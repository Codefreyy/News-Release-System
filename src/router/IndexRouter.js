import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function IndexRouter() {
    return (
        <Routes>
            {/* 在浏览器地址栏输入的时候 要在前面加#/，也就是localhost:3000/#?login */}
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NewsSandBox />} />

            {/* 下面的代码没生效，没权限也能进入首页 */}
            <Route path='*' element={
                localStorage.getItem("token") ?
                    <NewsSandBox /> : <Login />}
            />
        </Routes>


    )
}
