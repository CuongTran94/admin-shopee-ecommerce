import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => (
  <PageContainer>
    <Card>
      <Alert
        message="Chào mừng bạn đến với trang quản lý Shopee"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text strong>
        Shopee Management
      </Typography.Text>
      <CodePreview>App is made by Cuong Tran</CodePreview>
    </Card>
  </PageContainer>
);
