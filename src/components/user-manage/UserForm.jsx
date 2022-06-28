import React, { useState } from 'react'
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
                                value={item.id} key={item.id}>
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
