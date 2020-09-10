import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';

const tabList = [
  {
    key: 'published',
    tab: 'Published',
  },
  {
    key: 'unpublished',
    tab: 'Unpublished',
  },
  {
    key: 'create',
    tab: 'Create Product',
  },
];

const Product = props => {
  const { children } = props;

  const handleTabChange = key => {
    const { match } = props;
    const url = match.url === '/' ? '' : match.url;

    switch (key) {
      case 'published':
        history.push(`${url}/published`);
        break;

      case 'unpublished':
        history.push(`${url}/unpublished`);
        break;

      case 'create':
        history.push(`${url}/create`);
        break;

      default:
        break;
    }
  };

  const handleFormSubmit = value => {
    // eslint-disable-next-line no-console
  };

  const getTabKey = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');

    if (tabKey && tabKey !== '/') {
      return tabKey;
    }

    return 'published';
  };

  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      {children}
    </PageContainer>
  );
};

export default Product;
