import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Row, Col, List } from 'antd'
import _ from 'lodash'

const News = () => {
    const [list, setList] = useState([])
    useEffect(() => {
        //Object.entries()返回一个给定对象自身可枚举属性的键值对数组
        //const obj = { foo: 'bar', baz: 'abc' }; 
        // console.log(Object.entries(obj)); 
        // [['foo', 'bar'], ['baz', 'abc']]
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            console.log('列表', Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
    }, [])
    return (
        <>
            <div style={{ width: "95%", margin: "0 auto" }}>
                <PageHeader
                    className="site-page-header"
                    title="全球大新闻"
                    subTitle="查看新闻"
                />
                <div className="site-card-wrapper">
                    <Row gutter={[16, 16]}>
                        {list?.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true} style={{ height: "42vh" }}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{ pageSize: 3 }}

                                        renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>
            </div>
        </>
    )
}

export default News;