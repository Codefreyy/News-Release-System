import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/NewsSandbox/NewsSandBox'

export default function IndexRouter() {
    return (
        <Routes>
            <Route path='/' element={<NewsSandBox />} />
            <Route path="/login" element={<Login />} />

            <Route path='*' element={localStorage.getItem("token") ?
                <NewsSandBox ></NewsSandBox> : <Navigate to='/login' />} />
        </Routes>


    )
}
