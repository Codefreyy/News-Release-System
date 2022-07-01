import React, { useState, useEffect, useRef } from 'react'
import { Table, Switch, Button, Modal, Popover } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;



export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [visible, setVisible] = useState(false);
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdatevisible, setUpdatevisible] = useState(false)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [current, setcurrent] = useState(null)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)

  const handleChange = (item) => {
    // console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])

    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
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
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === ""
        }
        return record.region === value
      },
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
        return <Switch checked={roleState} disabled={item.default} onChange={() => {
          handleChange(item)
        }}></Switch>
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

            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => {
              handleUpdate(item)
            }}></Button>
          </Popover>
        </div>
      }
    },
  ];


  const handleUpdate = (item) => {
    setTimeout(() => {
      setUpdatevisible(true)
      if (item.roleId === 1) {
        //禁用
        setisUpdateDisabled(true)
      } else {
        //取消禁用
        setisUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)
    setcurrent(item)
  }
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
    axios.delete(`http://localhost:5000/users/${item.id}`)

  }

  //提交表单
  const addFormOK = () => {
    addForm.current.validateFields().then(value => {
      setVisible(false);
      //post到后端生成id，再设置dataSource，方便后面的删除和更新
      axios.post(`http://localhost:5000/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        setdataSource([...dataSource, res.data])
      })

    }).catch(err => {
      console.log(err);
    })
  }

  const UpdateFormOK = () => {
    updateForm.current.validateFields().then(value => {
      setUpdatevisible(false);
      console.log(value);
      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
            // 上面这行是找出中文名
          }
        }
        return item
      }))


    })
  }

  const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {

    return (
      <>
        <Modal
          visible={visible}
          title="添加用户"
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            setVisible(false)
          }}
          onOk={addFormOK}
        >
          <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
        </Modal>

        <Modal
          visible={isUpdatevisible}
          title="更新用户"
          okText="更新"
          cancelText="取消"
          onCancel={() => {
            setUpdatevisible(false)
          }}
          onOk={UpdateFormOK}
        >
          <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} ></UserForm>
        </Modal></>
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
