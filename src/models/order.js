import { fetchOrder, updateOrder, deleteOrder } from '@/pages/Order/service';
import { message } from 'antd';

const OrderModel = {
  namespace: 'order',
  state: {
    orderList: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchOrder);

      yield put({
        type: 'getOrder',
        payload: response,
      });
    },
    *update({ payload }, { call, select }) {
      const orders = yield select((state) => state.order.orderList);
      const ownerOrderById = orders.filter((order) => order.id === payload.id);
      const newOrder = {
        ...ownerOrderById[0],
        status: Number(payload.status),
      };
      try {
        yield call(() => updateOrder(newOrder, payload.id));
        message.success('Updated successfully');
      } catch (error) {
        message.error('Updated failed');
      }
    },
    *delete({ payload }, { call, put }) {
      try {
        yield call(() => deleteOrder(payload));
        yield put({ type: 'deleteOrder', payload });
        message.success('Delete successfully');
      } catch (error) {
        message.error('Delete failed');
      }
    },
  },

  reducers: {
    getOrder(state, action) {
      return {
        ...state,
        orderList: action.payload || [],
      };
    },
    deleteOrder(state, action) {
      return {
        ...state,
        orderList: state.orderList.filter((order) => order.id !== action.payload),
      };
    },
  },
};
export default OrderModel;
