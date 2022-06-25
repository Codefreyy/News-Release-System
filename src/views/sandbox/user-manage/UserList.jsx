import React, { useState, useEffect } from 'react'
import { Table, Switch, Button, Modal, Popover, Form, Input, Select } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;
const { Option } = Select


export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [visible, setVisible] = useState(false);
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])


  // 获取角色列表
  useEffect(() => {
    axios.get("http://localhost:5000/roles").then(res => {
      setroleList(res.data)
      console.log('you wanna see', res.data);
    })
  }, [])

  // 获取区域列表
  useEffect(() => {
    axios.get("http://localhost:5000/regions").then(res => {
      setregionList(res.data)
    })
  }, [])

  // 用户列表
  useEffect(() => {
    axios.get("http://localhost:5000/users?expand=role").then(res => {
      setdataSource(res.data)
    })
  }, [])


  // 表格的表头
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId) => {
        return roleId === 1 ? '超级管理员' : roleId === 2 ? "区域管理员" : "区域编辑"
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },

    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },

    {
      title: '操作',
      key: 'option',
      // 如果这里没写dataIndex，那么render的第一个形参就是整个这一行数据
      render: (item) => {
        return <div>
          <Button shape='circle' danger icon={<DeleteOutlined onClick={() => {
            showConfirm(item)
          }} />} disabled={item.default}></Button>

          <Popover title='配置项' content={
            <div>
              <Switch defaultChecked ></Switch>
            </div>
          } trigger={item.pagepermisson === undefined ? '' : 'click'}>

            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default}></Button>
          </Popover>
        </div>
      }
    },
  ];

  // 提示确认删除
  const showConfirm = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        handleDelete(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 执行删除
  const handleDelete = (item) => {
    setdataSource(dataSource.filter(el =>
      el.id !== item.id
    ))
    // axios.delete(`http://localhost:5000/roles/${item.id}`)

  }

  const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"

        >
          <Form.Item
            name="用户名"
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
            name="密码"
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
            name="区域"
            label="区域"
            rules={[
              { required: true, message: '请选择用户所在区域', },
            ]}
          >
            <Select
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
            name="角色"
            label="角色"
            rules={[
              { required: true, message: '请选择用户权限角色', },
            ]}
          >

            <Select
              allowClear
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
      </Modal>
    );
  };

  const onCreate = (values) => {
    setVisible(false);
  }


  return (
    <>
      <Button type='primary' onClick={() => {
        setVisible(true)
      }}>添加用户</Button>

      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}
        pagination={{
          pageSize: 5
        }} />
    </>
  )
}
