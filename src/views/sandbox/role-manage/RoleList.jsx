import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { MenuUnfoldOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import axios from 'axios'
const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)


  useEffect(() => {
    axios.get("/roles").then(res => {
      console.log(res.data);
      setdataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      //首页的children改成空字符串 就不会有树形结构
      const list = res.data
      list.forEach((item) => {
        if (!item.children.length) {
          item.children = ""
        }
      })
      setrightList(res.data)
    })
  }, [])

  // 表格的表头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      key: 'option',
      // 如果这里没写dataIndex，那么render的第一个形参就是整个这一行数据
      render: (item) => {
        return <div>
          <Button shape='circle' danger icon={<DeleteOutlined />} onClick={() => {
            showConfirm(item)
          }}></Button>

          <Button type='primary' shape='circle' onClick={() => {
            setIsModalVisible(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }} icon={<MenuUnfoldOutlined />} ></Button>


          <Modal title="权限分配" visible={isModalVisible} onOk={handleTreeOk} onCancel={handleTreeCancel}>
            <Tree
              checkStrictly={true}
              checkable
              checkedKeys={currentRights}
              onCheck={onCheck}
              treeData={rightList}
            />
          </Modal>
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
    // axios.delete(`/roles/${item.id}`)

  }


  //树形操作

  const onCheck = (checkedKeys) => {
    setcurrentRights(checkedKeys.checked)
  }



  const handleTreeOk = () => {
    setIsModalVisible(false);
    // 同步dataSource
    setdataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    //后端
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  }

  const handleTreeCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
    </>
  )
}

