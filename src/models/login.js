import { history } from 'umi';
import { signIn } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getUserProfile } from '@/services/user';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    authErr: null,
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(signIn, payload);
        const userCurrent = yield call(getUserProfile, response);
        yield put({
          type: 'changeLoginStatus',
          payload: userCurrent.data(),
        }); // Login successfully

        if (response.status === 'ok') {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;

          if (redirect) {
            const redirectUrlParams = new URL(redirect);

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }

          history.replace(redirect || '/');
        }
      } catch (err) {
        yield put({
          type: 'setLoginErr',
          payload: err
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.userRoles);
      return { ...state, status: payload.status, type: payload.type };
    },
    setLoginErr(state, { payload }) {
      return { ...state, status: 'error', authErr: 'Login failed' };
    }
  },
};
export default Model;
