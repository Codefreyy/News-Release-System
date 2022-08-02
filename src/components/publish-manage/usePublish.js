import { useState, useEffect } from 'react'
import axios from 'axios'
import { notification } from 'antd'

function usePublish(type) {
    const [dataSource, setDataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            console.log("待发布", res.data);
            setDataSource(res.data)
        })
    }, [username, type])


    const handlePublish = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到发布管理/已发布中查看您的新闻!`,
                placement: "bottomRight",

            })
        })
    }
    const handleSunset = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到发布管理/已下线中查看您的新闻!`,
                placement: "bottomRight",

            })
        })
    }

    const handleDelete = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))

        axios.delete(`news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您已删除该新闻！`,
                placement: "bottomRight",

            })
        })
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish