import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal } from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      //首页的children改成空字符串 就不会有树形结构
      const list = res.data
      list.forEach((item) => {
        if (!item.children.length) {
          item.children = ""
        }
      })
      setdataSource(res.data)
    })
  }, [])

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
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'keyPath',
      render: (key) => {
        return <Tag color="gold">{key}</Tag>
      }
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
          <Button type='primary' shape='circle' icon={<EditOutlined />}></Button>
        </div>
      }
    },
  ];

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

  const handleDelete = (item) => {
    // 过滤dataSource中id和当前删除这行的id相同的数据
    if (item.grade === 1) {
      setdataSource(dataSource.filter(el =>
        el.id !== item.id
      ))
      axios.delete(`http://localhost:5000/rights/${item.id}`).then(res => {
        console.log('删除', res);
      }).catch(err => { console.log('删除失败', err); })
    } else {
      // 前端
      let parentList = dataSource.filter(data => data.id === item.rightId)

      parentList[0].children = parentList[0].children.filter(data => data.id !== item.id)

      setdataSource([...dataSource])

      // 后端
      // axios.delete(`http://localhost:5000/right/${item.rightId}/`)
    }

  }

  const pagination = {
    pageSize: 5
  }

  return (
    <>
      <Table dataSource={dataSource} columns={columns} pagination={pagination} />
    </>
  )
}
