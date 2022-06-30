import React from 'react'
import classes from './Login.module.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import ParticlesBg from 'particles-bg'



const Login = () => {
  return (

    <div className={classes.FormOuter}
    >
      <ParticlesBg type="lines" bg={true} />
      <div className={classes.Form}>
        <div className={classes.title}>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
        // onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>

          </Form.Item>
        </Form>
      </div>

    </div>

  )
}

export default Login;
