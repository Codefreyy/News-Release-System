import React from 'react'
import classes from './Login.module.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import ParticlesBg from 'particles-bg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';




const Login = (props) => {
  let navigate = useNavigate()
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      console.log(res.data)
      if (res.data.length === 0) {
        message.error("用户名或密码不匹配！")
      } else {
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        navigate(`/home`)
        message.info("登录成功！")
      }
    })
  }
  return (

    <div className={classes.FormOuter}
    >
      <ParticlesBg type="lines" bg={true} />
      <div className={classes.Form}>
        <div className={classes.title}>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
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
