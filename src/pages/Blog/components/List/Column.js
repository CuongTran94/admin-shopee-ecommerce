import { Button, Space } from 'antd';
import styled from 'styled-components';

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Published',
    dataIndex: 'published',
    key: 'published',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'action',
    render: (action) => {
      return (
        <Space>
          <Button onClick={action.deletePost} size="small" type="primary">
            Delete
          </Button>
          <Button onClick={action.editPost} size="small" type="primary">
            Edit
          </Button>
        </Space>
      );
    },
  },
];
