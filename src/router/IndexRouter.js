import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function IndexRouter() {
    return (
        <Routes>
            {/* 在浏览器地址栏输入的时候 要在前面加#/，也就是localhost:3000/#?login */}
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NewsSandBox />} />
            <Route path='*' element={
                localStorage.getItem("token") ?
                    <NewsSandBox /> : <Login />}
            />
        </Routes>


    )
}
