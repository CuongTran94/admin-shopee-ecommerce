import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';


const Blog = (props) => {
  const { children } = props;
  return <PageContainer>{children}</PageContainer>;
};

export default Blog;
