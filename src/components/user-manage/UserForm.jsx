import React, { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = React.forwardRef((props, ref) => {

    const [form] = Form.useForm();
    const [isRegionDisabled, setRegionDisabled] = useState(false)
    const { regionList, roleList } = props
    const onRoleChange = (value) => {
        if (value === 1) {
            setRegionDisabled(true)
            ref.current.setFieldsValue({
                region: ""
            })
        } else {
            setRegionDisabled(false)
        }
    }
    const roleObj = {
        "1": "superAdmin",
        "2": "admin",
        "3": "editor",
    }
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))

    // 区域要不要禁用
    const checkRegionDisabled = (item) => {
        console.log('i am item', item);
        // 更新时：
        if (props.isUpdate) {
            // 如果当前用户是超级管理员，就可以更新别人的区域和角色
            if (roleObj[roleId] === "superAdmin") {
                return false
                // 禁用为假 = 不禁用
            } else {
                return true
            }

            //创建时：
        } else {
            if (roleObj[roleId] === "superAdmin") {
                return false
            }
            return item.value !== region
        }
    }
    // 角色要不要禁用
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            // 如果当前用户是超级管理员，就可以更新别人的区域和角色
            if (roleObj[roleId] === "superAdmin") {
                return false
                // 禁用为假 = 不禁用
            } else {
                return true
            }

            //创建时：
        } else {
            if (roleObj[roleId] === "superAdmin") {
                return false
            } else {
                return roleObj[item.id] !== "editor"
            }
        }
    }

    useEffect(() => {
        setRegionDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    return (
        <>
            <Form
                ref={ref}
                form={form}
                layout="vertical"

            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true, message: '请输入用户名',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={
                        isRegionDisabled ? [] : [{
                            required: true, message: '请选择用户所在区域',
                        }]
                    }
                >
                    <Select disabled={isRegionDisabled}
                        allowClear
                    >
                        {
                            regionList.map(item => <Option
                                disabled={checkRegionDisabled(item)}
                                value={item.value} key={item.id}>
                                {item.title}
                            </Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[
                        { required: true, message: '请选择用户权限角色', },
                    ]}
                >

                    <Select onChange={onRoleChange}

                    >
                        {
                            roleList.map(item => <Option
                                value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>
                                {item.roleName}

                            </Option>)
                        }
                    </Select>

                </Form.Item>
            </Form>
        </>
    )
})

export default UserForm
