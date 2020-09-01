import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Button, Modal } from 'antd';
import styles from './index.less';
import UpdateProductForm from '../UpdateForm';
import noImage from '@/assets/no-image.png';
import { connect } from 'umi';

const ListProduct = props => {
  const [formValues, setFormValues] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const { dispatch, route, listProduct, loading } = props;

  useEffect(() => {
    dispatch({
      type: 'product/fetch',
      payload: { status: route.name === "published" ? true : false }
    });
  }, []);

  const handleDelete = (selectedRows) => {
    if (!selectedRows) return true;

    Modal.confirm({
      title: `Are you sure you want to delete the selected product (${selectedRows.pro_name})?`,
      content: 'Once deleted, the data cannot be recovered',
      okText: 'OK',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch({
          type: 'product/handleDelete',
          payload: { id: selectedRows.key, url: selectedRows.pro_avatar },
          callback: () => {
            dispatch({
              type: 'product/fetch',
              payload: { status: route.name === "published" ? true : false }
            });
          }
        });
      }
    })

  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'pro_avatar',
      key: 'pro_avatar',
      render: text => <img src={text ? text : noImage} style={{ width: 80, height: 80 }} />,
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'pro_name',
      key: 'pro_name',
      width: 525,
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'pro_category_id',
      key: 'pro_category_id',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'pro_price',
      key: 'pro_price',
    },
    {
      title: 'Status',
      dataIndex: 'pro_active',
      key: 'pro_active',
      render: value => {
        return value ? (
          <>
            <Tag key={value} color="success">Show</Tag>
          </>
        ) : (
            <>
              <Tag key={value} color="default">Hide</Tag>
            </>
          )
      }
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => (
        <div>{new Date(date.seconds * 1000).toLocaleDateString("en-US")}</div>
      )
    },
    {
      title: 'Action',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            shape="round"
            onClick={() => {
              handleUpdateModalVisible(true);
              setFormValues(record);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            type="primary"
            shape="round"
            danger
            onClick={() => handleDelete(record)}
          >Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div id="components-table-demo-ellipsis">
        <Card bordered={false}>
          <Table columns={columns} dataSource={listProduct} loading={loading} />
        </Card>
        {formValues && Object.keys(formValues).length ? (
          <UpdateProductForm
            updateModalVisible={updateModalVisible}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            values={formValues}
          />
        ) : null}
      </div>
    </div>
  );
}

export default connect(({ product, loading }) => ({
  listProduct: product.listProduct,
  loading: loading.effects['product/fetch'],
}))(ListProduct);
