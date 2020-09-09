import React from 'react';
import { Table, Tag, Select } from 'antd';
import styled from 'styled-components';

import { getTotalPrice, getShortId, getStatus, getPrice } from '@/utils/utils';
import FooterOrder from './FooterOrder';

const { Option } = Select;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-style: none !important;
  }
`;

const StyledTag = styled(Tag)`
  display: inline-flex !important;
  border-radius: 10px !important;
  width: 100px !important;
  justify-content: center;
  border-style: hidden !important;
  background-color: #edd7fb !important;
  height: 30px !important;
  align-items: center !important;
`;

const StyledImg = styled.img`
  width: 50px;
  height: 50px;
`;

const columns = [
  {
    key: 'orderID',
    title: 'Order ID',
    dataIndex: 'orderID',
  },
  {
    key: 'created',
    title: 'Created',
    dataIndex: 'created',
  },
  {
    key: 'customer',
    title: 'Customer',
    dataIndex: 'customer',
  },
  {
    key: 'total',
    title: 'Total',
    dataIndex: 'total',
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (status) => {
      return (
        <StyledSelect
          onChange={status.onChangeStatus}
          defaultValue={status.statusNum}
          style={{ width: 130 }}
        >
          <Option value="2">Pending</Option>
          <Option value="3">Confirmed</Option>
          <Option value="4">Paid</Option>
          <Option value="5">Cancelled</Option>
        </StyledSelect>
      );
    },
  },
  {
    key: 'action',
    title: 'Action',
    dataIndex: 'action',
    render: (onDelete) => {
      return <a onClick={onDelete}>Delete</a>;
    },
  },
];

const columnsProduct = [
  {
    key: 'image',
    title: '#',
    dataIndex: 'image',
    render: (image) => {
      return <StyledImg src={image} />;
    },
  },
  {
    key: 'pid',
    title: 'PID',
    dataIndex: 'pid',
  },
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
  },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
  },
  {
    key: 'qty',
    title: 'Qty',
    dataIndex: 'qty',
  },
  {
    key: 'total',
    title: 'Total',
    dataIndex: 'total',
  },
];

const ListOrder = ({ loading, orderList, onUpdateStatus, onDeleteOrder }) => {
  const handleChangeStatus = (status, id) => {
    onUpdateStatus({ status, id });
  };

  const newData = orderList.map((order) => ({
    key: order.id,
    orderID: getShortId(order.id),
    created: '2 min ago',
    customer: order.name,
    status: {
      statusNum: getStatus(order.status),
      onChangeStatus: (value) => handleChangeStatus(value, order.id),
    },
    total: getTotalPrice(order.products),
    action: () => onDeleteOrder(order.id),
    products: order.products,
  }));

  return (
    <Table
      rowKey="key"
      loading={loading}
      pagination={false}
      dataSource={newData}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => {
          const productData = record.products.map((product) => ({
            key: product.pro_id,
            image: product.pro_avatar,
            pid: getShortId(product.pro_id),
            name: product.pro_name,
            price: product.pro_price,
            qty: product.pro_quantity,
            total: getPrice(product.pro_quantity, product.pro_price),
          }));
          const price = getTotalPrice(record.products);
          return (
            <>
              <Table pagination={false} columns={columnsProduct} dataSource={productData} />
              <FooterOrder price={price} />
            </>
          );
        },
      }}
    />
  );
};

export default ListOrder;
