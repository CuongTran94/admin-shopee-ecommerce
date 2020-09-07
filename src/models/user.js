import { getCurrentUser, getUserProfile } from '@/services/user';
import { signOut } from '@/services/logout';
import { getPageQuery } from '@/utils/utils';
import { stringify } from 'querystring';
import { setAuthority } from '@/utils/authority';
import { history } from 'umi';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getCurrentUser);
      if (response) {
        const userProfile = yield call(getUserProfile, response);
        yield put({
          type: 'saveCurrentUser',
          payload: { userid: userProfile.id, ...userProfile.data() },
        });
      }

    },
    *logout(_, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield call(signOut);
        yield put({
          type: 'saveCurrentUser',
          payload: {}
        });
        setAuthority([]);
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
