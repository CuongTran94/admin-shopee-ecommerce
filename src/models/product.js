import {
  fetchProduct,
  updateProduct,
  uploadAvatarProduct,
  createProduct,
  deleteProduct,
} from '@/pages/Product/service';
import { message } from 'antd';

const ProductModel = {
  namespace: 'product',
  state: {
    listProduct: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchProduct, payload);
      yield put({
        type: 'getProduct',
        payload: response,
      });
    },
    *handleAdd({ payload, callback }, { call, put }) {
      const response = yield call(createProduct, payload);
      if (response) {
        message.success('Added successfully');
      } else {
        message.error('Added failed');
      }

      if (callback) callback();
    },
    *handleUpdate({ payload, callback }, { call, put }) {
      const response = yield call(updateProduct, payload);
      if (response) {
        message.success('Updated successfully');
      } else {
        message.error('Updated failed');
      }
    },
    *handleDelete({ payload, callback }, { call }) {
      const response = yield call(deleteProduct, payload);
      if (response) {
        message.success('Deleted successfully');
      } else {
        message.error('Deleted failed');
      }

      if (callback) callback();
    },
    *handleUpload({ payload, callback }, { call, put }) {
      const response = yield call(uploadAvatarProduct, payload);
      if (response) {
        message.success('Upload successfully');
      } else {
        message.error('Upload failed');
      }

      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    getProduct(state, action) {
      return {
        ...state,
        listProduct: action.payload || [],
      };
    },
  },
};

export default ProductModel;
