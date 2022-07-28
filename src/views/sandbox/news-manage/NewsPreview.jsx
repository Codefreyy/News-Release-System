import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, Divider } from 'antd';
import { useParams } from "react-router";
import axios from 'axios';
import moment from 'moment'

const NewsPreview = (props) => {
    const params = useParams();
    const [newsInfo, setnewsInfo] = useState({})

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo(res.data)
            console.log('newsinfo', res.data);
        })
    }, [params.id])



    const AuditState = ["未审核", "审核中", "已通过", "未通过"]
    const PublishState = ["未发布", "待发布", "已上线", "已下线"]
    const colorList = ['black', 'orange', 'green', 'red']
    return (
        <>
            {newsInfo && newsInfo.category && <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={newsInfo.category.title}

            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">

                        {moment(newsInfo.createTime).format(`YYYY/MM/DD HH:mm:ss`)}
                    </Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {
                            newsInfo.publishTime ? moment(newsInfo.publishTime).format(`YYYY/MM/DD HH:mm:ss`) : "-"
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>

                    <Descriptions.Item label="审核状态">
                        <span style={{ color: colorList[newsInfo.auditState] }}>
                            {AuditState[newsInfo.auditState]}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="发布状态" >
                        <span style={{ color: colorList[newsInfo.publishState] }}>
                            {PublishState[newsInfo.publishState]}
                        </span>

                    </Descriptions.Item>

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
        </>
    )
}
export default NewsPreview;