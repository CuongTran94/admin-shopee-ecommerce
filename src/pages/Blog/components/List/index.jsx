import React, { useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'umi';

import { columns } from './Column';
import { useHistory } from 'react-router';

const List = ({ dispatch, posts, loading, postDetail }) => {
  useEffect(() => {
    dispatch({
      type: 'blog/fetchPosts',
    });
  }, []);
  const history = useHistory();
  const handleDeletePost = (id) => {
    dispatch({
      type: 'blog/deletePost',
      payload: id,
    });
  };

  const newPostPosts = posts.map((post) => {
    return {
      ...post,
      action: {
        deletePost: () => handleDeletePost(post.id),
        editPost: () => history.push(`/blog/update/${post.slug}`),
      },
    };
  });

  return <Table dataSource={newPostPosts} columns={columns} />;
};

export default connect(({ blog, loading }) => ({
  posts: blog.posts,
  loading: loading.effects['blog/fetchPosts'],
}))(List);
