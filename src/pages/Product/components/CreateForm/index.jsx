import React, { useState } from 'react';
import {
  Form,
  Input,
  TreeSelect,
  Row,
  Col,
  Checkbox,
  Button,
  Card,
  InputNumber,
  Upload
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import styles from './index.less';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import ImgCrop from 'antd-img-crop';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import { useEffect, useRef } from 'react';
import { to_slug } from '@/utils/utils';
import { extend } from 'lodash';


const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 10,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 17,
      offset: 7,
    },
  },
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const CreateProductForm = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const timeoutRef = useRef(null);
  const { values, dispatch, listCate, edit } = props;

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    if (isJpgOrPng && isLt2M) {
      setImage(file);
    }
    return isJpgOrPng && isLt2M;
  }

  useEffect(() => {
    if (values) {
      setImgUrl(values.pro_avatar);
    }
    dispatch({
      type: 'category/fetch'
    })
  }, []);

  const handleEditorChange = val => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setContent(val);
    }, 400);
  }

  const handleUpload = () => {
    dispatch({
      type: 'product/handleUpload',
      payload: image,
      callback: res => {
        if (res) {
          setImgUrl(res);
        } else {
          setImgUrl('');
        }
      }
    });
  }

  const getCategoryByParent = (pId = 'root') => {
    const result = listCate.filter(item => item.c_parentId === pId);

    let treeData = [];
    let count = 0;
    result.forEach(item => {
      let category = {};

      category['title'] = item.c_name;
      category['value'] = item.id;
      category['children'] = getCategoryByParent(item.id);
      treeData[count++] = category;
    });
    return treeData;
  }

  const handleResetForm = () => {
    form.resetFields();
  }

  const onFinish = items => {
    if (items) {
      let params = {
        pro_name: items.name,
        pro_slug: to_slug(items.name),
        pro_sale: items.sales,
        pro_price_entry: items.entry_price,
        pro_price: items.price,
        inventory: items.inventory,
        pro_active: items.status,
        pro_description: content,
        pro_category_id: items.category,
        pro_avatar: imgUrl,
        createdAt: new Date
      };
      if (!edit && !Object.keys(values).length) {
        dispatch({
          type: 'product/handleAdd',
          payload: params,
          callback: () => {
            handleResetForm();
            setImage(null);
            setImgUrl('');
            setContent('');
          }
        });
      } else {
        dispatch({
          type: 'product/handleUpdate',
          payload: extend(params, { id: values.key })
        });
      }

    }
  };

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false),
        getBase64(info.file.originFileObj, imgUrl =>
          setImgUrl(imgUrl),
        );
    }
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const buttonUpload = () => {
    const base64regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

    return (
      <>
        {(base64regex.test(imgUrl) || !imgUrl) ? (
          <Button type="primary" onClick={handleUpload}>Upload</Button>
        ) : (
            <Button type="primary" danger >Remove</Button>
          )}
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div id="form-product">
        <Card bordered={false}>
          <Form
            {...formItemLayout}
            form={form}
            name="form-product"
            onFinish={onFinish}
            initialValues={{
              name: values.pro_name,
              price: values.pro_price,
              entry_price: values.pro_price_entry,
              sales: values.pro_sale,
              category: values.pro_category_id,
              status: values.pro_active || false,
              description: values.pro_description,
              inventory: values.inventory
            }}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please input your product name!',
                },
              ]}
            >
              <Input placeholder="Tên sản phẩm" />
            </Form.Item>

            <Form.Item
              name="entry_price"
              label="Entry price"
              rules={[
                {
                  required: true,
                  message: 'Please input your entry price!',
                },
              ]}
            >
              <InputNumber placeholder="Giá nhập vào" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="sales"
              label="Sale (%)"
              rules={[
                {
                  required: true,
                  message: 'Please input your sale',
                },
              ]}
            >
              <InputNumber placeholder="Chiết khấu" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: 'Please input your price!',
                },
              ]}
            >
              <InputNumber placeholder="Giá sản phẩm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="inventory"
              label="Inventory"
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: 'Please input your inventory!',
                },
              ]}
            >
              <InputNumber placeholder="Số lượng sản phẩm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[
                {
                  required: true,
                  message: 'Please select your category!',
                },
              ]}
            >
              <TreeSelect
                treeData={getCategoryByParent()}
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
              >
              </TreeSelect>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
              ]}
            >
              <Editor
                onEditorChange={handleEditorChange}
                init={{
                  apiKey: '7t5oboh02n9lzhlqgoc68zmh8ibr9dg9mexgxqxt2qoj51vv',
                  plugins: [
                    'lists link image paste help wordcount table '
                  ],
                  language_url: '/tinymce/langs/en_US.js',
                  language: 'en_US',
                  min_height: 450
                }}
              />
            </Form.Item>

            <Form.Item label="Image">
              <Row gutter={8} style={{ alignItems: 'center' }}>
                <Col span={6}>
                  <Form.Item
                    name="avatar"
                    noStyle
                  >
                    <ImgCrop rotate>
                      <Upload
                        onPreview={onPreview}
                        listType="picture-card"
                        showUploadList={false}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                      >
                        {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  {buttonUpload()}
                </Col>
              </Row>
            </Form.Item>

            <Form.Item name="status" valuePropName="checked" {...tailFormItemLayout}>
              <Checkbox>
                Publish
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Save
          </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

CreateProductForm.propTypes = {
  values: PropTypes.object,
  edit: PropTypes.bool
};

CreateProductForm.defaultProps = {
  values: {},
  edit: false
};

export default connect(({ category }) => ({
  listCate: category.listCate,
}))(CreateProductForm);