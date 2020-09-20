import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Row, Col, Form } from 'antd';
import { connect } from 'umi';

import { categoriesRender, upload, buttonUpload } from './Button';
import { handleEditorChange } from './helper';
import { INIT } from './Init';

import {
  Layout,
  Header,
  Footer,
  StyledInput,
  StyledSelect,
  StyledButton,
  RightLayout,
  StyledSwitch,
  ButtonContainer,
} from './Styled';

const CreateForm = (props) => {
  const { dispatch, categories, postDetail } = props;
  const postSlug = props.match.params.slug;
  const [content, setContent] = useState('');
  const [form] = Form.useForm();
  const timeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState(postDetail.coverImage);
  const [images, setImages] = useState({ small: null, medium: null, large: null });
  const [urlsImage, setUrlsImage] = useState({ smallUrl: '', mediumUrl: '', largeUrl: '' });

  useEffect(() => {
    if (postDetail.coverImage) {
      setUrlImage(postDetail.coverImage);
    }
  }, [postDetail.coverImage]);

  useEffect(() => {
    form.resetFields();
  }, [postDetail]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    dispatch({
      type: 'blog/fetchCategory',
    });
    if (postSlug !== undefined) {
      dispatch({
        type: 'blog/fetchPostDetail',
        payload: postSlug,
      });
      return () => {
        dispatch({
          type: 'blog/cleanPostDetail',
        });
      };
    }
  }, []);

  const onFinish = (value) => {
    const blog = {
      ...value,
      content,
      author: '',
      coverImage: urlImage,
      published: new Date(),
      id: postDetail.id,
      ...urlsImage,
    };
    dispatch({
      type: 'blog/createPost',
      payload: blog,
    });
  };

  const handleUpload = (img) => {
    dispatch({
      type: 'blog/uploadCoverPost',
      payload: { img, images },
      callback: ({ url, urls }) => {
        if (url) {
          setUrlImage(url);
          setUrlsImage(urls);
          return;
        }
        setUrlImage('');
      },
    });
  };

  return (
    <Form
      form={form}
      initialValues={{
        title: postDetail.title,
        slug: postDetail.slug,
        postStatus: true,
        content: postDetail.content,
      }}
      onFinish={onFinish}
    >
      <Row>
        <Col span={17}>
          <Layout>
            <Header>
              <Form.Item name="title">
                <StyledInput height={45} placeholder="Tiltle" />
              </Form.Item>
              <Form.Item name="slug">
                <StyledInput height={40} placeholder="Slug" />
              </Form.Item>
              <Form.Item name="category">
                <StyledSelect>{categoriesRender(categories)}</StyledSelect>
              </Form.Item>
            </Header>
            <Form.Item name="content">
              <Editor
                onEditorChange={(val) => handleEditorChange(val, timeoutRef, setContent)}
                init={INIT}
              />
            </Form.Item>
            <Footer />
          </Layout>
        </Col>
        <Col span={1} />
        <Col span={6}>
          <RightLayout>
            <Form.Item valuePropName="checked" name="postStatus">
              <StyledSwitch checkedChildren="Public" unCheckedChildren="Draft" />
            </Form.Item>

            <Form.Item>
              <Row>
                <Col>
                  {upload({ urlImage, setUrlImage, setImage, loading, setLoading, setImages })}
                </Col>
              </Row>
              <Row style={{ marginLeft: '15px' }}>{buttonUpload(handleUpload, image)}</Row>
            </Form.Item>

            <ButtonContainer>
              <Form.Item>
                <StyledButton htmlType="submit" type="primary" height={45} width={240}>
                  Submit
                </StyledButton>
              </Form.Item>
            </ButtonContainer>
          </RightLayout>
        </Col>
      </Row>
    </Form>
  );
};

export default connect(({ blog, loading }) => ({
  categories: blog.categories,
  postDetail: blog.postDetail,
  loading: loading.effects['blog/fetchCategory'],
}))(CreateForm);
