import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import LoginForm from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType, authErr } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="Account">
          {status === 'error' && authErr && !submitting && (
            <LoginMessage content={authErr} />
          )}

          <UserName
            name="userName"
            placeholder="username"
            rules={[
              {
                required: true,
                message: 'username is required!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="password"
            rules={[
              {
                required: true,
                message: 'password is required！',
              },
            ]}
          />
        </Tab>
        <Tab key="mobile" tab="Mobile">
          {status === 'error' && authErr && !submitting && (
            <LoginMessage content="Verification code error" />
          )}
          <Mobile
            name="mobile"
            placeholder="phone number"
            rules={[
              {
                required: true,
                message: 'phone number is required！',
              },
              {
                pattern: /^1\d{10}$/,
                message: 'incorrect phone number format！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="code"
            countDown={60}
            getCaptchaButtonText="123"
            getCaptchaSecondText=""
            rules={[
              {
                required: true,
                message: 'code is required！',
              },
            ]}
          />
        </Tab>

        <Submit loading={submitting}>Login</Submit>

      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
