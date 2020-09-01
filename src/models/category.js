import { fetchCategory, addCategory, removeCategory, updateCategory } from '@/pages/Category/service';
import { message } from 'antd';

const CategoryModel = {
    namespace: 'category',
    state: {
        listCate: [],
    },
    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(fetchCategory);
            yield put({
                type: 'getCategory',
                payload: response
            });
        },
        *handleSubmitCate({ payload }, { call, put }) {
            const hide = message.loading('Adding');
            const response = yield call(addCategory, payload);
            if (response) {
                hide();
                message.success('Added successfully');
            } else {
                message.error('Added failed');
            }
        },
        *handleUpdateCate({ payload, callback }, { call, put }) {
            const hide = message.loading('Updating');
            const response = yield call(updateCategory, payload)
            if (response) {
                hide();
                message.success('Updated successfully');
            } else {
                message.error('Updated failed');
            }
            if (callback) callback();
        },
        *handleDelCate({ payload, callback }, { call, put }) {
            const hide = message.loading('Deleting');
            const response = yield call(removeCategory, payload);
            if (response) {
                hide();
                message.success('Deleted successfully');
            } else {
                message.error('Deleted failed');
            }
            if (callback) callback();
        }
    },
    reducers: {
        getCategory(state, action) {
            return {
                ...state,
                listCate: action.payload || []
            };
        }
    }
};

export default CategoryModel;