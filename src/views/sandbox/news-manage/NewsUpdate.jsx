import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Select, Input, message, notification } from 'antd';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import './News.css'
import { useParams } from "react-router";
import axios from 'axios'
import { useNavigate } from "react-router";
const { Step } = Steps

const NewsUpdate = (props) => {
    const params = useParams()
    const navigate = useNavigate();

    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")
    // const User = JSON.parse(localStorage.getItem("token"))
    const next = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空！")
            } else {
                console.log("第三步", formInfo, content)
                setCurrent(current + 1)
            }
        }

    }
    const prev = () => {
        setCurrent(current - 1)
    }

    // 表单相关设置
    const { Option } = Select;
    const layout = {
        labelCol: {
            span: 2,
        },
        wrapperCol: {
            span: 22,
        },
    };

    const NewsForm = useRef(null)
    useEffect(() => {
        axios.get('/categories').then(res => {
            console.log("数据", res.data);
            setCategoryList(res.data)
        })
    }, [])

    const handleSave = (auditState) => {
        axios.patch(`news/${params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
            // "publishTime": 0
        }).then(res => {
            navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list");

            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻!`,
                placement: "bottomRight",

            })
        })
    }

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            let { title, categoryId, content } = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setContent(content)
        })
    }, [params.id])

    return (

        <>
            <PageHeader
                onBack={() => navigate(-1)}
                className="site-page-header"
                title="修改新闻"
            />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{ marginTop: "4em" }}>
                <div className={current === 0 ? "" : "hidden"}>
                    <Form {...layout} name="control-hooks"
                        ref={NewsForm}>
                        <Form.Item
                            name="title"
                            label="新闻标题"
                            rules={[
                                {
                                    required: true, message: '您未输入任何内容！'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="新闻分类"
                            rules={[
                                {
                                    required: true,
                                    message: '您未输入任何内容！'
                                },
                            ]}
                        >
                            <Select
                            >

                                {
                                    categoryList?.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }

                            </Select>
                        </Form.Item>

                    </Form>

                </div>
                <div className={current === 1 ? "" : "hidden"} >
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? "" : "hidden"}>
                    333
                </div>

            </div>

            <div style={{ marginTop: "5em" }}>

                {current === 2 && <span>
                    <Button type="primary" onClick={() => {
                        handleSave(0)
                    }}>保存草稿箱</Button>
                    <Button type="primary" onClick={() => {
                        handleSave(1)
                    }} >提交审核</Button></span>}

                {current < 2 &&
                    <Button type="primary" onClick={next}>下一步</Button>
                }

                {current > 0 && <Button onClick={prev}>上一步</Button>}
            </div>
        </>
    )
}

export default NewsUpdate

