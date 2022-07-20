import type { FC } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';

import { Button, Card, Form, Input, message, notification } from 'antd';
import { useRouter } from 'next/router';

import type { UserData } from '@/pages/api/login';

const LoginPage: FC = () => {
  const router = useRouter();
  const user = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem('user');
  }, []);

  useEffect(() => {
    if (user) router.push('/');
  }, [router, user]);

  const onFinish = useCallback(async (values: UserData) => {
    try {
      const res: Response = await fetch('api/login', {
        method: 'POST',
        body: JSON.stringify({
          password: values.password,
          username: values.username
        })
      });

      if (!res.ok) {
        const resMessage = await res.json();
        notification.error({
          message: 'Error',
          description: resMessage.message
        });

        return;
      }

      window.localStorage.setItem('user', values.username);
      router.push('/');
    } catch (e) {
      message.error('oops!');
    }
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100vw',
      minHeight: '100vh',
      background: '#ececec'
    }}>
      <Card title="Login" bordered={false} style={{ width: 300 }}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;