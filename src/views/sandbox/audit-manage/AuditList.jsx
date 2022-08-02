import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, notification } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const AuditState = ["未审核", "审核中", "已通过", "未通过"]
const AuditColor = ['', 'gold', 'green', 'red']

const AuditList = () => {
    let navigate = useNavigate()
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            console.log(res.data);
            setDataSource(res.data)
        })
    }, [username])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',

        },


        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>
                    {category.title}
                </div>
            }
        },

        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                return < Tag color={AuditColor[auditState]} > {AuditState[auditState]}</Tag >
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    {item.auditState === 2 && <Button danger onClick={() => {
                        onPublish(item)
                    }}>发布</Button>}

                    {item.auditState === 1 && <Button onClick={() => {
                        handleRevert(item)
                    }}>撤销</Button>}

                    {item.auditState === 3 && <Button type='primary' onClick={() => {
                        handleUpdate(item)
                    }}>更新</Button>}
                </div>
            }
        }
    ];

    const onPublish = (item) => {
        axios.patch(`news/${item.id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            navigate('/publish-manage/published')
            notification.info({
                message: `通知`,
                description:
                    `您可以到发布管理/已发布中查看您的新闻!`,
                placement: "bottomRight",

            })
        })
    }

    const handleUpdate = (item) => {
        navigate(`/news-manage/update/${item.id}`)
    }
    const handleRevert = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到草稿箱中查看您的新闻!`,
                placement: "bottomRight",

            })
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />
        </div>
    )
}

export default AuditList
