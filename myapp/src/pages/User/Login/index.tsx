import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {Helmet, history, Link, useModel} from '@umijs/max';
import {Alert, Tabs, message, Divider, Space} from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {SYSTEM_LINK, SYSTEM_LOGO} from "@/constant";
import {API} from "@/services/ant-design-pro/typings";
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const res = await login({
        ...values,
        type,
      });

      if (res.code === 0 && res.data!==null) {
        const defaultLoginSuccessMessage = '登录成功！';
        // @ts-ignore
        //message.success(user_Account + user_Password);
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else throw new Error(res.description);
      // 如果失败去设置用户错误信息
      //setUserLoginState(res.data);
    } catch (error:any) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(error.message ?? defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="全栈开发平台"
          subTitle={<a href={SYSTEM_LINK} target = "_blank" rel="noreferrer" > 大学最优质、最高效的在线编程学习平台 </a>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账号密码登录',
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的账号和密码'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min:8,
                    type: 'string',
                    message: '长度不能小于 8 ' ,
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Space split={<Divider type="vertical" /> }>
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <Link to="/user/register">没有账户？新注册</Link>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </Space>

          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
