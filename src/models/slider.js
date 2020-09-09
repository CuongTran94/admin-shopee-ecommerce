import {
  uploadImage,
  fetchSlider,
  createSlider,
  updateSlider,
  deleteSlider,
} from '@/pages/Slider/service';
import { message } from 'antd';

const SliderModel = {
  namespace: 'slider',
  state: {
    listSlider: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchSlider);
      yield put({
        type: 'getSlider',
        payload: response,
      });
    },
    *handleAdd({ payload, callback }, { call, put }) {
      const response = yield call(createSlider, payload);
      if (response) {
        message.success('Added successfully');
      } else {
        message.error('Added failed');
      }

      if (callback) callback();
    },
    *handleUpdate({ payload, callback }, { call, put }) {
      const response = yield call(updateSlider, payload);
      if (response) {
        message.success('Updated successfully');
      } else {
        message.error('Updated failed');
      }

      if (callback) callback();
    },
    *handleDelete({ payload, callback }, { call }) {
      const response = yield call(deleteSlider, payload);
      if (response) {
        message.success('Deleted successfully');
      } else {
        message.error('Deleted failed');
      }

      if (callback) callback();
    },
    *handleUpload({ payload, callback }, { call, put }) {
      const response = yield call(uploadImage, payload);
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
    getSlider(state, action) {
      console.log('hello');
      return {
        ...state,
        listSlider: action.payload || [],
      };
    },
  },
};

export default SliderModel;
