import React, { useEffect } from 'react'
import './NewsSandBox.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import SideMenu from '../../components/newsSandBox/sideMenu/index';
import TopHeader from '../../components/newsSandBox/TopHeader'
import { Layout } from 'antd'
import NewsRouter from '../../components/newsSandBox/NewsRouter';
const { Content } = Layout

const NewsSandBox = () => {
    NProgress.start()
    useEffect(() => {
        NProgress.done()
    })
    return (

        <Layout>
            <SideMenu />
            <Layout className='site-layout'>
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"
                    }}
                >
                    <NewsRouter></NewsRouter>

                </Content>
            </Layout>


        </Layout>





    )
}

export default NewsSandBox
