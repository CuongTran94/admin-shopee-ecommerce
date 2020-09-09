import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import ModolDelete from './Modal';

import ListOrder from './ListOrder';
import ModalDelete from './Modal';

const Order = (props) => {
  const { dispatch, orderList, loading } = props;

  useEffect(() => {
    dispatch({
      type: 'order/fetch',
    });
  }, []);

  const handleUpdateStatus = (value) => {
    dispatch({
      type: 'order/update',
      payload: value,
    });
  };

  const handleDeleteOrder = (orderID) => {
    ModalDelete(() =>
      dispatch({
        type: 'order/delete',
        payload: orderID,
      }),
    );
  };

  return (
    <PageContainer>
      <ListOrder
        onDeleteOrder={handleDeleteOrder}
        onUpdateStatus={handleUpdateStatus}
        orderList={orderList}
        loading={loading}
      />
    </PageContainer>
  );
};

export default connect(({ order, loading }) => ({
  orderList: order.orderList,
  loading: loading.effects['order/fetch'],
}))(Order);
