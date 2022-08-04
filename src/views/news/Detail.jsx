import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, Divider, notification } from 'antd';
import { useParams } from "react-router";
import axios from 'axios';
import moment from 'moment'
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@ant-design/icons';


const Detail = (props) => {
    let star = localStorage.getItem("star") || [];
    const params = useParams();
    const [newsInfo, setnewsInfo] = useState({})

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            // console.log('newsinfo', res.data);
            //同步后端
            return res.data
        }).then(result => {
            axios.patch(`/news/${params.id}`, {
                view: result.view + 1
            })
        })
    }, [params.id])

    const handleLike = () => {
        if (!star.includes(params.id.toString())) {
            updateNews(params.id, {
                star: newsInfo.star + 1
            }).then(() => {
                setRefresh()
                const arr = [...star]
                localStorage.setItem("star", arr.concat(params.id)).catch((e) => console.log(e))
            })
        } else {
            notification.info({
                message: "error",
                description: "不能重复点赞！",
                placement: "bottomRight",
            })
        }

        setnewsInfo(
            {
                ...newsInfo,

            }
        )

        axios.patch(`/news/${params.id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <>
            <div>
                {newsInfo && newsInfo.category && <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                    subTitle={
                        <div>
                            {newsInfo.category.title}
                            <HeartTwoTone twoToneColor="#eb2f96" onClick={() => {
                                handleLike()
                            }} />
                        </div>
                    }

                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>

                        <Descriptions.Item label="发布时间">
                            {
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format(`YYYY/MM/DD HH:mm:ss`) : "-"
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>



                        <Descriptions.Item label="访问数量">
                            {newsInfo.view}
                        </Descriptions.Item>
                        <Descriptions.Item label="点赞数量">
                            {newsInfo.star}
                        </Descriptions.Item>
                        <Descriptions.Item label="评论数量">
                            0
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>}
                <Divider />
                <div style={{ paddingLeft: "20px" }}>

                    <b style={{ display: "inline-block", fontSize: "20px", marginBottom: "10px" }}>新闻内容</b>
                    <div dangerouslySetInnerHTML={
                        { __html: newsInfo.content }
                    }>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Detail